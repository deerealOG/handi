// src/routes/features.ts
// Combined routes for: Quotes, Home Profile, Loyalty, Guarantee, Trade, Reviews (two-way), SLA

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin, requireArtisan } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ================================
// QUOTE MANAGEMENT
// ================================

// POST /api/features/quotes/request - Request quotes
router.post(
  "/quotes/request",
  authenticate,
  [
    body("categoryId").isString().notEmpty(),
    body("categoryName").isString().notEmpty(),
    body("serviceType").isString().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("address").isString().trim().notEmpty(),
    body("city").isString().trim().notEmpty(),
    body("preferredDate").optional().isISO8601(),
    body("budget").optional().isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const quoteRequest = await prisma.quoteRequest.create({
        data: { clientId: req.user!.userId, ...req.body },
      });
      res.status(201).json({ success: true, data: quoteRequest });
    } catch (error) {
      console.error("Create quote request error:", error);
      res.status(500).json({ success: false, error: "Failed to create quote request" });
    }
  },
);

// GET /api/features/quotes/requests - User's quote requests
router.get(
  "/quotes/requests",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const requests = await prisma.quoteRequest.findMany({
        where: { clientId: req.user!.userId },
        include: { quotes: { orderBy: { amount: "asc" } } },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get requests" });
    }
  },
);

// POST /api/features/quotes/:requestId/submit - Pro submits quote
router.post(
  "/quotes/:requestId/submit",
  authenticate,
  requireArtisan,
  [
    param("requestId").isUUID(),
    body("amount").isFloat({ min: 0 }),
    body("estimatedDuration").optional().isInt(),
    body("message").optional().isString(),
    body("breakdownItems").optional().isArray(),
    body("validDays").optional().isInt({ min: 1, max: 30 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { amount, estimatedDuration, message, breakdownItems, validDays = 7 } = req.body;
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      const quote = await prisma.quote.create({
        data: {
          quoteRequestId: req.params.requestId,
          professionalId: req.user!.userId,
          amount,
          estimatedDuration,
          message,
          breakdownItems: breakdownItems || [],
          validUntil,
        },
      });

      res.status(201).json({ success: true, data: quote });
    } catch (error) {
      console.error("Submit quote error:", error);
      res.status(500).json({ success: false, error: "Failed to submit quote" });
    }
  },
);

// POST /api/features/quotes/:id/accept - Accept a quote
router.post(
  "/quotes/:id/accept",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id: req.params.id },
        include: { quoteRequest: true },
      });
      if (!quote) return res.status(404).json({ success: false, error: "Quote not found" });
      if (quote.quoteRequest.clientId !== req.user!.userId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      await prisma.quote.update({
        where: { id: quote.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });

      // Close the quote request
      await prisma.quoteRequest.update({
        where: { id: quote.quoteRequestId },
        data: { status: "CLOSED" },
      });

      // Decline other quotes
      await prisma.quote.updateMany({
        where: { quoteRequestId: quote.quoteRequestId, id: { not: quote.id } },
        data: { status: "DECLINED", declinedAt: new Date() },
      });

      res.json({ success: true, message: "Quote accepted" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to accept quote" });
    }
  },
);

// ================================
// HOME PROFILE
// ================================

// GET /api/features/home-profile
router.get(
  "/home-profile",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const profile = await prisma.homeProfile.findUnique({
        where: { userId: req.user!.userId },
      });
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get home profile" });
    }
  },
);

// PUT /api/features/home-profile
router.put(
  "/home-profile",
  authenticate,
  [
    body("nickname").optional().isString(),
    body("propertyType").optional().isString(),
    body("squareFootage").optional().isFloat(),
    body("yearBuilt").optional().isInt(),
    body("bedrooms").optional().isInt(),
    body("bathrooms").optional().isInt(),
    body("floors").optional().isInt(),
    body("address").optional().isString(),
    body("city").optional().isString(),
    body("state").optional().isString(),
    body("appliances").optional().isArray(),
    body("systems").optional().isArray(),
    body("notes").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const profile = await prisma.homeProfile.upsert({
        where: { userId: req.user!.userId },
        update: req.body,
        create: { userId: req.user!.userId, ...req.body },
      });
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update home profile" });
    }
  },
);

// ================================
// LOYALTY & REWARDS
// ================================

// GET /api/features/loyalty - Get loyalty account
router.get(
  "/loyalty",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      let account = await prisma.loyaltyAccount.findUnique({
        where: { userId: req.user!.userId },
        include: {
          transactions: { orderBy: { createdAt: "desc" }, take: 20 },
        },
      });

      // Auto-create if not exists
      if (!account) {
        account = await prisma.loyaltyAccount.create({
          data: {
            userId: req.user!.userId,
            referralCode: `HANDI-${req.user!.userId.slice(0, 6).toUpperCase()}`,
          },
          include: { transactions: true },
        });
      }

      res.json({ success: true, data: account });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get loyalty account" });
    }
  },
);

