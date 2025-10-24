import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../../constants/theme";

const transactions = [
  { id: "1", type: "Credit", amount: 55000, user: "Sarah Johnson", date: "2025-10-14" },
  { id: "2", type: "Debit", amount: 12000, user: "David Okafor", date: "2025-10-15" },
  { id: "3", type: "Credit", amount: 76000, user: "Emma Brown", date: "2025-10-16" },
  { id: "4", type: "Debit", amount: 25000, user: "Chidi Umeh", date: "2025-10-17" },
];

export default function AdminTransactions() {
  const renderItem = ({ item }: any) => (
    <View style={[styles.card, styles.shadow]}>
      <View style={styles.row}>
        <Text style={styles.user}>{item.user}</Text>
        <Text
          style={[
            styles.amount,
            item.type === "Credit" ? styles.credit : styles.debit,
          ]}
        >
          {item.type === "Credit" ? "+" : "-"}₦
          {item.amount.toLocaleString("en-NG")}
        </Text>
      </View>
      <Text style={styles.type}>
        {item.type} • {item.date}
      </Text>
    </View>
  );

  const totalCredit = transactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Transactions Overview</Text>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.shadow]}>
          <Text style={styles.summaryLabel}>Total Credit</Text>
          <Text style={[styles.summaryValue, styles.credit]}>
            ₦{totalCredit.toLocaleString("en-NG")}
          </Text>
        </View>

        <View style={[styles.summaryCard, styles.shadow]}>
          <Text style={styles.summaryLabel}>Total Debit</Text>
          <Text style={[styles.summaryValue, styles.debit]}>
            ₦{totalDebit.toLocaleString("en-NG")}
          </Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Recent Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  subHeader: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "600",
    color: THEME.colors.muted,
    marginVertical: THEME.spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    width: "48%",
    padding: THEME.spacing.md,
  },
  summaryLabel: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
  },
  summaryValue: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
  },
  credit: {
    color: THEME.colors.success,
  },
  debit: {
    color: THEME.colors.error,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  user: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  amount: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
  },
  type: {
    color: THEME.colors.muted,
    marginTop: 4,
    fontSize: THEME.typography.sizes.sm,
  },
  shadow: {
    shadowColor: "rgba(147,51,234,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
