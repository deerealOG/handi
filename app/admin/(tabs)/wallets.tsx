// app/admin/(tabs)/wallets.tsx
// Admin wallet overview screen

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { walletService } from '@/services/walletService';
import { Wallet } from '@/types/wallet';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AdminWalletsScreen() {
  const { colors } = useAppTheme();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await walletService.getAllWallets();
      if (response.success && response.data) {
        setWallets(response.data);
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const renderWalletCard = ({ item }: { item: Wallet }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: item.userType === 'provider' ? colors.primaryLight : colors.secondaryLight }]}>
             <Ionicons 
               name={item.userType === 'provider' ? 'briefcase' : 'person'} 
               size={16} 
               color={item.userType === 'provider' ? colors.primary : colors.secondary} 
             />
          </View>
          <View>
            <Text style={[styles.userId, { color: colors.text }]}>User: {item.userId}</Text>
            <Text style={[styles.userType, { color: colors.muted }]}>{item.userType.toUpperCase()}</Text>
          </View>
        </View>
        <View style={[styles.frozenBadge, { backgroundColor: item.isFrozen ? colors.errorLight : colors.successLight }]}>
           <Text style={[styles.frozenText, { color: item.isFrozen ? colors.error : colors.success }]}>
             {item.isFrozen ? 'FROZEN' : 'ACTIVE'}
           </Text>
        </View>
      </View>

      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Text style={[styles.balanceLabel, { color: colors.muted }]}>Available</Text>
          <Text style={[styles.balanceValue, { color: colors.text }]}>{formatCurrency(item.balance)}</Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={[styles.balanceLabel, { color: colors.muted }]}>Locked (Escrow)</Text>
          <Text style={[styles.balanceValue, { color: colors.primary }]}>{formatCurrency(item.lockedBalance)}</Text>
        </View>
      </View>

      <Text style={[styles.updatedAt, { color: colors.muted }]}>
        Last Updated: {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </View>
  );

  const totals = wallets.reduce((acc, w) => ({
    balance: acc.balance + w.balance,
    locked: acc.locked + w.lockedBalance
  }), { balance: 0, locked: 0 });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Wallet Management</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
           <Text style={[styles.summaryLabel, { color: colors.muted }]}>Platform Total Balance</Text>
           <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totals.balance)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
           <Text style={[styles.summaryLabel, { color: colors.muted }]}>Total Held in Escrow</Text>
           <Text style={[styles.summaryValue, { color: colors.primary }]}>{formatCurrency(totals.locked)}</Text>
        </View>
      </View>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={renderWalletCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No wallets found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes['2xl'],
    fontFamily: THEME.typography.fontFamily.heading,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userId: {
    fontSize: 14,
    fontWeight: '600',
  },
  userType: {
    fontSize: 10,
    fontWeight: '700',
  },
  frozenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  frozenText: {
    fontSize: 9,
    fontWeight: '800',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  updatedAt: {
    fontSize: 10,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});
