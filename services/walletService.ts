import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallet, WalletTransaction, WithdrawalRequest } from "../types/wallet";
import { ApiResponse } from "./api";

const WALLET_STORAGE_KEY = "handi_wallets_v1";
const TRANSACTIONS_STORAGE_KEY = "handi_transactions_v1";
const WITHDRAWALS_STORAGE_KEY = "handi_withdrawals_v1";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const walletService = {
  /**
   * Get Current User's Wallet
   * Creates one if it doesn't exist (Mock behavior)
   */
  async getMyWallet(): Promise<ApiResponse<Wallet>> {
    try {
      await delay(500);
      // In a real app, userId comes from auth context/token
      // Here we mock it or fetch from generic storage if available
      const userId = "user_current";
      const userType = "customer"; // Defaulting to customer for this mock, would be dynamic

      let wallets = await this._loadWallets();
      let wallet = wallets.find((w) => w.userId === userId);

      if (!wallet) {
        wallet = {
          id: `wallet_${Date.now()}`,
          userId,
          userType,
          balance: 0,
          lockedBalance: 0,
          currency: "NGN",
          isFrozen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        wallets.push(wallet);
        await this._saveWallets(wallets);
      }

      return { success: true, data: wallet };
    } catch (error) {
      return { success: false, error: "Failed to fetch wallet" };
    }
  },

  /**
   * Get Transactions
   */
  async getTransactions(
    walletId: string,
  ): Promise<ApiResponse<WalletTransaction[]>> {
    try {
      await delay(500);
      const allTransactions = await this._loadTransactions();
      const walletTransactions = allTransactions
        .filter((t) => t.walletId === walletId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      return { success: true, data: walletTransactions };
    } catch (error) {
      return { success: false, error: "Failed to load transactions" };
    }
  },

  /**
   * Top Up Wallet (Funding)
   */
  async topUp(
    walletId: string,
    amount: number,
    paymentRef: string,
  ): Promise<ApiResponse<Wallet>> {
    try {
      await delay(1000);
      const wallets = await this._loadWallets();
      const walletIndex = wallets.findIndex((w) => w.id === walletId);

      if (walletIndex === -1)
        return { success: false, error: "Wallet not found" };

      // Update Balance
      wallets[walletIndex].balance += amount;
      wallets[walletIndex].updatedAt = new Date().toISOString();

      // Record Transaction
      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        walletId,
        type: "TOPUP",
        amount: amount,
        referenceId: paymentRef,
        referenceType: "payment_gateway",
        status: "COMPLETED",
        description: "Wallet funding via Card",
        createdAt: new Date().toISOString(),
      };

      await this._saveWallets(wallets);
      await this._saveTransaction(transaction);

      return {
        success: true,
        data: wallets[walletIndex],
        message: "Top-up successful",
      };
    } catch (error) {
      return { success: false, error: "Top-up failed" };
    }
  },

  /**
   * Lock Funds (Escrow) - e.g. when booking a service
   */
  async lockFunds(
    walletId: string,
    amount: number,
    bookingId: string,
  ): Promise<ApiResponse<Wallet>> {
    try {
      const wallets = await this._loadWallets();
      const walletIndex = wallets.findIndex((w) => w.id === walletId);

      if (walletIndex === -1)
        return { success: false, error: "Wallet not found" };

      const wallet = wallets[walletIndex];

      if (wallet.balance < amount) {
        return { success: false, error: "Insufficient wallet balance" };
      }

      // Move funds from Balance to Locked
      wallet.balance -= amount;
      wallet.lockedBalance += amount;
      wallet.updatedAt = new Date().toISOString();

      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        walletId,
        type: "PAYMENT_LOCKED",
        amount: -amount,
        referenceId: bookingId,
        referenceType: "booking",
        status: "COMPLETED",
        description: "Funds locked for service booking",
        createdAt: new Date().toISOString(),
      };

      await this._saveWallets(wallets);
      await this._saveTransaction(transaction);

      return {
        success: true,
        data: wallet,
        message: "Funds locked successfully",
      };
    } catch (error) {
      return { success: false, error: "Failed to lock funds" };
    }
  },

  /**
   * Release Funds (Completion) - Transfers from Customer Locked -> Provider Available
   */
  async releaseFunds(
    customerWalletId: string,
    providerWalletId: string,
    amount: number,
    bookingId: string,
    commissionPercent: number = 10,
  ): Promise<ApiResponse<{ customerWallet: Wallet; providerWallet: Wallet }>> {
    try {
      const wallets = await this._loadWallets();
      const custIndex = wallets.findIndex((w) => w.id === customerWalletId);
      const provIndex = wallets.findIndex((w) => w.id === providerWalletId);

      if (custIndex === -1 || provIndex === -1) {
        return { success: false, error: "One or both wallets not found" };
      }

      const customerWallet = wallets[custIndex];
      const providerWallet = wallets[provIndex];

      if (customerWallet.lockedBalance < amount) {
        return { success: false, error: "Inconsistent locked balance state" };
      }

      // 1. Debit Locked Balance from Customer
      customerWallet.lockedBalance -= amount;
      customerWallet.updatedAt = new Date().toISOString();

      // 2. Calculate Commission
      const commission = amount * (commissionPercent / 100);
      const providerEarnings = amount - commission;

      // 3. Credit Provider Wallet
      providerWallet.balance += providerEarnings;
      providerWallet.updatedAt = new Date().toISOString();

      // 4. Create Transactions
      const releaseTxn: WalletTransaction = {
        id: `txn_rel_${Date.now()}`,
        walletId: customerWalletId,
        type: "PAYMENT_RELEASED",
        amount: 0, // The actual debit happened during Lock, this is just a state change record or we can show 0
        referenceId: bookingId,
        referenceType: "booking",
        status: "COMPLETED",
        description: `Funds released for booking ${bookingId}`,
        createdAt: new Date().toISOString(),
      };

      const earningTxn: WalletTransaction = {
        id: `txn_earn_${Date.now()}`,
        walletId: providerWalletId,
        type: "EARNING",
        amount: providerEarnings,
        referenceId: bookingId,
        referenceType: "booking",
        status: "COMPLETED",
        description: `Earnings for booking ${bookingId}`,
        createdAt: new Date().toISOString(),
      };

      // In a real system, we'd also log the Commission transaction for the platform ledger

      await this._saveWallets(wallets);
      await this._saveTransaction(releaseTxn);
      await this._saveTransaction(earningTxn);

      return {
        success: true,
        data: { customerWallet, providerWallet },
        message: "Funds released successfully",
      };
    } catch (error) {
      return { success: false, error: "Failed to release funds" };
    }
  },

  /**
   * Refund Fund (Cancellation) - Unlocks funds back to available
   */
  async refundLockedFunds(
    walletId: string,
    amount: number,
    bookingId: string,
  ): Promise<ApiResponse<Wallet>> {
    try {
      const wallets = await this._loadWallets();
      const idx = wallets.findIndex((w) => w.id === walletId);

      if (idx === -1) return { success: false, error: "Wallet not found" };

      const wallet = wallets[idx];

      // Move Locked -> Available
      wallet.lockedBalance -= amount;
      wallet.balance += amount;
      wallet.updatedAt = new Date().toISOString();

      const transaction: WalletTransaction = {
        id: `txn_ref_${Date.now()}`,
        walletId,
        type: "REFUND",
        amount: amount,
        referenceId: bookingId,
        referenceType: "booking",
        status: "COMPLETED",
        description: `Refund for cancelled booking ${bookingId}`,
        createdAt: new Date().toISOString(),
      };

      await this._saveWallets(wallets);
      await this._saveTransaction(transaction);

      return { success: true, data: wallet, message: "Refund successful" };
    } catch {
      return { success: false, error: "Refund failed" };
    }
  },

  /**
   * Request Withdrawal
   */
  async requestWithdrawal(
    walletId: string,
    amount: number,
    bankDetails: WithdrawalRequest["bankDetails"],
  ): Promise<ApiResponse<WithdrawalRequest>> {
    try {
      await delay(500);
      const wallets = await this._loadWallets();
      const idx = wallets.findIndex((w) => w.id === walletId);

      if (idx === -1) return { success: false, error: "Wallet not found" };

      const wallet = wallets[idx];

      if (wallet.balance < amount) {
        return { success: false, error: "Insufficient balance for withdrawal" };
      }

      // Debit wallet immediately
      wallet.balance -= amount;
      wallet.updatedAt = new Date().toISOString();

      const withdrawalReq: WithdrawalRequest = {
        id: `wd_${Date.now()}`,
        walletId,
        amount,
        bankDetails,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const transaction: WalletTransaction = {
        id: `txn_wd_${Date.now()}`,
        walletId,
        type: "WITHDRAWAL",
        amount: -amount,
        referenceId: withdrawalReq.id,
        referenceType: "withdrawal",
        status: "PENDING",
        description: `Withdrawal Request to ${bankDetails.bankName}`,
        createdAt: new Date().toISOString(),
      };

      await this._saveWallets(wallets);
      await this._saveWithdrawal(withdrawalReq);
      await this._saveTransaction(transaction);

      return {
        success: true,
        data: withdrawalReq,
        message: "Withdrawal requested",
      };
    } catch {
      return { success: false, error: "Withdrawal request failed" };
    }
  },

  /**
   * ADMIN: Get All Wallets
   */
  async getAllWallets(): Promise<ApiResponse<Wallet[]>> {
    try {
      await delay(500);
      const wallets = await this._loadWallets();
      return { success: true, data: wallets };
    } catch {
      return { success: false, error: "Failed to load wallets" };
    }
  },

  /**
   * ADMIN: Get All Withdrawal Requests
   */
  async getAllWithdrawalRequests(): Promise<ApiResponse<WithdrawalRequest[]>> {
    try {
      await delay(500);
      const data = await AsyncStorage.getItem(WITHDRAWALS_STORAGE_KEY);
      const withdrawals = data ? JSON.parse(data) : [];
      return {
        success: true,
        data: withdrawals.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      };
    } catch {
      return { success: false, error: "Failed to load withdrawals" };
    }
  },

  /**
   * ADMIN: Get All Transactions
   */
  async getAllTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    try {
      await delay(500);
      const transactions = await this._loadTransactions();
      return {
        success: true,
        data: transactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      };
    } catch {
      return { success: false, error: "Failed to load transactions" };
    }
  },

  /**
   * ADMIN: Approve Withdrawal
   */
  async approveWithdrawal(
    withdrawalId: string,
  ): Promise<ApiResponse<WithdrawalRequest>> {
    try {
      await delay(800);
      const withdrawals = await this._loadWithdrawalRequestsRaw();
      const idx = withdrawals.findIndex((w) => w.id === withdrawalId);

      if (idx === -1)
        return { success: false, error: "Withdrawal request not found" };

      const withdrawal = withdrawals[idx];
      if (withdrawal.status !== "PENDING") {
        return { success: false, error: "Request is already processed" };
      }

      withdrawal.status = "APPROVED";
      withdrawal.processedAt = new Date().toISOString();

      // Update the transaction status as well
      const transactions = await this._loadTransactions();
      const txnIdx = transactions.findIndex(
        (t) => t.referenceId === withdrawalId,
      );
      if (txnIdx !== -1) {
        transactions[txnIdx].status = "COMPLETED";
        await AsyncStorage.setItem(
          TRANSACTIONS_STORAGE_KEY,
          JSON.stringify(transactions),
        );
      }

      await this._saveWithdrawalRequestsRaw(withdrawals);
      return {
        success: true,
        data: withdrawal,
        message: "Withdrawal approved",
      };
    } catch {
      return { success: false, error: "Approval failed" };
    }
  },

  /**
   * ADMIN: Reject Withdrawal
   */
  async rejectWithdrawal(
    withdrawalId: string,
    reason: string,
  ): Promise<ApiResponse<WithdrawalRequest>> {
    try {
      await delay(800);
      const withdrawals = await this._loadWithdrawalRequestsRaw();
      const idx = withdrawals.findIndex((w) => w.id === withdrawalId);

      if (idx === -1)
        return { success: false, error: "Withdrawal request not found" };

      const withdrawal = withdrawals[idx];
      if (withdrawal.status !== "PENDING") {
        return { success: false, error: "Request is already processed" };
      }

      withdrawal.status = "REJECTED";
      withdrawal.adminNote = reason;
      withdrawal.processedAt = new Date().toISOString();

      // Refund the money to the wallet
      const wallets = await this._loadWallets();
      const walletIdx = wallets.findIndex((w) => w.id === withdrawal.walletId);
      if (walletIdx !== -1) {
        wallets[walletIdx].balance += withdrawal.amount;
        wallets[walletIdx].updatedAt = new Date().toISOString();
        await this._saveWallets(wallets);
      }

      // Update transaction status
      const transactions = await this._loadTransactions();
      const txnIdx = transactions.findIndex(
        (t) => t.referenceId === withdrawalId,
      );
      if (txnIdx !== -1) {
        transactions[txnIdx].status = "FAILED";
        transactions[txnIdx].description += ` (Rejected: ${reason})`;
        await AsyncStorage.setItem(
          TRANSACTIONS_STORAGE_KEY,
          JSON.stringify(transactions),
        );
      }

      await this._saveWithdrawalRequestsRaw(withdrawals);
      return {
        success: true,
        data: withdrawal,
        message: "Withdrawal rejected and funds refunded",
      };
    } catch {
      return { success: false, error: "Rejection failed" };
    }
  },

  // Helpers
  async _loadWallets(): Promise<Wallet[]> {
    try {
      const data = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async _saveWallets(wallets: Wallet[]) {
    await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  },

  async _loadTransactions(): Promise<WalletTransaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async _saveTransaction(txn: WalletTransaction) {
    const txns = await this._loadTransactions();
    txns.push(txn);
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txns));
  },

  async _loadWithdrawalRequestsRaw(): Promise<WithdrawalRequest[]> {
    const data = await AsyncStorage.getItem(WITHDRAWALS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async _saveWithdrawalRequestsRaw(list: WithdrawalRequest[]) {
    await AsyncStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(list));
  },

  async _saveWithdrawal(wd: WithdrawalRequest) {
    const list = await this._loadWithdrawalRequestsRaw();
    list.push(wd);
    await this._saveWithdrawalRequestsRaw(list);
  },
};
