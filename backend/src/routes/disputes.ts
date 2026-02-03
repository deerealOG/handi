// src/routes/disputes.ts
// Dispute management routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// POST /api/disputes - File a dispute
// ================================
router.post(
  "/",
  authenticate,
  [
    body("bookingId").isUUID(),
    body("reason").trim().notEmpty(),
    body("description").trim().isLength({ min: 20 }),
    body("evidence").optional().isArray(),
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

      const { bookingId, reason, description, evidence } = req.body;

      // Verify booking exists and user is involved
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      if (
        booking.clientId !== req.user!.userId &&
        booking.artisanId !== req.user!.userId
      ) {
        return res.status(403).json({
          success: false,
          error: "Not authorized for this booking",
        });
      }

      // Check if dispute already exists
      const existingDispute = await prisma.dispute.findUnique({
        where: { bookingId },
      });

      if (existingDispute) {
        return res.status(400).json({
          success: false,
          error: "A dispute already exists for this booking",
        });
      }

      const dispute = await prisma.dispute.create({
        data: {
          bookingId,
          filedById: req.user!.userId,
          reason,
          description,
          evidence: JSON.stringify(evidence || []),
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "DISPUTED" },
      });

      // Notify other party
      const otherPartyId =
        booking.clientId === req.user!.userId
          ? booking.artisanId
          : booking.clientId;

      await prisma.notification.create({
        data: {
          userId: otherPartyId,
          type: "SYSTEM",
          title: "Dispute Filed",
          body: `A dispute has been filed for your booking. Reason: ${reason}`,
          data: { bookingId, disputeId: dispute.id },
        },
      });

      res.status(201).json({
        success: true,
        data: dispute,
        message: "Dispute filed successfully",
      });
    } catch (error) {
      console.error("File dispute error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to file dispute",
      });
    }
  },
);

// ================================
// GET /api/disputes - List disputes (admin) or user's disputes
// ================================
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", perPage = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const skip = (pageNum - 1) * perPageNum;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { userType: true },
    });

    const isAdmin = user?.userType === "ADMIN";

    let where: any = {};

    if (!isAdmin) {
      // Get user's disputes (either as filer or involved party)
      const userBookings = await prisma.booking.findMany({
        where: {
          OR: [{ clientId: req.user!.userId }, { artisanId: req.user!.userId }],
        },
        select: { id: true },
      });
      where.bookingId = { in: userBookings.map((b) => b.id) };
    }

    if (status) {
      where.status = status;
    }

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPageNum,
      }),
      prisma.dispute.count({ where }),
    ]);

    // Enrich with booking info
    const bookingIds = disputes.map((d) => d.bookingId);
    const bookings = await prisma.booking.findMany({
      where: { id: { in: bookingIds } },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        artisan: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    const bookingMap = new Map(bookings.map((b) => [b.id, b]));

    const enrichedDisputes = disputes.map((d) => ({
      ...d,
      evidence: JSON.parse(d.evidence),
      booking: bookingMap.get(d.bookingId),
    }));

    res.json({
      success: true,
      data: enrichedDisputes,
      pagination: {
        page: pageNum,
        perPage: perPageNum,
        total,
        totalPages: Math.ceil(total / perPageNum),
      },
    });
  } catch (error) {
    console.error("List disputes error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to list disputes",
    });
  }
});

// ================================
// GET /api/disputes/:id - Get dispute details with chat logs
// ================================
router.get(
  "/:id",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const disputeId = req.params.id as string;
      const dispute = await prisma.dispute.findUnique({
        where: { id: disputeId },
      });

      if (!dispute) {
        return res.status(404).json({
          success: false,
          error: "Dispute not found",
        });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: dispute.bookingId },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          artisan: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
          review: true,
        },
      });

      // Get materials for this booking
      const materials = await prisma.materialCost.findMany({
        where: { bookingId: dispute.bookingId },
      });

      res.json({
        success: true,
        data: {
          ...dispute,
          evidence: JSON.parse(dispute.evidence),
          booking,
          materials,
        },
      });
    } catch (error) {
      console.error("Get dispute error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get dispute",
      });
    }
  },
);

// ================================
// POST /api/disputes/:id/resolve - Admin: Resolve dispute
// ================================
router.post(
  "/:id/resolve",
  authenticate,
  requireAdmin,
  [
    param("id").isUUID(),
    body("resolution").isIn([
      "REFUND_CLIENT",
      "PAY_ARTISAN",
      "SPLIT_50_50",
      "PARTIAL_REFUND",
      "NO_ACTION",
    ]),
    body("adminNotes").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { resolution, adminNotes } = req.body;
      const disputeId = req.params.id as string;

      const dispute = await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: "RESOLVED",
          resolution,
          resolvedBy: req.user!.userId,
          resolvedAt: new Date(),
          adminNotes,
        },
      });

      // Get booking to notify parties
      const booking = await prisma.booking.findUnique({
        where: { id: dispute.bookingId },
      });

      if (booking) {
        // Notify both parties
        const resolutionText = resolution.replace(/_/g, " ").toLowerCase();

        await prisma.notification.createMany({
          data: [
            {
              userId: booking.clientId,
              type: "SYSTEM",
              title: "Dispute Resolved",
              body: `Your dispute has been resolved: ${resolutionText}`,
              data: { disputeId: dispute.id },
            },
            {
              userId: booking.artisanId,
              type: "SYSTEM",
              title: "Dispute Resolved",
              body: `The dispute has been resolved: ${resolutionText}`,
              data: { disputeId: dispute.id },
            },
          ],
        });

        // Update booking status based on resolution
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "COMPLETED",
            paymentStatus:
              resolution === "REFUND_CLIENT" ? "REFUNDED" : "RELEASED",
          },
        });
      }

      res.json({
        success: true,
        data: dispute,
        message: "Dispute resolved",
      });
    } catch (error) {
      console.error("Resolve dispute error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to resolve dispute",
      });
    }
  },
);

export default router;
