import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BarChartCard from "../../../components/BarChartCard";
import { THEME } from "../../../constants/theme";


export default function AdminDashboard() {
  const stats = {
    users: 1240,
    activeJobs: 328,
    completedJobs: 2845,
    disputes: 12,
    transactions: "₦1.45M",
    revenue: [12, 18, 9, 22, 27, 15, 19],
  };

  const loading = false;
  const refreshing = false;

  const onRefresh = () => {};

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={THEME.colors.admin} />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[THEME.colors.admin]}
        />
      }
    >
      <Text style={styles.title}>Admin Dashboard 📊</Text>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { title: "Total Users", value: stats.users, emoji: "👥" },
          { title: "Active Jobs", value: stats.activeJobs, emoji: "🧰" },
          { title: "Completed Jobs", value: stats.completedJobs, emoji: "✅" },
          { title: "Pending Disputes", value: stats.disputes, emoji: "⚠️" },
          { title: "Transactions", value: stats.transactions, emoji: "💳" },
        ].map((s, i) => (
          <View key={i} style={[styles.card, styles.shadow]}>
            <Text style={styles.cardEmoji}>{s.emoji}</Text>
            <Text style={styles.cardValue}>{s.value}</Text>
            <Text style={styles.cardTitle}>{s.title}</Text>
          </View>
        ))}
      </View>

      <BarChartCard data={stats.revenue} />

      <View style={[styles.overviewBox, styles.shadow]}>
        <Text style={styles.overviewText}>
          FIXIT connects clients and artisans efficiently while ensuring
          transparency through admin oversight. System uptime is stable, and
          user engagement continues to grow steadily. 🚀
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  contentContainer: {
    padding: THEME.spacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
  },
  loaderText: {
    color: THEME.colors.text,
    marginTop: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: THEME.colors.white,
    width: "48%",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  cardEmoji: {
    fontSize: 30,
    textAlign: "center",
  },
  cardValue: {
    color: THEME.colors.admin,
    fontWeight: "700",
    fontSize: THEME.typography.sizes.xl,
    textAlign: "center",
  },
  cardTitle: {
    color: THEME.colors.muted,
    textAlign: "center",
    marginTop: 4,
  },
  overviewBox: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  overviewText: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
    lineHeight: 22,
  },
  shadow: {
    shadowColor: "rgba(28,140,75,0.6)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
