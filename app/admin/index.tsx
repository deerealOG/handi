// app/admin/index.tsx
// Admin Dashboard Home

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";

interface StatCard {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: string;
}

const stats: StatCard[] = [
  {
    label: "Total Users",
    value: "1,234",
    icon: "people",
    color: "#3B82F6",
    trend: "+12%",
  },
  {
    label: "Active Jobs",
    value: "89",
    icon: "briefcase",
    color: "#10B981",
    trend: "+5%",
  },
  {
    label: "Open Disputes",
    value: "7",
    icon: "alert-circle",
    color: "#EF4444",
    trend: "-2",
  },
  {
    label: "Pending Verifications",
    value: "23",
    icon: "shield-checkmark",
    color: "#F59E0B",
  },
  {
    label: "Revenue (This Month)",
    value: "₦2.4M",
    icon: "wallet",
    color: "#8B5CF6",
    trend: "+18%",
  },
  {
    label: "Completed Jobs",
    value: "456",
    icon: "checkmark-circle",
    color: "#06B6D4",
  },
];

export default function AdminDashboard() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Admin Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Welcome back, Admin
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: stat.color + "20" },
              ]}
            >
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {stat.label}
              </Text>
            </View>
            {stat.trend && (
              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor: stat.trend.startsWith("+")
                      ? "#10B98120"
                      : "#EF444420",
                  },
                ]}
              >
                <Text
                  style={{
                    color: stat.trend.startsWith("+") ? "#10B981" : "#EF4444",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {stat.trend}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <View
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.actionLabel, { color: colors.text }]}>
              Review Verifications
            </Text>
          </View>
          <View
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            <Text style={[styles.actionLabel, { color: colors.text }]}>
              Resolve Disputes
            </Text>
          </View>
          <View
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="analytics-outline" size={32} color="#8B5CF6" />
            <Text style={[styles.actionLabel, { color: colors.text }]}>
              View Reports
            </Text>
          </View>
          <View
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="megaphone-outline" size={32} color="#F59E0B" />
            <Text style={[styles.actionLabel, { color: colors.text }]}>
              Send Notification
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flexBasis: "30%",
    flexGrow: 1,
    minWidth: 200,
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  actionCard: {
    flexBasis: "22%",
    minWidth: 150,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
