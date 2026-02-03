// app/admin/(tabs)/disputes.tsx
// Admin disputes management screen

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { disputeService, verificationService } from '@/services';
import { Dispute, DisputeResolution, DisputeStatus, LEGAL_DISCLAIMERS } from '@/types/legal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STATUS_COLORS: Record<DisputeStatus, { bg: string; text: string }> = {
  submitted: { bg: '#FEF3C7', text: '#B45309' },
  under_review: { bg: '#DBEAFE', text: '#1D4ED8' },
  awaiting_response: { bg: '#E0E7FF', text: '#4338CA' },
  resolved: { bg: '#D1FAE5', text: '#059669' },
  escalated: { bg: '#FEE2E2', text: '#DC2626' },
  closed: { bg: '#F3F4F6', text: '#6B7280' },
  referred_to_authorities: { bg: '#FEE2E2', text: '#991B1B' },
};

const PRIORITY_COLORS: Record<Dispute['priority'], string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED',
};

export default function AdminDisputesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<DisputeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    escalated: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Seed mock data if empty (for demo)
      await disputeService.seedMockData();
      
      const [allDisputes, disputeStats] = await Promise.all([
        disputeService.getAllDisputes(),
        disputeService.getDisputeStats(),
      ]);
      setDisputes(allDisputes);
      setStats(disputeStats);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDisputePress = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailModal(true);
  };

  const handleStatusChange = async (disputeId: string, newStatus: DisputeStatus) => {
    const result = await disputeService.updateStatus(disputeId, newStatus, 'admin_001');
    if (result.success) {
      loadData();
      Alert.alert('Success', `Dispute status updated to ${newStatus}`);
    }
  };

  const handleResolve = async (disputeId: string, resolution: DisputeResolution) => {
    const notes = resolution === 'no_violation' 
      ? 'Investigation found no violation.' 
      : 'Violation confirmed. Action taken as per Code of Conduct.';
    
    const result = await disputeService.resolveDispute(disputeId, resolution, notes, 'admin_001');
    if (result.success) {
      setShowDetailModal(false);
      loadData();
      Alert.alert('Dispute Resolved', result.message);
    }
  };

  const handleSuspendArtisan = async (artisanId: string, reason: string) => {
    const result = await verificationService.suspendArtisan(artisanId, reason, 'admin_001');
    if (result.success) {
      Alert.alert('Artisan Suspended', 'The artisan account has been suspended.');
    }
  };

  const handleBanArtisan = async (artisanId: string, reason: string) => {
    Alert.alert(
      'Confirm Permanent Ban',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Ban Permanently',
          style: 'destructive',
          onPress: async () => {
            const result = await verificationService.banArtisan(artisanId, reason, 'admin_001');
            if (result.success) {
              Alert.alert('Artisan Banned', 'The artisan account has been permanently banned.');
            }
          },
        },
      ]
    );
  };

  const renderDisputeCard = ({ item }: { item: Dispute }) => {
    const statusColors = STATUS_COLORS[item.status];
    
    return (
      <TouchableOpacity
        style={[styles.disputeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => handleDisputePress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.disputeIdRow}>
            <Text style={[styles.disputeId, { color: colors.muted }]}>#{item.id.slice(-8)}</Text>
            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <Text style={[styles.disputeType, { color: colors.text }]}>
          {item.type.replace(/_/g, ' ').toUpperCase()}
        </Text>
        
        <Text style={[styles.description, { color: colors.muted }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>
              {new Date(item.reportedAt).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Ionicons name="attach" size={14} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>
              {item.evidence.length} evidence
            </Text>
          </View>

          {item.payoutFrozen && (
            <View style={[styles.frozenBadge, { backgroundColor: colors.errorLight }]}>
              <Ionicons name="snow" size={12} color={colors.error} />
              <Text style={[styles.frozenText, { color: colors.error }]}>Frozen</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Disputes</Text>
        <TouchableOpacity 
          style={[styles.exportButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => Alert.alert('Export', 'Dispute records exported.')}
        >
          <Ionicons name="download-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        {[
          { label: 'Pending', value: stats.pending, color: '#F59E0B' },
          { label: 'Under Review', value: stats.underReview, color: '#3B82F6' },
          { label: 'Resolved', value: stats.resolved, color: '#10B981' },
          { label: 'Escalated', value: stats.escalated, color: '#EF4444' },
        ].map((stat, index) => (
          <View 
            key={index} 
            style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.statDot, { backgroundColor: stat.color }]} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by ID..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['all', 'submitted', 'under_review', 'escalated', 'resolved'] as const).map((status) => (
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
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Disputes List */}
      <FlatList
        data={filteredDisputes}
        keyExtractor={(item) => item.id}
        renderItem={renderDisputeCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No disputes found</Text>
          </View>
        }
      />

      {/* Dispute Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Dispute Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedDispute && (
              <ScrollView style={styles.modalBody}>
                {/* Dispute Info */}
                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>ID:</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{selectedDispute.id}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>Type:</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {selectedDispute.type.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>Booking:</Text>
                    <Text style={[styles.infoValue, { color: colors.primary }]}>
                      {selectedDispute.bookingId}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>Reported:</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {new Date(selectedDispute.reportedAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>Within Window:</Text>
                    <Text style={[styles.infoValue, { color: selectedDispute.reportedWithinWindow ? colors.success : colors.error }]}>
                      {selectedDispute.reportedWithinWindow ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                  <Text style={[styles.descriptionText, { color: colors.muted }]}>
                    {selectedDispute.description}
                  </Text>
                </View>

                {/* Evidence */}
                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Evidence ({selectedDispute.evidence.length})
                  </Text>
                  {selectedDispute.evidence.length === 0 ? (
                    <Text style={[styles.noEvidence, { color: colors.muted }]}>No evidence provided</Text>
                  ) : (
                    <Text style={[styles.evidenceNote, { color: colors.muted }]}>
                      {selectedDispute.evidence.length} file(s) attached
                    </Text>
                  )}
                </View>

                {/* Payout Status */}
                <View style={[styles.payoutSection, { backgroundColor: selectedDispute.payoutFrozen ? colors.errorLight : colors.successLight }]}>
                  <Ionicons 
                    name={selectedDispute.payoutFrozen ? 'snow' : 'checkmark-circle'} 
                    size={20} 
                    color={selectedDispute.payoutFrozen ? colors.error : colors.success} 
                  />
                  <Text style={{ color: selectedDispute.payoutFrozen ? colors.error : colors.success }}>
                    Payout: {selectedDispute.payoutFrozen ? 'FROZEN' : 'Not Frozen'}
                  </Text>
                </View>

                {/* Legal Disclaimer */}
                <View style={[styles.disclaimerBox, { backgroundColor: colors.warningLight }]}>
                  <Ionicons name="alert-circle" size={16} color={colors.secondary} />
                  <Text style={[styles.disclaimerText, { color: colors.text }]}>
                    {LEGAL_DISCLAIMERS.NO_COMPENSATION}
                  </Text>
                </View>

                {/* Actions */}
                {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed' && (
                  <View style={styles.actionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
                    
                    {selectedDispute.status === 'submitted' && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleStatusChange(selectedDispute.id, 'under_review')}
                      >
                        <Text style={styles.actionButtonText}>Start Review</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.resolutionButtons}>
                      <TouchableOpacity
                        style={[styles.resolutionButton, { backgroundColor: colors.successLight, borderColor: colors.success }]}
                        onPress={() => handleResolve(selectedDispute.id, 'no_violation')}
                      >
                        <Text style={{ color: colors.success }}>No Violation</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.resolutionButton, { backgroundColor: colors.warningLight, borderColor: colors.secondary }]}
                        onPress={() => handleResolve(selectedDispute.id, 'warning_issued')}
                      >
                        <Text style={{ color: colors.secondary }}>Issue Warning</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.resolutionButtons}>
                      <TouchableOpacity
                        style={[styles.resolutionButton, { backgroundColor: colors.errorLight, borderColor: colors.error }]}
                        onPress={() => handleSuspendArtisan(selectedDispute.artisanId, selectedDispute.description)}
                      >
                        <Text style={{ color: colors.error }}>Suspend Artisan</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.resolutionButton, { backgroundColor: '#FEE2E2', borderColor: '#991B1B' }]}
                        onPress={() => handleBanArtisan(selectedDispute.artisanId, selectedDispute.description)}
                      >
                        <Text style={{ color: '#991B1B' }}>Ban Artisan</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}
                      onPress={() => handleResolve(selectedDispute.id, 'referred_to_authorities')}
                    >
                      <Ionicons name="shield" size={18} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Refer to Authorities</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Internal Notes */}
                <View style={[styles.infoSection, { borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Internal Notes</Text>
                  <TextInput
                    style={[styles.notesInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="Add internal note..."
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={3}
                  />
                  <TouchableOpacity style={[styles.addNoteButton, { backgroundColor: colors.primary }]}>
                    <Text style={{ color: '#FFFFFF' }}>Add Note</Text>
                  </TouchableOpacity>
                </View>
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
  exportButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
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
    minWidth: 100,
    alignItems: 'center',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  searchContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
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
    textTransform: 'capitalize',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  disputeCard: {
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
  disputeIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disputeId: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.subheading,
    textTransform: 'uppercase',
  },
  disputeType: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  description: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
    marginBottom: THEME.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  frozenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  frozenText: {
    fontSize: 10,
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
    height: '90%',
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
  infoSection: {
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: 100,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  infoValue: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  descriptionText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
  },
  noEvidence: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    fontStyle: 'italic',
  },
  evidenceNote: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  payoutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  disclaimerBox: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  disclaimerText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
  },
  actionsSection: {
    marginBottom: THEME.spacing.lg,
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
  resolutionButtons: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  resolutionButton: {
    flex: 1,
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: THEME.spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: THEME.spacing.sm,
  },
  addNoteButton: {
    padding: THEME.spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
});
