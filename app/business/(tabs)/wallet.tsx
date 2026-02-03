// app/business/(tabs)/wallet.tsx
// Business Wallet - Earnings as Service Provider

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { BusinessJob, businessService } from "@/services";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

interface Transaction {
  id: string;
  title: string;
  client: string;
  amount: number;
  date: string;
  type: 'completed' | 'pending' | 'active';
}

export default function BusinessWallet() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, lastMonth: 0, pending: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = useCallback(async () => {
    try {
      const businessId = user?.id || 'business_001';
      const [earningsData, jobs] = await Promise.all([
        businessService.getEarningsSummary(businessId),
        businessService.getJobs(businessId),
      ]);
      
      setEarnings(earningsData);
      
      // Transform jobs to transactions
      const txns: Transaction[] = jobs.map((job: BusinessJob) => ({
        id: job.id,
        title: job.serviceType,
        client: job.clientName,
        amount: job.estimatedPrice,
        date: job.status === 'completed' ? job.updatedAt : job.createdAt,
        type: job.status === 'completed' ? 'completed' : 
              ['accepted', 'assigned', 'in_progress'].includes(job.status) ? 'active' : 'pending',
      }));
      
      setTransactions(txns.filter(t => t.type !== 'pending'));
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const formatCurrency = (amount: number): string => `₦${amount.toLocaleString()}`;
  const formatDate = (dateString: string): string => 
    new Date(dateString).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Text style={[styles.headerTitle, { color: colors.text }]}>Earnings</Text>

      {/* Main Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.balanceLabel}>Total Earnings</Text>
        <Text style={styles.balanceValue}>{formatCurrency(earnings.total)}</Text>
        {earnings.pending > 0 && (
          <View style={styles.pendingRow}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.pendingText}>
              {formatCurrency(earnings.pending)} in active jobs
            </Text>
          </View>
        )}
      </View>

      {/* Earnings Breakdown */}
      <View style={styles.breakdownRow}>
        <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="calendar-month" size={24} color={colors.success} />
          <Text style={[styles.breakdownLabel, { color: colors.muted }]}>This Month</Text>
          <Text style={[styles.breakdownValue, { color: colors.text }]}>
            {formatCurrency(earnings.thisMonth)}
          </Text>
        </View>
        <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="calendar-arrow-left" size={24} color={colors.muted} />
          <Text style={[styles.breakdownLabel, { color: colors.muted }]}>Last Month</Text>
          <Text style={[styles.breakdownValue, { color: colors.text }]}>
            {formatCurrency(earnings.lastMonth)}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="bank-transfer-out" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
            <MaterialCommunityIcons name="file-chart" size={24} color="#1D4ED8" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#FCE7F3' }]}>
            <MaterialCommunityIcons name="history" size={24} color="#DB2777" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Earnings</Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[
              styles.transactionIcon, 
              { backgroundColor: item.type === 'completed' ? '#D1FAE5' : '#FEF3C7' }
            ]}>
              <MaterialCommunityIcons 
                name={item.type === 'completed' ? "check-circle" : "clock-outline"} 
                size={20} 
                color={item.type === 'completed' ? '#059669' : '#D97706'} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.transactionClient, { color: colors.muted }]}>{item.client}</Text>
              <Text style={[styles.transactionDate, { color: colors.muted }]}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={[
                styles.transactionAmount, 
                { color: item.type === 'completed' ? colors.success : colors.secondary }
              ]}>
                {item.type === 'completed' ? '+' : ''}{formatCurrency(item.amount)}
              </Text>
              <Text style={[styles.statusLabel, { 
                color: item.type === 'completed' ? colors.success : colors.secondary 
              }]}>
                {item.type === 'completed' ? 'Received' : 'In Progress'}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="cash-multiple" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No earnings yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#fff",
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  pendingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  breakdownCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  breakdownLabel: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
  breakdownValue: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  sectionTitle: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  transactionClient: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statusLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
});
