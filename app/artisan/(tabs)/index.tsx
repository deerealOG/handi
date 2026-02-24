// app/artisan/(tabs)/index.tsx — Provider Dashboard (mirrors web DashboardTab)
import {
    PROVIDER_BOOKINGS,
    PROVIDER_DASHBOARD_STATS,
    PROVIDER_TRANSACTIONS,
} from "@/constants/role-dashboard-data";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown
} from "react-native-reanimated";
import { THEME } from "../../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Icons mapping for stats
const STAT_ICONS: Record<
  string,
  { name: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  total_jobs: { name: "briefcase-outline", bg: "rgba(255,255,255,0.18)" },
  rating: { name: "star-outline", bg: "rgba(255,255,255,0.18)" },
  month: { name: "trending-up-outline", bg: "rgba(255,255,255,0.18)" },
  pending: { name: "time-outline", bg: "rgba(255,255,255,0.18)" },
};

const QUICK_ACTIONS = [
  {
    id: "services",
    label: "Add Service",
    icon: "add-circle-outline" as const,
    route: "/artisan/(tabs)/services",
  },
  {
    id: "earnings",
    label: "My Earnings",
    icon: "wallet-outline" as const,
    route: "/artisan/(tabs)/wallet",
  },
  {
    id: "bookings",
    label: "View Bookings",
    icon: "calendar-outline" as const,
    route: "/artisan/(tabs)/jobs",
  },
  {
    id: "profile",
    label: "Edit Profile",
    icon: "settings-outline" as const,
    route: "/artisan/(tabs)/profile",
  },
];

const RECENT_ACTIVITY = [
  {
    id: "a1",
    text: "New booking request from Adaobi Chen",
    time: "2 hours ago",
    icon: "notifications-outline" as const,
    color: "#F59E0B",
  },
  {
    id: "a2",
    text: "Payment received: ₦15,000 for Deep Cleaning",
    time: "5 hours ago",
    icon: "card-outline" as const,
    color: "#10B981",
  },
  {
    id: "a3",
    text: "Client left a 5★ review on Home Fumigation",
    time: "1 day ago",
    icon: "star-outline" as const,
    color: "#8B5CF6",
  },
  {
    id: "a4",
    text: "Service 'Kitchen Renovation' paused",
    time: "2 days ago",
    icon: "pause-circle-outline" as const,
    color: "#EF4444",
  },
];

// Performance chart (simple bar chart data)
const WEEKLY_BOOKINGS = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 7 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 6 },
  { day: "Sun", value: 1 },
];
const MAX_BAR = Math.max(...WEEKLY_BOOKINGS.map((d) => d.value));

