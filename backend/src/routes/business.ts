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
// PATCH /api/business/profile - Update business profile
// ================================
router.patch(
  "/profile",
  authenticate,
  requireBusinessOwner,
  [
    body("name").optional().isString(),
    body("description").optional().isString(),
    body("address").optional().isString(),
    body("city").optional().isString(),
    body("phone").optional().isMobilePhone("any"),
    body("email").optional().isEmail(),
    body("logo").optional().isString(),
    body("coverImage").optional().isString(),
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

      const business = (req as any).business;
      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          name: req.body.name,
          description: req.body.description,
          address: req.body.address,
          city: req.body.city,
          phone: req.body.phone,
          email: req.body.email,
          logo: req.body.logo,
          coverImage: req.body.coverImage,
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Business profile updated",
      });
    } catch (error) {
      console.error("Update business profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  },
);

// ================================
// POST /api/business/verification - Submit verification docs
// ================================
router.post(
  "/verification",
  authenticate,
  requireBusinessOwner,
  [
    body("cacNumber").optional().isString(),
    body("tinNumber").optional().isString(),
    body("cacDocumentUrl").optional().isString(),
    body("tinDocumentUrl").optional().isString(),
    body("utilityBillUrl").optional().isString(),
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

      const business = (req as any).business;
      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          cacNumber: req.body.cacNumber,
          tinNumber: req.body.tinNumber,
          cacDocumentUrl: req.body.cacDocumentUrl,
          tinDocumentUrl: req.body.tinDocumentUrl,
          utilityBillUrl: req.body.utilityBillUrl,
          verificationStatus: "IN_REVIEW",
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Verification submitted",
      });
    } catch (error) {
      console.error("Submit verification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to submit verification",
      });
    }
  },
);

// ================================
// Services (Offerings)
// ================================
router.get(
  "/services",
  authenticate,
  requireBusinessOwner,
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const services = await prisma.businessServiceOffering.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: services });
    } catch (error) {
      console.error("List services error:", error);
      res.status(500).json({ success: false, error: "Failed to load services" });
    }
  },
);

router.post(
  "/services",
  authenticate,
  requireBusinessOwner,
  [
    body("categoryId").trim().notEmpty(),
    body("categoryName").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("basePrice").isNumeric(),
    body("priceType").isIn(["FIXED", "HOURLY", "QUOTE"]),
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

      const business = (req as any).business;
      const service = await prisma.businessServiceOffering.create({
        data: {
          businessId: business.id,
          categoryId: req.body.categoryId,
          categoryName: req.body.categoryName,
          description: req.body.description,
          basePrice: Number(req.body.basePrice),
          priceType: req.body.priceType,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        data: service,
        message: "Service added",
      });
    } catch (error) {
      console.error("Create service error:", error);
      res.status(500).json({ success: false, error: "Failed to create service" });
    }
  },
);

router.patch(
  "/services/:serviceId",
  authenticate,
  requireBusinessOwner,
  param("serviceId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const existing = await prisma.businessServiceOffering.findUnique({
        where: { id: req.params.serviceId },
      });
      if (!existing || existing.businessId !== business.id) {
        return res.status(404).json({ success: false, error: "Service not found" });
      }

      const service = await prisma.businessServiceOffering.update({
        where: { id: req.params.serviceId },
        data: {
          categoryId: req.body.categoryId,
          categoryName: req.body.categoryName,
          description: req.body.description,
          basePrice:
            req.body.basePrice !== undefined
              ? Number(req.body.basePrice)
              : undefined,
          priceType: req.body.priceType,
          isActive: req.body.isActive,
        },
      });

      res.json({ success: true, data: service, message: "Service updated" });
    } catch (error) {
      console.error("Update service error:", error);
      res.status(500).json({ success: false, error: "Failed to update service" });
    }
  },
);

router.post(
  "/services/:serviceId/toggle",
  authenticate,
  requireBusinessOwner,
  param("serviceId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const service = await prisma.businessServiceOffering.findUnique({
        where: { id: req.params.serviceId },
      });
      if (!service || service.businessId !== business.id) {
        return res.status(404).json({ success: false, error: "Service not found" });
      }

      const updated = await prisma.businessServiceOffering.update({
        where: { id: req.params.serviceId },
        data: { isActive: !service.isActive },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Toggle service error:", error);
      res.status(500).json({ success: false, error: "Failed to update service" });
    }
  },
);

