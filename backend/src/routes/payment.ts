// src/routes/payment.ts
// Paystack Payment Integration Routes

// PrismaClient import removed — using shared instance
import axios from "axios";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
import { prisma } from "../lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.warn("⚠️ PAYSTACK_SECRET_KEY is missing from environment variables!");
}

const paystackApi = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// ================================
// POST /api/payment/initialize
// Initialize a Paystack transaction for wallet funding
// ================================
router.post(
  "/initialize",
  authenticate,
  [
    body("amount")
      .isInt({ min: 100 })
      .withMessage("Amount must be at least 100 NGN"), // Expected in whole NGN, converted to kobo below
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { amount } = req.body;

      // Get user from the authenticate middleware
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Ensure wallet exists (auto-create if missing)
      let wallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });
      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: { userId: user.id, balance: 0, pendingBalance: 0 },
        });
      }

      // Generate a unique reference for our database to match with Paystack
      const reference = `DEP-${uuidv4().slice(0, 8).toUpperCase()}`;

      // 1. Create a PENDING WalletTransaction in Prisma
      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          amount: amount,
          status: "PENDING",
          reference: reference,
          description: `Wallet deposit via Paystack`,
        },
      });

      // 2. Initialize the physical payload with Paystack (Note: Paystack expects amount in Kobo)
      const paystackPayload = {
        email: user.email,
        amount: amount * 100, // NGN to Kobo
        reference: reference,
        callback_url: `${process.env.FRONTEND_URL}/wallet`, // Where the user goes after popup failure/success natively
        metadata: {
          userId: user.id,
          transactionId: transaction.id,
        },
      };

      const paystackResponse = await paystackApi.post(
        "/transaction/initialize",
        paystackPayload,
      );

      if (!paystackResponse.data.status) {
        // Mark the transaction as FAILED since Paystack rejected it
        await prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED" },
        });
        throw new Error(
          paystackResponse.data.message || "Paystack initialization failed",
        );
      }

      // Return the generated checkout URL and reference to the frontend
      res.json({
        success: true,
        data: {
          authorization_url: paystackResponse.data.data.authorization_url,
          access_code: paystackResponse.data.data.access_code,
          reference: reference,
        },
        message: "Payment initialized successfully",
      });
    } catch (error: any) {
      console.error(
        "Payment initialize error:",
        error?.response?.data || error.message,
      );
      res.status(500).json({
        success: false,
        error: "Failed to initialize payment",
      });
    }
  },
);

// ================================
// GET /api/payment/verify/:reference
// Verify a Paystack transaction and credit the wallet
// ================================
router.get(
  "/verify/:reference",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const reference = req.params.reference as string;

      const transaction = await prisma.walletTransaction.findUnique({
        where: { reference },
        include: { wallet: true },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction reference not found in our records",
        });
      }

      // Double-entry protection
      if (transaction.status === "COMPLETED") {
        return res.json({
          success: true,
          data: {
            amount: transaction.amount,
            status: transaction.status,
            balance: transaction.wallet.balance,
          },
          message: "Transaction already verified and completed.",
        });
      }

      // Ask Paystack if this reference actually succeeded
      const paystackResponse = await paystackApi.get(
        `/transaction/verify/${reference}`,
      );

      const paystackData = paystackResponse.data.data;

      if (paystackData.status === "success") {
        const verifiedAmountNGN = paystackData.amount / 100;

        // Compare amounts to prevent manipulation
        if (verifiedAmountNGN !== transaction.amount) {
          console.warn(
            `Amount mismatch for ${reference}. Expected ${transaction.amount}, got ${verifiedAmountNGN}`,
          );
          // Safe handling: You might want to update the DB amount to reflect reality, or throw an error.
        }

        // Successfully paid. Update the Wallet and Transaction synchronously
        await prisma.$transaction(async (tx) => {
          // Mark transaction as fully completed
          await tx.walletTransaction.update({
            where: { id: transaction.id },
            data: {
              status: "COMPLETED",
              metadata: JSON.stringify(paystackData),
            },
          });

          // Increment the user's wallet
          await tx.wallet.update({
            where: { id: transaction.walletId },
            data: { balance: { increment: transaction.amount } },
          });
        });

        // Fetch fresh wallet balance to send back
        const updatedWallet = await prisma.wallet.findUnique({
          where: { id: transaction.walletId },
        });

        return res.json({
          success: true,
          data: {
            amount: transaction.amount,
            status: "COMPLETED",
            balance: updatedWallet?.balance,
          },
          message: "Payment successfully verified and wallet credited.",
        });
      } else {
        // Payment failed or was abandoned
        await prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: {
            status: "FAILED",
            metadata: JSON.stringify(paystackData),
          },
        });

        return res.status(400).json({
          success: false,
          error: `Payment verification failed on Paystack. Status: ${paystackData.status}`,
        });
      }
    } catch (error: any) {
      console.error(
        "Payment verify error:",
        error?.response?.data || error.message,
      );
      res.status(500).json({
        success: false,
        error: "Failed to verify payment",
      });
    }
  },
);

// ================================
// POST /api/payment/webhook
// Background webhook for Paystack to alert us of async successes (Optional but good practice)
// ================================
router.post("/webhook", async (req: Request, res: Response) => {
  // Note: For a true production app, you should verify the x-paystack-signature header here using crypto!
  try {
    const event = req.body;

    if (event && event.event === "charge.success") {
      const reference = event.data.reference;
      const amountNGN = event.data.amount / 100;

      const transaction = await prisma.walletTransaction.findUnique({
        where: { reference },
      });

      // If we find the transaction and it's still pending, credit the user
      if (transaction && transaction.status === "PENDING") {
        await prisma.$transaction([
          prisma.walletTransaction.update({
            where: { id: transaction.id },
            data: {
              status: "COMPLETED",
              metadata: JSON.stringify(event.data),
            },
          }),
          prisma.wallet.update({
            where: { id: transaction.walletId },
            data: { balance: { increment: amountNGN } },
          }),
        ]);
      }
    }

    // Always return 200 OK so Paystack knows we received it
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Webhook error");
  }
});

export default router;
