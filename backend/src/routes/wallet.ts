// src/routes/wallet.ts
// Wallet and transaction routes

import { TransactionStatus, TransactionType } from "@prisma/client";
import { Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// ================================
// GET /api/wallet - Get wallet balance
// ================================
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.userId },
    });

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user!.userId,
          balance: 0,
          pendingBalance: 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        pendingBalance: wallet.pendingBalance,
        currency: wallet.currency,
        totalBalance: wallet.balance + wallet.pendingBalance,
      },
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallet",
    });
  }
});

// ================================
// GET /api/wallet/transactions - Get transactions
// ================================
router.get(
  "/transactions",
  authenticate,
  [
    query("type")
      .optional()
      .isIn([
        "DEPOSIT",
        "WITHDRAWAL",
        "EARNING",
        "PLATFORM_FEE",
        "PAYOUT",
        "BONUS",
      ]),
    query("status")
      .optional()
      .isIn(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]),
    query("page").optional().isInt({ min: 1 }),
    query("perPage").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { type, status, page = "1", perPage = "20" } = req.query;
      const pageNum = parseInt(page as string);
      const perPageNum = parseInt(perPage as string);
      const skip = (pageNum - 1) * perPageNum;

      const wallet = await prisma.wallet.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!wallet) {
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: pageNum,
            perPage: perPageNum,
            total: 0,
            totalPages: 0,
          },
        });
      }

      const where: any = { walletId: wallet.id };
      if (type) where.type = type as TransactionType;
      if (status) where.status = status as TransactionStatus;

      const [transactions, total] = await Promise.all([
        prisma.walletTransaction.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: perPageNum,
        }),
        prisma.walletTransaction.count({ where }),
      ]);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: pageNum,
          perPage: perPageNum,
          total,
          totalPages: Math.ceil(total / perPageNum),
        },
      });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get transactions",
      });
    }
  },
);

