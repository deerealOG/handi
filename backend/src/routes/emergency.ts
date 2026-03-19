// src/routes/emergency.ts
// Emergency Services routes

import { Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authenticate, AuthRequest, requireArtisan } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// Surge pricing based on urgency and time of day
function calculateSurge(urgencyLevel: number): number {
  const hour = new Date().getHours();
  let multiplier = 1.0;

  // Urgency multiplier
  if (urgencyLevel === 1) multiplier = 1.75; // Critical
  else if (urgencyLevel === 2) multiplier = 1.4; // Urgent
  else multiplier = 1.15; // Same-day

  // After-hours premium (8pm - 6am)
  if (hour >= 20 || hour < 6) multiplier *= 1.25;
  // Weekend premium
  const day = new Date().getDay();
  if (day === 0 || day === 6) multiplier *= 1.15;

  return Math.round(multiplier * 100) / 100;
}

// ================================
// POST /api/emergency - Create emergency request
// ================================
router.post(
  "/",
  authenticate,
  [
    body("categoryId").isString().notEmpty(),
    body("categoryName").isString().notEmpty(),
    body("description").isString().trim().notEmpty(),
    body("address").isString().trim().notEmpty(),
    body("city").isString().trim().notEmpty(),
    body("latitude").optional().isFloat(),
    body("longitude").optional().isFloat(),
    body("urgencyLevel").optional().isInt({ min: 1, max: 3 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { categoryId, categoryName, description, address, city, latitude, longitude, urgencyLevel = 1 } = req.body;
      const surgeMultiplier = calculateSurge(urgencyLevel);

      const request = await prisma.emergencyRequest.create({
        data: {
          clientId: req.user!.userId,
          categoryId,
          categoryName,
          description,
          address,
          city,
          latitude,
          longitude,
          urgencyLevel,
          surgeMultiplier,
        },
      });

      // Find available emergency pros in the area
      const emergencyPros = await prisma.emergencyProPool.findMany({
        where: { isAvailable: true },
      });

      // Notify nearby pros
      for (const pro of emergencyPros) {
        const categories = (pro.categoryIds as string[]) || [];
        if (categories.includes(categoryId)) {
          await prisma.notification.create({
            data: {
              userId: pro.userId,
              type: "JOB_REQUEST",
              title: "🚨 Emergency Service Request",
              body: `Urgent ${categoryName} request in ${city}`,
              data: { emergencyRequestId: request.id, surgeMultiplier },
            },
          });
        }
      }

      res.status(201).json({
        success: true,
        data: { ...request, surgeMultiplier },
        message: "Emergency request submitted. Professionals are being notified.",
      });
    } catch (error) {
      console.error("Create emergency request error:", error);
      res.status(500).json({ success: false, error: "Failed to create emergency request" });
    }
  },
);

// ================================
// POST /api/emergency/:id/respond - Pro responds to emergency
// ================================
router.post(
  "/:id/respond",
  authenticate,
  requireArtisan,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const request = await prisma.emergencyRequest.findUnique({
        where: { id: req.params.id as string },
      });

      if (!request) {
        return res.status(404).json({ success: false, error: "Emergency request not found" });
      }
      if (request.respondedBy) {
        return res.status(400).json({ success: false, error: "Already claimed by another professional" });
      }

      const updated = await prisma.emergencyRequest.update({
        where: { id: request.id },
        data: {
          respondedBy: req.user!.userId,
          respondedAt: new Date(),
        },
      });

      // Notify the client
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          type: "JOB_ACCEPTED",
          title: "Emergency Pro Found!",
          body: "A professional is on their way to help you.",
          data: { emergencyRequestId: request.id },
        },
      });

      res.json({ success: true, data: updated, message: "Emergency accepted" });
    } catch (error) {
      console.error("Respond to emergency error:", error);
      res.status(500).json({ success: false, error: "Failed to respond" });
    }
  },
);

// ================================
// GET /api/emergency/active - User's active emergencies
// ================================
router.get(
  "/active",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const requests = await prisma.emergencyRequest.findMany({
        where: {
          OR: [
            { clientId: req.user!.userId },
            { respondedBy: req.user!.userId },
          ],
          isResolved: false,
        },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get emergencies" });
    }
  },
);

// ================================
// POST /api/emergency/pool/join - Join emergency pro pool
// ================================
router.post(
  "/pool/join",
  authenticate,
  requireArtisan,
  [
    body("categoryIds").isArray({ min: 1 }),
    body("maxDistance").optional().isFloat({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { categoryIds, maxDistance = 15 } = req.body;

      const entry = await prisma.emergencyProPool.upsert({
        where: { userId: req.user!.userId },
        update: { categoryIds, maxDistance, isAvailable: true },
        create: { userId: req.user!.userId, categoryIds, maxDistance },
      });

      res.json({ success: true, data: entry, message: "Joined emergency pool" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to join pool" });
    }
  },
);

export default router;
