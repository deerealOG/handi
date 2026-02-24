import { ADMIN_SERVICE_CATEGORIES } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
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

export default function AdminServicesScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const totals = {
    categories: ADMIN_SERVICE_CATEGORIES.length,
    services: ADMIN_SERVICE_CATEGORIES.reduce((sum, c) => sum + c.services, 0),
    providers: ADMIN_SERVICE_CATEGORIES.reduce((sum, c) => sum + c.providers, 0),
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Service Categories</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Manage platform services and categories</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/admin/(tabs)/reports" as any)}
          >
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>+ Add Category</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{totals.categories}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Categories</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{totals.services}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Total Services</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{totals.providers}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Active Providers</Text>
          </View>
        </View>

        <View style={styles.cardsWrap}>
          {ADMIN_SERVICE_CATEGORIES.map((category) => (
            <View key={category.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <View style={styles.cardHeader}>
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        category.status === "active"
                          ? colors.successLight
                          : colors.warningLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          category.status === "active"
                            ? colors.success
                            : colors.warning,
                      },
                    ]}
                  >
                    {category.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metrics}>
                <Text style={[styles.metricText, { color: colors.muted }]}>Services: {category.services}</Text>
                <Text style={[styles.metricText, { color: colors.muted }]}>Providers: {category.providers}</Text>
                <Text style={[styles.metricText, { color: colors.text }]}>Avg. Price: {category.avgPrice}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.secondaryAction, { borderColor: colors.border }]}
                  onPress={() => router.push("/admin/(tabs)/reports" as any)}
                >
                  <Text style={[styles.secondaryActionText, { color: colors.text }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryAction, { backgroundColor: colors.primaryLight }]}
                  onPress={() => router.push("/admin/(tabs)/jobs" as any)}
                >
                  <Text style={[styles.primaryActionText, { color: colors.primary }]}>View Services</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  addButton: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    paddingVertical: 10,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  statValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  cardsWrap: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    textTransform: "capitalize",
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  metrics: {
    gap: 3,
    marginBottom: 10,
  },
  metricText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingVertical: 8,
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  primaryAction: {
    flex: 1.2,
    borderRadius: THEME.radius.pill,
    paddingVertical: 8,
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
