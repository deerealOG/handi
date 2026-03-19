// src/routes/products.ts
// Product Marketplace routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// ================================
// GET /api/products - List/search products
// ================================
router.get(
  "/",
  [
    query("category").optional().isString(),
    query("search").optional().isString(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("brand").optional().isString(),
    query("sortBy").optional().isIn(["price_asc", "price_desc", "rating", "newest", "popular"]),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
    query("featured").optional().isBoolean(),
    query("installable").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        category, search, minPrice, maxPrice, brand,
        sortBy = "newest", page = "1", perPage = "20",
        featured, installable,
      } = req.query;

      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);
      const skip = (pageNum - 1) * perPageNum;

      const where: any = { status: "ACTIVE" };

      if (category) where.categoryName = category;
      if (brand) where.brand = brand;
      if (featured === "true") where.isFeatured = true;
      if (installable === "true") where.isInstallable = true;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice as string);
        if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { tags: { array_contains: search } },
        ];
      }

      let orderBy: any = { createdAt: "desc" };
      if (sortBy === "price_asc") orderBy = { price: "asc" };
      if (sortBy === "price_desc") orderBy = { price: "desc" };
      if (sortBy === "rating") orderBy = { rating: "desc" };
      if (sortBy === "popular") orderBy = { totalSold: "desc" };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            vendor: {
              select: { id: true, businessName: true, logo: true, rating: true, isVerified: true },
            },
          },
          orderBy,
          skip,
          take: perPageNum,
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          page: pageNum,
          perPage: perPageNum,
          total,
          totalPages: Math.ceil(total / perPageNum),
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ success: false, error: "Failed to get products" });
    }
  },
);

// ================================
// GET /api/products/featured - Featured products
// ================================
router.get("/featured", async (_req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: {
        vendor: {
          select: { id: true, businessName: true, logo: true, isVerified: true },
        },
      },
      orderBy: { rating: "desc" },
      take: 12,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ success: false, error: "Failed to get featured products" });
  }
});

// ================================
// GET /api/products/categories - Product categories
// ================================
router.get("/categories", async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ["categoryName"],
      where: { status: "ACTIVE", categoryName: { not: null } },
      _count: { id: true },
    });
    res.json({
      success: true,
      data: categories.map((c) => ({
        name: c.categoryName,
        count: c._count.id,
      })),
    });
  } catch (error) {
    console.error("Get product categories error:", error);
    res.status(500).json({ success: false, error: "Failed to get categories" });
  }
});

// ================================
// GET /api/products/:id - Single product
// ================================
router.get(
  "/:id",
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: {
          vendor: {
            select: {
              id: true, businessName: true, logo: true, rating: true,
              isVerified: true, description: true, city: true, state: true,
            },
          },
          reviews: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.json({ success: true, data: product });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ success: false, error: "Failed to get product" });
    }
  },
);

// ================================
// POST /api/products/:id/reviews - Add product review
// ================================
router.post(
  "/:id/reviews",
  authenticate,
  [
    param("id").isUUID(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("title").optional().isString().trim(),
    body("comment").optional().isString().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { rating, title, comment } = req.body;
      const productId = req.params.id;

      // Check if user already reviewed this product
      const existing = await prisma.productReview.findFirst({
        where: { productId, userId: req.user!.userId },
      });
      if (existing) {
        return res.status(400).json({ success: false, error: "You already reviewed this product" });
      }

      // Check if user purchased this product (verified review)
      const purchased = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: { userId: req.user!.userId, status: "DELIVERED" },
        },
      });

      const review = await prisma.productReview.create({
        data: {
          productId,
          userId: req.user!.userId,
          rating,
          title,
          comment,
          isVerified: !!purchased,
        },
      });

      // Update product rating
      const avgRating = await prisma.productReview.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: avgRating._avg.rating || 0,
          reviewCount: avgRating._count.id,
        },
      });

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({ success: false, error: "Failed to add review" });
    }
  },
);

export default router;
