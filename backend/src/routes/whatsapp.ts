import { Router, Request, Response } from "express";
import { sendWhatsAppMessage } from "../utils/whatsapp";

const router = Router();
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Validation Endpoint (Meta calls this once to verify)
router.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Message Reception Endpoint
router.post("/webhook", async (req: Request, res: Response) => {
  const body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const msgInfo = body.entry[0].changes[0].value.messages[0];
      const from = msgInfo.from;
      const text = msgInfo.text?.body;

      if (text) {
        console.log(`Received WhatsApp message from ${from}: ${text}`);
        
        // Basic echo bot response for now. Can be tied into AI Chatbot.
        const botReply = `Hello! You said: ${text}. Our AI logic is connecting...`;
        
        await sendWhatsAppMessage(from, botReply);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
