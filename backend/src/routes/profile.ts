// src/routes/profile.ts
// Profile management routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// GET /api/profile - Get current user profile
// ================================
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        userType: true,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        verificationStatus: true,
        city: true,
        state: true,
        address: true,
        skills: true,
        bio: true,
        rating: true,
        totalJobs: true,
        certifications: true,
        isOnline: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get profile",
    });
  }
});

// ================================
// PATCH /api/profile - Update profile
// ================================
router.patch(
  "/",
  authenticate,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
    body("phone").optional().isMobilePhone("any"),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("address").optional().trim(),
    body("bio").optional().trim().isLength({ max: 500 }),
    body("skills").optional().isArray(),
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

      const allowedFields = [
        "firstName",
        "lastName",
        "phone",
        "city",
        "state",
        "address",
        "bio",
        "skills",
        "avatar",
      ];

      const updateData: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          avatar: true,
          userType: true,
          city: true,
          state: true,
          address: true,
          skills: true,
          bio: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: {
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        },
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  },
);

// ================================
// PATCH /api/profile/online - Toggle online status
// ================================
router.patch(
  "/online",
  authenticate,
  body("isOnline").isBoolean(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { isOnline } = req.body;

      await prisma.user.update({
        where: { id: req.user!.userId },
        data: { isOnline },
      });

      res.json({
        success: true,
        data: { isOnline },
        message: isOnline ? "You are now online" : "You are now offline",
      });
    } catch (error) {
      console.error("Toggle online error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update status",
      });
    }
  },
);

// ================================
// GET /api/profile/reviews - Get artisan reviews
// ================================
router.get(
  "/reviews",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          booking: {
            artisanId: req.user!.userId,
          },
        },
        include: {
          booking: {
            select: {
              id: true,
              serviceType: true,
              completedAt: true,
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Calculate rating stats
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      reviews.forEach((review) => {
        ratingCounts[review.rating as 1 | 2 | 3 | 4 | 5]++;
        totalRating += review.rating;
      });

      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      res.json({
        success: true,
        data: {
          reviews: reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            serviceType: r.booking.serviceType,
            client: {
              fullName: `${r.booking.client.firstName} ${r.booking.client.lastName}`,
              avatar: r.booking.client.avatar,
            },
          })),
          stats: {
            totalReviews: reviews.length,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingBreakdown: ratingCounts,
          },
        },
      });
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get reviews",
      });
    }
  },
);

export default router;
