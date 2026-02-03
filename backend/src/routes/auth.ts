// src/routes/auth.ts
// Authentication routes

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// Helper Functions
// ================================
const generateTokens = (userId: string, email: string, userType: string) => {
  const accessToken = jwt.sign(
    { userId, email, userType },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" },
  );

  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );

  return { accessToken, refreshToken };
};

// ================================
// POST /api/auth/register
// ================================
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("phone").isMobilePhone("any"),
    body("password").isLength({ min: 6 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("userType").isIn(["CLIENT", "ARTISAN", "BUSINESS"]),
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

      const { email, phone, password, firstName, lastName, userType } =
        req.body;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error:
            existingUser.email === email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          passwordHash,
          firstName,
          lastName,
          userType,
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
          isVerified: true,
          createdAt: true,
        },
      });

      // Generate tokens
      const tokens = generateTokens(user.id, user.email, user.userType);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: 900, // 15 minutes in seconds
          },
        },
        message: "Registration successful",
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
// POST /api/auth/login
// ================================
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    body("userType")
      .optional()
      .isIn(["CLIENT", "ARTISAN", "BUSINESS", "ADMIN"]),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const { email, password, userType } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      // Check user type if specified
      if (userType && user.userType !== userType) {
        return res.status(401).json({
          success: false,
          error: `No ${userType.toLowerCase()} account found with this email`,
        });
      }

      // Check if banned
      if (user.verificationStatus === "BANNED") {
        return res.status(403).json({
          success: false,
          error: "Account suspended. Please contact support.",
        });
      }

      // Generate tokens
      const tokens = generateTokens(user.id, user.email, user.userType);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Remove password from response
      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: {
            ...userWithoutPassword,
            fullName: `${user.firstName} ${user.lastName}`,
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: 900,
          },
        },
        message: "Login successful",
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
// POST /api/auth/refresh
// ================================
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: string };

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const tokens = generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.userType,
    );

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 900,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid refresh token",
    });
  }
});

// ================================
// GET /api/auth/me
// ================================
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
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
// POST /api/auth/logout
// ================================
router.post(
  "/logout",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // Delete all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId: req.user!.userId },
      });

      res.json({
        success: true,
        message: "Logged out successfully",
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

export default router;