// ================================
// GET /api/wallet/stats - Get wallet statistics
// ================================
router.get("/stats", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!wallet) {
      return res.json({
        success: true,
        data: {
          totalEarnings: 0,
          totalWithdrawals: 0,
          pendingPayouts: 0,
          transactionCount: 0,
        },
      });
    }

    const [earnings, withdrawals, pending, count] = await Promise.all([
      prisma.walletTransaction.aggregate({
        where: { walletId: wallet.id, type: "EARNING", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.walletTransaction.aggregate({
        where: { walletId: wallet.id, type: "WITHDRAWAL", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.walletTransaction.aggregate({
        where: { walletId: wallet.id, type: "PAYOUT", status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalEarnings: earnings._sum.amount || 0,
        totalWithdrawals: withdrawals._sum.amount || 0,
        pendingPayouts: pending._sum.amount || 0,
        transactionCount: count,
        balance: wallet.balance,
        pendingBalance: wallet.pendingBalance,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallet stats",
    });
  }
});

// ================================
// POST /api/wallet/withdraw - Request withdrawal
// With fraud detection + idempotency
// ================================

// Suspicious activity thresholds (bank-like protections)
const MAX_WITHDRAWALS_PER_HOUR = 3;
const MAX_WITHDRAWALS_PER_DAY = 5; // Auto-lock if exceeded
const LARGE_WITHDRAWAL_THRESHOLD = 0.8; // 80% of balance

router.post(
  "/withdraw",
  authenticate,
  [
    body("amount").isFloat({ min: 1000 }), // Minimum 1000 NGN
    body("bankName").trim().notEmpty(),
    body("accountNumber").trim().isLength({ min: 10, max: 10 }),
    body("accountName").trim().notEmpty(),
    body("idempotencyKey").optional().isString().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Invalid withdrawal request",
          details: errors.array(),
        });
      }

      const { amount, bankName, accountNumber, accountName, idempotencyKey } =
        req.body;
      const userId = req.user!.userId;

      // === IDEMPOTENCY CHECK ===
      // Prevent duplicate transactions with the same key
      if (idempotencyKey) {
        const existing = await prisma.walletTransaction.findFirst({
          where: {
            wallet: { userId },
            reference: idempotencyKey,
          },
        });
        if (existing) {
          return res.json({
            success: true,
            data: existing,
            message: "Transaction already processed (idempotent)",
          });
        }
      }

      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        return res.status(400).json({
          success: false,
          error: "Wallet not found",
        });
      }

      // === WALLET LOCK CHECK ===
      if (wallet.isLocked) {
        return res.status(403).json({
          success: false,
          error:
            "Your wallet has been temporarily locked due to suspicious activity. Please contact support.",
        });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance",
        });
      }

      // === SUSPICIOUS ACTIVITY DETECTION ===
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [recentWithdrawals, dailyWithdrawals] = await Promise.all([
        prisma.walletTransaction.count({
          where: {
            walletId: wallet.id,
            type: "WITHDRAWAL",
            createdAt: { gte: oneHourAgo },
          },
        }),
        prisma.walletTransaction.count({
          where: {
            walletId: wallet.id,
            type: "WITHDRAWAL",
            createdAt: { gte: oneDayAgo },
          },
        }),
      ]);

      const flags: string[] = [];

      // Rate limit: max N withdrawals per hour
      if (recentWithdrawals >= MAX_WITHDRAWALS_PER_HOUR) {
        flags.push("RATE_LIMIT_EXCEEDED");
      }

      // Large withdrawal: >80% of balance
      if (amount > wallet.balance * LARGE_WITHDRAWAL_THRESHOLD) {
        flags.push("LARGE_WITHDRAWAL");
      }

      // Auto-lock if too many daily withdrawals
      if (dailyWithdrawals >= MAX_WITHDRAWALS_PER_DAY) {
        flags.push("DAILY_LIMIT_EXCEEDED");

        // Auto-lock the wallet
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { isLocked: true },
        });

        console.warn(
          `[SECURITY] 🚨 Wallet AUTO-LOCKED for user ${userId} — ${dailyWithdrawals} withdrawals in 24h`,
        );

        return res.status(403).json({
          success: false,
          error:
            "Too many withdrawal attempts. Your wallet has been locked for security. Contact support.",
          flags,
        });
      }

      if (flags.includes("RATE_LIMIT_EXCEEDED")) {
        console.warn(
          `[SECURITY] ⚠️ Rate limit hit for user ${userId} — ${recentWithdrawals} withdrawals in 1h`,
        );
        return res.status(429).json({
          success: false,
          error:
            "Too many withdrawal requests. Please wait before trying again.",
          flags,
        });
      }

      // Log warning for large withdrawals but don't block
      if (flags.includes("LARGE_WITHDRAWAL")) {
        console.warn(
          `[SECURITY] ⚠️ Large withdrawal for user ${userId}: ₦${amount} (balance: ₦${wallet.balance})`,
        );
      }

      // === DUPLICATE PENDING TRANSACTION CHECK ===
      const pendingWithdrawal = await prisma.walletTransaction.findFirst({
        where: {
          walletId: wallet.id,
          type: "WITHDRAWAL",
          status: "PENDING",
          amount,
          bankName,
          accountNumber,
          createdAt: { gte: oneHourAgo },
        },
      });

      if (pendingWithdrawal) {
        return res.status(409).json({
          success: false,
          error:
            "You already have a pending withdrawal for this amount. Please wait for it to complete.",
          data: {
            existingTransactionId: pendingWithdrawal.id,
            reference: pendingWithdrawal.reference,
          },
        });
      }

      // === CREATE WITHDRAWAL TRANSACTION ===
      const reference =
        idempotencyKey ||
        `WD-${uuidv4().slice(0, 8).toUpperCase()}`;

      const transaction = await prisma.$transaction(async (tx) => {
        // Re-check balance inside transaction for safety
        const freshWallet = await tx.wallet.findUnique({
          where: { id: wallet.id },
        });
        if (!freshWallet || freshWallet.balance < amount) {
          throw new Error("Insufficient balance");
        }

        // Deduct from balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { decrement: amount },
            pendingBalance: { increment: amount },
          },
        });

        // Create transaction record
        return tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "WITHDRAWAL",
            amount,
            status: "PENDING",
            reference,
            description: `Withdrawal to ${bankName} - ${accountNumber}`,
            bankName,
            accountNumber,
            accountName,
          },
        });
      });

      res.json({
        success: true,
        data: transaction,
        message: "Withdrawal request submitted",
        ...(flags.length > 0 ? { warnings: flags } : {}),
      });
    } catch (error) {
      console.error("Withdraw error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process withdrawal",
      });
    }
  },
);

export default router;
