import * as dotenv from "dotenv";
import { sendEmail } from "../utils/email";

// Load environment variables manually since this is a standalone script
dotenv.config();

const runTest = async () => {
  console.log("Checking for Brevo SMTP credentials...");
  if (
    !process.env.SMTP_PASS ||
    process.env.SMTP_PASS === "your_brevo_smtp_key_here"
  ) {
    console.error(
      "❌ ERROR: Please put your real Brevo SMTP key (Master Password) in backend/.env under SMTP_PASS!",
    );
    process.exit(1);
  }

  console.log("Attempting to send a test email via Brevo...");

  const result = await sendEmail({
    to: "support@handiapp.com.ng", // You can change this to your personal email to test
    subject: "Hello from HANDI & Brevo",
    html: "<p>Congrats on sending your <strong>first email</strong> via the newly integrated HANDI backend (Brevo)!</p>",
  });

  if (result.success) {
    console.log(
      "✅ Email sent successfully! Message ID:",
      result.data?.messageId,
    );
  } else {
    console.error("❌ Failed to send email. Error:", result.error);
  }
};

runTest();