export default function ArtisanHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const pendingBookings = PROVIDER_BOOKINGS.filter(
    (b) => b.status === "pending",
  );
  const recentTransactions = PROVIDER_TRANSACTIONS.slice(0, 3);

  const openBooking = (id: string) => {
    router.push({ pathname: "/artisan/job-details", params: { id } } as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "upcoming":
        return { bg: "#DBEAFE", text: "#2563EB" };
      case "confirmed":
        return { bg: "#D1FAE5", text: "#059669" };
      case "completed":
        return { bg: "#D1FAE5", text: "#059669" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#DC2626" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ─── Welcome Header ─── */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.welcomeSection}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Welcome back, {user?.firstName || "Provider"}! 👋
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.muted }]}>
              Here's what's happening with your services today.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notifButton, { backgroundColor: colors.surface }]}
            onPress={() => router.push("/artisan/notifications" as any)}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
            <View style={[styles.notifDot, { backgroundColor: "#EF4444" }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Stats Card (Green Gradient — mirrors web) ─── */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient
            colors={["#059669", "#065F46"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsGrid}>
              {PROVIDER_DASHBOARD_STATS.map((stat, i) => {
                const iconInfo = STAT_ICONS[stat.key] || STAT_ICONS.total_jobs;
                return (
                  <View key={stat.key} style={styles.statItem}>
                    <View
                      style={[
                        styles.statIconBox,
                        { backgroundColor: iconInfo.bg },
                      ]}
                    >
                      <Ionicons name={iconInfo.name} size={18} color="#fff" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ─── Quick Actions ─── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIconBox,
                    { backgroundColor: `${colors.primary}15` },
                  ]}
                >
                  <Ionicons
                    name={action.icon}
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ─── Pending Booking Requests ─── */}
        {pendingBookings.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.pulseDot} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  New Booking Requests
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#FFF7ED" }]}>
                <Text style={[styles.badgeText, { color: "#C2410C" }]}>
                  {pendingBookings.length} pending
                </Text>
              </View>
            </View>
            {pendingBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={[styles.bookingCard, { borderColor: colors.border }]}
                activeOpacity={0.8}
                onPress={() => openBooking(booking.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookingService, { color: colors.text }]}>
                    {booking.service}
                  </Text>
                  <Text style={[styles.bookingMeta, { color: colors.muted }]}>
                    {booking.client} · {booking.date} at {booking.time}
                  </Text>
                  <Text
                    style={[styles.bookingAmount, { color: colors.primary }]}
                  >
                    {booking.amount}
                  </Text>
                </View>
                <View style={styles.bookingActions}>
                  <TouchableOpacity
                    style={[styles.roundAction, { backgroundColor: "#FEE2E2" }]}
                    onPress={() =>
                      Alert.alert("Declined", "Booking request declined.")
                    }
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={16}
                      color="#DC2626"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roundAction, { backgroundColor: "#D1FAE5" }]}
                    onPress={() =>
                      Alert.alert("Accepted", "Booking request accepted!")
                    }
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#059669"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* ─── Weekly Performance ─── */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Weekly Performance
          </Text>
          <View style={styles.chartContainer}>
            {WEEKLY_BOOKINGS.map((d, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <Animated.View
                    entering={FadeInDown.delay(500 + i * 60).duration(600)}
                    style={[
                      styles.barFill,
                      {
                        height: `${(d.value / MAX_BAR) * 100}%`,
                        backgroundColor:
                          d.value === MAX_BAR
                            ? colors.primary
                            : `${colors.primary}60`,
                        borderRadius: 4,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.muted }]}>
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <Text style={[styles.chartLegendText, { color: colors.muted }]}>
              Total this week:{" "}
              <Text
                style={{
                  color: colors.text,
                  fontFamily: THEME.typography.fontFamily.heading,
                }}
              >
                28 bookings
              </Text>
            </Text>
          </View>
        </Animated.View>

        {/* ─── Recent Activity ─── */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          {RECENT_ACTIVITY.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                i < RECENT_ACTIVITY.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <Ionicons name={item.icon} size={16} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityText, { color: colors.text }]}>
                  {item.text}
                </Text>
                <Text style={[styles.activityTime, { color: colors.muted }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* ─── Recent Transactions ─── */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/artisan/(tabs)/wallet" as any)}
            >
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((tx) => (
            <View
              key={tx.id}
              style={[styles.txRow, { borderBottomColor: colors.border }]}
            >
              <View
                style={[
                  styles.txIcon,
                  {
                    backgroundColor:
                      tx.type === "credit" ? "#D1FAE5" : "#FEE2E2",
                  },
                ]}
              >
                <Ionicons
                  name={
                    tx.type === "credit"
                      ? "arrow-down-outline"
                      : "arrow-up-outline"
                  }
                  size={16}
                  color={tx.type === "credit" ? "#059669" : "#DC2626"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txTitle, { color: colors.text }]}>
                  {tx.title}
                </Text>
                <Text style={[styles.txDate, { color: colors.muted }]}>
                  {tx.date}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.type === "credit" ? "#059669" : "#DC2626" },
                ]}
              >
                {tx.amount}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* ─── Upcoming Bookings Summary ─── */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Upcoming Bookings
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/artisan/(tabs)/jobs" as any)}
            >
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {PROVIDER_BOOKINGS.filter(
            (b) => b.status === "upcoming" || b.status === "confirmed",
          ).map((booking) => {
            const sc = getStatusColor(booking.status);
            return (
              <TouchableOpacity
                key={booking.id}
                style={[
                  styles.upcomingRow,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => openBooking(booking.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.upcomingDate,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <Text
                    style={[styles.upcomingDateText, { color: colors.primary }]}
                  >
                    {booking.date.split("-")[2]}
                  </Text>
                  <Text
                    style={[
                      styles.upcomingMonthText,
                      { color: colors.primary },
                    ]}
                  >
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][parseInt(booking.date.split("-")[1]) - 1]
                    }
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookingService, { color: colors.text }]}>
                    {booking.service}
                  </Text>
                  <Text style={[styles.bookingMeta, { color: colors.muted }]}>
                    {booking.client} · {booking.time}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.text }]}>
                    {booking.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: Platform.OS === "ios" ? 56 : 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 16,
  },

  // Welcome
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  welcomeTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...THEME.shadow.card,
  },
  notifDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Stats Gradient
  statsGradient: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    ...THEME.shadow.card,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  statItem: {
    width: "50%",
    paddingHorizontal: 4,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Card (shared)
  card: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    width: (SCREEN_WIDTH - 32 - 40 - 10) / 2,
    borderRadius: THEME.radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },

  // Pending Bookings
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F97316",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  bookingCard: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingService: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  bookingMeta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  bookingAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  bookingActions: {
    flexDirection: "row",
    gap: 6,
  },
  roundAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // Weekly Chart
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  barTrack: {
    width: 24,
    height: 80,
    justifyContent: "flex-end",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
  },
  barLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  chartLegend: {
    marginTop: 12,
    alignItems: "center",
  },
  chartLegendText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Activity
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Transactions
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  txTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: 2,
  },
  txDate: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  txAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Upcoming Bookings
  upcomingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  upcomingDate: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingDateText: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  upcomingMonthText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: -2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textTransform: "capitalize",
  },
});
