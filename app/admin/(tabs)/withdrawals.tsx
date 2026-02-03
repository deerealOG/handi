// app/admin/(tabs)/withdrawals.tsx
// Admin withdrawal request management screen

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { walletService } from '@/services/walletService';
import { WithdrawalRequest } from '@/types/wallet';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const STATUS_CONFIG: Record<WithdrawalRequest['status'], { label: string; color: string; bg: string; icon: string }> = {
  PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  APPROVED: { label: 'Approved', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
  REJECTED: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' },
  PAID: { label: 'Paid', color: '#3B82F6', bg: '#DBEAFE', icon: 'cash-outline' },
};

export default function AdminWithdrawalsScreen() {
  const { colors } = useAppTheme();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<WithdrawalRequest['status'] | 'ALL'>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await walletService.getAllWithdrawalRequests();
      if (response.success && response.data) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => 
    filterStatus === 'ALL' || w.status === filterStatus
  );

  const handleRequestPress = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = async (id: string) => {
    Alert.alert(
      'Approve Withdrawal',
      'Confirm you have processed this payment to the artisan\'s bank account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            const result = await walletService.approveWithdrawal(id);
            if (result.success) {
              loadData();
              setShowDetailModal(false);
              Alert.alert('Success', 'Withdrawal approved.');
            } else {
              Alert.alert('Error', result.error || 'Failed to approve');
            }
          },
        },
      ]
    );
  };

  const handleReject = async (id: string) => {
    Alert.prompt(
      'Reject Withdrawal',
      'Enter reason for rejection (this will be shown to the artisan and funds will be refunded):',
      async (reason) => {
        if (reason) {
          const result = await walletService.rejectWithdrawal(id, reason);
          if (result.success) {
            loadData();
            setShowDetailModal(false);
            Alert.alert('Success', 'Withdrawal rejected and funds refunded.');
          }
        }
      }
    );
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const renderWithdrawalCard = ({ item }: { item: WithdrawalRequest }) => {
    const status = STATUS_CONFIG[item.status];
    
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => handleRequestPress(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.date, { color: colors.muted }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon as any} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(item.amount)}</Text>
          <Text style={[styles.walletId, { color: colors.muted }]}>Wallet: {item.walletId.slice(-8)}</Text>
        </View>

        <View style={styles.bankRow}>
          <Ionicons name="business-outline" size={14} color={colors.muted} />
          <Text style={[styles.bankText, { color: colors.muted }]}>
            {item.bankDetails.bankName} • {item.bankDetails.accountNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Withdrawals</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
              filterStatus === status && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filterStatus === status ? '#FFFFFF' : colors.text },
              ]}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredWithdrawals}
        keyExtractor={(item) => item.id}
        renderItem={renderWithdrawalCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cash-remove" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No withdrawal requests</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Request Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView style={styles.modalBody}>
                <View style={[styles.statusSection, { backgroundColor: STATUS_CONFIG[selectedRequest.status].bg }]}>
                  <Ionicons 
                    name={STATUS_CONFIG[selectedRequest.status].icon as any} 
                    size={24} 
                    color={STATUS_CONFIG[selectedRequest.status].color} 
                  />
                  <Text style={{ color: STATUS_CONFIG[selectedRequest.status].color, fontWeight: '600' }}>
                    {STATUS_CONFIG[selectedRequest.status].label.toUpperCase()}
                  </Text>
                </View>

                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.muted }]}>WITHDRAWAL AMOUNT</Text>
                  <Text style={[styles.mainAmount, { color: colors.text }]}>{formatCurrency(selectedRequest.amount)}</Text>
                </View>

                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.muted }]}>BANKING DETAILS</Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>Account Name</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedRequest.bankDetails.accountName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>Account Number</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedRequest.bankDetails.accountNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>Bank Name</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedRequest.bankDetails.bankName}</Text>
                  </View>
                </View>

                {selectedRequest.status === 'PENDING' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => handleApprove(selectedRequest.id)}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Mark as Approved & Paid</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.error }]}
                      onPress={() => handleReject(selectedRequest.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Reject & Refund</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedRequest.adminNote && (
                  <View style={[styles.noteSection, { backgroundColor: colors.background }]}>
                    <Text style={[styles.noteLabel, { color: colors.muted }]}>Admin Note:</Text>
                    <Text style={[styles.noteText, { color: colors.text }]}>{selectedRequest.adminNote}</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    marginBottom: THEME.spacing.md,
  },
  filterContent: {
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  card: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: THEME.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  walletId: {
    fontSize: 11,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: THEME.spacing.lg,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  mainAmount: {
    fontSize: 28,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
  },
});
