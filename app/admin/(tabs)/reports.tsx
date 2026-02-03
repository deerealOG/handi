import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../../constants/theme";
import BarChartCard from "..//..//../components/BarChartCard"; // adjust this path if needed

export default function AdminReports() {
  const { colors } = useAppTheme();

  // Mock analytics data
  const monthlyRevenue = [
    50, 75, 90, 120, 150, 170, 210, 240, 270, 300, 280, 350,
  ];
  const userGrowth = [
    100, 140, 200, 260, 320, 410, 480, 560, 630, 720, 810, 900,
  ];

  const satisfactionRate = 92;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        📊 System Reports
      </Text>

      {/* Revenue Trend */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          styles.shadow,
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Monthly Revenue
        </Text>
        <BarChartCard data={monthlyRevenue} />
      </View>

      {/* User Growth Trend */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          styles.shadow,
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          User Growth (Clients & Artisans)
        </Text>
        <BarChartCard data={userGrowth} />
      </View>

      {/* System Performance Summary */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          styles.shadow,
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Performance Overview
        </Text>
        <View style={styles.row}>
          <View style={styles.metricBox}>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>
              Satisfaction
            </Text>
            <Text style={[styles.metricValue, { color: colors.success }]}>
              {satisfactionRate}%
            </Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>
              Avg Response Time
            </Text>
            <Text style={[styles.metricValue, { color: colors.error }]}>
              1.4s
            </Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>
              System Uptime
            </Text>
            <Text style={[styles.metricValue, { color: colors.secondary }]}>
              99.9%
            </Text>
          </View>
        </View>
      </View>

      {/* Insights Text */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          styles.shadow,
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Insights Summary
        </Text>
        <Text style={[styles.text, { color: colors.muted }]}>
          The HANDI platform continues to show positive growth in both revenue
          and user engagement. Monthly revenue has increased by 18% since last
          quarter, and the system uptime remains consistently above 99%.
          Customer satisfaction is stable, with an average rating of{" "}
          {satisfactionRate}% across all completed jobs. 🚀
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
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
    marginBottom: THEME.spacing.sm,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  text: {
    fontSize: THEME.typography.sizes.base,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: THEME.spacing.sm,
  },
  metricBox: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: THEME.typography.sizes.sm,
  },
  metricValue: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
  },
  shadow: {
    shadowColor: "rgba(147,51,234,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
