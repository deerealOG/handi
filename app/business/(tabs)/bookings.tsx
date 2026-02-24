// app/business/(tabs)/bookings.tsx
// Business Jobs - Service Provider incoming job requests

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { BusinessJob, businessService, TeamMember } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

type TabKey = 'pending' | 'active' | 'completed' | 'all';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

const STATUS_COLORS: Record<BusinessJob['status'], { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  accepted: { bg: '#DBEAFE', text: '#1D4ED8' },
  assigned: { bg: '#E0E7FF', text: '#4338CA' },
  in_progress: { bg: '#FEF3C7', text: '#D97706' },
  completed: { bg: '#D1FAE5', text: '#059669' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function BusinessJobs() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [jobs, setJobs] = useState<BusinessJob[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  
  // Assignment modal
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<BusinessJob | null>(null);

  const loadData = useCallback(async () => {
    try {
      const businessId = user?.id || 'business_001';
      const [jobsData, teamData] = await Promise.all([
        businessService.getJobs(businessId),
        businessService.getTeamMembers(businessId),
      ]);
      setJobs(jobsData);
      setTeam(teamData.filter(m => m.role === 'technician' && m.isActive));
    } catch (error) {
      console.error('Error loading jobs:', error);
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

  const getFilteredJobs = (): BusinessJob[] => {
    switch (activeTab) {
      case 'pending':
        return jobs.filter(j => j.status === 'pending');
      case 'active':
        return jobs.filter(j => 
          j.status === 'accepted' || j.status === 'assigned' || j.status === 'in_progress'
        );
      case 'completed':
        return jobs.filter(j => j.status === 'completed' || j.status === 'cancelled');
      default:
        return jobs;
    }
  };

  const handleAccept = async (jobId: string) => {
    const result = await businessService.acceptJob(jobId);
    if (result.success) {
      Alert.alert("Success", "Job accepted! Now assign a team member.");
      loadData();
    }
  };

  const handleDecline = async (jobId: string) => {
    Alert.alert("Decline Job", "Are you sure you want to decline this job?", [
      { text: "Cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          await businessService.declineJob(jobId);
          loadData();
        },
      },
    ]);
  };

  const handleOpenAssignModal = (job: BusinessJob) => {
    setSelectedJobForAssign(job);
    setAssignModalVisible(true);
  };

  const handleAssign = async (memberId: string) => {
    if (!selectedJobForAssign) return;
    const result = await businessService.assignTeamMember(selectedJobForAssign.id, memberId);
    if (result.success) {
      Alert.alert("Assigned", result.message);
      setAssignModalVisible(false);
      loadData();
    }
  };

  const handleStartJob = async (jobId: string) => {
    await businessService.updateJobStatus(jobId, 'in_progress');
    loadData();
  };

  const handleCompleteJob = async (jobId: string) => {
    Alert.alert("Complete Job", "Mark this job as completed?", [
      { text: "Cancel" },
      {
        text: "Complete",
        onPress: async () => {
          await businessService.updateJobStatus(jobId, 'completed');
          loadData();
        },
      },
    ]);
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Jobs</Text>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.tabsContainer}
      >
        {TABS.map(tab => {
          const count = tab.key === 'pending' 
            ? jobs.filter(j => j.status === 'pending').length
            : tab.key === 'active'
            ? jobs.filter(j => ['accepted', 'assigned', 'in_progress'].includes(j.status)).length
            : tab.key === 'completed'
            ? jobs.filter(j => ['completed', 'cancelled'].includes(j.status)).length
            : jobs.length;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeTab === tab.key && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[
                styles.tabText, 
                { color: colors.muted },
                activeTab === tab.key && { color: colors.onPrimary }
              ]}>
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Jobs List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredJobs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="briefcase-off-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Jobs</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {activeTab === 'pending' 
                ? 'No pending job requests'
                : activeTab === 'active'
                ? 'No active jobs at the moment'
                : 'No completed jobs yet'}
            </Text>
          </View>
        ) : (
          filteredJobs.map(job => {
            const statusStyle = STATUS_COLORS[job.status];
            return (
              <View 
                key={job.id} 
                style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                {/* Header */}
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.jobTitle, { color: colors.text }]}>{job.serviceType}</Text>
                    <Text style={[styles.jobClient, { color: colors.muted }]}>{job.clientName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {job.status.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={[styles.jobDescription, { color: colors.muted }]} numberOfLines={2}>
                  {job.description}
                </Text>

                {/* Meta */}
                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.muted} />
                    <Text style={[styles.metaText, { color: colors.muted }]}>{formatDate(job.scheduledDate)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={colors.muted} />
                    <Text style={[styles.metaText, { color: colors.muted }]}>{job.city}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="cash-outline" size={14} color={colors.primary} />
                    <Text style={[styles.metaText, { color: colors.primary, fontWeight: '600' }]}>
                      {formatCurrency(job.estimatedPrice)}
                    </Text>
                  </View>
                </View>

                {/* Assigned Member */}
                {job.assignedMemberName && (
                  <View style={[styles.assignedRow, { borderTopColor: colors.border }]}>
                    <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
                    <Text style={[styles.assignedText, { color: colors.text }]}>
                      {job.assignedMemberName}
                    </Text>
                  </View>
                )}

                {/* Actions based on status */}
                {job.status === 'pending' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.declineBtn, { borderColor: colors.error }]}
                      onPress={() => handleDecline(job.id)}
                    >
                      <Text style={[styles.actionBtnText, { color: colors.error }]}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.acceptBtn, { backgroundColor: colors.success }]}
                      onPress={() => handleAccept(job.id)}
                    >
                      <Text style={[styles.actionBtnText, { color: 'white' }]}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {job.status === 'accepted' && (
                  <TouchableOpacity 
                    style={[styles.fullActionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleOpenAssignModal(job)}
                  >
                    <Ionicons name="person-add" size={18} color="white" />
                    <Text style={styles.fullActionText}>Assign Team Member</Text>
                  </TouchableOpacity>
                )}

                {job.status === 'assigned' && (
                  <TouchableOpacity 
                    style={[styles.fullActionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleStartJob(job.id)}
                  >
                    <Ionicons name="play" size={18} color="white" />
                    <Text style={styles.fullActionText}>Start Job</Text>
                  </TouchableOpacity>
                )}

                {job.status === 'in_progress' && (
                  <TouchableOpacity 
                    style={[styles.fullActionBtn, { backgroundColor: colors.success }]}
                    onPress={() => handleCompleteJob(job.id)}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="white" />
                    <Text style={styles.fullActionText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Assignment Modal */}
      <Modal
        visible={assignModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Assign Team Member</Text>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>
              Select a technician for this job
            </Text>
            
            {team.length === 0 ? (
              <Text style={[styles.noTeamText, { color: colors.muted }]}>
                No technicians available. Add team members first.
              </Text>
            ) : (
              team.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.teamMemberItem, { borderColor: colors.border }]}
                  onPress={() => handleAssign(member.id)}
                >
                  <View style={[styles.memberAvatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.memberInitial, { color: colors.primary }]}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberSkills, { color: colors.muted }]}>
                      {member.skills.join(', ')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={[styles.cancelModalBtn, { backgroundColor: colors.background }]}
              onPress={() => setAssignModalVisible(false)}
            >
              <Text style={[styles.cancelModalText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes['2xl'],
    fontFamily: THEME.typography.fontFamily.heading,
  },
  tabsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 10,
    marginBottom: THEME.spacing.md,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 6,
    textAlign: 'center',
  },
  jobCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  jobClient: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
    textTransform: 'uppercase',
  },
  jobDescription: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
    marginBottom: 10,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  assignedText: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  declineBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  acceptBtn: {
    borderWidth: 0,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  fullActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  fullActionText: {
    color: 'white',
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 20,
  },
  noTeamText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    padding: 20,
  },
  teamMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  memberName: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  memberSkills: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  cancelModalBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelModalText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
