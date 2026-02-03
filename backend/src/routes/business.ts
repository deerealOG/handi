// src/routes/business.ts
// Business/Agency management routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Middleware to check business owner
const requireBusinessOwner = async (
  req: AuthRequest,
  res: Response,
  next: Function,
) => {
  try {
    const business = await prisma.business.findUnique({
      where: { ownerId: req.user!.userId },
    });

    if (!business) {
      return res.status(403).json({
        success: false,
        error: "You do not own a business",
      });
    }

    (req as any).business = business;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: "Authorization failed" });
  }
};

// ================================
// POST /api/business - Create a business
// ================================
router.post(
  "/",
  authenticate,
  [
    body("name").trim().notEmpty(),
    body("description").optional().isString(),
    body("address").optional().isString(),
    body("city").optional().isString(),
    body("phone").optional().isMobilePhone("any"),
    body("email").optional().isEmail(),
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

      // Check if user already owns a business
      const existing = await prisma.business.findUnique({
        where: { ownerId: req.user!.userId },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: "You already own a business",
        });
      }

      const { name, description, address, city, phone, email } = req.body;

      const business = await prisma.business.create({
        data: {
          name,
          ownerId: req.user!.userId,
          description,
          address,
          city,
          phone,
          email,
          members: {
            create: {
              userId: req.user!.userId,
              role: "OWNER",
            },
          },
        },
        include: { members: true },
      });

      // Update user type to BUSINESS
      await prisma.user.update({
        where: { id: req.user!.userId },
        data: { userType: "BUSINESS" },
      });

      res.status(201).json({
        success: true,
        data: business,
        message: "Business created successfully",
      });
    } catch (error) {
      console.error("Create business error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create business",
      });
    }
  },
);

// ================================
// GET /api/business - Get my business
// ================================
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const business = await prisma.business.findUnique({
      where: { ownerId: req.user!.userId },
      include: {
        members: true,
      },
    });

    if (!business) {
      // Check if user is a member of any business
      const membership = await prisma.businessMember.findFirst({
        where: { userId: req.user!.userId },
        include: { business: true },
      });

      if (membership) {
        return res.json({
          success: true,
          data: {
            ...membership.business,
            myRole: membership.role,
            isOwner: false,
          },
        });
      }

      return res.status(404).json({
        success: false,
        error: "No business found",
      });
    }

    // Get member details
    const memberIds = business.members.map((m) => m.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: memberIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedMembers = business.members.map((m) => ({
      ...m,
      user: userMap.get(m.userId),
    }));

    res.json({
      success: true,
      data: {
        ...business,
        members: enrichedMembers,
        isOwner: true,
      },
    });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get business",
    });
  }
});

// ================================
// POST /api/business/invite - Invite team member
// ================================
router.post(
  "/invite",
  authenticate,
  requireBusinessOwner,
  [
    body("email").isEmail(),
    body("role").optional().isIn(["MANAGER", "WORKER"]),
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

      const { email, role = "WORKER" } = req.body;
      const business = (req as any).business;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found with this email",
        });
      }

      // Check if already a member
      const existingMember = await prisma.businessMember.findUnique({
        where: {
          businessId_userId: {
            businessId: business.id,
            userId: user.id,
          },
        },
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          error: "User is already a member",
        });
      }

      const member = await prisma.businessMember.create({
        data: {
          businessId: business.id,
          userId: user.id,
          role,
        },
      });

      // Notify the invited user
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Business Invitation",
          body: `You've been added to ${business.name} as a ${role}`,
          data: { businessId: business.id },
        },
      });

      res.status(201).json({
        success: true,
        data: member,
        message: "Team member invited",
      });
    } catch (error) {
      console.error("Invite member error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to invite member",
      });
    }
  },
);

// ================================
// GET /api/business/members - List team members
// ================================
router.get(
  "/members",
  authenticate,
  requireBusinessOwner,
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;

      const members = await prisma.businessMember.findMany({
        where: { businessId: business.id },
      });

      const userIds = members.map((m) => m.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          rating: true,
          totalJobs: true,
          isOnline: true,
        },
      });

      const userMap = new Map(users.map((u) => [u.id, u]));

      const enrichedMembers = members.map((m) => ({
        ...m,
        user: userMap.get(m.userId),
      }));

      res.json({
        success: true,
        data: enrichedMembers,
      });
    } catch (error) {
      console.error("List members error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to list members",
      });
    }
  },
);

// ================================
// DELETE /api/business/members/:userId - Remove team member
// ================================
router.delete(
  "/members/:userId",
  authenticate,
  requireBusinessOwner,
  param("userId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const userId = req.params.userId as string;

      if (userId === req.user!.userId) {
        return res.status(400).json({
          success: false,
          error: "Cannot remove yourself",
        });
      }

      await prisma.businessMember.delete({
        where: {
          businessId_userId: {
            businessId: business.id,
            userId: userId,
          },
        },
      });

      res.json({
        success: true,
        message: "Member removed",
      });
    } catch (error) {
      console.error("Remove member error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove member",
      });
    }
  },
);

// ================================
// POST /api/business/assign/:jobId - Assign job to team member
// ================================
router.post(
  "/assign/:jobId",
  authenticate,
  requireBusinessOwner,
  [param("jobId").isUUID(), body("memberId").isUUID()],
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const jobId = req.params.jobId as string;
      const { memberId } = req.body;

      // Verify member belongs to business
      const member = await prisma.businessMember.findUnique({
        where: {
          businessId_userId: {
            businessId: business.id,
            userId: memberId,
          },
        },
      });

      if (!member) {
        return res.status(400).json({
          success: false,
          error: "Member not found in your business",
        });
      }

      // Update booking artisanId
      const booking = await prisma.booking.update({
        where: { id: jobId },
        data: { artisanId: memberId },
      });

      // Notify the assigned member
      await prisma.notification.create({
        data: {
          userId: memberId,
          type: "JOB_REQUEST",
          title: "Job Assigned",
          body: `You've been assigned a new job: ${booking.serviceType}`,
          data: { bookingId: jobId },
        },
      });

      res.json({
        success: true,
        data: booking,
        message: "Job assigned to team member",
      });
    } catch (error) {
      console.error("Assign job error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to assign job",
      });
    }
  },
);

export default router;
