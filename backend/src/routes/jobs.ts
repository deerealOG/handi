// src/routes/jobs.ts
// Job/Booking routes for artisans

import { BookingStatus, PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireArtisan } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// GET /api/jobs - Get jobs for artisan
// ================================
router.get(
  "/",
  authenticate,
  requireArtisan,
  [
    query("status")
      .optional()
      .isIn([
        "all",
        "PENDING",
        "ACCEPTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ]),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, page = "1", perPage = "10" } = req.query;
      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);
      const skip = (pageNum - 1) * perPageNum;

      const where: any = {
        artisanId: req.user!.userId,
      };

      if (status && status !== "all") {
        where.status = status as BookingStatus;
      }

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
              },
            },
            review: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPageNum,
        }),
        prisma.booking.count({ where }),
      ]);

      res.json({
        success: true,
        data: bookings.map((booking) => ({
          ...booking,
          client: {
            ...booking.client,
            fullName: `${booking.client.firstName} ${booking.client.lastName}`,
          },
        })),
        pagination: {
          page: pageNum,
          perPage: perPageNum,
          total,
          totalPages: Math.ceil(total / perPageNum),
        },
      });
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get jobs",
      });
    }
  },
);

// ================================
// GET /api/jobs/available - Get available jobs (not assigned)
// ================================
router.get(
  "/available",
  authenticate,
  requireArtisan,
  async (req: AuthRequest, res: Response) => {
    try {
      const artisan = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { skills: true, city: true },
      });

      // Find pending jobs that match artisan's skills and location
      const jobs = await prisma.booking.findMany({
        where: {
          status: "PENDING",
          artisanId: { not: req.user!.userId },
          // Match city if artisan has location set
          ...(artisan?.city ? { city: artisan.city } : {}),
        },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      res.json({
        success: true,
        data: jobs.map((job) => ({
          ...job,
          client: {
            ...job.client,
            fullName: `${job.client.firstName} ${job.client.lastName}`,
          },
        })),
      });
    } catch (error) {
      console.error("Get available jobs error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get available jobs",
      });
    }
  },
);

// ================================
// GET /api/jobs/stats - Get job statistics
// ================================
router.get(
  "/stats",
  authenticate,
  requireArtisan,
  async (req: AuthRequest, res: Response) => {
    try {
      const [pending, inProgress, completed, cancelled, earnings] =
        await Promise.all([
          prisma.booking.count({
            where: { artisanId: req.user!.userId, status: "PENDING" },
          }),
          prisma.booking.count({
            where: { artisanId: req.user!.userId, status: "IN_PROGRESS" },
          }),
          prisma.booking.count({
            where: { artisanId: req.user!.userId, status: "COMPLETED" },
          }),
          prisma.booking.count({
            where: { artisanId: req.user!.userId, status: "CANCELLED" },
          }),
          prisma.booking.aggregate({
            where: {
              artisanId: req.user!.userId,
              status: "COMPLETED",
              finalPrice: { not: null },
            },
            _sum: { finalPrice: true },
          }),
        ]);

      res.json({
        success: true,
        data: {
          total: pending + inProgress + completed + cancelled,
          pending,
          inProgress,
          completed,
          cancelled,
          totalEarnings: earnings._sum.finalPrice || 0,
        },
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get statistics",
      });
    }
  },
);

// ================================
// GET /api/jobs/:id - Get single job
// ================================
router.get(
  "/:id",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
              address: true,
            },
          },
          artisan: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
              rating: true,
              skills: true,
            },
          },
          review: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 50,
          },
        },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      // Check access
      if (
        booking.artisanId !== req.user!.userId &&
        booking.clientId !== req.user!.userId
      ) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
        });
      }

      res.json({
        success: true,
        data: {
          ...booking,
          client: {
            ...booking.client,
            fullName: `${booking.client.firstName} ${booking.client.lastName}`,
          },
          artisan: {
            ...booking.artisan,
            fullName: `${booking.artisan.firstName} ${booking.artisan.lastName}`,
          },
        },
      });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get job",
      });
    }
  },
);

// ================================
// POST /api/jobs/:id/accept - Accept a job
// ================================
router.post(
  "/:id/accept",
  authenticate,
  requireArtisan,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      if (booking.status !== "PENDING") {
        return res.status(400).json({
          success: false,
          error: "Job is no longer available",
        });
      }

      const updated = await prisma.booking.update({
        where: { id: req.params.id },
        data: {
          artisanId: req.user!.userId,
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Create notification for client
      await prisma.notification.create({
        data: {
          userId: booking.clientId,
          type: "JOB_ACCEPTED",
          title: "Job Accepted",
          body: `Your ${booking.serviceType} job has been accepted`,
          data: { bookingId: booking.id },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Job accepted successfully",
      });
    } catch (error) {
      console.error("Accept job error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to accept job",
      });
    }
  },
);

// ================================
// POST /api/jobs/:id/decline - Decline a job
// ================================
router.post(
  "/:id/decline",
  authenticate,
  requireArtisan,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      if (booking.artisanId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
        });
      }

      // For decline, we just remove artisan and keep pending
      const updated = await prisma.booking.update({
        where: { id: req.params.id },
        data: {
          status: "PENDING",
          artisanId: booking.clientId, // Reset to client temporarily
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Job declined",
      });
    } catch (error) {
      console.error("Decline job error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to decline job",
      });
    }
  },
);

// ================================
// PATCH /api/jobs/:id/status - Update job status
// ================================
router.patch(
  "/:id/status",
  authenticate,
  requireArtisan,
  [param("id").isUUID(), body("status").isIn(["IN_PROGRESS", "COMPLETED"])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Invalid status",
        });
      }

      const { status } = req.body;
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      if (booking.artisanId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
        });
      }

      const updateData: any = { status };

      if (status === "IN_PROGRESS") {
        updateData.startedAt = new Date();
      } else if (status === "COMPLETED") {
        updateData.completedAt = new Date();
        updateData.finalPrice = booking.estimatedPrice;
        updateData.paymentStatus = "HELD_IN_ESCROW";

        // Update artisan's total jobs
        await prisma.user.update({
          where: { id: req.user!.userId },
          data: { totalJobs: { increment: 1 } },
        });
      }

      const updated = await prisma.booking.update({
        where: { id: req.params.id },
        data: updateData,
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: booking.clientId,
          type: status === "COMPLETED" ? "JOB_COMPLETED" : "JOB_ACCEPTED",
          title: status === "COMPLETED" ? "Job Completed" : "Job Started",
          body:
            status === "COMPLETED"
              ? `Your ${booking.serviceType} job has been completed`
              : `Your ${booking.serviceType} job has started`,
          data: { bookingId: booking.id },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: `Job ${status === "COMPLETED" ? "completed" : "started"}`,
      });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update status",
      });
    }
  },
);

export default router;
