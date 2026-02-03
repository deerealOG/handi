// src/routes/ai.ts
// AI Chat/Diagnostics routes

import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Categories and their keywords for matching
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Electrician: [
    "electric",
    "power",
    "socket",
    "outlet",
    "wire",
    "wiring",
    "light",
    "bulb",
    "switch",
    "circuit",
    "breaker",
    "fuse",
    "voltage",
    "shock",
  ],
  Plumber: [
    "water",
    "pipe",
    "leak",
    "leaking",
    "drain",
    "clog",
    "toilet",
    "sink",
    "faucet",
    "tap",
    "shower",
    "bathroom",
    "sewage",
    "plumb",
  ],
  "AC Repair": [
    "ac",
    "air conditioner",
    "cooling",
    "hvac",
    "cold",
    "hot",
    "temperature",
    "thermostat",
    "refrigerant",
    "compressor",
  ],
  Carpenter: [
    "wood",
    "furniture",
    "door",
    "window",
    "cabinet",
    "shelf",
    "table",
    "chair",
    "wardrobe",
    "cupboard",
    "timber",
  ],
  Painter: [
    "paint",
    "wall",
    "ceiling",
    "color",
    "colour",
    "brush",
    "coat",
    "primer",
    "stain",
    "finish",
  ],
  Cleaner: [
    "clean",
    "dust",
    "dirty",
    "wash",
    "mop",
    "sweep",
    "sanitize",
    "disinfect",
    "tidy",
  ],
  Mechanic: [
    "car",
    "vehicle",
    "engine",
    "brake",
    "tire",
    "tyre",
    "oil",
    "battery",
    "motor",
    "auto",
  ],
};

// Simple AI response generation (can be replaced with actual AI API)
function generateAIResponse(userMessage: string): {
  response: string;
  suggestedCategory: string | null;
} {
  const lowerMessage = userMessage.toLowerCase();

  // Find matching category
  let suggestedCategory: string | null = null;
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter((kw) => lowerMessage.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      suggestedCategory = category;
    }
  }

  // Generate contextual response
  let response = "";

  if (suggestedCategory) {
    const responses: Record<string, string> = {
      Electrician: `Based on your description, this sounds like an electrical issue. This could involve problems with wiring, outlets, or circuit breakers. 

**Safety First**: If you notice sparks, burning smells, or frequent circuit trips, please turn off the main power and avoid touching any electrical components.

I recommend booking a verified **Electrician** to diagnose and fix this safely. Would you like me to show you available electricians in your area?`,

      Plumber: `This sounds like a plumbing issue. Common causes include pipe blockages, worn seals, or water pressure problems.

**Quick Tip**: If there's active leaking, try to locate and turn off the water supply valve near the affected area to prevent water damage.

I recommend booking a **Plumber** to properly diagnose and repair this. Should I show you top-rated plumbers nearby?`,

      "AC Repair": `Based on your description, this appears to be an AC/cooling system issue. Possible causes include low refrigerant, dirty filters, or compressor problems.

**Quick Check**: Make sure your air filters are clean and the thermostat is set correctly. If the unit is making unusual noises or not cooling at all, professional help is needed.

Would you like me to find an **AC Technician** for you?`,

      Carpenter: `This sounds like it requires carpentry work. Whether it's furniture repair, door adjustment, or custom woodwork, a skilled carpenter can help.

I can connect you with verified **Carpenters** in your area. Would you like to see available options?`,

      Painter: `This is a painting/finishing job. Professional painters can ensure proper surface preparation and a quality finish that lasts.

I can find **Painters** near you with great reviews. Should I show you the options?`,

      Cleaner: `This sounds like a cleaning job. Whether it's regular house cleaning, deep cleaning, or specialized sanitization, I can help you find the right professional.

Would you like to browse available **Cleaners** in your area?`,

      Mechanic: `Based on your description, this is an automotive issue. It's best to have a qualified mechanic inspect the vehicle to prevent further damage.

I can connect you with trusted **Mechanics** nearby. Shall I show you the options?`,
    };

    response =
      responses[suggestedCategory] ||
      `I understand you're having an issue. Based on what you've described, I'd recommend connecting with a ${suggestedCategory}. Would you like me to find one for you?`;
  } else {
    response = `I'm here to help! Could you describe your issue in a bit more detail? For example:
    
• **Electrical**: power outages, flickering lights, broken outlets
• **Plumbing**: leaks, clogged drains, water pressure issues  
• **AC/Cooling**: not cooling, strange noises, ice buildup
• **Other**: cleaning, painting, carpentry, auto repair

What kind of problem are you experiencing?`;
  }

  return { response, suggestedCategory };
}

// ================================
// POST /api/ai/chat - Send message, get AI response
// ================================
router.post(
  "/chat",
  authenticate,
  [body("message").trim().notEmpty(), body("sessionId").optional().isUUID()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Message is required",
        });
      }

      const { message, sessionId } = req.body;

      // Get or create session
      let session;
      if (sessionId) {
        session = await prisma.chatSession.findUnique({
          where: { id: sessionId },
        });
      }

      if (!session) {
        session = await prisma.chatSession.create({
          data: {
            userId: req.user!.userId,
            title: message.substring(0, 50),
          },
        });
      }

      // Save user message
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: "user",
          content: message,
        },
      });

      // Generate AI response
      const { response, suggestedCategory } = generateAIResponse(message);

      // Save AI response
      const aiMessage = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: "assistant",
          content: response,
          suggestedCat: suggestedCategory,
        },
      });

      // Get matching artisans if category was identified
      let suggestedProfessionals: any[] = [];
      if (suggestedCategory) {
        suggestedProfessionals = await prisma.user.findMany({
          where: {
            userType: "ARTISAN",
            isVerified: true,
            isOnline: true,
            skills: { contains: suggestedCategory },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            totalJobs: true,
            city: true,
          },
          take: 5,
          orderBy: { rating: "desc" },
        });
      }

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          message: {
            id: aiMessage.id,
            role: "assistant",
            content: response,
            suggestedCategory,
            createdAt: aiMessage.createdAt,
          },
          suggestedProfessionals,
        },
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process message",
      });
    }
  },
);

// ================================
// GET /api/ai/sessions - Get user's chat sessions
// ================================
router.get(
  "/sessions",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const sessions = await prisma.chatSession.findMany({
        where: { userId: req.user!.userId },
        orderBy: { updatedAt: "desc" },
        take: 20,
      });

      res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get sessions",
      });
    }
  },
);

// ================================
// GET /api/ai/sessions/:id - Get session with messages
// ================================
router.get(
  "/sessions/:id",
  authenticate,
  param("id").isUUID(),
  async (req: AuthRequest, res: Response) => {
    try {
      const sessionId = req.params.id as string;
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found",
        });
      }

      if (session.userId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          error: "Not authorized",
        });
      }

      res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get session",
      });
    }
  },
);

export default router;
