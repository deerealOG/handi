import {
  ADMIN_ACTIVITY,
  ADMIN_DECISION_LOG,
  ADMIN_PLATFORM_STATS,
} from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const OVERVIEW_STATS = [
  { id: "users", label: "Total Users", value: ADMIN_PLATFORM_STATS.totalUsers.toLocaleString(), icon: "people-outline" as const },
  { id: "providers", label: "Providers", value: ADMIN_PLATFORM_STATS.totalProviders.toLocaleString(), icon: "briefcase-outline" as const },
  { id: "bookings", label: "Bookings", value: ADMIN_PLATFORM_STATS.totalBookings.toLocaleString(), icon: "calendar-outline" as const },
  { id: "revenue", label: "Revenue", value: ADMIN_PLATFORM_STATS.revenue, icon: "trending-up-outline" as const },
];

export default function AdminOverviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Platform overview and management</Text>
        </View>

        <View style={styles.statsGrid}>
          {OVERVIEW_STATS.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={stat.icon} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.alertRow}>
          <TouchableOpacity
            style={[styles.alertCard, { backgroundColor: colors.errorLight }]}
            onPress={() => router.push("/admin/(tabs)/disputes" as any)}
          >
            <Text style={[styles.alertTitle, { color: colors.error }]}>Active Disputes</Text>
            <Text style={[styles.alertCount, { color: colors.error }]}>{ADMIN_PLATFORM_STATS.activeDisputes}</Text>
            <Text style={[styles.alertMeta, { color: colors.error }]}>Requires immediate attention</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alertCard, { backgroundColor: colors.warningLight }]}
            onPress={() => router.push("/admin/(tabs)/users" as any)}
          >
            <Text style={[styles.alertTitle, { color: colors.warning }]}>Pending Providers</Text>
            <Text style={[styles.alertCount, { color: colors.warning }]}>{ADMIN_PLATFORM_STATS.pendingProviders}</Text>
            <Text style={[styles.alertMeta, { color: colors.warning }]}>Awaiting verification</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Decision Log</Text>
          {ADMIN_DECISION_LOG.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.rowItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push("/admin/(tabs)/reports" as any)}
            >
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
              <Text style={[styles.rowText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          {ADMIN_ACTIVITY.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.rowItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push("/admin/(tabs)/jobs" as any)}
            >
              <Ionicons name="pulse-outline" size={14} color={colors.muted} />
              <Text style={[styles.rowText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>More Admin Tools</Text>
          <View style={styles.toolsGrid}>
            {[
              { id: "payouts", label: "Payouts", icon: "card-outline", route: "/admin/(tabs)/payouts" },
              { id: "withdrawals", label: "Withdrawals", icon: "wallet-outline", route: "/admin/(tabs)/withdrawals" },
              { id: "wallets", label: "Wallets", icon: "apps-outline", route: "/admin/(tabs)/wallets" },
              { id: "transactions", label: "Transactions", icon: "swap-horizontal-outline", route: "/admin/(tabs)/transactions" },
              { id: "reports", label: "Reports", icon: "bar-chart-outline", route: "/admin/(tabs)/reports" },
            ].map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                onPress={() => router.push(tool.route as any)}
              >
                <Ionicons name={tool.icon as any} size={14} color={colors.primary} />
                <Text style={[styles.toolBtnText, { color: colors.text }]}>{tool.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 14,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: 12,
    ...THEME.shadow.card,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  alertRow: {
    flexDirection: "row",
    gap: 8,
  },
  alertCard: {
    flex: 1,
    borderRadius: THEME.radius.lg,
    padding: 12,
  },
  alertTitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  alertCount: {
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
    marginVertical: 2,
  },
  alertMeta: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toolBtn: {
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toolBtnText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});
