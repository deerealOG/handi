// app/admin/(tabs)/payouts.tsx
// Admin escrow and payout management screen

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { escrowService } from '@/services';
import { EscrowStatus, EscrowTransaction, LEGAL_DISCLAIMERS } from '@/types/legal';
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

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  released: { label: 'Released', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
  frozen: { label: 'Frozen', color: '#EF4444', bg: '#FEE2E2', icon: 'snow' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'close-circle' },
  partially_released: { label: 'Partial', color: '#8B5CF6', bg: '#EDE9FE', icon: 'pie-chart' },
};

export default function AdminPayoutsScreen() {
  const { colors } = useAppTheme();
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EscrowStatus | 'all'>('all');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalHeld: 0,
    totalReleased: 0,
    totalFrozen: 0,
    pendingCount: 0,
    frozenCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allEscrows, escrowStats] = await Promise.all([
        escrowService.getAllEscrows(),
        escrowService.getEscrowStats(),
      ]);
      setEscrows(allEscrows);
      setStats(escrowStats);
    } catch (error) {
      console.error('Error loading escrows:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredEscrows = escrows.filter(e => 
    filterStatus === 'all' || e.status === filterStatus
  );

  const handleEscrowPress = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setShowDetailModal(true);
  };

  const handleFreezeEscrow = async (bookingId: string) => {
    Alert.prompt(
      'Freeze Payout',
      'Enter reason for freezing this payout:',
      async (reason) => {
        if (reason) {
          const result = await escrowService.freezeEscrow(bookingId, '', reason);
          if (result.success) {
            loadData();
            setShowDetailModal(false);
            Alert.alert('Success', 'Payout has been frozen.');
          }
        }
      }
    );
  };

  const handleReleaseEscrow = async (bookingId: string) => {
    Alert.alert(
      'Release Payout',
      'Are you sure you want to release this payout to the artisan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          onPress: async () => {
            const result = await escrowService.releaseEscrow(bookingId, 'admin_001');
            if (result.success) {
              loadData();
              setShowDetailModal(false);
              Alert.alert('Success', result.message);
            } else {
              Alert.alert('Error', result.error || 'Failed to release payout');
            }
          },
        },
      ]
    );
  };

  const handleAutoRelease = async () => {
    Alert.alert(
      'Auto-Release Eligible Payouts',
      'This will release all payouts that have passed the review window. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Process',
          onPress: async () => {
            const result = await escrowService.autoReleaseEligiblePayouts();
            loadData();
            Alert.alert('Complete', `Released: ${result.released}, Failed: ${result.failed}`);
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const renderEscrowCard = ({ item }: { item: EscrowTransaction }) => {
    const status = STATUS_CONFIG[item.status];
    
    return (
      <TouchableOpacity
        style={[styles.escrowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => handleEscrowPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.bookingIdRow}>
            <Ionicons name="receipt-outline" size={16} color={colors.muted} />
            <Text style={[styles.bookingId, { color: colors.muted }]}>#{item.bookingId.slice(-8)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon as any} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, { color: colors.muted }]}>Total Amount</Text>
          <Text style={[styles.amountValue, { color: colors.text }]}>{formatCurrency(item.amount)}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Text style={[styles.breakdownLabel, { color: colors.muted }]}>Artisan</Text>
            <Text style={[styles.breakdownValue, { color: colors.success }]}>
              {formatCurrency(item.artisanPayout)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={[styles.breakdownLabel, { color: colors.muted }]}>Platform Fee</Text>
            <Text style={[styles.breakdownValue, { color: colors.primary }]}>
              {formatCurrency(item.platformFee)}
            </Text>
          </View>
        </View>

        {item.status === 'pending' && item.releaseEligibleAt && (
          <View style={[styles.releaseInfo, { backgroundColor: colors.background }]}>
            <Ionicons name="time-outline" size={14} color={colors.muted} />
            <Text style={[styles.releaseText, { color: colors.muted }]}>
              Eligible: {new Date(item.releaseEligibleAt).toLocaleString()}
            </Text>
          </View>
        )}

        {item.status === 'frozen' && item.disputeId && (
          <View style={[styles.disputeInfo, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={[styles.disputeText, { color: colors.error }]}>
              Dispute: {item.disputeId.slice(-8)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payouts</Text>
        <TouchableOpacity 
          style={[styles.autoReleaseButton, { backgroundColor: colors.primary }]}
          onPress={handleAutoRelease}
        >
          <Ionicons name="flash" size={18} color="#FFFFFF" />
          <Text style={styles.autoReleaseText}>Auto-Release</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Held in Escrow</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatCurrency(stats.totalHeld)}</Text>
          <Text style={[styles.statCount, { color: colors.muted }]}>{stats.pendingCount} pending</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
          <Text style={[styles.statLabel, { color: colors.success }]}>Total Released</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>{formatCurrency(stats.totalReleased)}</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
          <Text style={[styles.statLabel, { color: colors.error }]}>Frozen</Text>
          <Text style={[styles.statValue, { color: colors.error }]}>{formatCurrency(stats.totalFrozen)}</Text>
          <Text style={[styles.statCount, { color: colors.error }]}>{stats.frozenCount} disputes</Text>
        </View>
      </ScrollView>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['all', 'pending', 'frozen', 'released', 'cancelled'] as const).map((status) => (
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
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Escrow List */}
      <FlatList
        data={filteredEscrows}
        keyExtractor={(item) => item.id}
        renderItem={renderEscrowCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cash-remove" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No transactions found</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Transaction Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedEscrow && (
              <ScrollView style={styles.modalBody}>
                {/* Status */}
                <View style={[styles.statusSection, { backgroundColor: STATUS_CONFIG[selectedEscrow.status].bg }]}>
                  <Ionicons 
                    name={STATUS_CONFIG[selectedEscrow.status].icon as any} 
                    size={24} 
                    color={STATUS_CONFIG[selectedEscrow.status].color} 
                  />
                  <Text style={{ color: STATUS_CONFIG[selectedEscrow.status].color, fontWeight: '600' }}>
                    {STATUS_CONFIG[selectedEscrow.status].label.toUpperCase()}
                  </Text>
                </View>

                {/* Amount Breakdown */}
                <View style={[styles.amountSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.amountDetailRow}>
                    <Text style={[styles.amountDetailLabel, { color: colors.muted }]}>Total Amount</Text>
                    <Text style={[styles.amountDetailValue, { color: colors.text }]}>
                      {formatCurrency(selectedEscrow.amount)}
                    </Text>
                  </View>
                  <View style={styles.amountDetailRow}>
                    <Text style={[styles.amountDetailLabel, { color: colors.muted }]}>Platform Fee (10%)</Text>
                    <Text style={[styles.amountDetailValue, { color: colors.primary }]}>
                      -{formatCurrency(selectedEscrow.platformFee)}
                    </Text>
                  </View>
                  <View style={[styles.amountDetailRow, styles.amountDetailTotal]}>
                    <Text style={[styles.amountDetailLabel, { color: colors.text, fontWeight: '600' }]}>
                      Artisan Payout
                    </Text>
                    <Text style={[styles.amountDetailValue, { color: colors.success, fontSize: 18 }]}>
                      {formatCurrency(selectedEscrow.artisanPayout)}
                    </Text>
                  </View>
                </View>

                {/* Timeline */}
                <View style={[styles.timelineSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
                  
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineLabel, { color: colors.text }]}>Payment Received</Text>
                      <Text style={[styles.timelineDate, { color: colors.muted }]}>
                        {new Date(selectedEscrow.paymentReceivedAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {selectedEscrow.jobCompletedAt && (
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                      <View style={styles.timelineContent}>
                        <Text style={[styles.timelineLabel, { color: colors.text }]}>Job Completed</Text>
                        <Text style={[styles.timelineDate, { color: colors.muted }]}>
                          {new Date(selectedEscrow.jobCompletedAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedEscrow.releaseEligibleAt && (
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.secondary }]} />
                      <View style={styles.timelineContent}>
                        <Text style={[styles.timelineLabel, { color: colors.text }]}>Release Eligible</Text>
                        <Text style={[styles.timelineDate, { color: colors.muted }]}>
                          {new Date(selectedEscrow.releaseEligibleAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedEscrow.frozenAt && (
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.error }]} />
                      <View style={styles.timelineContent}>
                        <Text style={[styles.timelineLabel, { color: colors.error }]}>Frozen</Text>
                        <Text style={[styles.timelineDate, { color: colors.muted }]}>
                          {new Date(selectedEscrow.frozenAt).toLocaleString()}
                        </Text>
                        {selectedEscrow.frozenReason && (
                          <Text style={[styles.frozenReason, { color: colors.error }]}>
                            {selectedEscrow.frozenReason}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}

                  {selectedEscrow.releasedAt && (
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
                      <View style={styles.timelineContent}>
                        <Text style={[styles.timelineLabel, { color: colors.success }]}>Released</Text>
                        <Text style={[styles.timelineDate, { color: colors.muted }]}>
                          {new Date(selectedEscrow.releasedAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Important Notice */}
                <View style={[styles.noticeSection, { backgroundColor: colors.warningLight }]}>
                  <Ionicons name="alert-circle" size={18} color={colors.secondary} />
                  <Text style={[styles.noticeText, { color: colors.text }]}>
                    {LEGAL_DISCLAIMERS.NO_COMPENSATION}
                  </Text>
                </View>

                {/* Actions */}
                {(selectedEscrow.status === 'pending' || selectedEscrow.status === 'frozen') && (
                  <View style={styles.actionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
                    
                    {selectedEscrow.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.success }]}
                          onPress={() => handleReleaseEscrow(selectedEscrow.bookingId)}
                        >
                          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Release to Artisan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.error }]}
                          onPress={() => handleFreezeEscrow(selectedEscrow.bookingId)}
                        >
                          <Ionicons name="snow" size={20} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Freeze Payout</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {selectedEscrow.status === 'frozen' && !selectedEscrow.disputeId && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.success }]}
                        onPress={() => handleReleaseEscrow(selectedEscrow.bookingId)}
                      >
                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Unfreeze & Release</Text>
                      </TouchableOpacity>
                    )}

                    {selectedEscrow.status === 'frozen' && selectedEscrow.disputeId && (
                      <View style={[styles.disputeWarning, { backgroundColor: colors.errorLight }]}>
                        <Ionicons name="warning" size={18} color={colors.error} />
                        <Text style={[styles.disputeWarningText, { color: colors.error }]}>
                          This payout is frozen due to an active dispute. Resolve the dispute first.
                        </Text>
                      </View>
                    )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes['2xl'],
    fontFamily: THEME.typography.fontFamily.heading,
  },
  autoReleaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 20,
    gap: 6,
  },
  autoReleaseText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  statsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  statCard: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: THEME.spacing.sm,
    minWidth: 140,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  statValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
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
    marginRight: THEME.spacing.sm,
  },
  filterChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  escrowCard: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: THEME.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  bookingIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingId: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  amountRow: {
    marginBottom: THEME.spacing.sm,
  },
  amountLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  amountValue: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: THEME.spacing.lg,
  },
  breakdownItem: {},
  breakdownLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  breakdownValue: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  releaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    padding: THEME.spacing.sm,
    borderRadius: 8,
    gap: 6,
  },
  releaseText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  disputeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    padding: THEME.spacing.sm,
    borderRadius: 8,
    gap: 6,
  },
  disputeText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing['3xl'],
  },
  emptyText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
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
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  modalBody: {
    padding: THEME.spacing.lg,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  amountSection: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: THEME.spacing.lg,
  },
  amountDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  amountDetailTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 12,
  },
  amountDetailLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  amountDetailValue: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  timelineSection: {
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  timelineDate: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  frozenReason: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  noticeSection: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
  },
  actionsSection: {
    marginBottom: THEME.spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
    marginBottom: THEME.spacing.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  disputeWarning: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  disputeWarningText: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
