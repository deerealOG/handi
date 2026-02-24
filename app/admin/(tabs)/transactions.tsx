import { useAppTheme } from "@/hooks/use-app-theme";
import { walletService } from "@/services/walletService";
import { WalletTransaction } from "@/types/wallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../../constants/theme";

export default function AdminTransactions() {
  const { colors } = useAppTheme();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await walletService.getAllTransactions();
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: WalletTransaction }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }, styles.shadow]}>
      <View style={styles.row}>
        <View>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          <Text style={[styles.type, { color: colors.muted }]}>
            {item.type} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={[
            styles.amount,
            item.amount >= 0 ? { color: colors.success } : { color: colors.error },
          ]}
        >
          {item.amount >= 0 ? "+" : ""}
          ₦{Math.abs(item.amount).toLocaleString("en-NG")}
        </Text>
      </View>
      <View style={styles.footerRow}>
        <Text style={[styles.walletId, { color: colors.muted }]}>Wallet: {item.walletId.slice(-8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'COMPLETED' ? colors.successLight : colors.warningLight }]}>
           <Text style={[styles.statusText, { color: item.status === 'COMPLETED' ? colors.success : colors.warning }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  const totalCredit = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>💳 Transactions Overview</Text>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }, styles.shadow]}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Total Inflow</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            ₦{totalCredit.toLocaleString("en-NG")}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface }, styles.shadow]}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Total Outflow</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>
            ₦{totalDebit.toLocaleString("en-NG")}
          </Text>
        </View>
      </View>

      <Text style={[styles.subHeader, { color: colors.muted }]}>Recent Activity</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No transactions recorded</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.md,
  },
  subHeader: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "600",
    marginVertical: THEME.spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    borderRadius: THEME.radius.lg,
    width: "48%",
    padding: THEME.spacing.md,
  },
  summaryLabel: {
    fontSize: THEME.typography.sizes.sm,
  },
  summaryValue: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: "600",
  },
  amount: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
  },
  type: {
    marginTop: 2,
    fontSize: THEME.typography.sizes.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  walletId: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  shadow: {
    shadowColor: "rgba(147,51,234,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
