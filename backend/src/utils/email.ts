import nodemailer from "nodemailer";

// Factory function — creates the transporter lazily so env vars are loaded first
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const port = parseInt(process.env.SMTP_PORT || "587");
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

// ================================
// Branded HTML Email Template
// ================================
const BRAND_COLOR = "#368951";
const BRAND_DARK = "#14532D";

// Always use absolute HTTPS production URL for email clients
function getLogoUrl(): string {
  return "https://handiapp.com.ng/images/handi-logo-green.png";
}

/**
 * Wraps email body content in a branded HANDI template with:
 * - Logo header
 * - Consistent green accent
 * - Professional footer with links
 */
export function buildEmailTemplate(bodyContent: string, preheader?: string): string {
  const logoUrl = getLogoUrl();
  const year = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL || "https://handiapp.com.ng";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>HANDI</title>
  <!--[if mso]>
  <style>table,td{font-family:'Segoe UI',Arial,sans-serif;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f4f7fa;">${preheader}</div>` : ""}
  
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        
        <!-- Email card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          
          <!-- Logo Header -->
          <tr>
            <td style="background:${BRAND_COLOR};padding:28px 32px;text-align:center;border-bottom:3px solid ${BRAND_DARK};">
              <img src="${logoUrl}" alt="HANDI" width="100" height="auto" style="display:block;margin:0 auto;border:0;outline:none;max-height:80px;" />
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding:32px 28px 16px;">
              ${bodyContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;padding-top:20px;">
                    
                    <!-- App links -->
                    <p style="margin:0 0 12px;text-align:center;">
                      <a href="${frontendUrl}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:50px;font-size:13px;font-weight:600;">Visit HANDI</a>
                    </p>
                    
                    <!-- Social / Help -->
                    <p style="margin:0 0 8px;text-align:center;font-size:12px;color:#9ca3af;">
                      <a href="${frontendUrl}/help" style="color:${BRAND_COLOR};text-decoration:none;">Help Center</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${frontendUrl}/privacy" style="color:${BRAND_COLOR};text-decoration:none;">Privacy</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${frontendUrl}/terms" style="color:${BRAND_COLOR};text-decoration:none;">Terms</a>
                    </p>
                    
                    <!-- Copyright -->
                    <p style="margin:0;text-align:center;font-size:11px;color:#9ca3af;line-height:1.5;">
                      &copy; ${year} HANDI &mdash; Nigeria&rsquo;s #1 Service Marketplace<br/>
                      You received this email because you're a HANDI member.<br/>
                      <a href="mailto:support@handiapp.com.ng" style="color:${BRAND_COLOR};text-decoration:none;">support@handiapp.com.ng</a>
                    </p>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ================================
// Pre-built Email Bodies
// ================================

export function welcomeEmailBody(firstName: string, frontendUrl: string): string {
  return `
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">Welcome to HANDI! 🎉</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi <strong>${firstName}</strong>,</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Thank you for joining HANDI — Nigeria's #1 on-demand service marketplace. You can now:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr><td style="padding:6px 0;color:#4b5563;font-size:14px;">🔍&nbsp; Browse verified providers near you</td></tr>
      <tr><td style="padding:6px 0;color:#4b5563;font-size:14px;">📅&nbsp; Book services instantly</td></tr>
      <tr><td style="padding:6px 0;color:#4b5563;font-size:14px;">💳&nbsp; Pay securely with escrow protection</td></tr>
      <tr><td style="padding:6px 0;color:#4b5563;font-size:14px;">⭐&nbsp; Rate and review your experience</td></tr>
    </table>
    <p style="text-align:center;margin:24px 0;">
      <a href="${frontendUrl}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:bold;font-size:15px;">Explore HANDI</a>
    </p>
  `;
}

export function otpEmailBody(otp: string, ttlMinutes: number): string {
  return `
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">Verification Code</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Use the code below to verify your HANDI account:
    </p>
    <div style="text-align:center;margin:24px 0;">
      <span style="display:inline-block;background:#f0fdf4;color:${BRAND_COLOR};font-size:36px;font-weight:bold;letter-spacing:10px;padding:18px 36px;border-radius:12px;border:2px dashed ${BRAND_COLOR};">${otp}</span>
    </div>
    <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 8px;">
      This code expires in <strong>${ttlMinutes} minutes</strong>. Do not share it with anyone.
    </p>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `;
}

export function passwordResetEmailBody(resetLink: string): string {
  return `
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">Reset Your Password</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 20px;">
      You requested a password reset for your HANDI account. Click the button below to set a new password:
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${resetLink}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:bold;font-size:15px;">Reset Password</a>
    </p>
    <p style="color:#6b7280;font-size:13px;text-align:center;line-height:1.6;margin:0 0 8px;">
      If the button doesn't work, copy and paste this link:<br/>
      <a href="${resetLink}" style="color:${BRAND_COLOR};font-size:12px;word-break:break-all;">${resetLink}</a>
    </p>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
      This link expires in 15 minutes. If you didn't request this, ignore this email.
    </p>
  `;
}

export interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
}

export function orderConfirmationEmailBody(
  orderId: string,
  items: OrderEmailItem[],
  total: number,
  deliveryAddress: string,
  estimatedDate?: string
): string {
  const frontendUrl = process.env.FRONTEND_URL || "https://handiapp.com.ng";
  const itemsHtml = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0;color:#4b5563;font-size:14px;border-bottom:1px solid #f3f4f6;">${i.name}</td>
      <td style="padding:8px 0;color:#4b5563;font-size:14px;text-align:center;border-bottom:1px solid #f3f4f6;">×${i.quantity}</td>
      <td style="padding:8px 0;color:#1f2937;font-size:14px;text-align:right;font-weight:600;border-bottom:1px solid #f3f4f6;">₦${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`
    )
    .join("");

  return `
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">Order Confirmed! ✅</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 4px;">
      Your order has been placed successfully.
    </p>
    <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">
      Order ID: <strong style="color:#1f2937;">${orderId}</strong>
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      <tr style="background:#f9fafb;">
        <td style="padding:8px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">Item</td>
        <td style="padding:8px 0;color:#6b7280;font-size:12px;font-weight:600;text-align:center;text-transform:uppercase;">Qty</td>
        <td style="padding:8px 0;color:#6b7280;font-size:12px;font-weight:600;text-align:right;text-transform:uppercase;">Price</td>
      </tr>
      ${itemsHtml}
      <tr>
        <td colspan="2" style="padding:12px 0 0;color:#1f2937;font-size:15px;font-weight:700;">Total</td>
        <td style="padding:12px 0 0;color:${BRAND_COLOR};font-size:18px;font-weight:700;text-align:right;">₦${total.toLocaleString()}</td>
      </tr>
    </table>

    <div style="background:#f0fdf4;border-radius:8px;padding:12px 16px;margin:0 0 16px;">
      <p style="color:#065f46;font-size:13px;margin:0;line-height:1.6;">
        <strong>📍 Delivery to:</strong> ${deliveryAddress}<br/>
        ${estimatedDate ? `<strong>📅 Estimated:</strong> ${estimatedDate}` : ""}
      </p>
    </div>

    <p style="text-align:center;margin:24px 0;">
      <a href="${frontendUrl}/bookings" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:bold;font-size:15px;">Track Order</a>
    </p>

    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
      You'll receive updates as your order progresses.
    </p>
  `;
}

export function suspiciousLoginOtpBody(otp: string, ttlMinutes: number, ipAddress?: string, device?: string): string {
  return `
    <h2 style="color:#1f2937;margin:0 0 8px;font-size:22px;font-weight:700;">🔒 Suspicious Login Detected</h2>
    <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 12px;">
      We noticed a login attempt to your HANDI account from an unfamiliar location or device. 
      To verify it's you, enter this code:
    </p>
    <div style="text-align:center;margin:24px 0;">
      <span style="display:inline-block;background:#fef3c7;color:#d97706;font-size:36px;font-weight:bold;letter-spacing:10px;padding:18px 36px;border-radius:12px;border:2px dashed #d97706;">${otp}</span>
    </div>
    ${ipAddress || device ? `
    <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin:0 0 16px;">
      <p style="color:#6b7280;font-size:12px;margin:0;line-height:1.8;">
        ${ipAddress ? `<strong>IP Address:</strong> ${ipAddress}<br/>` : ""}
        ${device ? `<strong>Device:</strong> ${device}` : ""}
      </p>
    </div>` : ""}
    <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 8px;">
      This code expires in <strong>${ttlMinutes} minutes</strong>.
    </p>
    <p style="color:#ef4444;font-size:12px;text-align:center;margin:8px 0 0;">
      ⚠️ If you did not attempt to log in, please change your password immediately.
    </p>
  `;
}

// ================================
// Send Email
// ================================
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP credentials are not defined. Email was not sent.");
      console.warn(`   SMTP_HOST: ${process.env.SMTP_HOST || "NOT SET"}`);
      console.warn(`   SMTP_PORT: ${process.env.SMTP_PORT || "NOT SET"}`);
      console.warn(`   SMTP_USER: ${process.env.SMTP_USER ? "SET" : "NOT SET"}`);
      console.warn(`   SMTP_PASS: ${process.env.SMTP_PASS ? "SET" : "NOT SET"}`);
      throw new Error("SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in .env");
    }

    const info = await getTransporter().sendMail({
      from: `"HANDI No-Reply" <${process.env.SMTP_SENDER || "support@handiapp.com.ng"}>`,
      to,
      subject,
      html,
    });

    return { success: true, data: info };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown email error";
    console.error("Failed to send email via Brevo SMTP:", msg);
    return { success: false, error: msg };
  }
};
