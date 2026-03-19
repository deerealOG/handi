// src/routes/vendors.ts
// Vendor management routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// ================================
// GET /api/vendors - List vendors
// ================================
router.get(
  "/",
  [
    query("city").optional().isString(),
    query("search").optional().isString(),
    query("verified").optional().isBoolean(),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { city, search, verified, page = "1", perPage = "20" } = req.query;
      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);
      const skip = (pageNum - 1) * perPageNum;

      const where: any = { status: "ACTIVE" };
      if (city) where.city = city;
      if (verified === "true") where.isVerified = true;
      if (search) {
        where.OR = [
          { businessName: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [vendors, total] = await Promise.all([
        prisma.vendor.findMany({
          where,
          include: { _count: { select: { products: true } } },
          orderBy: { rating: "desc" },
          skip,
          take: perPageNum,
        }),
        prisma.vendor.count({ where }),
      ]);

      res.json({
        success: true,
        data: vendors,
        pagination: { page: pageNum, perPage: perPageNum, total, totalPages: Math.ceil(total / perPageNum) },
      });
    } catch (error) {
      console.error("Get vendors error:", error);
      res.status(500).json({ success: false, error: "Failed to get vendors" });
    }
  },
);

// ================================
// POST /api/vendors/register - Register as vendor
// ================================
router.post(
  "/register",
  authenticate,
  [
    body("businessName").isString().trim().notEmpty(),
    body("description").optional().isString(),
    body("address").optional().isString(),
    body("city").optional().isString(),
    body("state").optional().isString(),
    body("phone").optional().isString(),
    body("email").optional().isEmail(),
    body("cacNumber").optional().isString(),
    body("bankName").optional().isString(),
    body("accountNumber").optional().isString(),
    body("accountName").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // Check if already a vendor
      const existing = await prisma.vendor.findUnique({
        where: { userId: req.user!.userId },
      });
      if (existing) {
        return res.status(400).json({ success: false, error: "Already registered as vendor" });
      }

      const vendor = await prisma.vendor.create({
        data: {
          userId: req.user!.userId,
          ...req.body,
        },
      });

      res.status(201).json({ success: true, data: vendor, message: "Vendor registration submitted" });
    } catch (error) {
      console.error("Register vendor error:", error);
      res.status(500).json({ success: false, error: "Failed to register vendor" });
    }
  },
);

// ================================
// GET /api/vendors/:id - Vendor profile
// ================================
router.get(
  "/:id",
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id: req.params.id },
        include: {
          products: {
            where: { status: "ACTIVE" },
            orderBy: { rating: "desc" },
            take: 20,
          },
          _count: { select: { products: true, orders: true } },
        },
      });

      if (!vendor) {
        return res.status(404).json({ success: false, error: "Vendor not found" });
      }

      res.json({ success: true, data: vendor });
    } catch (error) {
      console.error("Get vendor error:", error);
      res.status(500).json({ success: false, error: "Failed to get vendor" });
    }
  },
);

// ================================
// POST /api/vendors/products - Add product (vendor only)
// ================================
router.post(
  "/products",
  authenticate,
  [
    body("name").isString().trim().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("categoryName").optional().isString(),
    body("brand").optional().isString(),
    body("stock").optional().isInt({ min: 0 }),
    body("images").optional().isArray(),
    body("isInstallable").optional().isBoolean(),
    body("installCategoryId").optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!vendor) {
        return res.status(403).json({ success: false, error: "Not a registered vendor" });
      }

      const { name, description, price, categoryName, brand, stock, images, isInstallable, installCategoryId, ...rest } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

      const product = await prisma.product.create({
        data: {
          vendorId: vendor.id,
          name,
          slug: uniqueSlug,
          description,
          price,
          categoryName,
          brand,
          stock: stock || 0,
          images: images || [],
          isInstallable: isInstallable || false,
          installCategoryId,
          status: "ACTIVE",
        },
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error("Add product error:", error);
      res.status(500).json({ success: false, error: "Failed to add product" });
    }
  },
);

// ================================
// GET /api/vendors/dashboard/stats - Vendor dashboard stats
// ================================
router.get(
  "/dashboard/stats",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!vendor) {
        return res.status(403).json({ success: false, error: "Not a vendor" });
      }

      const [totalProducts, activeProducts, totalOrders, revenue, lowStock] = await Promise.all([
        prisma.product.count({ where: { vendorId: vendor.id } }),
        prisma.product.count({ where: { vendorId: vendor.id, status: "ACTIVE" } }),
        prisma.order.count({ where: { vendorId: vendor.id } }),
        prisma.order.aggregate({
          where: { vendorId: vendor.id, status: "DELIVERED" },
          _sum: { total: true },
        }),
        prisma.product.count({
          where: { vendorId: vendor.id, stock: { lte: 5 }, status: "ACTIVE" },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: revenue._sum.total || 0,
          lowStockProducts: lowStock,
          rating: vendor.rating,
        },
      });
    } catch (error) {
      console.error("Get vendor stats error:", error);
      res.status(500).json({ success: false, error: "Failed to get stats" });
    }
  },
);

// ================================
// GET /api/vendors/dashboard/orders - Vendor orders
// ================================
router.get(
  "/dashboard/orders",
  authenticate,
  [
    query("status").optional().isString(),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!vendor) {
        return res.status(403).json({ success: false, error: "Not a vendor" });
      }

      const { status, page = "1", perPage = "10" } = req.query;
      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);

      const where: any = { vendorId: vendor.id };
      if (status && status !== "all") where.status = status;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: { items: true },
          orderBy: { createdAt: "desc" },
          skip: (pageNum - 1) * perPageNum,
          take: perPageNum,
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: { page: pageNum, perPage: perPageNum, total, totalPages: Math.ceil(total / perPageNum) },
      });
    } catch (error) {
      console.error("Get vendor orders error:", error);
      res.status(500).json({ success: false, error: "Failed to get orders" });
    }
  },
);

export default router;