// POST /api/features/loyalty/redeem - Redeem points
router.post(
  "/loyalty/redeem",
  authenticate,
  [body("points").isInt({ min: 100 }), body("description").isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const { points, description } = req.body;
      const account = await prisma.loyaltyAccount.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!account || account.availablePoints < points) {
        return res.status(400).json({ success: false, error: "Insufficient points" });
      }

      await prisma.$transaction(async (tx) => {
        await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            availablePoints: { decrement: points },
            totalPoints: { decrement: points },
          },
        });
        await tx.pointsTransaction.create({
          data: {
            accountId: account.id,
            action: "POINTS_REDEEMED",
            points: -points,
            description,
          },
        });
      });

      res.json({ success: true, message: `${points} points redeemed` });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to redeem points" });
    }
  },
);

// POST /api/features/loyalty/referral - Apply referral code
router.post(
  "/loyalty/referral",
  authenticate,
  body("referralCode").isString().notEmpty(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { referralCode } = req.body;
      const referrer = await prisma.loyaltyAccount.findUnique({
        where: { referralCode },
      });
      if (!referrer) {
        return res.status(404).json({ success: false, error: "Invalid referral code" });
      }
      if (referrer.userId === req.user!.userId) {
        return res.status(400).json({ success: false, error: "Cannot refer yourself" });
      }

      // Award points to both
      const REFERRAL_POINTS = 500;
      await prisma.$transaction(async (tx) => {
        // Referrer bonus
        await tx.loyaltyAccount.update({
          where: { id: referrer.id },
          data: {
            totalPoints: { increment: REFERRAL_POINTS },
            availablePoints: { increment: REFERRAL_POINTS },
            lifetimePoints: { increment: REFERRAL_POINTS },
            totalReferrals: { increment: 1 },
          },
        });
        await tx.pointsTransaction.create({
          data: {
            accountId: referrer.id,
            action: "REFERRAL_SIGNUP",
            points: REFERRAL_POINTS,
            description: "Referral bonus",
          },
        });

        // Referred user bonus
        let account = await tx.loyaltyAccount.findUnique({ where: { userId: req.user!.userId } });
        if (!account) {
          account = await tx.loyaltyAccount.create({
            data: {
              userId: req.user!.userId,
              referralCode: `HANDI-${req.user!.userId.slice(0, 6).toUpperCase()}`,
              totalPoints: REFERRAL_POINTS,
              availablePoints: REFERRAL_POINTS,
              lifetimePoints: REFERRAL_POINTS,
            },
          });
        } else {
          await tx.loyaltyAccount.update({
            where: { id: account.id },
            data: {
              totalPoints: { increment: REFERRAL_POINTS },
              availablePoints: { increment: REFERRAL_POINTS },
              lifetimePoints: { increment: REFERRAL_POINTS },
            },
          });
        }
        await tx.pointsTransaction.create({
          data: {
            accountId: account.id,
            action: "REFERRAL_SIGNUP",
            points: REFERRAL_POINTS,
            description: "Welcome bonus from referral",
          },
        });
      });

      res.json({ success: true, message: `${REFERRAL_POINTS} bonus points awarded!` });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to apply referral" });
    }
  },
);

// ================================
// SERVICE GUARANTEE
// ================================

// POST /api/features/guarantee/claim - Submit guarantee claim
router.post(
  "/guarantee/claim",
  authenticate,
  [
    body("bookingId").isUUID(),
    body("issue").isString().trim().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("evidence").optional().isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { bookingId, issue, description, evidence = [] } = req.body;

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
      if (booking.clientId !== req.user!.userId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Check 30-day guarantee window
      const completedAt = booking.completedAt;
      if (!completedAt) {
        return res.status(400).json({ success: false, error: "Booking not yet completed" });
      }
      const daysSince = Math.floor((Date.now() - completedAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 30) {
        return res.status(400).json({ success: false, error: "Guarantee window (30 days) has expired" });
      }

      const claim = await prisma.guaranteeClaim.create({
        data: { bookingId, clientId: req.user!.userId, issue, description, evidence },
      });

      res.status(201).json({ success: true, data: claim, message: "Guarantee claim submitted" });
    } catch (error) {
      console.error("Submit claim error:", error);
      res.status(500).json({ success: false, error: "Failed to submit claim" });
    }
  },
);

// GET /api/features/guarantee/claims - User's claims
router.get(
  "/guarantee/claims",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const claims = await prisma.guaranteeClaim.findMany({
        where: { clientId: req.user!.userId },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: claims });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get claims" });
    }
  },
);

// PATCH /api/features/guarantee/claims/:id - Admin resolve claim
router.patch(
  "/guarantee/claims/:id",
  authenticate,
  requireAdmin,
  [
    param("id").isUUID(),
    body("status").isIn(["APPROVED_RESERVICE", "APPROVED_REFUND", "DENIED"]),
    body("reviewNotes").optional().isString(),
    body("refundAmount").optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, reviewNotes, refundAmount } = req.body;
      const updated = await prisma.guaranteeClaim.update({
        where: { id: req.params.id },
        data: {
          status,
          reviewNotes,
          refundAmount,
          reviewedBy: req.user!.userId,
          resolvedAt: new Date(),
          resolution: status === "APPROVED_RESERVICE" ? "Re-service" : status === "APPROVED_REFUND" ? "Refund" : "Denied",
        },
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to resolve claim" });
    }
  },
);

