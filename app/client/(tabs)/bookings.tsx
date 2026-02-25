// app/client/(tabs)/bookings.tsx
// Client bookings screen with real service integration

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Booking, bookingService } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../../constants/theme";

// ========================================
// TYPES
// ========================================
type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

const STATUS_TABS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706" },
  confirmed: { bg: "#DBEAFE", text: "#1D4ED8" },
  in_progress: { bg: "#E0E7FF", text: "#4338CA" },
  completed: { bg: "#D1FAE5", text: "#059669" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

// ========================================
// BOOKINGS SCREEN
// ========================================
export default function BookingsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = useCallback(async () => {
    try {
      const userId = user?.id || "user_001";
      const result = await bookingService.getBookings(userId, "client", {
        status: activeTab === "all" ? undefined : activeTab,
      });

      if (result.success) {
        setBookings(result.data || []);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, activeTab]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, [loadBookings]);

  // --- Actions ---
  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const result = await bookingService.cancelBooking(
              bookingId,
              "User requested cancellation",
            );
            if (result.success) {
              loadBookings();
            }
          },
        },
      ],
    );
  };

  const handleBookAgain = (booking: Booking) => {
    router.push({
      pathname: "/client/book-artisan",
      params: {
        artisan: booking.artisan?.fullName || "Artisan",
        skill: booking.categoryName,
        artisanId: booking.artisanId,
      },
    } as any);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ========================================
  // RENDER
  // ========================================
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      {/* --- Header --- */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Bookings
        </Text>
      </Animated.View>

      {/* --- Tabs --- */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(800)}
        style={styles.tabContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {STATUS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeTab === tab.key && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.muted },
                  activeTab === tab.key && { color: colors.onPrimary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* --- Booking List --- */}
      <Animated.ScrollView
        entering={FadeInDown.delay(400).duration(800)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const statusStyle =
              STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
            return (
              <TouchableOpacity
                key={booking.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/client/booking-details",
                    params: {
                      id: booking.id,
                      artisan: booking.artisan?.fullName || "Artisan",
                      skill: booking.categoryName,
                      date: booking.scheduledDate,
                      time: booking.scheduledTime,
                      price: booking.estimatedPrice,
                      status: booking.status,
                    },
                  } as any)
                }
                activeOpacity={0.9}
              >
                {/* Card Header: ID & Status */}
                <View style={styles.cardTopRow}>
                  <Text style={[styles.orderId, { color: colors.muted }]}>
                    Order #{booking.id.slice(-8)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusStyle.text }]}
                    >
                      {booking.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />

                {/* Artisan Info */}
                <View style={styles.artisanRow}>
                  <Image
                    source={require("../../../assets/images/profileavatar.png")}
                    style={styles.avatar}
                  />
                  <View style={styles.artisanInfo}>
                    <Text style={[styles.artisanName, { color: colors.text }]}>
                      {booking.artisan?.fullName || "Artisan"}
                    </Text>
                    <Text
                      style={[styles.artisanSkill, { color: colors.muted }]}
                    >
                      {booking.categoryName}
                    </Text>
                    <View style={styles.dateTimeRow}>
                      <View style={styles.iconText}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={colors.muted}
                        />
                        <Text
                          style={[styles.metaText, { color: colors.muted }]}
                        >
                          {formatDate(booking.scheduledDate)}
                        </Text>
                      </View>
                      <View style={[styles.iconText, { marginLeft: 12 }]}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={colors.muted}
                        />
                        <Text
                          style={[styles.metaText, { color: colors.muted }]}
                        >
                          {booking.scheduledTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.priceText, { color: colors.primary }]}>
                    ₦{booking.estimatedPrice.toLocaleString()}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                  {(booking.status === "confirmed" ||
                    booking.status === "in_progress") && (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.outlineButton,
                          { borderColor: colors.primary },
                        ]}
                        onPress={() =>
                          router.push({
                            pathname: "/client/track-artisan",
                            params: {
                              id: booking.id,
                              artisan: booking.artisan?.fullName,
                              skill: booking.categoryName,
                            },
                          } as any)
                        }
                      >
                        <Text
                          style={[
                            styles.outlineButtonText,
                            { color: colors.primary },
                          ]}
                        >
                          Track
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.primaryButton,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={16}
                          color="white"
                        />
                        <Text style={styles.primaryButtonText}> Message</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {booking.status === "pending" && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.cancelButton,
                        { backgroundColor: colors.errorLight },
                      ]}
                      onPress={() => handleCancelBooking(booking.id)}
                    >
                      <Text
                        style={[
                          styles.cancelButtonText,
                          { color: colors.error },
                        ]}
                      >
                        Cancel Booking
                      </Text>
                    </TouchableOpacity>
                  )}

                  {booking.status === "completed" && (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.outlineButton,
                          { borderColor: colors.primary },
                        ]}
                        onPress={() =>
                          router.push({
                            pathname: "/client/dispute/[bookingId]",
                            params: {
                              bookingId: booking.id,
                              artisanId: booking.artisanId,
                              artisanName: booking.artisan?.fullName,
                            },
                          } as any)
                        }
                      >
                        <Text
                          style={[
                            styles.outlineButtonText,
                            { color: colors.primary },
                          ]}
                        >
                          Report Issue
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.primaryButton,
                          { backgroundColor: colors.primary },
                        ]}
                        onPress={() => handleBookAgain(booking)}
                      >
                        <Text style={styles.primaryButtonText}>Book Again</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {booking.status === "cancelled" && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.outlineButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: "/client/booking-details",
                          params: { id: booking.id },
                        } as any)
                      }
                    >
                      <Text
                        style={[
                          styles.outlineButtonText,
                          { color: colors.muted },
                        ]}
                      >
                        See Details
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          // --- Empty State ---
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={40}
                color={colors.muted}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Bookings Found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : `No ${activeTab.replace(/_/g, " ")} bookings at the moment.`}
            </Text>
            <TouchableOpacity
              style={[
                styles.findArtisanButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => router.push("/client/(tabs)/explore" as any)}
            >
              <Text
                style={[styles.findArtisanText, { color: colors.onPrimary }]}
              >
                Find an Artisan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes["2xl"],
    color: THEME.colors.text,
  },

  // Tabs
  tabContainer: {
    marginBottom: THEME.spacing.md,
  },
  tabScrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    marginRight: 8,
  },
  tabText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
  },

  // List
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.xs,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 10,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginBottom: 12,
  },
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  artisanSkill: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    marginBottom: 6,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 12,
    color: THEME.colors.muted,
  },
  priceText: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.primary,
  },

  // Actions
  actionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
  },
  primaryButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  outlineButtonText: {
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },
  cancelButton: {
    backgroundColor: THEME.colors.errorLight,
  },
  cancelButtonText: {
    color: THEME.colors.error,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyTitle: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  findArtisanButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: THEME.colors.primary,
    borderRadius: 25,
    ...THEME.shadow.base,
  },
  findArtisanText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },
});
