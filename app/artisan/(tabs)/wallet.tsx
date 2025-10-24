// app/artisan/(tabs)/wallet.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanWallet() {
  const router = useRouter();
  const balance = 24500;
  const transactions = [
    {
      id: "1",
      title: "Job Payment - Plumbing",
      amount: "+₦5,000",
      date: "Oct 20, 2025",
      type: "credit",
    },
    {
      id: "2",
      title: "Withdrawal to Bank",
      amount: "-₦3,000",
      date: "Oct 15, 2025",
      type: "debit",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>My Wallet</Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <MaterialCommunityIcons
            name="bank-transfer-out"
            size={18}
            color={THEME.colors.surface}
          />
          <Text style={styles.withdrawText}>Withdraw Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    item.type === "credit"
                      ? THEME.colors.primary
                      : THEME.colors.error,
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
      />
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
  },
  balanceCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: THEME.colors.surface,
    fontSize: 14,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: THEME.colors.surface,
    marginVertical: 8,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: "center",
  },
  withdrawText: {
    color: THEME.colors.surface,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: THEME.colors.text,
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    ...THEME.shadow.base,
  },
  transactionTitle: {
    fontSize: 14,
    color: THEME.colors.text,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
    viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.primary,
    borderWidth: 0.8,
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  viewButtonText: {
    color: THEME.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
});
