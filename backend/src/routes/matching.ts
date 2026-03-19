// src/routes/matching.ts
// Smart Matching Engine routes

import { Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

// ================================
// Matching Algorithm
// ================================
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MatchScores {
  matchScore: number;
  skillScore: number;
  distanceScore: number;
  ratingScore: number;
  availabilityScore: number;
  priceScore: number;
  distanceKm: number | null;
}

function computeMatchScores(
  professional: any,
  categoryName: string,
  clientLat?: number | null,
  clientLon?: number | null,
  dayOfWeek?: number,
  preferredTime?: string,
): MatchScores {
  // Skill match (30% weight)
  const skills = (professional.skills as string[]) || [];
  const skillMatch = skills.some(
    (s: string) => s.toLowerCase().includes(categoryName.toLowerCase())
  );
  const skillScore = skillMatch ? 100 : 20;

  // Distance score (25% weight)
  let distanceKm: number | null = null;
  let distanceScore = 50; // Default when no location
  if (clientLat && clientLon && professional.latitude && professional.longitude) {
    distanceKm = calculateDistance(clientLat, clientLon, professional.latitude, professional.longitude);
    if (distanceKm <= 5) distanceScore = 100;
    else if (distanceKm <= 10) distanceScore = 85;
    else if (distanceKm <= 20) distanceScore = 70;
    else if (distanceKm <= 50) distanceScore = 40;
    else distanceScore = 10;
  }

  // Rating score (25% weight)
  const ratingScore = Math.min(100, (professional.rating / 5) * 100);

  // Availability score (10% weight)
  let availabilityScore = professional.isOnline ? 80 : 30;
  if (professional.availability && dayOfWeek !== undefined) {
    const daySlot = professional.availability.find((a: any) => a.dayOfWeek === dayOfWeek && a.isActive);
    if (daySlot) availabilityScore = 100;
  }

  // Experience/price score (10% weight)
  const priceScore = Math.min(100, (professional.totalJobs / 100) * 100);

  // Weighted final score
  const matchScore =
    skillScore * 0.30 +
    distanceScore * 0.25 +
    ratingScore * 0.25 +
    availabilityScore * 0.10 +
    priceScore * 0.10;

  return { matchScore, skillScore, distanceScore, ratingScore, availabilityScore, priceScore, distanceKm };
}

// ================================
// POST /api/matching/find - Find matching professionals
// ================================
router.post(
  "/find",
  authenticate,
  [
    body("categoryName").isString().trim().notEmpty(),
    body("city").optional().isString(),
    body("latitude").optional().isFloat(),
    body("longitude").optional().isFloat(),
    body("scheduledDate").optional().isISO8601(),
    body("scheduledTime").optional().isString(),
    body("maxResults").optional().isInt({ min: 1, max: 20 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { categoryName, city, latitude, longitude, scheduledDate, scheduledTime, maxResults = 10 } = req.body;

      // Get user's match preferences
      const preferences = await prisma.matchPreference.findUnique({
        where: { userId: req.user!.userId },
      });

      // Find professionals
      const where: any = {
        userType: "ARTISAN",
        verificationStatus: "VERIFIED",
      };
      if (city) where.city = city;
      if (preferences?.preferVerified) where.verificationLevel = { not: "BASIC" };
      if (preferences?.preferredMinRating) where.rating = { gte: preferences.preferredMinRating };

      const professionals = await prisma.user.findMany({
        where,
        select: {
          id: true, firstName: true, lastName: true, avatar: true,
          skills: true, rating: true, totalJobs: true,
          city: true, state: true, latitude: true, longitude: true,
          isOnline: true, verificationLevel: true, bio: true,
        },
        take: 100, // Get candidates then rank
      });

      // Calculate day of week from scheduled date
      const dayOfWeek = scheduledDate ? new Date(scheduledDate).getDay() : undefined;

      // Score and rank
      const scored = professionals.map((pro) => {
        const scores = computeMatchScores(pro, categoryName, latitude, longitude, dayOfWeek, scheduledTime);
        return { professional: pro, ...scores };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      const topMatches = scored.slice(0, maxResults);

      // Store match results
      for (const match of topMatches) {
        await prisma.matchResult.create({
          data: {
            clientId: req.user!.userId,
            professionalId: match.professional.id,
            matchScore: match.matchScore,
            skillScore: match.skillScore,
            distanceScore: match.distanceScore,
            ratingScore: match.ratingScore,
            availabilityScore: match.availabilityScore,
            priceScore: match.priceScore,
            distanceKm: match.distanceKm,
          },
        });
      }

      res.json({
        success: true,
        data: topMatches.map((m) => ({
          ...m.professional,
          fullName: `${m.professional.firstName} ${m.professional.lastName}`,
          matchScore: Math.round(m.matchScore),
          distanceKm: m.distanceKm ? Math.round(m.distanceKm * 10) / 10 : null,
          scores: {
            skill: Math.round(m.skillScore),
            distance: Math.round(m.distanceScore),
            rating: Math.round(m.ratingScore),
            availability: Math.round(m.availabilityScore),
            experience: Math.round(m.priceScore),
          },
        })),
      });
    } catch (error) {
      console.error("Find matches error:", error);
      res.status(500).json({ success: false, error: "Failed to find matches" });
    }
  },
);

// ================================
// GET/PUT /api/matching/preferences
// ================================
router.get(
  "/preferences",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const prefs = await prisma.matchPreference.findUnique({
        where: { userId: req.user!.userId },
      });
      res.json({ success: true, data: prefs });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get preferences" });
    }
  },
);

router.put(
  "/preferences",
  authenticate,
  [
    body("preferredDistance").optional().isFloat({ min: 1 }),
    body("preferredMinRating").optional().isFloat({ min: 0, max: 5 }),
    body("preferVerified").optional().isBoolean(),
    body("preferExperienced").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const prefs = await prisma.matchPreference.upsert({
        where: { userId: req.user!.userId },
        update: req.body,
        create: { userId: req.user!.userId, ...req.body },
      });
      res.json({ success: true, data: prefs });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update preferences" });
    }
  },
);

export default router;
