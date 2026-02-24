import { PROVIDER_BOOKINGS, ProviderBookingStatus } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const FILTERS: ("all" | ProviderBookingStatus)[] = [
  "all",
  "pending",
  "upcoming",
  "completed",
  "cancelled",
];

const statusColor = (status: ProviderBookingStatus, colors: any) => {
  if (status === "pending") return { bg: colors.warningLight, fg: colors.warning };
  if (status === "completed") return { bg: colors.successLight, fg: colors.success };
  if (status === "cancelled") return { bg: colors.errorLight, fg: colors.error };
  return { bg: colors.primaryLight, fg: colors.primary };
};

export default function ArtisanBookingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const bookings = useMemo(() => {
    return filter === "all"
      ? PROVIDER_BOOKINGS
      : PROVIDER_BOOKINGS.filter((b) => b.status === filter);
  }, [filter]);

  const openBooking = (id: string) => {
    router.push({ pathname: "/artisan/job-details", params: { id } } as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bookings</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((value) => {
          const active = value === filter;
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.filterPill,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(value)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: active ? colors.onPrimary : colors.text },
                ]}
              >
                {value === "all"
                  ? "All"
                  : value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {bookings.map((booking) => {
          const badge = statusColor(booking.status, colors);
          return (
            <TouchableOpacity
              key={booking.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => openBooking(booking.id)}
              activeOpacity={0.92}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.service, { color: colors.text }]}>{booking.service}</Text>
                  <Text style={[styles.meta, { color: colors.muted }]}>{booking.client}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.fg }]}>{booking.status.replace("_", " ")}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={13} color={colors.muted} />
                  <Text style={[styles.detailText, { color: colors.muted }]}>{booking.date} at {booking.time}</Text>
                </View>
                <Text style={[styles.amount, { color: colors.text }]}>{booking.amount}</Text>
              </View>

              {booking.status === "pending" && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: colors.error }]}
                    onPress={() =>
                      Alert.alert(
                        "Decline booking",
                        "Booking request declined.",
                      )
                    }
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.error }]}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={() => openBooking(booking.id)}
                  >
                    <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 8,
    paddingBottom: 10,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 36,
    justifyContent: "center",
  },
  filterText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  service: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  meta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statusBadge: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textTransform: "capitalize",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  amount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  primaryButton: {
    flex: 1,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    paddingVertical: 8,
  },
  primaryButtonText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
