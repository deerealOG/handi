import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
  PROVIDER_BOOKINGS,
  PROVIDER_DASHBOARD_STATS,
} from "@/constants/role-dashboard-data";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const QUICK_ACTIONS = [
  { id: "services", label: "Add Service", icon: "add-circle-outline" as const, route: "/artisan/(tabs)/services" },
  { id: "earnings", label: "My Earnings", icon: "wallet-outline" as const, route: "/artisan/(tabs)/wallet" },
  { id: "bookings", label: "View Bookings", icon: "calendar-outline" as const, route: "/artisan/(tabs)/jobs" },
  { id: "profile", label: "Edit Profile", icon: "settings-outline" as const, route: "/artisan/(tabs)/profile" },
];

export default function ArtisanHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const pendingBookings = PROVIDER_BOOKINGS.filter((b) => b.status === "pending");

  const openBooking = (id: string) => {
    router.push({ pathname: "/artisan/job-details", params: { id } } as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome back, {user?.firstName || "Provider"}!</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Here is what is happening with your services today.</Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.primary }]}> 
          <View style={styles.statsGrid}>
            {PROVIDER_DASHBOARD_STATS.map((stat) => (
              <View key={stat.key} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { borderColor: colors.border }]}
                onPress={() => router.push(action.route as any)}
              >
                <Ionicons name={action.icon} size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {pendingBookings.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.pendingHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>New Booking Requests</Text>
              <View style={[styles.pendingBadge, { backgroundColor: colors.warningLight }]}> 
                <Text style={[styles.pendingBadgeText, { color: colors.warning }]}>{pendingBookings.length} pending</Text>
              </View>
            </View>

            {pendingBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={[styles.pendingCard, { borderColor: colors.border }]}
                activeOpacity={0.9}
                onPress={() => openBooking(booking.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pendingService, { color: colors.text }]}>{booking.service}</Text>
                  <Text style={[styles.pendingMeta, { color: colors.muted }]}>{booking.client} | {booking.date} at {booking.time}</Text>
                  <Text style={[styles.pendingAmount, { color: colors.text }]}>{booking.amount}</Text>
                </View>
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={[styles.smallAction, { backgroundColor: colors.errorLight }]}
                    onPress={() =>
                      Alert.alert(
                        "Decline booking",
                        "This booking request has been declined.",
                      )
                    }
                  >
                    <MaterialCommunityIcons name="close" size={16} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallAction, { backgroundColor: colors.successLight }]}
                    onPress={() => openBooking(booking.id)}
                  >
                    <MaterialCommunityIcons name="check" size={16} color={colors.success} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    gap: 16,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statsCard: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    ...THEME.shadow.card,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
  },
  statItem: {
    width: "50%",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    color: "#E5E7EB",
    fontSize: THEME.typography.sizes.xs,
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
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    width: "48%",
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  pendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  pendingCard: {
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pendingService: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  pendingMeta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  pendingAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  pendingActions: {
    flexDirection: "row",
    gap: 6,
  },
  smallAction: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