// ================================
// TWO-WAY REVIEWS
// ================================

// POST /api/features/reviews/pro - Pro reviews client
router.post(
  "/reviews/pro",
  authenticate,
  requireArtisan,
  [
    body("bookingId").isUUID(),
    body("clientId").isUUID(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString(),
    body("punctuality").optional().isInt({ min: 1, max: 5 }),
    body("communication").optional().isInt({ min: 1, max: 5 }),
    body("propertyReadiness").optional().isInt({ min: 1, max: 5 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const review = await prisma.proReview.create({
        data: { professionalId: req.user!.userId, ...req.body },
      });
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to submit review" });
    }
  },
);

// POST /api/features/reviews/:id/respond - Pro responds to client review
router.post(
  "/reviews/:id/respond",
  authenticate,
  [param("id").isUUID(), body("content").isString().trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const response = await prisma.reviewResponse.create({
        data: { reviewId: req.params.id, userId: req.user!.userId, content: req.body.content },
      });
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to respond to review" });
    }
  },
);

// ================================
// TRADE PURCHASING
// ================================

// POST /api/features/trade/account - Create trade account
router.post(
  "/trade/account",
  authenticate,
  requireArtisan,
  async (req: AuthRequest, res: Response) => {
    try {
      const existing = await prisma.tradeAccount.findUnique({ where: { userId: req.user!.userId } });
      if (existing) return res.status(400).json({ success: false, error: "Trade account exists" });

      const account = await prisma.tradeAccount.create({
        data: { userId: req.user!.userId },
      });
      res.status(201).json({ success: true, data: account });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create trade account" });
    }
  },
);

// GET /api/features/trade/account
router.get(
  "/trade/account",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const account = await prisma.tradeAccount.findUnique({
        where: { userId: req.user!.userId },
        include: { orders: { orderBy: { createdAt: "desc" }, take: 10 } },
      });
      res.json({ success: true, data: account });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get trade account" });
    }
  },
);

// POST /api/features/trade/order - Place trade order
router.post(
  "/trade/order",
  authenticate,
  requireArtisan,
  [
    body("vendorId").isUUID(),
    body("items").isArray({ min: 1 }),
    body("items.*.productId").isUUID(),
    body("items.*.quantity").isInt({ min: 1 }),
    body("deliveryAddress").isString().notEmpty(),
    body("deliveryCity").isString().notEmpty(),
    body("deliveryState").isString().notEmpty(),
    body("bookingId").optional().isUUID(),
    body("useCredit").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { vendorId, items, deliveryAddress, deliveryCity, deliveryState, bookingId, useCredit } = req.body;

      const account = await prisma.tradeAccount.findUnique({ where: { userId: req.user!.userId } });
      if (!account || !account.isApproved) {
        return res.status(403).json({ success: false, error: "Trade account not approved" });
      }

      // Fetch products with trade pricing
      const productIds = items.map((i: any) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, tradePriceEnabled: true },
      });

      let subtotal = 0;
      const orderItems: any[] = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;
        const unitPrice = product.tradePrice || product.price;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;
        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }

      const discount = subtotal * 0.05; // Additional 5% trade discount
      const total = subtotal - discount;
      const orderNumber = `TRD-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

      // Check credit if using credit
      if (useCredit && account.creditAvailable < total) {
        return res.status(400).json({ success: false, error: "Insufficient trade credit" });
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + account.paymentTerms);

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.tradeOrder.create({
          data: {
            tradeAccountId: account.id,
            vendorId,
            orderNumber,
            subtotal,
            discount,
            total,
            deliveryAddress,
            deliveryCity,
            deliveryState,
            bookingId,
            isPaidOnCredit: useCredit || false,
            dueDate: useCredit ? dueDate : null,
            items: { create: orderItems },
          },
          include: { items: true },
        });

        if (useCredit) {
          await tx.tradeAccount.update({
            where: { id: account.id },
            data: { creditUsed: { increment: total }, creditAvailable: { decrement: total } },
          });
        }

        return newOrder;
      });

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error("Trade order error:", error);
      res.status(500).json({ success: false, error: "Failed to place trade order" });
    }
  },
);

// ================================
// SLA & COMPLIANCE
// ================================

// GET /api/features/sla/:userId - Get SLA records
router.get(
  "/sla/:userId",
  authenticate,
  param("userId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const records = await prisma.sLARecord.findMany({
        where: { userId: req.params.userId },
        orderBy: { period: "desc" },
        take: 12,
      });
      res.json({ success: true, data: records });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get SLA records" });
    }
  },
);

// ================================
// RECOMMENDATIONS
// ================================

// GET /api/features/recommendations
router.get(
  "/recommendations",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const recommendations = await prisma.userRecommendation.findMany({
        where: { userId: req.user!.userId, isActedOn: false },
        orderBy: { score: "desc" },
        take: 10,
      });
      res.json({ success: true, data: recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get recommendations" });
    }
  },
);

export default router;
