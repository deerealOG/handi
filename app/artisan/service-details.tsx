import { PROVIDER_SERVICES } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function ArtisanServiceDetailsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const service = PROVIDER_SERVICES.find((item) => item.id === id) ?? PROVIDER_SERVICES[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Service Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
          <Text style={[styles.category, { color: colors.muted }]}>{service.category}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Price</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{service.price}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Bookings</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{service.bookings}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Rating</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{service.rating}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    service.status === "active" ? colors.successLight : colors.warningLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: service.status === "active" ? colors.success : colors.warning,
                  },
                ]}
              >
                {service.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => router.push("/artisan/edit-profile" as any)}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Edit Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/artisan/(tabs)/jobs" as any)}
          >
            <Text style={[styles.primaryBtnText, { color: colors.onPrimary }]}>View Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  headerSpacer: {
    width: 34,
    height: 34,
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  serviceName: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  category: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  metricItem: {
    flex: 1,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "rgba(17, 24, 39, 0.03)",
  },
  metricLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  metricValue: {
    marginTop: 3,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textTransform: "capitalize",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  primaryBtnText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
