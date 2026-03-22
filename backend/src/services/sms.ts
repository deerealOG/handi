// src/services/sms.ts
// Unified messaging service: SMS, WhatsApp, Voice Call
// Provider: Africa's Talking (https://africastalking.com)
//
// Environment variables:
//   AT_API_KEY      — Africa's Talking API key
//   AT_USERNAME     — Africa's Talking username (sandbox or live)
//   AT_SENDER_ID    — Sender ID for SMS (e.g. "HANDI")
//   AT_ENVIRONMENT  — "sandbox" or "production" (default: sandbox)

const AT_API_KEY = process.env.AT_API_KEY || "";
const AT_USERNAME = process.env.AT_USERNAME || "sandbox";
const AT_SENDER_ID = process.env.AT_SENDER_ID || "HANDI";
const AT_ENVIRONMENT = process.env.AT_ENVIRONMENT || "sandbox";
const IS_DEV = process.env.NODE_ENV !== "production";

const AT_SMS_URL =
  AT_ENVIRONMENT === "production"
    ? "https://api.africastalking.com/version1/messaging"
    : "https://api.sandbox.africastalking.com/version1/messaging";

const AT_VOICE_URL =
  AT_ENVIRONMENT === "production"
    ? "https://voice.africastalking.com/call"
    : "https://voice.sandbox.africastalking.com/call";

// Format Nigerian number to international format
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "+234" + cleaned.slice(1);
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+234" + cleaned;
  }
  return cleaned;
}

// ================================
// SMS via Africa's Talking
// ================================
export async function sendSMS(
  phone: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const to = formatPhone(phone);

  // Dev mode: just log
  if (IS_DEV && !AT_API_KEY) {
    console.log(`[SMS → ${to}]: ${message}`);
    return { success: true };
  }

  try {
    const body = new URLSearchParams({
      username: AT_USERNAME,
      to,
      message,
      from: AT_SENDER_ID,
    });

    const res = await fetch(AT_SMS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: AT_API_KEY,
      },
      body: body.toString(),
    });

    const data = await res.json();
    const recipient = data?.SMSMessageData?.Recipients?.[0];

    if (recipient?.statusCode === 101 || recipient?.status === "Success") {
      console.log(`[SMS] ✅ Sent to ${to}`);
      return { success: true };
    }

    const errorMsg = recipient?.status || "SMS delivery failed";
    console.error(`[SMS] ❌ Failed to ${to}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  } catch (err) {
    const error = err as Error;
    console.error(`[SMS] ❌ Network error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ================================
// WhatsApp via Africa's Talking
// (Uses the SMS API with channel prefix)
// ================================
export async function sendWhatsApp(
  phone: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const to = formatPhone(phone);

  if (IS_DEV && !AT_API_KEY) {
    console.log(`[WHATSAPP → ${to}]: ${message}`);
    return { success: true };
  }

  try {
    // Africa's Talking WhatsApp uses the same SMS endpoint
    // but with the channel parameter set to "whatsapp"
    const body = new URLSearchParams({
      username: AT_USERNAME,
      to,
      message,
      from: AT_SENDER_ID,
      channel: "whatsapp",
    });

    const res = await fetch(AT_SMS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: AT_API_KEY,
      },
      body: body.toString(),
    });

    const data = await res.json();
    const recipient = data?.SMSMessageData?.Recipients?.[0];

    if (recipient?.statusCode === 101 || recipient?.status === "Success") {
      console.log(`[WHATSAPP] ✅ Sent to ${to}`);
      return { success: true };
    }

    const errorMsg = recipient?.status || "WhatsApp delivery failed";
    console.error(`[WHATSAPP] ❌ Failed to ${to}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  } catch (err) {
    const error = err as Error;
    console.error(`[WHATSAPP] ❌ Network error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ================================
// Voice Call via Africa's Talking
// Reads OTP aloud to the user
// ================================
export async function sendVoiceOTP(
  phone: string,
  otp: string,
): Promise<{ success: boolean; error?: string }> {
  const to = formatPhone(phone);

  if (IS_DEV && !AT_API_KEY) {
    console.log(`[VOICE CALL → ${to}]: Your OTP is ${otp}`);
    return { success: true };
  }

  try {
    // Build TTS (text-to-speech) XML for Africa's Talking voice
    const ttsMessage = `<Response><Say voice="en-US-Wavenet">Hello. Your HANDI verification code is: ${otp.split("").join(". ")}. I repeat: ${otp.split("").join(". ")}. Thank you.</Say></Response>`;

    const body = new URLSearchParams({
      username: AT_USERNAME,
      to,
      from: AT_SENDER_ID,
    });

    const res = await fetch(AT_VOICE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: AT_API_KEY,
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (data?.entries?.[0]?.status === "Queued") {
      console.log(`[VOICE] ✅ Call queued to ${to}`);
      return { success: true };
    }

    const errorMsg = data?.errorMessage || "Voice call failed";
    console.error(`[VOICE] ❌ Failed to ${to}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  } catch (err) {
    const error = err as Error;
    console.error(`[VOICE] ❌ Network error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ================================
// Unified OTP sending
// ================================
export async function sendOTP(
  phone: string,
  otp: string,
  method: "sms" | "whatsapp" | "voice",
  firstName?: string,
): Promise<{ success: boolean; error?: string }> {
  const otpMessage = `🔐 ${firstName ? `Hey ${firstName}! ` : ""}Your HANDI verification code is: ${otp}. It expires in 10 mins. Don't share it with anyone! — HANDI Team`;

  switch (method) {
    case "whatsapp":
      return sendWhatsApp(phone, otpMessage);
    case "voice":
      return sendVoiceOTP(phone, otp);
    case "sms":
    default:
      return sendSMS(phone, otpMessage);
  }
}
