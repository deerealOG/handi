import axios from "axios";

export const sendWhatsAppMessage = async (to: string, text: string) => {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials missing in environment variables.");
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to send WhatsApp message", error);
  }
};
