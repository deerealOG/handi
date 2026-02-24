// app/admin/(tabs)/index.tsx — Admin Overview (mirrors web AdminDashboard OverviewTab)
import {
    ADMIN_ACTIVITY,
    ADMIN_BOOKINGS,
    ADMIN_PLATFORM_STATS
} from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OVERVIEW_STATS = [
  {
    id: "users",
    label: "Total Users",
    value: ADMIN_PLATFORM_STATS.totalUsers.toLocaleString(),
    icon: "people-outline" as const,
    gradient: ["#7C3AED", "#4338CA"] as [string, string],
    change: "+12%",
  },
  {
    id: "providers",
    label: "Providers",
    value: ADMIN_PLATFORM_STATS.totalProviders.toLocaleString(),
    icon: "briefcase-outline" as const,
    gradient: ["#10B981", "#0D9488"] as [string, string],
    change: "+8%",
  },
  {
    id: "bookings",
    label: "Bookings",
    value: ADMIN_PLATFORM_STATS.totalBookings.toLocaleString(),
    icon: "calendar-outline" as const,
    gradient: ["#3B82F6", "#0891B2"] as [string, string],
    change: "+15%",
  },
  {
    id: "revenue",
    label: "Revenue",
    value: ADMIN_PLATFORM_STATS.revenue,
    icon: "trending-up-outline" as const,
    gradient: ["#F59E0B", "#EA580C"] as [string, string],
    change: "+22%",
  },
];

const DECISION_LOG = [
  {
    action: "Approved provider",
    target: "CleanPro Services",
    time: "2 min ago",
    emoji: "✅",
  },
  {
    action: "Resolved dispute",
    target: "#DSP-1089",
    time: "28 min ago",
    emoji: "🔧",
  },
  {
    action: "Issued refund",
    target: "₦40,000 to Fatima",
    time: "1 hr ago",
    emoji: "💰",
  },
  {
    action: "Suspended user",
    target: "bad_actor_99",
    time: "3 hrs ago",
    emoji: "🚫",
  },
  {
    action: "Verified provider",
    target: "AutoCare Mechanics",
    time: "5 hrs ago",
    emoji: "✅",
  },
];

const QUICK_MANAGE = [
  {
    id: "users",
    label: "Users",
    icon: "people-outline" as const,
    route: "/admin/(tabs)/users",
  },
  {
    id: "disputes",
    label: "Disputes",
    icon: "warning-outline" as const,
    route: "/admin/(tabs)/disputes",
  },
  {
    id: "services",
    label: "Services",
    icon: "grid-outline" as const,
    route: "/admin/(tabs)/services",
  },
  {
    id: "payouts",
    label: "Payouts",
    icon: "card-outline" as const,
    route: "/admin/(tabs)/payouts",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: "swap-horizontal-outline" as const,
    route: "/admin/(tabs)/transactions",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "bar-chart-outline" as const,
    route: "/admin/(tabs)/reports",
  },
];

