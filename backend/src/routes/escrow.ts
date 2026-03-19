// src/routes/escrow.ts
// Escrow & Refund management routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// ================================
// Refund percentage calculation per policy
// ================================
function calculateRefund(type: string, originalAmount: number): { refundAmount: number; refundPercentage: number; creditAmount: number } {
  switch (type) {
    case "CANCELLATION_24H_PLUS":
      return { refundAmount: originalAmount, refundPercentage: 100, creditAmount: 0 };
    case "CANCELLATION_WITHIN_24H":
      return { refundAmount: originalAmount * 0.85, refundPercentage: 85, creditAmount: 0 };
    case "CANCELLATION_AFTER_ARRIVAL":
      return { refundAmount: originalAmount * 0.50, refundPercentage: 50, creditAmount: 0 };
    case "PRO_NO_SHOW":
      return { refundAmount: originalAmount, refundPercentage: 100, creditAmount: originalAmount * 0.10 };
    case "WORK_INCOMPLETE":
      return { refundAmount: 0, refundPercentage: 0, creditAmount: 0 }; // Subject to review
    case "DEFECTIVE_PRODUCT":
      return { refundAmount: originalAmount, refundPercentage: 100, creditAmount: 0 };
    case "CHANGE_OF_MIND":
      return { refundAmount: originalAmount * 0.95, refundPercentage: 95, creditAmount: 0 }; // Less return shipping
    default:
      return { refundAmount: 0, refundPercentage: 0, creditAmount: 0 };
  }
}

// ================================
// POST /api/escrow/hold - Create escrow hold for booking
// ================================
router.post(
  "/hold",
  authenticate,
  [
    body("bookingId").isUUID(),
    body("amount").isFloat({ min: 0 }),
    body("paymentMethod").optional().isString(),
    body("paymentReference").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { bookingId, amount, paymentMethod, paymentReference } = req.body;

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }

      // Check if escrow already exists
      const existingEscrow = await prisma.escrow.findUnique({
        where: { bookingId },
      });
      if (existingEscrow) {
        return res.status(400).json({ success: false, error: "Escrow already exists for this booking" });
      }

      const platformFeeRate = 0.10; // 10% platform fee
      const platformFee = amount * platformFeeRate;
      const payeeAmount = amount - platformFee;

      const escrow = await prisma.escrow.create({
        data: {
          bookingId,
          payerId: booking.clientId,
          payeeId: booking.artisanId,
          amount,
          platformFee,
          payeeAmount,
          paymentMethod,
          paymentReference,
          status: "HELD",
        },
      });

      // Update booking payment status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "HELD_IN_ESCROW" },
      });

      res.status(201).json({ success: true, data: escrow });
    } catch (error) {
      console.error("Create escrow error:", error);
      res.status(500).json({ success: false, error: "Failed to create escrow" });
    }
  },
);

// ================================
// POST /api/escrow/:id/release - Release escrow (on completion)
// ================================
router.post(
  "/:id/release",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const escrow = await prisma.escrow.findUnique({ where: { id: req.params.id } });
      if (!escrow) {
        return res.status(404).json({ success: false, error: "Escrow not found" });
      }
      if (escrow.status !== "HELD") {
        return res.status(400).json({ success: false, error: `Cannot release escrow in ${escrow.status} status` });
      }

      // Only client or admin can release
      if (escrow.payerId !== req.user!.userId && req.user!.userType !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Only the payer or admin can release escrow" });
      }

      const updated = await prisma.$transaction(async (tx) => {
        const released = await tx.escrow.update({
          where: { id: escrow.id },
          data: {
            status: "RELEASED",
            releasedAt: new Date(),
            releasedAmount: escrow.payeeAmount,
          },
        });

        // Credit the professional's wallet
        const wallet = await tx.wallet.findUnique({ where: { userId: escrow.payeeId } });
        if (wallet) {
          await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: escrow.payeeAmount } },
          });
          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,
              type: "EARNING",
              amount: escrow.payeeAmount,
              status: "COMPLETED",
              reference: `ESC-${escrow.id.slice(0, 8)}`,
              description: `Payment for booking`,
            },
          });
        }

        // Update booking
        await tx.booking.update({
          where: { id: escrow.bookingId },
          data: { paymentStatus: "RELEASED" },
        });

        return released;
      });

      res.json({ success: true, data: updated, message: "Escrow released successfully" });
    } catch (error) {
      console.error("Release escrow error:", error);
      res.status(500).json({ success: false, error: "Failed to release escrow" });
    }
  },
);

