// app/artisan/(tabs)/jobs.tsx
// Artisan jobs screen with real service integration

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Booking, bookingService } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#DBEAFE', text: '#1D4ED8' },
  in_progress: { bg: '#E0E7FF', text: '#4338CA' },
  completed: { bg: '#D1FAE5', text: '#059669' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function ArtisanJobs() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalEarned: 0,
  });
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const loadJobs = useCallback(async () => {
    try {
      const artisanId = user?.id || 'artisan_001';
      
      const [bookingsResult, statsResult] = await Promise.all([
        bookingService.getBookings(artisanId, 'artisan'),
        bookingService.getBookingStats(artisanId, 'artisan'),
      ]);
      
      if (bookingsResult.success) {
        setJobs(bookingsResult.data || []);
      }
      if (statsResult.success && statsResult.data) {
        setStats({
          ...statsResult.data,
          totalEarned: statsResult.data.totalEarned || 0,
        });
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadJobs();
  }, [loadJobs]);

  const handleTabSwitch = (tab: "ongoing" | "completed") => {
    if (tab === activeTab) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAcceptJob = async (bookingId: string) => {
    Alert.alert("Accept Job", "Are you sure you want to accept this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          const result = await bookingService.updateBookingStatus(bookingId, 'accepted');
          if (result.success) {
            Alert.alert("Success", "Job accepted successfully!");
            loadJobs();
          } else {
            Alert.alert("Error", result.error || "Failed to accept job");
          }
        },
      },
    ]);
  };

  const handleDeclineJob = async (bookingId: string) => {
    Alert.alert("Decline Job", "Are you sure you want to decline this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          const result = await bookingService.updateBookingStatus(bookingId, 'cancelled');
          if (result.success) {
            loadJobs();
          }
        },
      },
    ]);
  };

  const handleStartJob = async (bookingId: string) => {
    const result = await bookingService.updateBookingStatus(bookingId, 'in_progress');
    if (result.success) {
      Alert.alert("Job Started", "You've started working on this job.");
      loadJobs();
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    Alert.alert(
      "Complete Job",
      "Mark this job as completed? The client will be notified and the review period will begin.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: async () => {
            const result = await bookingService.updateBookingStatus(bookingId, 'completed');
            if (result.success) {
              Alert.alert("Job Completed", "Great work! The payment will be released after the review period.");
              loadJobs();
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const ongoingJobs = jobs.filter(j => 
    j.status === 'pending' || j.status === 'accepted' || j.status === 'in_progress'
  );
  const completedJobs = jobs.filter(j => 
    j.status === 'completed' || j.status === 'cancelled'
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* --- Header Section --- */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Jobs</Text>
      </View>

      {/* --- Job Stats --- */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Total Jobs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.secondary + '20' }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{ongoingJobs.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Ongoing</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2196F3' + '15' }]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.completed}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Completed</Text>
        </View>
      </View>

      {/* --- Tab Header --- */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: colors.surface },
            activeTab === "ongoing" && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleTabSwitch("ongoing")}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.muted },
              activeTab === "ongoing" && { color: colors.onPrimary },
            ]}
          >
            Ongoing ({ongoingJobs.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: colors.surface },
            activeTab === "completed" && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleTabSwitch("completed")}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.muted },
              activeTab === "completed" && { color: colors.onPrimary },
            ]}
          >
            Completed ({completedJobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- Animated Tab Content --- */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView 
          style={styles.tabContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {(activeTab === "ongoing" ? ongoingJobs : completedJobs).length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialCommunityIcons 
                name={activeTab === "ongoing" ? "briefcase-clock-outline" : "briefcase-check-outline"} 
                size={48} 
                color={colors.muted} 
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No {activeTab === "ongoing" ? "Ongoing" : "Completed"} Jobs
              </Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                {activeTab === "ongoing" 
                  ? "New job requests will appear here" 
                  : "Your completed jobs will be shown here"}
              </Text>
            </View>
          ) : (
            (activeTab === "ongoing" ? ongoingJobs : completedJobs).map((job) => {
              const statusStyle = STATUS_COLORS[job.status] || STATUS_COLORS.pending;
              return (
                <View 
                  key={job.id} 
                  style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.jobHeader}>
                    <Image 
                      source={require("../../../assets/images/profileavatar.png")} 
                      style={styles.avatar} 
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.jobTitle, { color: colors.text }]}>{job.serviceType}</Text>
                      <Text style={[styles.clientName, { color: colors.muted }]}>
                        {job.client?.fullName || 'Client'}
                      </Text>
                      <Text style={[styles.dateText, { color: colors.muted }]}>
                        {formatDate(job.scheduledDate)} • {job.scheduledTime}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {job.status.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* Job Details */}
                  <View style={[styles.jobDetails, { borderTopColor: colors.border }]}>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color={colors.muted} />
                      <Text style={[styles.detailText, { color: colors.muted }]} numberOfLines={1}>
                        {job.address}, {job.city}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color={colors.primary} />
                      <Text style={[styles.priceText, { color: colors.primary }]}>
                        ₦{job.estimatedPrice.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  {job.status === 'pending' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.declineButton, { borderColor: colors.error }]}
                        onPress={() => handleDeclineJob(job.id)}
                      >
                        <Ionicons name="close" size={18} color={colors.error} />
                        <Text style={[styles.declineText, { color: colors.error }]}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: colors.success }]}
                        onPress={() => handleAcceptJob(job.id)}
                      >
                        <Ionicons name="checkmark" size={18} color="white" />
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {job.status === 'accepted' && (
                    <TouchableOpacity
                      style={[styles.startButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleStartJob(job.id)}
                    >
                      <MaterialCommunityIcons name="play" size={18} color="white" />
                      <Text style={styles.startButtonText}>Start Job</Text>
                    </TouchableOpacity>
                  )}

                  {job.status === 'in_progress' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.messageButton, { borderColor: colors.primary }]}
                        onPress={() => router.push(`/artisan/chat/${job.clientId || job.id}`)}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
                        <Text style={[styles.messageText, { color: colors.primary }]}>Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.completeButton, { backgroundColor: colors.success }]}
                        onPress={() => handleCompleteJob(job.id)}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="white" />
                        <Text style={styles.completeText}>Complete</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === "completed" && (
                    <TouchableOpacity
                      style={[styles.viewButton, { borderColor: colors.primary }]}
                      onPress={() => router.push(`/artisan/job-details?id=${job.id}`)}
                    >
                      <MaterialCommunityIcons name="eye" size={18} color={colors.text} />
                      <Text style={[styles.viewButtonText, { color: colors.text }]}>View Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: THEME.spacing.sm,
    marginTop: THEME.spacing.xl,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },
  statNumber: { 
    fontWeight: "700",
    fontSize: 16, 
    color: THEME.colors.text 
  },
  statLabel: { 
    fontSize: 12, 
    color: THEME.colors.muted, 
    marginTop: 2 
  },

  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    backgroundColor: "#f2f2f2",
  },
  tabText: { 
    color: THEME.colors.muted,
    fontWeight: "600" 
  },

  tabContainer: { 
    flex: 1, 
    padding: 12 
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
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
    textAlign: 'center',
  },
  
  jobCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  jobHeader: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12 
  },
  jobTitle: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: THEME.colors.text 
  },
  clientName: { 
    fontSize: 13, 
    color: THEME.colors.muted, 
    marginVertical: 2 
  },
  dateText: { 
    fontSize: 12, 
    color: THEME.colors.muted 
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
    textTransform: 'uppercase',
  },
  
  jobDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  declineText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  acceptText: {
    color: 'white',
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  startButtonText: {
    color: 'white',
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  messageText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeText: {
    color: 'white',
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  viewButtonText: {
    color: THEME.colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
});
