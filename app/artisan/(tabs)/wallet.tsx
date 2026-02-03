import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { escrowService, EscrowTransaction } from "@/services";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

interface WalletTransaction {
  id: string;
  title: string;
  amount: string;
  date: string;
  type: 'credit' | 'debit';
}

export default function ArtisanWallet() {
  const { colors } = useAppTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const loadWalletData = useCallback(async () => {
    try {
      const artisanId = user?.id || 'artisan_001';

      // Get escrow statistics and transactions
      const [statsResult, historyResult] = await Promise.all([
        escrowService.getEscrowStats(),
        escrowService.getArtisanPayoutHistory(artisanId),
      ]);

      if (statsResult) {
        // Calculate balance from released payouts
        const releasedAmount = historyResult
          ? historyResult
            .filter((t: EscrowTransaction) => t.status === 'released')
            .reduce((sum: number, t: EscrowTransaction) => sum + t.artisanAmount, 0)
          : 0;

        setBalance(releasedAmount);

        // Calculate pending from in-review escrows
        const pendingAmount = historyResult
          ? historyResult
            .filter((t: EscrowTransaction) => t.status === 'in_review' || t.status === 'completed')
            .reduce((sum: number, t: EscrowTransaction) => sum + t.artisanAmount, 0)
          : 0;

        setPendingPayouts(pendingAmount);
      }

      // Transform escrow transactions to wallet transactions format
      if (historyResult) {
        const walletTxns: WalletTransaction[] = historyResult.map((t: EscrowTransaction) => ({
          id: t.id,
          title: t.status === 'released'
            ? `Job Payment - ${t.id.slice(-6)}`
            : `Pending - ${t.id.slice(-6)}`,
          amount: `${t.status === 'released' ? '+' : ''}₦${t.artisanAmount.toLocaleString()}`,
          date: new Date(t.createdAt).toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          type: t.status === 'released' ? 'credit' : 'debit' as const,
        }));
        setTransactions(walletTxns);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWalletData();
  }, [loadWalletData]);

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      alert("Insufficient funds");
      return;
    }

    setBalance(prev => prev - amount);
    setModalVisible(false);
    setWithdrawAmount("");
    alert(`Successfully withdrew ₦${amount.toLocaleString()}`);
  };

  const handleTopUp = () => {
    const amount = parseInt(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setBalance(prev => prev + amount);
    setTopUpModalVisible(false);
    setTopUpAmount("");
    alert(`Successfully topped up ₦${amount.toLocaleString()}`);
  }

  const handleTransfer = () => {
    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      alert("Insufficient funds");
      return;
    }
    if (!recipient.trim()) {
      alert("Please enter a recipient");
      return;
    }

    setBalance(prev => prev - amount);
    setTransferModalVisible(false);
    setTransferAmount("");
    setRecipient("");
    alert(`Successfully transferred ₦${amount.toLocaleString()} to ${recipient}`);
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Text style={[styles.headerTitle, { color: colors.text }]}>My Wallet</Text>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>
        {pendingPayouts > 0 && (
          <View style={styles.pendingRow}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.pendingText}>₦{pendingPayouts.toLocaleString()} pending</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setTopUpModalVisible(true)}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Top Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <View style={[styles.actionIcon, { backgroundColor: colors.errorLight }]}>
            <MaterialCommunityIcons name="bank-transfer-out" size={24} color={colors.error} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setTransferModalVisible(true)}>
          <View style={[styles.actionIcon, { backgroundColor: '#2196F3' + '15' }]}>
            <MaterialCommunityIcons name="send" size={24} color="#2196F3" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Transfer</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.transactionIcon, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons
                name={item.type === 'credit' ? "arrow-down-left" : "arrow-up-right"}
                size={20}
                color={item.type === 'credit' ? colors.primary : colors.error}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.transactionDate, { color: colors.muted }]}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    item.type === "credit"
                      ? colors.primary
                      : colors.error,
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
      />

      {/* Withdraw Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Withdraw Funds</Text>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>Enter amount to withdraw</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount (₦)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleWithdraw}
              >
                <Text style={[styles.confirmButtonText, { color: colors.onPrimary }]}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Top Up Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={topUpModalVisible}
        onRequestClose={() => setTopUpModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Top Up Wallet</Text>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>Enter amount to add</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount (₦)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setTopUpModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleTopUp}
              >
                <Text style={[styles.confirmButtonText, { color: colors.onPrimary }]}>Top Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={transferModalVisible}
        onRequestClose={() => setTransferModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Transfer Funds</Text>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>Send money to another user</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Recipient Email / ID"
              placeholderTextColor={colors.muted}
              value={recipient}
              onChangeText={setRecipient}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount (₦)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={transferAmount}
              onChangeText={setTransferAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setTransferModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleTransfer}
              >
                <Text style={[styles.confirmButtonText, { color: colors.onPrimary }]}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 20,
    marginTop: 20,
  },
  balanceCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  pendingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
    color: THEME.colors.text,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 14,
    color: THEME.colors.text,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
    ...THEME.shadow.card,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: THEME.colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: THEME.colors.muted,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
  },
  cancelButtonText: {
    color: THEME.colors.text,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
