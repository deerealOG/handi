// src/routes/maintenance.ts
// Maintenance Plans & Subscriptions routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// ================================
// GET /api/maintenance/plans - List available plans
// ================================
router.get(
  "/plans",
  async (_req: AuthRequest, res: Response) => {
    try {
      const plans = await prisma.maintenancePlan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });
      res.json({ success: true, data: plans });
    } catch (error) {
      console.error("Get plans error:", error);
      res.status(500).json({ success: false, error: "Failed to get plans" });
    }
  },
);

// ================================
// POST /api/maintenance/plans - Create plan (admin)
// ================================
router.post(
  "/plans",
  authenticate,
  requireAdmin,
  [
    body("name").isString().trim().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("categoryIds").isArray(),
    body("interval").isIn(["MONTHLY", "QUARTERLY", "BIANNUAL", "ANNUAL"]),
    body("price").isFloat({ min: 0 }),
    body("includedVisits").optional().isInt({ min: 1 }),
    body("features").optional().isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const plan = await prisma.maintenancePlan.create({ data: req.body });
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      console.error("Create plan error:", error);
      res.status(500).json({ success: false, error: "Failed to create plan" });
    }
  },
);

// ================================
// POST /api/maintenance/subscribe - Subscribe to plan
// ================================
router.post(
  "/subscribe",
  authenticate,
  [
    body("planId").isUUID(),
    body("paymentMethod").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { planId, paymentMethod } = req.body;
      const plan = await prisma.maintenancePlan.findUnique({ where: { id: planId } });
      if (!plan) {
        return res.status(404).json({ success: false, error: "Plan not found" });
      }

      // Calculate billing date based on interval
      const startDate = new Date();
      const nextBillingDate = new Date(startDate);
      switch (plan.interval) {
        case "MONTHLY": nextBillingDate.setMonth(nextBillingDate.getMonth() + 1); break;
        case "QUARTERLY": nextBillingDate.setMonth(nextBillingDate.getMonth() + 3); break;
        case "BIANNUAL": nextBillingDate.setMonth(nextBillingDate.getMonth() + 6); break;
        case "ANNUAL": nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1); break;
      }

      const subscription = await prisma.planSubscription.create({
        data: {
          userId: req.user!.userId,
          planId,
          startDate,
          nextBillingDate,
          visitsRemaining: plan.includedVisits,
          paymentMethod,
        },
      });

      res.status(201).json({ success: true, data: subscription, message: "Subscription activated" });
    } catch (error) {
      console.error("Subscribe error:", error);
      res.status(500).json({ success: false, error: "Failed to subscribe" });
    }
  },
);

// ================================
// GET /api/maintenance/subscriptions - User's subscriptions
// ================================
router.get(
  "/subscriptions",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const subscriptions = await prisma.planSubscription.findMany({
        where: { userId: req.user!.userId },
        include: { scheduledVisits: { orderBy: { scheduledDate: "asc" } } },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: subscriptions });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get subscriptions" });
    }
  },
);

// ================================
// PATCH /api/maintenance/subscriptions/:id/cancel
// ================================
router.patch(
  "/subscriptions/:id/cancel",
  authenticate,
  [param("id").isUUID(), body("reason").optional().isString()],
  async (req: AuthRequest, res: Response) => {
    try {
      const sub = await prisma.planSubscription.findUnique({ where: { id: req.params.id } });
      if (!sub || sub.userId !== req.user!.userId) {
        return res.status(404).json({ success: false, error: "Subscription not found" });
      }

      const updated = await prisma.planSubscription.update({
        where: { id: sub.id },
        data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: req.body.reason },
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to cancel subscription" });
    }
  },
);

export default router;
