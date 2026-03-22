import { Router, Request, Response } from "express";

const router = Router();

// ===================================
// HANDI WhatsApp Bot Webhook
// Uses Africa's Talking WhatsApp API
// ===================================

// FAQ knowledge base (matches the web chat bot)
const BOT_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    response:
      "Hello! 👋 Welcome to HANDI Support.\n\nHow can I help you?\n• Type BOOK to learn about booking\n• Type ORDER to track orders\n• Type PAY for payment help\n• Type AGENT to speak with support",
  },
  {
    keywords: ["book", "booking", "appointment", "schedule"],
    response:
      "To book a service on HANDI:\n1. Visit handiapp.com.ng\n2. Browse Services\n3. Pick a provider\n4. Choose date & time\n5. Pay & confirm\n\nType AGENT for more help.",
  },
  {
    keywords: ["order", "track", "delivery", "shipped"],
    response:
      "Track your orders at:\nhandiapp.com.ng/dashboard → Orders\n\nEach order shows its status.\n\nFor delayed orders, type AGENT.",
  },
  {
    keywords: ["pay", "payment", "refund", "wallet", "withdraw"],
    response:
      "Payment info:\n• Card payments via Paystack\n• Wallet for quick checkout\n• Refunds in 3-5 business days\n• Withdrawals to your bank\n\nType AGENT for payment issues.",
  },
  {
    keywords: ["provider", "become", "register", "sell", "vendor"],
    response:
      "Join HANDI as a provider:\n1. Visit handiapp.com.ng/signup\n2. Select 'Provider' or 'Vendor'\n3. Fill your details\n4. Upload documents\n5. Get verified in 24-48hrs\n\nType AGENT for help.",
  },
  {
    keywords: ["contact", "phone", "email", "call"],
    response:
      "Contact HANDI:\n📞 +234 800 426 3400\n📧 support@handiapp.com.ng\n📍 Port Harcourt, Nigeria\n🌐 handiapp.com.ng",
  },
];

// In-memory store of users who requested an agent
const agentRequests = new Map<string, { phone: string; timestamp: Date; email?: string }>();

function getBotResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  for (const entry of BOT_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }

  return "I'm not sure I understand. Here are some options:\n• BOOK - Booking help\n• ORDER - Track orders\n• PAY - Payment help\n• AGENT - Speak to support\n\nOr visit handiapp.com.ng";
}

/**
 * POST /api/chat/whatsapp/webhook
 * Receives incoming WhatsApp messages from Africa's Talking
 */
router.post("/whatsapp/webhook", (req: Request, res: Response) => {
  try {
    const { from, text } = req.body;

    if (!from || !text) {
      res.status(400).json({ error: "Missing from or text" });
      return;
    }

    const message = text.trim();
    const phone = from.replace("whatsapp:", "").trim();

    // Check for AGENT escalation
    if (message.toUpperCase() === "AGENT" || message.toUpperCase().includes("SPEAK TO AGENT")) {
      agentRequests.set(phone, {
        phone,
        timestamp: new Date(),
      });

      // In production, this would:
      // 1. Check if agents are online (query DB)
      // 2. If yes, create a support ticket and notify agent
      // 3. If no, queue for follow-up

      const agentResponse =
        "Your request has been noted. ✅\n\n" +
        "A support agent will reach out to you shortly via WhatsApp or call.\n\n" +
        "Expected response time: within 30 minutes during business hours (8am-8pm WAT).\n\n" +
        "If urgent, call us at: +234 800 426 3400";

      console.log(`[WhatsApp Bot] Agent request from ${phone}`);

      // TODO: Send agentResponse via Africa's Talking WhatsApp API
      // await sendWhatsAppMessage(phone, agentResponse);

      res.json({
        message: agentResponse,
        escalated: true,
        phone,
      });
      return;
    }

    // Normal bot response
    const botReply = getBotResponse(message);
    console.log(`[WhatsApp Bot] ${phone}: "${message}" → Bot reply sent`);

    // TODO: Send botReply via Africa's Talking WhatsApp API
    // await sendWhatsAppMessage(phone, botReply);

    res.json({
      message: botReply,
      escalated: false,
    });
  } catch (error) {
    console.error("[WhatsApp Bot] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/chat/whatsapp/agent-requests
 * Admin endpoint to view pending agent requests
 */
router.get("/whatsapp/agent-requests", (_req: Request, res: Response) => {
  const requests = Array.from(agentRequests.entries()).map(([phone, data]) => ({
    phone,
    ...data,
  }));
  res.json({ requests, count: requests.length });
});

/**
 * POST /api/chat/support
 * In-app chat — receives messages from the web chat widget
 */
router.post("/support", (req: Request, res: Response) => {
  try {
    const { message, userId, requestAgent } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (requestAgent) {
      // Check agent availability
      // In production: query support_agents table for online agents
      const agentAvailable = Math.random() > 0.4; // Simulated

      if (agentAvailable) {
        res.json({
          type: "agent_connected",
          agentName: "Agent Temi",
          message: "A support agent is connecting to you now.",
        });
      } else {
        res.json({
          type: "agent_unavailable",
          message:
            "All agents are currently busy. We will follow up via email or WhatsApp within 30 minutes.",
          userId,
        });
      }
      return;
    }

    // Bot response
    const botReply = getBotResponse(message);
    res.json({
      type: "bot",
      message: botReply,
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
