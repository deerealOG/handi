// app/client/(tabs)/wallet.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  /**
   * Load wallet data from AsyncStorage
   * and compute current balance when the screen mounts.
   */
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const stored = await AsyncStorage.getItem("transactions");
        const parsed = stored ? JSON.parse(stored) : [];
        setTransactions(parsed);

        // Calculate wallet balance (credits - debits)
        const total = parsed.reduce(
          (sum: number, t: any) =>
            t.type === "credit" ? sum + t.amount : sum - t.amount,
          0
        );
        setBalance(total);
      } catch (err) {
        console.log("Error loading wallet data:", err);
      }
    };
    loadWalletData();
  }, []);

  /**
   * 💰 Dummy "Add Funds" action
   * Adds ₦5000 to wallet and persists in AsyncStorage.
   */
  const handleAddFunds = async () => {
    const newTransaction = {
      id: Date.now().toString(),
      type: "credit",
      description: "Wallet top-up",
      amount: 5000,
      date: new Date().toLocaleString(),
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    setBalance(balance + newTransaction.amount);
    await AsyncStorage.setItem("transactions", JSON.stringify(updated));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>

        {/* Add Funds Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddFunds}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={22}
            color={THEME.colors.primary}
          />
          <Text style={styles.addButtonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.length === 0 ? (
          // 🕊 Empty state (no transactions yet)
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={60}
              color={THEME.colors.muted}
            />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Top up your wallet or make a booking to see your activity here.
            </Text>
          </View>
        ) : (
          // Transaction list rendering
          transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name={
                    tx.type === "credit"
                      ? "arrow-down-bold-circle"
                      : "arrow-up-bold-circle"
                  }
                  size={28}
                  color={
                    tx.type === "credit"
                      ? THEME.colors.success
                      : THEME.colors.error
                  }
                />
                <View style={{ marginLeft: THEME.spacing.sm }}>
                  <Text style={styles.txDescription}>{tx.description}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
              </View>

              <Text
                style={[
                  styles.txAmount,
                  {
                    color:
                      tx.type === "credit"
                        ? THEME.colors.success
                        : THEME.colors.error,
                  },
                ]}
              >
                {tx.type === "credit" ? "+" : "-"}₦
                {tx.amount.toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

/**
 *  Styles — strictly following THEME tokens
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  // Header
  header: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    textAlign: "center",
  },
  title: {
   fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    textAlign: "center",
  },

  // Balance Card
  balanceCard: {
    backgroundColor: THEME.colors.primary,
    margin: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.xl,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  balanceLabel: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  balanceAmount: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginVertical: THEME.spacing.sm,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    marginTop: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  addButtonText: {
    color: THEME.colors.primary,
    marginLeft: THEME.spacing.xs,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // 📄 Transactions Section
  section: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },

  // 🕊 Empty state display
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: THEME.spacing.xl,
  },
  emptyText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xs,
  },
  emptySubtext: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.xs,
  },

  // 💵 Transaction list
  transactionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  txDescription: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },
  txDate: {
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.bodyLight,
    fontSize: THEME.typography.sizes.xs,
  },
  txAmount: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