export default function AdminOverviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ─── Header ─── */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              Admin Dashboard
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Platform overview and management
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.surface }]}
            onPress={() => router.push("/admin/notifications" as any)}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
            <View style={[styles.notifDot, { backgroundColor: "#EF4444" }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Stats Grid (Individual gradient cards) ─── */}
        <View style={styles.statsGrid}>
          {OVERVIEW_STATS.map((stat, i) => (
            <Animated.View
              key={stat.id}
              entering={FadeInDown.delay(100 + i * 80).duration(500)}
              style={styles.statWrapper}
            >
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                {/* Background icon (decorative) */}
                <View style={styles.statBgIcon}>
                  <Ionicons
                    name={stat.icon}
                    size={48}
                    color="rgba(255,255,255,0.1)"
                  />
                </View>
                {/* Top row: icon + change */}
                <View style={styles.statTopRow}>
                  <View style={styles.statIconBox}>
                    <Ionicons name={stat.icon} size={16} color="#fff" />
                  </View>
                  <View style={styles.changeBadge}>
                    <Ionicons name="arrow-up" size={10} color="#fff" />
                    <Text style={styles.changeText}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* ─── Alert Cards ─── */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.alertRow}
        >
          <TouchableOpacity
            style={[
              styles.alertCard,
              { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
            ]}
            onPress={() => router.push("/admin/(tabs)/disputes" as any)}
            activeOpacity={0.7}
          >
            <View style={styles.alertTop}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.alertTitle}>Active Disputes</Text>
            </View>
            <Text style={[styles.alertCount, { color: "#B91C1C" }]}>
              {ADMIN_PLATFORM_STATS.activeDisputes}
            </Text>
            <Text style={styles.alertMeta}>Requires immediate attention</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.alertCard,
              { backgroundColor: "#FEFCE8", borderColor: "#FEF08A" },
            ]}
            onPress={() => router.push("/admin/(tabs)/users" as any)}
            activeOpacity={0.7}
          >
            <View style={styles.alertTop}>
              <Ionicons name="time-outline" size={20} color="#CA8A04" />
              <Text style={[styles.alertTitle, { color: "#A16207" }]}>
                Pending Providers
              </Text>
            </View>
            <Text style={[styles.alertCount, { color: "#A16207" }]}>
              {ADMIN_PLATFORM_STATS.pendingProviders}
            </Text>
            <Text style={[styles.alertMeta, { color: "#CA8A04" }]}>
              Awaiting verification
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Quick Management ─── */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Quick Management
          </Text>
          <View style={styles.manageGrid}>
            {QUICK_MANAGE.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.manageBtn,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.manageBtnIcon,
                    { backgroundColor: `${colors.primary}15` },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.manageBtnLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ─── Admin Decision Log ─── */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeaderRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#7C3AED"
              />
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, marginBottom: 0 },
                ]}
              >
                Decision Log
              </Text>
            </View>
            <View
              style={[styles.metaBadge, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.metaBadgeText, { color: colors.muted }]}>
                Last 5 actions
              </Text>
            </View>
          </View>
          {DECISION_LOG.map((item, i) => (
            <View
              key={i}
              style={[
                styles.logRow,
                i < DECISION_LOG.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={styles.logEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.logAction, { color: colors.text }]}>
                  {item.action} —{" "}
                  <Text
                    style={{
                      fontFamily: THEME.typography.fontFamily.bodyMedium,
                    }}
                  >
                    {item.target}
                  </Text>
                </Text>
                <Text style={[styles.logTime, { color: colors.muted }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* ─── Recent Activity ─── */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          {ADMIN_ACTIVITY.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.actRow,
                i < ADMIN_ACTIVITY.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => router.push("/admin/(tabs)/reports" as any)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actDot,
                  { backgroundColor: i < 2 ? colors.primary : colors.muted },
                ]}
              />
              <Text style={[styles.actText, { color: colors.text }]}>
                {item}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ─── Recent Bookings Snapshot ─── */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[
                styles.cardTitle,
                { color: colors.text, marginBottom: 0 },
              ]}
            >
              Recent Bookings
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/admin/(tabs)/jobs" as any)}
            >
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {ADMIN_BOOKINGS.slice(0, 3).map((b, i) => {
            const statusColors: Record<string, { bg: string; text: string }> = {
              confirmed: { bg: "#D1FAE5", text: "#059669" },
              pending: { bg: "#FEF3C7", text: "#D97706" },
              completed: { bg: "#DBEAFE", text: "#2563EB" },
              disputed: { bg: "#FEE2E2", text: "#DC2626" },
            };
            const sc = statusColors[b.status] || {
              bg: "#F3F4F6",
              text: "#6B7280",
            };
            return (
              <View
                key={b.id}
                style={[
                  styles.bookingRow,
                  i < 2 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookingService, { color: colors.text }]}>
                    {b.service}
                  </Text>
                  <Text style={[styles.bookingMeta, { color: colors.muted }]}>
                    {b.client} → {b.provider}
                  </Text>
                  <Text style={[styles.bookingDate, { color: colors.muted }]}>
                    {b.date} · {b.time}
                  </Text>
                </View>
                <View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: sc.bg }]}
                  >
                    <Text style={[styles.statusText, { color: sc.text }]}>
                      {b.status}
                    </Text>
                  </View>
                  <Text style={[styles.bookingAmount, { color: colors.text }]}>
                    {b.amount}
                  </Text>
                </View>
              </View>
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

  // Header
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  notifBtn: {
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

  // Stats Grid
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statWrapper: { width: (SCREEN_WIDTH - 32 - 8) / 2 },
  statCard: {
    borderRadius: THEME.radius.xl,
    padding: 16,
    overflow: "hidden",
  },
  statBgIcon: { position: "absolute", top: -4, right: -4 },
  statTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: THEME.radius.lg,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.pill,
  },
  changeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },

  // Alert
  alertRow: { flexDirection: "row", gap: 8 },
  alertCard: {
    flex: 1,
    borderRadius: THEME.radius.xl,
    padding: 14,
    borderWidth: 1,
  },
  alertTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: "#991B1B",
  },
  alertCount: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 2,
  },
  alertMeta: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#DC2626",
  },

  // Card
  card: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Quick Manage
  manageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  manageBtn: {
    width: (SCREEN_WIDTH - 32 - 32 - 16) / 3,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  manageBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  manageBtnLabel: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },

  // Decision Log
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.pill,
  },
  metaBadgeText: { fontSize: 10, fontFamily: THEME.typography.fontFamily.body },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  logEmoji: { fontSize: 18 },
  logAction: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  logTime: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Activity
  actRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  actDot: { width: 6, height: 6, borderRadius: 3 },
  actText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Bookings
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  bookingService: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  bookingMeta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  bookingDate: { fontSize: 10, fontFamily: THEME.typography.fontFamily.body },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.pill,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textTransform: "capitalize",
  },
  bookingAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "right",
    marginTop: 4,
  },
});
