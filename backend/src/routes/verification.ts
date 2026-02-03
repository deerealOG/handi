// src/routes/verification.ts
// KYC Verification document routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// POST /api/verification/upload - Upload verification document
// ================================
router.post(
  "/upload",
  authenticate,
  [
    body("type").isIn([
      "ID_CARD",
      "DRIVERS_LICENSE",
      "PASSPORT",
      "UTILITY_BILL",
      "CERTIFICATE",
      "BUSINESS_REG",
    ]),
    body("fileUrl").isURL(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { type, fileUrl } = req.body;

      const document = await prisma.verificationDocument.create({
        data: {
          userId: req.user!.userId,
          type,
          fileUrl,
        },
      });

      res.status(201).json({
        success: true,
        data: document,
        message: "Document uploaded successfully. Pending review.",
      });
    } catch (error) {
      console.error("Upload verification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload document",
      });
    }
  },
);

// ================================
// GET /api/verification/status - Get user's verification status
// ================================
router.get("/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const documents = await prisma.verificationDocument.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { isVerified: true, verificationStatus: true },
    });

    const approved = documents.filter((d) => d.status === "APPROVED").length;
    const pending = documents.filter((d) => d.status === "PENDING").length;
    const rejected = documents.filter((d) => d.status === "REJECTED").length;

    res.json({
      success: true,
      data: {
        isVerified: user?.isVerified || false,
        verificationStatus: user?.verificationStatus || "PENDING",
        documents,
        summary: { approved, pending, rejected, total: documents.length },
      },
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get verification status",
    });
  }
});

// ================================
// GET /api/verification/pending - Admin: List pending verifications
// ================================
router.get(
  "/pending",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const documents = await prisma.verificationDocument.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });

      // Get user info for each document
      const userIds = [...new Set(documents.map((d) => d.userId))];
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      });

      const userMap = new Map(users.map((u) => [u.id, u]));

      const enrichedDocs = documents.map((doc) => ({
        ...doc,
        user: userMap.get(doc.userId),
      }));

      res.json({
        success: true,
        data: enrichedDocs,
        count: enrichedDocs.length,
      });
    } catch (error) {
      console.error("Get pending verifications error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get pending verifications",
      });
    }
  },
);

// ================================
// POST /api/verification/:id/approve - Admin: Approve document
// ================================
router.post(
  "/:id/approve",
  authenticate,
  requireAdmin,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const docId = req.params.id as string;
      const document = await prisma.verificationDocument.update({
        where: { id: docId },
        data: {
          status: "APPROVED",
          reviewedBy: req.user!.userId,
          reviewNotes: req.body.notes || "Approved",
        },
      });

      // Check if user should be marked as verified
      const allDocs = await prisma.verificationDocument.findMany({
        where: { userId: document.userId },
      });

      const hasApprovedId = allDocs.some(
        (d) =>
          d.status === "APPROVED" &&
          ["ID_CARD", "DRIVERS_LICENSE", "PASSPORT"].includes(d.type),
      );

      if (hasApprovedId) {
        await prisma.user.update({
          where: { id: document.userId },
          data: { isVerified: true, verificationStatus: "VERIFIED" },
        });
      }

      res.json({
        success: true,
        data: document,
        message: "Document approved",
      });
    } catch (error) {
      console.error("Approve document error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to approve document",
      });
    }
  },
);

// ================================
// POST /api/verification/:id/reject - Admin: Reject document
// ================================
router.post(
  "/:id/reject",
  authenticate,
  requireAdmin,
  [param("id").isUUID(), body("reason").notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const docId = req.params.id as string;
      const document = await prisma.verificationDocument.update({
        where: { id: docId },
        data: {
          status: "REJECTED",
          reviewedBy: req.user!.userId,
          reviewNotes: req.body.reason,
        },
      });

      // Create notification for user
      await prisma.notification.create({
        data: {
          userId: document.userId,
          type: "SYSTEM",
          title: "Document Rejected",
          body: `Your ${document.type} was rejected: ${req.body.reason}`,
        },
      });

      res.json({
        success: true,
        data: document,
        message: "Document rejected",
      });
    } catch (error) {
      console.error("Reject document error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reject document",
      });
    }
  },
);

export default router;
