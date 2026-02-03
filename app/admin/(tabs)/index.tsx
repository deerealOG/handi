import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BarChartCard from "../../../components/BarChartCard";
import { THEME } from "../../../constants/theme";

export default function AdminDashboard() {
  const { colors } = useAppTheme();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.loaderText, { color: colors.text }]}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.secondary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Admin Dashboard 📊
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { title: "Total Users", value: stats.users, emoji: "👥" },
          { title: "Active Jobs", value: stats.activeJobs, emoji: "🧰" },
          { title: "Completed Jobs", value: stats.completedJobs, emoji: "✅" },
          { title: "Pending Disputes", value: stats.disputes, emoji: "⚠️" },
          { title: "Transactions", value: stats.transactions, emoji: "💳" },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: colors.surface },
              styles.shadow,
            ]}
          >
            <Text style={styles.cardEmoji}>{s.emoji}</Text>
            <Text style={[styles.cardValue, { color: colors.secondary }]}>
              {s.value}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.muted }]}>
              {s.title}
            </Text>
          </View>
        ))}
      </View>

      <BarChartCard data={stats.revenue} />

      <View
        style={[
          styles.overviewBox,
          { backgroundColor: colors.surface },
          styles.shadow,
        ]}
      >
        <Text style={[styles.overviewText, { color: colors.text }]}>
          HANDI connects clients and artisans efficiently while ensuring
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
  },
  contentContainer: {
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.lg, // Added extra top padding for better alignment
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  logoutButton: {
    padding: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    alignItems: "center", // Center content aligned
  },
  cardEmoji: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: "700",
    fontSize: THEME.typography.sizes.xl,
    textAlign: "center",
  },
  cardTitle: {
    textAlign: "center",
    marginTop: 4,
  },
  overviewBox: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  overviewText: {
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
