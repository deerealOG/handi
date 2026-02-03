export type WalletType = 'customer' | 'provider';
export type TransactionType = 'TOPUP' | 'PAYMENT_LOCKED' | 'PAYMENT_RELEASED' | 'REFUND' | 'EARNING' | 'WITHDRAWAL' | 'COMMISSION';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Wallet {
  id: string;
  userId: string;
  userType: WalletType;
  balance: number; // Available balance
  lockedBalance: number; // Funds held in escrow
  currency: string;
  isFrozen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number; // Positive for credit, negative for debit
  referenceId: string; // e.g. Booking ID or Payment Ref
  referenceType: 'booking' | 'payment_gateway' | 'withdrawal' | 'system';
  status: TransactionStatus;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface WithdrawalRequest {
  id: string;
  walletId: string;
  amount: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  status: WithdrawalStatus;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
}

// API Response Wrappers
export interface WalletBalanceResponse {
  available: number;
  locked: number;
  currency: string;
}
