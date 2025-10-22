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

  // Load wallet data
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const stored = await AsyncStorage.getItem("transactions");
        const parsed = stored ? JSON.parse(stored) : [];
        setTransactions(parsed);

        // Calculate balance
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

  // Dummy Add Funds
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
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFunds}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={22}
            color={THEME.colors.primary}
          />
          <Text style={styles.addButtonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={60}
              color={THEME.colors.muted}
            />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Top up your wallet or make a booking to see transactions here.
            </Text>
          </View>
        ) : (
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
                      ? THEME.colors.primary
                      : THEME.colors.danger
                  }
                />
                <View style={{ marginLeft: 10 }}>
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
                        ? THEME.colors.primary
                        : THEME.colors.danger,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    marginTop:20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
  },
  balanceCard: {
    backgroundColor: THEME.colors.primary,
    margin: 16,
    borderRadius: THEME.radius.lg,
    padding: 20,
    alignItems: "center",
  },
  balanceLabel: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.sm,
  },
  balanceAmount: {
    color: THEME.colors.white,
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: THEME.colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  addButtonText: {
    color: THEME.colors.primary,
    marginLeft: 8,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: "600",
    color: THEME.colors.text,
    marginBottom: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontWeight: "600",
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    marginTop: 8,
  },
  emptySubtext: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 4,
  },
  transactionCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.md,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  txDescription: {
    color: THEME.colors.text,
    fontWeight: "500",
  },
  txDate: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
  },
  txAmount: {
    fontWeight: "600",
    fontSize: THEME.typography.sizes.base,
  },
});
