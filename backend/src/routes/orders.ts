// src/routes/orders.ts
// Order management routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ================================
// GET /api/orders - User's orders
// ================================
router.get(
  "/",
  authenticate,
  [
    query("status").optional().isString(),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, page = "1", perPage = "10" } = req.query;
      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);
      const skip = (pageNum - 1) * perPageNum;

      const where: any = { userId: req.user!.userId };
      if (status && status !== "all") where.status = status;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: true,
            vendor: {
              select: { id: true, businessName: true, logo: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPageNum,
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: pageNum,
          perPage: perPageNum,
          total,
          totalPages: Math.ceil(total / perPageNum),
        },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ success: false, error: "Failed to get orders" });
    }
  },
);

// ================================
// POST /api/orders - Create order (checkout)
// ================================
router.post(
  "/",
  authenticate,
  [
    body("vendorId").isUUID(),
    body("items").isArray({ min: 1 }),
    body("items.*.productId").isUUID(),
    body("items.*.quantity").isInt({ min: 1 }),
    body("shippingAddress").isString().trim().notEmpty(),
    body("shippingCity").isString().trim().notEmpty(),
    body("shippingState").isString().trim().notEmpty(),
    body("shippingPhone").optional().isString(),
    body("shippingMethod").optional().isString(),
    body("paymentMethod").optional().isString(),
    body("pairedBookingId").optional().isUUID(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        vendorId, items, shippingAddress, shippingCity, shippingState,
        shippingPhone, shippingMethod, paymentMethod, pairedBookingId,
      } = req.body;

      // Fetch products and validate stock
      const productIds = items.map((i: any) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, vendorId },
      });

      if (products.length !== items.length) {
        return res.status(400).json({ success: false, error: "Some products not found or not from this vendor" });
      }

      // Check stock and calculate totals
      let subtotal = 0;
      const orderItems: any[] = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.name}`,
          });
        }
        const totalPrice = product.price * item.quantity;
        subtotal += totalPrice;
        orderItems.push({
          productId: product.id,
          productName: product.name,
          productImage: (product.images as any[])?.[0] || null,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice,
        });
      }

      const shippingFee = subtotal > 50000 ? 0 : 2500; // Free shipping over 50k
      const total = subtotal + shippingFee;
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

      // Create order with items in a transaction
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: req.user!.userId,
            vendorId,
            subtotal,
            shippingFee,
            total,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingPhone,
            shippingMethod,
            paymentMethod,
            pairedBookingId,
            items: {
              create: orderItems,
            },
          },
          include: { items: true },
        });

        // Decrement product stock
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              totalSold: { increment: item.quantity },
            },
          });
        }

        // Update vendor stats
        await tx.vendor.update({
          where: { id: vendorId },
          data: { totalSales: { increment: 1 } },
        });

        return newOrder;
      });

      res.status(201).json({
        success: true,
        data: order,
        message: "Order placed successfully",
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  },
);

// ================================
// GET /api/orders/:id - Order details
// ================================
router.get(
  "/:id",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: true, slug: true },
              },
            },
          },
          vendor: {
            select: { id: true, businessName: true, logo: true, phone: true, email: true },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
      if (order.userId !== req.user!.userId && req.user!.userType !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ success: false, error: "Failed to get order" });
    }
  },
);

// ================================
// PATCH /api/orders/:id/cancel - Cancel order
// ================================
router.patch(
  "/:id/cancel",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
      if (order.userId !== req.user!.userId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }
      if (!["PENDING", "CONFIRMED"].includes(order.status)) {
        return res.status(400).json({ success: false, error: "Order cannot be cancelled at this stage" });
      }

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED", cancelledAt: new Date() },
        });

        // Restore stock
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              totalSold: { decrement: item.quantity },
            },
          });
        }
      });

      res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({ success: false, error: "Failed to cancel order" });
    }
  },
);

// ================================
// PATCH /api/orders/:id/status - Update order status (vendor/admin)
// ================================
router.patch(
  "/:id/status",
  authenticate,
  [
    param("id").isUUID(),
    body("status").isIn(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]),
    body("trackingNumber").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, trackingNumber } = req.body;
      const order = await prisma.order.findUnique({ where: { id: req.params.id } });

      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const updateData: any = { status };
      if (status === "CONFIRMED") updateData.confirmedAt = new Date();
      if (status === "SHIPPED") {
        updateData.shippedAt = new Date();
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
      }
      if (status === "DELIVERED") updateData.deliveredAt = new Date();

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: updateData,
      });

      // Notify customer
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "SYSTEM",
          title: `Order ${status.toLowerCase()}`,
          body: `Your order #${order.orderNumber} has been ${status.toLowerCase()}`,
          data: { orderId: order.id },
        },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ success: false, error: "Failed to update order" });
    }
  },
);

// ================================
// POST /api/orders/:id/return - Request return
// ================================
router.post(
  "/:id/return",
  authenticate,
  [
    param("id").isUUID(),
    body("reason").isString().trim().notEmpty(),
    body("type").isIn(["DEFECTIVE_PRODUCT", "CHANGE_OF_MIND"]),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { reason, type } = req.body;
      const order = await prisma.order.findUnique({ where: { id: req.params.id } });

      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
      if (order.userId !== req.user!.userId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }
      if (order.status !== "DELIVERED") {
        return res.status(400).json({ success: false, error: "Only delivered orders can be returned" });
      }

      // Check return window
      const deliveredAt = order.deliveredAt || order.updatedAt;
      const daysSinceDelivery = Math.floor((Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24));

      if (type === "DEFECTIVE_PRODUCT" && daysSinceDelivery > 14) {
        return res.status(400).json({ success: false, error: "Defective product return window (14 days) has expired" });
      }
      if (type === "CHANGE_OF_MIND" && daysSinceDelivery > 7) {
        return res.status(400).json({ success: false, error: "Change of mind return window (7 days) has expired" });
      }

      // Calculate refund based on policy
      let refundPercentage = 100;
      let refundAmount = order.total;
      if (type === "CHANGE_OF_MIND") {
        refundAmount = order.total - order.shippingFee; // 100% less return shipping
      }

      const refund = await prisma.refundRequest.create({
        data: {
          orderId: order.id,
          userId: req.user!.userId,
          type,
          originalAmount: order.total,
          refundAmount,
          refundPercentage,
          reason,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: "RETURNED", returnedAt: new Date() },
      });

      res.status(201).json({
        success: true,
        data: refund,
        message: "Return request submitted",
      });
    } catch (error) {
      console.error("Return order error:", error);
      res.status(500).json({ success: false, error: "Failed to process return" });
    }
  },
);

export default router;
