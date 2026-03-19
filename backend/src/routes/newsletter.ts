// src/routes/newsletter.ts
// Newsletter routes — uses Brevo SMTP, no extra DB models

import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import {
  sendEmail,
  buildEmailTemplate,
} from "../utils/email";

const router = Router();

const BRAND_COLOR = "#368951";

// ================================
// POST /api/newsletter/subscribe
// Public — subscribe an email
// ================================
router.post(
  "/subscribe",
  [body("email").isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: "Invalid email" });
      }
      // We just acknowledge — Brevo contacts can be managed via their API separately
      // For now we log the subscription
      const { email } = req.body;
      console.log(`📩 Newsletter subscription: ${email}`);
      res.json({ success: true, message: "Subscribed to HANDI newsletter!" });
    } catch (error) {
      console.error("Newsletter subscribe error:", error);
      res.status(500).json({ success: false, error: "Subscription failed" });
    }
  }
);

// ================================
// POST /api/newsletter/send
// Admin-only — send a branded newsletter to all users
// ================================
router.post(
  "/send",
  authenticate,
  [
    body("subject").trim().notEmpty(),
    body("heading").trim().notEmpty(),
    body("body").trim().notEmpty(),
    body("ctaText").optional().trim(),
    body("ctaUrl").optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.userType !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Admin access required" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: "Missing required fields", details: errors.array() });
      }

      const { subject, heading, body: bodyText, ctaText, ctaUrl } = req.body;
      const frontendUrl = process.env.FRONTEND_URL || "https://handiapp.com.ng";

      // Build newsletter body
      const newsletterBody = `
        <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">${heading}</h2>
        <p style="color:#4b5563;font-size:15px;line-height:1.8;margin:0 0 20px;">
          ${bodyText}
        </p>
        ${ctaText && ctaUrl ? `
        <p style="text-align:center;margin:28px 0;">
          <a href="${ctaUrl}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:bold;font-size:15px;">${ctaText}</a>
        </p>` : ""}
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
          You're receiving this because you signed up on HANDI.<br/>
          <a href="${frontendUrl}/settings" style="color:${BRAND_COLOR};text-decoration:none;">Manage Preferences</a>
        </p>
      `;

      // Fetch verified user emails (batch — max 500 per send)
      const users = await prisma.user.findMany({
        where: { isEmailVerified: true },
        select: { email: true },
        take: 500,
      });

      const html = buildEmailTemplate(newsletterBody, heading);

      let sent = 0;
      let failed = 0;
      for (const user of users) {
        const result = await sendEmail({ to: user.email, subject, html });
        if (result.success) sent++;
        else failed++;
      }

      res.json({
        success: true,
        message: `Newsletter sent to ${sent} users (${failed} failed).`,
        data: { sent, failed, total: users.length },
      });
    } catch (error) {
      console.error("Newsletter send error:", error);
      res.status(500).json({ success: false, error: "Failed to send newsletter" });
    }
  }
);

export default router;