// ================================
// POST /api/escrow/refund - Process refund per policy
// ================================
router.post(
  "/refund",
  authenticate,
  [
    body("bookingId").optional().isUUID(),
    body("orderId").optional().isUUID(),
    body("type").isIn([
      "CANCELLATION_24H_PLUS", "CANCELLATION_WITHIN_24H",
      "CANCELLATION_AFTER_ARRIVAL", "PRO_NO_SHOW",
      "WORK_INCOMPLETE", "DEFECTIVE_PRODUCT", "CHANGE_OF_MIND",
    ]),
    body("reason").isString().trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { bookingId, orderId, type, reason } = req.body;

      let originalAmount = 0;

      if (bookingId) {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
        originalAmount = booking.finalPrice || booking.estimatedPrice;
      } else if (orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return res.status(404).json({ success: false, error: "Order not found" });
        originalAmount = order.total;
      } else {
        return res.status(400).json({ success: false, error: "Either bookingId or orderId required" });
      }

      const { refundAmount, refundPercentage, creditAmount } = calculateRefund(type, originalAmount);

      const refund = await prisma.refundRequest.create({
        data: {
          bookingId,
          orderId,
          userId: req.user!.userId,
          type,
          originalAmount,
          refundAmount,
          refundPercentage,
          creditAmount,
          reason,
          status: type === "WORK_INCOMPLETE" ? "REQUESTED" : "APPROVED",
        },
      });

      // If auto-approved, process immediately
      if (refund.status === "APPROVED" && bookingId) {
        const escrow = await prisma.escrow.findUnique({ where: { bookingId } });
        if (escrow && escrow.status === "HELD") {
          await prisma.escrow.update({
            where: { id: escrow.id },
            data: {
              status: "REFUNDED",
              refundAmount,
              refundReason: reason,
              refundedAt: new Date(),
            },
          });
          await prisma.booking.update({
            where: { id: bookingId },
            data: { paymentStatus: "REFUNDED", status: "CANCELLED", cancelledAt: new Date() },
          });
        }
      }

      res.status(201).json({
        success: true,
        data: {
          ...refund,
          policyApplied: `${refundPercentage}% refund${creditAmount > 0 ? ` + ${creditAmount} credit` : ""}`,
        },
      });
    } catch (error) {
      console.error("Process refund error:", error);
      res.status(500).json({ success: false, error: "Failed to process refund" });
    }
  },
);

// ================================
// GET /api/escrow/booking/:bookingId - Get escrow for booking
// ================================
router.get(
  "/booking/:bookingId",
  authenticate,
  param("bookingId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const escrow = await prisma.escrow.findUnique({
        where: { bookingId: req.params.bookingId },
      });
      if (!escrow) {
        return res.status(404).json({ success: false, error: "No escrow found for this booking" });
      }
      res.json({ success: true, data: escrow });
    } catch (error) {
      console.error("Get escrow error:", error);
      res.status(500).json({ success: false, error: "Failed to get escrow" });
    }
  },
);

// ================================
// GET /api/escrow/refunds - Get user's refund requests
// ================================
router.get(
  "/refunds",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const refunds = await prisma.refundRequest.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: refunds });
    } catch (error) {
      console.error("Get refunds error:", error);
      res.status(500).json({ success: false, error: "Failed to get refunds" });
    }
  },
);

// ================================
// PATCH /api/escrow/refunds/:id - Admin: process refund request
// ================================
router.patch(
  "/refunds/:id",
  authenticate,
  requireAdmin,
  [
    param("id").isUUID(),
    body("status").isIn(["APPROVED", "DENIED"]),
    body("adminNotes").optional().isString(),
    body("refundAmount").optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status: newStatus, adminNotes, refundAmount } = req.body;

      const updated = await prisma.refundRequest.update({
        where: { id: req.params.id },
        data: {
          status: newStatus,
          adminNotes,
          processedBy: req.user!.userId,
          processedAt: new Date(),
          ...(refundAmount !== undefined ? { refundAmount } : {}),
        },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Process refund request error:", error);
      res.status(500).json({ success: false, error: "Failed to process refund" });
    }
  },
);

export default router;
