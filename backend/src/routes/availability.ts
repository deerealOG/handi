// src/routes/availability.ts
// Artisan availability and scheduling routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireArtisan } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ================================
// GET /api/availability/:artisanId - Get artisan's availability
// ================================
router.get(
  "/:artisanId",
  param("artisanId").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const artisanId = req.params.artisanId as string;
      const { date } = req.query;

      // Get weekly schedule
      const weeklySchedule = await prisma.availability.findMany({
        where: { userId: artisanId },
        orderBy: { dayOfWeek: "asc" },
      });

      // Get blocked slots for specific date range if provided
      let blockedSlots: any[] = [];
      if (date) {
        const targetDate = new Date(date as string);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        blockedSlots = await prisma.blockedSlot.findMany({
          where: {
            userId: artisanId,
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      }

      res.json({
        success: true,
        data: {
          weeklySchedule,
          blockedSlots,
        },
      });
    } catch (error) {
      console.error("Get availability error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get availability",
      });
    }
  },
);

// ================================
// PUT /api/availability - Update weekly availability
// ================================
router.put(
  "/",
  authenticate,
  requireArtisan,
  body("schedule").isArray(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { schedule } = req.body;

      // Delete existing schedule
      await prisma.availability.deleteMany({
        where: { userId: req.user!.userId },
      });

      // Create new schedule
      const newSchedule = await prisma.availability.createMany({
        data: schedule.map((slot: any) => ({
          userId: req.user!.userId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive ?? true,
        })),
      });

      const updated = await prisma.availability.findMany({
        where: { userId: req.user!.userId },
        orderBy: { dayOfWeek: "asc" },
      });

      res.json({
        success: true,
        data: updated,
        message: "Availability updated",
      });
    } catch (error) {
      console.error("Update availability error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update availability",
      });
    }
  },
);

// ================================
// POST /api/availability/block - Block specific slot
// ================================
router.post(
  "/block",
  authenticate,
  requireArtisan,
  [
    body("date").isISO8601(),
    body("startTime").matches(/^\d{2}:\d{2}$/),
    body("endTime").matches(/^\d{2}:\d{2}$/),
    body("reason").optional().isString(),
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

      const { date, startTime, endTime, reason } = req.body;

      const blockedSlot = await prisma.blockedSlot.create({
        data: {
          userId: req.user!.userId,
          date: new Date(date),
          startTime,
          endTime,
          reason,
        },
      });

      res.status(201).json({
        success: true,
        data: blockedSlot,
        message: "Time slot blocked",
      });
    } catch (error) {
      console.error("Block slot error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to block slot",
      });
    }
  },
);

// ================================
// DELETE /api/availability/block/:id - Unblock slot
// ================================
router.delete(
  "/block/:id",
  authenticate,
  requireArtisan,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const slotId = req.params.id as string;
      const blockedSlot = await prisma.blockedSlot.findUnique({
        where: { id: slotId },
      });

      if (!blockedSlot) {
        return res.status(404).json({
          success: false,
          error: "Blocked slot not found",
        });
      }

      if (blockedSlot.userId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Not authorized",
        });
      }

      await prisma.blockedSlot.delete({
        where: { id: slotId },
      });

      res.json({
        success: true,
        message: "Slot unblocked",
      });
    } catch (error) {
      console.error("Unblock slot error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to unblock slot",
      });
    }
  },
);

// ================================
// GET /api/availability/slots/:artisanId/:date - Get available time slots for booking
// ================================
router.get(
  "/slots/:artisanId/:date",
  [param("artisanId").isUUID(), param("date").isISO8601()],
  async (req: AuthRequest, res: Response) => {
    try {
      const artisanId = req.params.artisanId as string;
      const date = req.params.date as string;
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();

      // Get weekly schedule for that day
      const schedule = await prisma.availability.findUnique({
        where: {
          userId_dayOfWeek: {
            userId: artisanId,
            dayOfWeek,
          },
        },
      });

      if (!schedule || !schedule.isActive) {
        return res.json({
          success: true,
          data: {
            available: false,
            slots: [],
            reason: "Not available on this day",
          },
        });
      }

      // Get blocked slots for that day
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const blockedSlots = await prisma.blockedSlot.findMany({
        where: {
          userId: artisanId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      });

      // Get existing bookings for that day
      const bookings = await prisma.booking.findMany({
        where: {
          artisanId,
          scheduledDate: { gte: startOfDay, lte: endOfDay },
          status: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] },
        },
      });

      // Generate available slots (1-hour intervals)
      const slots = [];
      const [startHour] = schedule.startTime.split(":").map(Number);
      const [endHour] = schedule.endTime.split(":").map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;

        const isBlocked = blockedSlots.some(
          (b) => timeSlot >= b.startTime && timeSlot < b.endTime,
        );

        const isBooked = bookings.some((b) => b.scheduledTime === timeSlot);

        slots.push({
          time: timeSlot,
          available: !isBlocked && !isBooked,
          reason: isBlocked ? "Blocked" : isBooked ? "Booked" : null,
        });
      }

      res.json({
        success: true,
        data: {
          available: true,
          workingHours: { start: schedule.startTime, end: schedule.endTime },
          slots,
        },
      });
    } catch (error) {
      console.error("Get slots error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get available slots",
      });
    }
  },
);

export default router;
