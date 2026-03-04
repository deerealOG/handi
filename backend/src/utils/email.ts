import nodemailer from "nodemailer";

// Factory function — creates the transporter lazily so env vars are loaded first
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const port = parseInt(process.env.SMTP_PORT || "465");
    const isSSL = port === 465;

    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port,
      secure: isSSL,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
    });
  }
  return _transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP credentials are not defined. Email was not sent.");
      return { success: false, error: "Missing SMTP credentials" };
    }

    const info = await getTransporter().sendMail({
      from: '"HANDI" <support@handiapp.com.ng>',
      to,
      subject,
      html,
    });

    return { success: true, data: info };
  } catch (error: any) {
    console.error("Failed to send email via Brevo SMTP:", error.message);
    return { success: false, error: error.message };
  }
};
