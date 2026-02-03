// src/routes/materials.ts
// Material costs and extra invoicing routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireArtisan } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// POST /api/jobs/:jobId/materials - Add material cost to job
// ================================
router.post(
  "/jobs/:jobId/materials",
  authenticate,
  requireArtisan,
  [
    param("jobId").isUUID(),
    body("description").trim().notEmpty(),
    body("amount").isFloat({ min: 0 }),
    body("imageUrl").optional().isURL(),
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

      const jobId = req.params.jobId as string;
      const { description, amount, imageUrl } = req.body;

      // Verify job exists and belongs to artisan
      const booking = await prisma.booking.findUnique({
        where: { id: jobId },
        include: { client: { select: { id: true, firstName: true } } },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      if (booking.artisanId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Not authorized for this job",
        });
      }

      if (booking.status !== "IN_PROGRESS") {
        return res.status(400).json({
          success: false,
          error: "Can only add materials to jobs in progress",
        });
      }

      const material = await prisma.materialCost.create({
        data: {
          bookingId: jobId,
          description,
          amount,
          imageUrl,
        },
      });

      // Notify client
      await prisma.notification.create({
        data: {
          userId: booking.clientId,
          type: "SYSTEM",
          title: "Material Cost Added",
          body: `₦${amount.toLocaleString()} material cost added: ${description}. Please approve.`,
          data: { bookingId: jobId, materialId: material.id },
        },
      });

      res.status(201).json({
        success: true,
        data: material,
        message: "Material cost added. Awaiting client approval.",
      });
    } catch (error) {
      console.error("Add material error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to add material cost",
      });
    }
  },
);

// ================================
// GET /api/jobs/:jobId/materials - Get materials for job
// ================================
router.get(
  "/jobs/:jobId/materials",
  authenticate,
  param("jobId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const jobId = req.params.jobId as string;

      const materials = await prisma.materialCost.findMany({
        where: { bookingId: jobId },
        orderBy: { createdAt: "desc" },
      });

      const totals = {
        pending: materials
          .filter((m) => m.status === "PENDING")
          .reduce((sum, m) => sum + m.amount, 0),
        approved: materials
          .filter((m) => m.status === "APPROVED")
          .reduce((sum, m) => sum + m.amount, 0),
        rejected: materials
          .filter((m) => m.status === "REJECTED")
          .reduce((sum, m) => sum + m.amount, 0),
      };

      res.json({
        success: true,
        data: materials,
        totals,
      });
    } catch (error) {
      console.error("Get materials error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get materials",
      });
    }
  },
);

// ================================
// POST /api/materials/:id/approve - Client approves material
// ================================
router.post(
  "/materials/:id/approve",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const materialId = req.params.id as string;
      const material = await prisma.materialCost.findUnique({
        where: { id: materialId },
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          error: "Material not found",
        });
      }

      // Verify client owns the booking
      const booking = await prisma.booking.findUnique({
        where: { id: material.bookingId },
      });

      if (booking?.clientId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Only the client can approve this",
        });
      }

      const updated = await prisma.materialCost.update({
        where: { id: materialId },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });

      // Update booking estimated price
      const allApproved = await prisma.materialCost.findMany({
        where: { bookingId: material.bookingId, status: "APPROVED" },
      });
      const totalMaterials = allApproved.reduce((sum, m) => sum + m.amount, 0);

      await prisma.booking.update({
        where: { id: material.bookingId },
        data: {
          finalPrice: (booking?.estimatedPrice || 0) + totalMaterials,
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Material cost approved",
      });
    } catch (error) {
      console.error("Approve material error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to approve material",
      });
    }
  },
);

// ================================
// POST /api/materials/:id/reject - Client rejects material
// ================================
router.post(
  "/materials/:id/reject",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const materialId = req.params.id as string;
      const material = await prisma.materialCost.findUnique({
        where: { id: materialId },
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          error: "Material not found",
        });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: material.bookingId },
      });

      if (booking?.clientId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Only the client can reject this",
        });
      }

      const updated = await prisma.materialCost.update({
        where: { id: materialId },
        data: {
          status: "REJECTED",
          rejectedAt: new Date(),
        },
      });

      // Notify artisan
      await prisma.notification.create({
        data: {
          userId: booking.artisanId,
          type: "SYSTEM",
          title: "Material Cost Rejected",
          body: `Client rejected material cost: ${material.description}`,
          data: { bookingId: material.bookingId },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Material cost rejected",
      });
    } catch (error) {
      console.error("Reject material error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reject material",
      });
    }
  },
);

export default router;
