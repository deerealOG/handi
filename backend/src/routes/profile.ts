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
        providerSubType: true,
        adminRole: true,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        verificationStatus: true,
        verificationLevel: true,
        city: true,
        state: true,
        address: true,
        skills: true,
        bio: true,
        rating: true,
        totalJobs: true,
        preferredCategories: true,
        isOnline: true,
        certifications: true,
        workExperiences: true,
        nextOfKin: true,
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
    body("preferredCategories").optional().isArray(),
    body("providerSubType").optional().isIn(["INDIVIDUAL", "BUSINESS"]),
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
        "preferredCategories",
        "providerSubType",
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
          providerSubType: true,
          city: true,
          state: true,
          address: true,
          skills: true,
          bio: true,
          preferredCategories: true,
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
// Certifications
// ================================
router.get(
  "/certifications",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const certifications = await prisma.userCertification.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: certifications });
    } catch (error) {
      console.error("List certifications error:", error);
      res.status(500).json({ success: false, error: "Failed to load data" });
    }
  },
);

router.post(
  "/certifications",
  authenticate,
  [
    body("name").trim().notEmpty(),
    body("type").optional().isString(),
    body("issuer").optional().isString(),
    body("year").optional().isString(),
    body("fileName").optional().isString(),
    body("fileUrl").optional().isString(),
    body("status").optional().isString(),
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

      const certification = await prisma.userCertification.create({
        data: {
          userId: req.user!.userId,
          name: req.body.name,
          type: req.body.type,
          issuer: req.body.issuer,
          year: req.body.year,
          fileName: req.body.fileName,
          fileUrl: req.body.fileUrl,
          status: req.body.status,
        },
      });

      res.status(201).json({
        success: true,
        data: certification,
        message: "Certification added",
      });
    } catch (error) {
      console.error("Add certification error:", error);
      res.status(500).json({ success: false, error: "Failed to save" });
    }
  },
);

router.patch(
  "/certifications/:id",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const certification = await prisma.userCertification.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
          type: req.body.type,
          issuer: req.body.issuer,
          year: req.body.year,
          fileName: req.body.fileName,
          fileUrl: req.body.fileUrl,
          status: req.body.status,
        },
      });
      res.json({ success: true, data: certification });
    } catch (error) {
      console.error("Update certification error:", error);
      res.status(500).json({ success: false, error: "Failed to update" });
    }
  },
);

router.delete(
  "/certifications/:id",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.userCertification.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true, message: "Certification removed" });
    } catch (error) {
      console.error("Delete certification error:", error);
      res.status(500).json({ success: false, error: "Failed to delete" });
    }
  },
);

// ================================
// Work Experience
// ================================
router.get(
  "/work-experience",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const items = await prisma.workExperience.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: items });
    } catch (error) {
      console.error("List work experience error:", error);
      res.status(500).json({ success: false, error: "Failed to load data" });
    }
  },
);

router.post(
  "/work-experience",
  authenticate,
  [
    body("title").trim().notEmpty(),
    body("company").trim().notEmpty(),
    body("duration").trim().notEmpty(),
    body("description").optional().isString(),
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

      const item = await prisma.workExperience.create({
        data: {
          userId: req.user!.userId,
          title: req.body.title,
          company: req.body.company,
          duration: req.body.duration,
          description: req.body.description,
        },
      });
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error("Add work experience error:", error);
      res.status(500).json({ success: false, error: "Failed to save" });
    }
  },
);

router.patch(
  "/work-experience/:id",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const item = await prisma.workExperience.update({
        where: { id: req.params.id },
        data: {
          title: req.body.title,
          company: req.body.company,
          duration: req.body.duration,
          description: req.body.description,
        },
      });
      res.json({ success: true, data: item });
    } catch (error) {
      console.error("Update work experience error:", error);
      res.status(500).json({ success: false, error: "Failed to update" });
    }
  },
);

router.delete(
  "/work-experience/:id",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.workExperience.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Work experience removed" });
    } catch (error) {
      console.error("Delete work experience error:", error);
      res.status(500).json({ success: false, error: "Failed to delete" });
    }
  },
);

// ================================
// Next of Kin
// ================================
router.get(
  "/next-of-kin",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const item = await prisma.nextOfKin.findUnique({
        where: { userId: req.user!.userId },
      });
      res.json({ success: true, data: item });
    } catch (error) {
      console.error("Get next of kin error:", error);
      res.status(500).json({ success: false, error: "Failed to load data" });
    }
  },
);

router.put(
  "/next-of-kin",
  authenticate,
  [
    body("name").trim().notEmpty(),
    body("relationship").trim().notEmpty(),
    body("phone").trim().notEmpty(),
    body("address").optional().isString(),
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

      const item = await prisma.nextOfKin.upsert({
        where: { userId: req.user!.userId },
        update: {
          name: req.body.name,
          relationship: req.body.relationship,
          phone: req.body.phone,
          address: req.body.address,
        },
        create: {
          userId: req.user!.userId,
          name: req.body.name,
          relationship: req.body.relationship,
          phone: req.body.phone,
          address: req.body.address,
        },
      });

      res.json({ success: true, data: item, message: "Saved" });
    } catch (error) {
      console.error("Upsert next of kin error:", error);
      res.status(500).json({ success: false, error: "Failed to save" });
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
