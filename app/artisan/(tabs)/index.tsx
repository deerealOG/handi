import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { THEME } from "../../../constants/theme";
import { Job } from "../types";

// Conditionally import web header
let WebHeader: React.ComponentType<{
  title?: string;
  showSearch?: boolean;
}> | null = null;
if (Platform.OS === "web") {
  WebHeader = require("@/components/web/WebHeader").WebHeader;
}

export default function ArtisanHomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const [isOnline, setIsOnline] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade and slide animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Modal slide animation
  useEffect(() => {
    Animated.timing(modalSlide, {
      toValue: showModal ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showModal, modalSlide]);

  const slideUp = modalSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [250, 0],
  });

  const handleAcceptPress = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setTimeout(() => {
      alert(`✅ You’ve successfully accepted the job: "${selectedJob?.title}"`);
      // In a real app, this would move the job to the active jobs list
    }, 300);
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.jobCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() =>
          router.push({
            pathname: "/artisan/job-details",
            params: { id: item.id },
          })
        }
      >
        <View
          style={[
            styles.jobIconContainer,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.jobTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.jobLocation, { color: colors.muted }]}>
            {item.location}
          </Text>
        </View>

        <View style={styles.jobAmountContainer}>
          <Text style={[styles.jobAmount, { color: colors.primary }]}>
            {item.amount}
          </Text>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAcceptPress(item)}
          >
            <Text
              style={[styles.acceptButtonText, { color: colors.onPrimary }]}
            >
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const availableJobs: Job[] = [
    {
      id: "1",
      title: "Fix leaking kitchen sink",
      location: "Victoria Island, Lagos",
      amount: "₦5,000",
      icon: "wrench-outline",
    },
    {
      id: "2",
      title: "Electrical socket installation",
      location: "Yaba, Lagos",
      amount: "₦7,500",
      icon: "flash-outline",
    },
    {
      id: "3",
      title: "Repaint 2-bedroom apartment",
      location: "Surulere, Lagos",
      amount: "₦15,000",
      icon: "format-paint",
    },
  ];

  return (
    <View style={[styles.webContainer, { backgroundColor: colors.background }]}>
      {/* Web Header */}
      {isWeb && WebHeader && <WebHeader title="Dashboard" showSearch={true} />}

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background },
          isWeb && styles.containerWeb,
        ]}
        contentContainerStyle={[
          { paddingBottom: 100 },
          isWeb && styles.contentWeb,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Header - hidden on web */}
        {!isWeb && (
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.welcomeText, { color: colors.muted }]}>
                  Welcome back,
                </Text>
                <Text style={[styles.nameText, { color: colors.text }]}>
                  Golden Amadi
                </Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => router.push("/artisan/notifications")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={colors.text}
                  />
                  <View
                    style={[styles.badge, { borderColor: colors.surface }]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => router.push("/artisan/messages")}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={22}
                    color={colors.text}
                  />
                  <View
                    style={[styles.badge, { borderColor: colors.surface }]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/artisan/profile")}
                >
                  <Image
                    source={require("../../../assets/images/profileavatar.png")}
                    style={[styles.avatar, { borderColor: colors.surface }]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Online Toggle */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOnline ? colors.primary : "#ccc" },
                ]}
              />
              <Text style={[styles.statusText, { color: colors.text }]}>
                {isOnline ? "You're Online" : "You're Offline"}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              thumbColor={isOnline ? colors.primary : "#ccc"}
              trackColor={{ false: "#ccc", true: colors.primary + "50" }}
            />
          </View>
        </View>

        {/* Stats Summary */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIconBg,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Earnings
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ₦35,000
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIconBg,
                { backgroundColor: "rgba(245, 124, 0, 0.1)" },
              ]}
            >
              <MaterialCommunityIcons
                name="briefcase-check-outline"
                size={24}
                color="#F57C00"
              />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Jobs Done
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                12
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIconBg,
                { backgroundColor: "rgba(33, 150, 243, 0.1)" },
              ]}
            >
              <MaterialCommunityIcons
                name="star-outline"
                size={24}
                color="#2196F3"
              />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Rating
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                4.8
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/artisan/calendar")}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#F3E5F5" }]}
              >
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={24}
                  color="#9C27B0"
                />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Calendar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/artisan/promote")}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#E0F7FA" }]}
              >
                <MaterialCommunityIcons
                  name="bullhorn-outline"
                  size={24}
                  color="#00BCD4"
                />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Promote
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/artisan/help")}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#FFEBEE" }]}
              >
                <MaterialCommunityIcons
                  name="headset"
                  size={24}
                  color="#E91E63"
                />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Support
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Active Job */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Job
          </Text>
          <TouchableOpacity
            style={[
              styles.activeJobCard,
              { backgroundColor: colors.primaryDark },
            ]}
            onPress={() => router.push("/artisan/job-details?id=active1")}
          >
            <View style={styles.activeJobHeader}>
              <View style={styles.activeJobBadge}>
                <Text style={styles.activeJobBadgeText}>IN PROGRESS</Text>
              </View>
              <Text style={styles.activeJobTime}>Due: 2:00 PM</Text>
            </View>

            <Text style={styles.activeJobTitle}>Bathroom Pipe Repair</Text>
            <View style={styles.activeJobLocationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.activeJobLocation}>Lekki Phase 1, Lagos</Text>
            </View>

            <View style={styles.activeJobFooter}>
              <View style={styles.activeJobClient}>
                <Image
                  source={require("../../../assets/images/profileavatar.png")}
                  style={styles.activeJobAvatar}
                />
                <Text style={styles.activeJobClientName}>Golden Amadi</Text>
              </View>
              <Text style={styles.activeJobAmount}>₦8,000</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Available Jobs */}
        <View style={styles.availableJobContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.availableJobTitle, { color: colors.text }]}>
              Available Jobs
            </Text>
            <TouchableOpacity onPress={() => router.push("/artisan/jobs")}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableJobs}
            keyExtractor={(item) => item.id}
            renderItem={renderJobCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            scrollEnabled={false}
          />
        </View>

        {/* Accept Job Modal */}
        <Modal transparent visible={showModal} animationType="none">
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideUp }],
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Accept Job Request
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalText, { color: colors.muted }]}>
                Are you sure you want to accept this job? This will notify the
                client immediately.
              </Text>

              {selectedJob && (
                <View
                  style={[
                    styles.modalJobDetails,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.modalJobRow}>
                    <MaterialCommunityIcons
                      name={selectedJob.icon as any}
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={[styles.modalJobTitle, { color: colors.text }]}
                    >
                      {selectedJob.title}
                    </Text>
                  </View>
                  <Text style={[styles.modalJobInfo, { color: colors.muted }]}>
                    {selectedJob.location}
                  </Text>
                  <View
                    style={[
                      styles.modalDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />
                  <View style={styles.modalPriceRow}>
                    <Text
                      style={[styles.modalPriceLabel, { color: colors.muted }]}
                    >
                      Estimated Earnings
                    </Text>
                    <Text
                      style={[styles.modalJobAmount, { color: colors.primary }]}
                    >
                      {selectedJob.amount}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={() => setShowModal(false)}
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleConfirm}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Accept Job
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  containerWeb: {
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  contentWeb: {
    maxWidth: 1200,
    paddingBottom: 48,
  },

  // Header
  header: {
    marginBottom: 20,
    marginTop: 20,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.error,
    borderWidth: 1,
    borderColor: "#fff",
  },
  welcomeText: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    fontSize: 14,
  },
  nameText: {
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Status Card
  statusCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
    ...THEME.shadow.base,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: 14,
  },

  // Stats
  statsScroll: {
    marginBottom: 24,
    overflow: "visible",
  },
  statsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    width: 150,
    gap: 12,
  },
  summaryIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    color: THEME.colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.text,
  },

  // Quick Actions
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsScroll: {
    gap: 16,
  },
  quickActionButton: {
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  seeAllText: {
    color: THEME.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  // Active Job Card (Premium)
  activeJobCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 20,
    padding: 20,
    ...THEME.shadow.card,
  },
  activeJobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activeJobBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeJobBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  activeJobTime: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  activeJobTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#fff",
    marginBottom: 4,
  },
  activeJobLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  activeJobLocation: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  activeJobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 16,
  },
  activeJobClient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeJobAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
  activeJobClientName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  activeJobAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  // Available Jobs
  availableJobContainer: {
    flex: 1,
  },
  availableJobTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    ...THEME.shadow.base,
  },
  jobIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(28,140,75,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 13,
    color: THEME.colors.muted,
  },
  jobAmountContainer: {
    alignItems: "flex-end",
  },
  jobAmount: {
    fontWeight: "700",
    color: THEME.colors.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
  },
  modalText: {
    color: THEME.colors.muted,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalJobDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  modalJobRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  modalJobTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: THEME.colors.text,
  },
  modalJobInfo: {
    color: THEME.colors.muted,
    fontSize: 13,
    marginLeft: 28,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  modalPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalPriceLabel: {
    color: THEME.colors.muted,
    fontSize: 13,
  },
  modalJobAmount: {
    color: THEME.colors.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  modalButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