// ================================
// GET /api/business/jobs
// ================================
router.get(
  "/jobs",
  authenticate,
  requireBusinessOwner,
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const jobs = await prisma.booking.findMany({
        where: { businessId: business.id },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      const enriched = jobs.map((job) => ({
        ...job,
        clientName: job.client
          ? `${job.client.firstName} ${job.client.lastName}`.trim()
          : undefined,
        clientPhone: job.client?.phone || undefined,
      }));
      res.json({ success: true, data: enriched });
    } catch (error) {
      console.error("Get business jobs error:", error);
      res.status(500).json({ success: false, error: "Failed to get jobs" });
    }
  },
);

// ================================
// POST /api/business/projects - Create a business project
// ================================
router.post(
  "/projects",
  authenticate,
  requireBusinessOwner,
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("serviceType").trim().notEmpty(),
    body("requiredSkills").optional().isArray(),
    body("budgetMin").isNumeric(),
    body("budgetMax").isNumeric(),
    body("address").trim().notEmpty(),
    body("city").trim().notEmpty(),
    body("state").trim().notEmpty(),
    body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    body("artisansNeeded").optional().isInt({ min: 1 }),
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

      const business = (req as any).business;
      const project = await prisma.businessProject.create({
        data: {
          businessId: business.id,
          title: req.body.title,
          description: req.body.description,
          serviceType: req.body.serviceType,
          requiredSkills: req.body.requiredSkills || [],
          budgetMin: Number(req.body.budgetMin),
          budgetMax: Number(req.body.budgetMax),
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          priority: req.body.priority || "MEDIUM",
          artisansNeeded: req.body.artisansNeeded
            ? Number(req.body.artisansNeeded)
            : 1,
        },
      });

      res.status(201).json({
        success: true,
        data: project,
        message: "Project created successfully",
      });
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ success: false, error: "Failed to create project" });
    }
  },
);

// ================================
// POST /api/business/jobs/:jobId/accept
// ================================
router.post(
  "/jobs/:jobId/accept",
  authenticate,
  requireBusinessOwner,
  param("jobId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const jobId = req.params.jobId as string;

      const booking = await prisma.booking.update({
        where: { id: jobId },
        data: {
          businessId: business.id,
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      res.json({ success: true, data: booking, message: "Job accepted" });
    } catch (error) {
      console.error("Accept job error:", error);
      res.status(500).json({ success: false, error: "Failed to accept job" });
    }
  },
);

// ================================
// POST /api/business/jobs/:jobId/decline
// ================================
router.post(
  "/jobs/:jobId/decline",
  authenticate,
  requireBusinessOwner,
  param("jobId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const booking = await prisma.booking.update({
        where: { id: req.params.jobId },
        data: { status: "CANCELLED" },
      });
      res.json({ success: true, data: booking, message: "Job declined" });
    } catch (error) {
      console.error("Decline job error:", error);
      res.status(500).json({ success: false, error: "Failed to decline job" });
    }
  },
);

// ================================
// PATCH /api/business/jobs/:jobId/status
// ================================
router.patch(
  "/jobs/:jobId/status",
  authenticate,
  requireBusinessOwner,
  [param("jobId").isUUID(), body("status").isIn(["IN_PROGRESS", "COMPLETED"])],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      const booking = await prisma.booking.update({
        where: { id: req.params.jobId },
        data:
          status === "COMPLETED"
            ? {
                status,
                completedAt: new Date(),
              }
            : { status, startedAt: new Date() },
      });
      res.json({ success: true, data: booking, message: "Status updated" });
    } catch (error) {
      console.error("Update job status error:", error);
      res.status(500).json({ success: false, error: "Failed to update job" });
    }
  },
);

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
// PATCH /api/business/members/:userId - Update team member
// ================================
router.patch(
  "/members/:userId",
  authenticate,
  requireBusinessOwner,
  param("userId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const business = (req as any).business;
      const userId = req.params.userId as string;

      const member = await prisma.businessMember.findUnique({
        where: {
          businessId_userId: {
            businessId: business.id,
            userId,
          },
        },
      });

      if (!member) {
        return res.status(404).json({
          success: false,
          error: "Member not found",
        });
      }

      const updated = await prisma.businessMember.update({
        where: {
          businessId_userId: {
            businessId: business.id,
            userId,
          },
        },
        data: {
          role: req.body.role,
          isActive: req.body.isActive,
        },
      });

      res.json({ success: true, data: updated, message: "Member updated" });
    } catch (error) {
      console.error("Update member error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update member",
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

      const memberUser = await prisma.user.findUnique({
        where: { id: memberId },
        select: { firstName: true, lastName: true },
      });

      // Update booking assignment
      const booking = await prisma.booking.update({
        where: { id: jobId },
        data: {
          businessId: business.id,
          assignedMemberId: memberId,
          assignedMemberName: memberUser
            ? `${memberUser.firstName} ${memberUser.lastName}`
            : undefined,
          status: "ASSIGNED",
        },
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
