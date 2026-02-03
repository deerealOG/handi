// src/routes/wallet.ts
// Wallet and transaction routes

import {
    PrismaClient,
    TransactionStatus,
    TransactionType,
} from "@prisma/client";
import { Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

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
// ================================
router.post(
  "/withdraw",
  authenticate,
  [
    body("amount").isFloat({ min: 1000 }), // Minimum 1000 NGN
    body("bankName").trim().notEmpty(),
    body("accountNumber").trim().isLength({ min: 10, max: 10 }),
    body("accountName").trim().notEmpty(),
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

      const { amount, bankName, accountNumber, accountName } = req.body;

      const wallet = await prisma.wallet.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!wallet) {
        return res.status(400).json({
          success: false,
          error: "Wallet not found",
        });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance",
        });
      }

      // Create withdrawal transaction
      const transaction = await prisma.$transaction(async (tx) => {
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
            amount: amount,
            status: "PENDING",
            reference: `WD-${uuidv4().slice(0, 8).toUpperCase()}`,
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
