// app/client/(tabs)/bookings.tsx

// ========================================
// IMPORTS
// ========================================
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

// ========================================
// BOOKINGS SCREEN
// ========================================
export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState<any[]>([]);

  // --- Default placeholder data ---
  const defaultBookings = [
    {
      id: "1",
      artisan: "Golden Amadi",
      skill: "Electrician",
      date: "Oct 25, 2025 - 10:00 AM",
      status: "Upcoming",
      image: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "2",
      artisan: "Golden Amadi",
      skill: "Plumber",
      date: "Oct 10, 2025 - 3:00 PM",
      status: "Completed",
      image: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "3",
      artisan: "Segun Ade",
      skill: "Carpenter",
      date: "Sept 28, 2025 - 12:00 PM",
      status: "Cancelled",
      image: require("../../../assets/images/profileavatar.png"),
    },
  ];

  // --- Load stored bookings or initialize defaults ---
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const stored = await AsyncStorage.getItem("bookings");
        if (stored) {
          setBookings(JSON.parse(stored));
        } else {
          setBookings(defaultBookings);
          await AsyncStorage.setItem("bookings", JSON.stringify(defaultBookings));
        }
      } catch (err) {
        console.log("Error loading bookings:", err);
      }
    };
    loadBookings();
  }, []);

  // --- Save bookings to local storage ---
  const saveBookings = async (newBookings: any[]) => {
    setBookings(newBookings);
    await AsyncStorage.setItem("bookings", JSON.stringify(newBookings));
  };

  // --- Filter bookings by selected tab ---
  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  // --- Cancel booking handler ---
  const handleCancelBooking = (id: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          const updated = bookings.map((b) =>
            b.id === id ? { ...b, status: "Cancelled" } : b
          );
          await saveBookings(updated);
        },
      },
    ]);
  };

  // --- Mark booking as completed ---
  const handleCompleteBooking = async (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Completed" } : b
    );
    await saveBookings(updated);
  };

  // --- Rebook the same artisan ---
  const handleBookAgain = (booking: any) => {
    router.push({
      pathname: "/client/book-artisan",
      params: {
        artisan: booking.artisan,
        skill: booking.skill,
      },
    });
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: THEME.spacing.xl * 3 }}
    >
      {/* --- Page Header --- */}
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>View and manage your artisan bookings.</Text>

      {/* --- Tabs for filtering bookings --- */}
      <View style={styles.tabRow}>
        {["Upcoming", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Booking Cards --- */}
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <View key={booking.id} style={styles.card}>
            {/* --- Booking Header (Artisan Info) --- */}
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => router.push("/client/artisan-details")}
            >
              <Image source={booking.image} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.artisanName}>{booking.artisan}</Text>
                <Text style={styles.artisanSkill}>{booking.skill}</Text>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={16}
                    color={THEME.colors.primary}
                  />
                  <Text style={styles.dateText}>{booking.date}</Text>
                </View>
              </View>
              <Text style={styles.bookService}>Book a Service</Text>
            </TouchableOpacity>

            {/* --- Action Buttons --- */}
            {booking.status === "Upcoming" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: THEME.colors.error }]}
                  onPress={() => handleCancelBooking(booking.id)}
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: THEME.colors.success }]}
                  onPress={() => handleCompleteBooking(booking.id)}
                >
                  <Text style={styles.actionText}>Mark Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* --- Completed State --- */}
            {booking.status === "Completed" && (
              <View style={styles.completedRow}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "#DCFCE7" },
                  ]}
                >
                  <Text style={[styles.statusText, { color: THEME.colors.success }]}>
                    Completed
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: THEME.colors.primary }]}
                  onPress={() => handleBookAgain(booking)}
                >
                  <Text style={styles.actionText}>Book Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* --- Cancelled State --- */}
            {booking.status === "Cancelled" && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: "#FEE2E2" },
                ]}
              >
                <Text style={[styles.statusText, { color: THEME.colors.error }]}>
                  Cancelled
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        // --- Empty State ---
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={60}
            color={THEME.colors.muted}
          />
          <Text style={styles.emptyText}>
            No {activeTab.toLowerCase()} bookings yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ========================================
// STYLES 
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },

  // --- Page Header ---
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    color: THEME.colors.muted,
    marginVertical: THEME.spacing.sm,
  },

  // --- Tabs ---
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xs,
    ...THEME.shadow.card,
  },
  tabButton: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
  },
  activeTabButton: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.muted,
  },
  activeTabText: {
    color: THEME.colors.surface,
  },

  // --- Booking Card ---
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: THEME.radius.lg,
    marginRight: THEME.spacing.md,
  },
  artisanName: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.md,
  },
  artisanSkill: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginBottom: THEME.spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: THEME.spacing.xs,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  bookService: {
    backgroundColor: THEME.colors.primary,
    color: THEME.colors.surface,
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // --- Actions ---
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  completedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: THEME.spacing.sm,
  },
  actionButton: {
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
  },
  actionText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },

  // --- Status Labels ---
  statusBadge: {
    marginTop: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    alignSelf: "flex-start",
  },
  statusText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },

  // --- Empty State ---
  emptyContainer: {
    alignItems: "center",
    marginTop: THEME.spacing.xl * 2,
  },
  emptyText: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginTop: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
  },
});
