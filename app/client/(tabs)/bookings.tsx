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

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState<any[]>([]);

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
      artisan: "Chika Obi",
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
  },);

  const saveBookings = async (newBookings: any[]) => {
    setBookings(newBookings);
    await AsyncStorage.setItem("bookings", JSON.stringify(newBookings));
  };

  const filteredBookings = bookings.filter(
    (b) => b.status === activeTab
  );

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

  const handleCompleteBooking = async (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Completed" } : b
    );
    await saveBookings(updated);
  };

  // NEW 🔥 Book Again button handler
  const handleBookAgain = (booking: any) => {
    router.push({
      pathname: "/client/book-artisan",
      params: {
        artisan: booking.artisan,
        skill: booking.skill,
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>View and manage your artisan bookings.</Text>

      {/* Tabs */}
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

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <View key={booking.id} style={styles.card}>
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1 }}
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

            {/* --- Booking Actions --- */}
            {booking.status === "Upcoming" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#e11d48" }]}
                  onPress={() => handleCancelBooking(booking.id)}
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#16a34a" }]}
                  onPress={() => handleCompleteBooking(booking.id)}
                >
                  <Text style={styles.actionText}>Mark Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* --- Completed: Now with Book Again --- */}
            {booking.status === "Completed" && (
              <View style={styles.completedRow}>
                <View style={[styles.statusBadge, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={[styles.statusText, { color: "#166534" }]}>
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

            {booking.status === "Cancelled" && (
              <View style={[styles.statusBadge, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[styles.statusText, { color: "#991B1B" }]}>
                  Cancelled
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
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

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background, padding: 20 },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
    marginTop: 40,
    textAlign: "center",
  },
  subtitle: { textAlign: "center", color: THEME.colors.muted, marginBottom: 20, marginTop: 6 },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 6,
  },
  tabButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  activeTabButton: { backgroundColor: THEME.colors.primary },
  tabText: { color: THEME.colors.muted, fontWeight: "500" },
  activeTabText: { color: THEME.colors.white },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: 14,
    marginBottom: 14,
    ...THEME.shadow.base,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  artisanName: { fontWeight: "600", color: THEME.colors.text, fontSize: 16 },
  artisanSkill: { color: THEME.colors.muted, marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 4, color: THEME.colors.text, fontSize: 13 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10, gap: 10 },
  completedRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { color: THEME.colors.white, fontSize: 13, fontWeight: "600" },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
  },
  statusText: { fontWeight: "600", fontSize: 13 },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { color: THEME.colors.muted, marginTop: 8, fontSize: 15 },
  bookService: {
    backgroundColor: THEME.colors.primary,
    
  }
});
