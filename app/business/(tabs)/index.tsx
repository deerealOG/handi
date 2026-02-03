// app/business/(tabs)/index.tsx
// Business Dashboard - Service Provider Model
// Shows incoming jobs, team overview, and earnings

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { BusinessJob, businessService, BusinessStats } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ProfileCompletionWidget } from "../../../components/business/ProfileCompletionWidget";
import { THEME } from "../../../constants/theme";

const JOB_STATUS_COLORS: Record<
  BusinessJob["status"],
  { bg: string; text: string }
> = {
  pending: { bg: "#FEF3C7", text: "#D97706" },
  accepted: { bg: "#DBEAFE", text: "#1D4ED8" },
  assigned: { bg: "#E0E7FF", text: "#4338CA" },
  in_progress: { bg: "#FEF3C7", text: "#D97706" },
  completed: { bg: "#D1FAE5", text: "#059669" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function BusinessDashboard() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<BusinessJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<BusinessJob[]>([]);

  const loadData = useCallback(async () => {
    try {
      const businessId = user?.id || "business_001";

      const [statsData, allJobs] = await Promise.all([
        businessService.getStats(businessId),
        businessService.getJobs(businessId),
      ]);

      setStats(statsData);
      setPendingJobs(allJobs.filter((j) => j.status === "pending"));
      setActiveJobs(
        allJobs.filter(
          (j) =>
            j.status === "accepted" ||
            j.status === "assigned" ||
            j.status === "in_progress",
        ),
      );
    } catch (error) {
      console.error("Error loading business data:", error);
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

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.muted }]}>
            Business Dashboard
          </Text>
          <Text style={[styles.businessName, { color: colors.text }]}>
            {user?.fullName || "HANDI Pro Services"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
          {pendingJobs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingJobs.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View
            style={[styles.mainStatCard, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons
              name="currency-ngn"
              size={28}
              color="white"
            />
            <Text style={styles.mainStatLabel}>Total Earnings</Text>
            <Text style={styles.mainStatValue}>
              {formatCurrency(stats?.totalEarnings || 0)}
            </Text>
            {(stats?.pendingPayouts || 0) > 0 && (
              <Text style={styles.pendingText}>
                +{formatCurrency(stats?.pendingPayouts || 0)} pending
              </Text>
            )}
          </View>

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats?.activeJobs || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Active Jobs
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats?.completedJobs || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Completed
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats?.teamSize || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Team
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions (Simplified) */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.surface, width: "48%" },
            ]}
            onPress={() => router.push("/business/(tabs)/bookings")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#DBEAFE" }]}>
              <MaterialCommunityIcons
                name="briefcase-clock"
                size={24}
                color="#1D4ED8"
              />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>
              All Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.surface, width: "48%" },
            ]}
            onPress={() => router.push("/business/(tabs)/wallet")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FCE7F3" }]}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color="#DB2777"
              />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>
              Earnings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Completion Widget */}
        <ProfileCompletionWidget
          onCompletePress={() => router.push("/business/profile" as any)}
        />

        {/* Pending Job Requests */}
        {pendingJobs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  New Job Requests
                </Text>
                <View
                  style={[styles.countBadge, { backgroundColor: colors.error }]}
                >
                  <Text style={styles.countBadgeText}>
                    {pendingJobs.length}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/business/(tabs)/bookings")}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {pendingJobs.slice(0, 2).map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.jobCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  router.push(`/business/job-details?id=${job.id}`)
                }
              >
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.jobTitle, { color: colors.text }]}>
                      {job.serviceType}
                    </Text>
                    <Text style={[styles.clientName, { color: colors.muted }]}>
                      {job.clientName}
                    </Text>
                  </View>
                  <Text style={[styles.jobPrice, { color: colors.primary }]}>
                    {formatCurrency(job.estimatedPrice)}
                  </Text>
                </View>
                <Text
                  style={[styles.jobDescription, { color: colors.muted }]}
                  numberOfLines={2}
                >
                  {job.description}
                </Text>
                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text style={[styles.metaText, { color: colors.muted }]}>
                      {new Date(job.scheduledDate).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text style={[styles.metaText, { color: colors.muted }]}>
                      {job.city}
                    </Text>
                  </View>
                </View>
                <View style={styles.jobActions}>
                  <TouchableOpacity
                    style={[styles.declineBtn, { borderColor: colors.error }]}
                    onPress={async (e) => {
                      e.stopPropagation();
                      await businessService.declineJob(job.id);
                      loadData();
                    }}
                  >
                    <Text
                      style={[styles.declineBtnText, { color: colors.error }]}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.acceptBtn,
                      { backgroundColor: colors.success },
                    ]}
                    onPress={async (e) => {
                      e.stopPropagation();
                      await businessService.acceptJob(job.id);
                      loadData();
                    }}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Active Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Jobs
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/business/(tabs)/bookings")}
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {activeJobs.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={40}
              color={colors.muted}
            />
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No active jobs at the moment
            </Text>
          </View>
        ) : (
          activeJobs.slice(0, 3).map((job) => {
            const statusStyle = JOB_STATUS_COLORS[job.status];
            return (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.activeJobCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  router.push(`/business/job-details?id=${job.id}`)
                }
              >
                <View style={styles.activeJobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.activeJobTitle, { color: colors.text }]}
                    >
                      {job.serviceType}
                    </Text>
                    <Text
                      style={[styles.activeJobClient, { color: colors.muted }]}
                    >
                      {job.clientName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusStyle.text }]}
                    >
                      {job.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>
                {job.assignedMemberName && (
                  <View style={styles.assignedRow}>
                    <Ionicons
                      name="person-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={[styles.assignedText, { color: colors.muted }]}
                    >
                      Assigned to {job.assignedMemberName}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
  },
  welcomeText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  businessName: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  notificationButton: {
    padding: 10,
    borderRadius: 50,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  statsGrid: {
    marginTop: 16,
    marginBottom: 20,
  },
  mainStatCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    ...THEME.shadow.card,
  },
  mainStatLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
  mainStatValue: {
    color: "white",
    fontSize: 32,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  pendingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "30%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  jobCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  clientName: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  jobPrice: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  jobDescription: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
    marginBottom: 10,
  },
  jobMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  jobActions: {
    flexDirection: "row",
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  declineBtnText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "white",
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
  activeJobCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  activeJobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  activeJobTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  activeJobClient: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
    textTransform: "uppercase",
  },
  assignedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  assignedText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  verifyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },
  verifyTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  verifyText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    opacity: 0.9,
  },
});
