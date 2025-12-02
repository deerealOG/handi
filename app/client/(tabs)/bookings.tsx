// app/client/(tabs)/bookings.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

// ========================================
// TYPES
// ========================================
type BookingStatus = "Active" | "Pending" | "Completed" | "Cancelled";

interface Booking {
  id: string;
  artisan: string;
  skill: string;
  date: string;
  time: string;
  price: string;
  status: BookingStatus;
  image: any;
}

// ========================================
// BOOKINGS SCREEN
// ========================================
export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingStatus>("Active");
  const [bookings, setBookings] = useState<Booking[]>([]);

  // --- Default placeholder data ---
  const defaultBookings = useMemo<Booking[]>(() => [
    {
      id: "1",
      artisan: "Golden Amadi",
      skill: "Electrician",
      date: "Today",
      time: "10:00 AM",
      price: "5,000",
      status: "Active",
      image: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "2",
      artisan: "Sarah Jones",
      skill: "Plumber",
      date: "Oct 28, 2025",
      time: "02:00 PM",
      price: "4,500",
      status: "Pending",
      image: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "3",
      artisan: "Mike Obi",
      skill: "Carpenter",
      date: "Oct 15, 2025",
      time: "12:00 PM",
      price: "6,000",
      status: "Completed",
      image: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "4",
      artisan: "John Doe",
      skill: "Painter",
      date: "Sept 28, 2025",
      time: "09:00 AM",
      price: "3,000",
      status: "Cancelled",
      image: require("../../../assets/images/profileavatar.png"),
    },
  ], []);

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
  }, [defaultBookings]);

  // --- Save bookings to local storage ---
  const saveBookings = async (newBookings: Booking[]) => {
    setBookings(newBookings);
    await AsyncStorage.setItem("bookings", JSON.stringify(newBookings));
  };

  // --- Filter bookings by selected tab ---
  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  // --- Actions ---
  const handleCancelBooking = (id: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          const updated = bookings.map((b) =>
            b.id === id ? { ...b, status: "Cancelled" as BookingStatus } : b
          );
          await saveBookings(updated);
        },
      },
    ]);
  };

  const handleBookAgain = (booking: Booking) => {
    router.push({
      pathname: "/client/book-artisan",
      params: {
        artisan: booking.artisan,
        skill: booking.skill,
      },
    } as any);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* --- Tabs --- */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {["Active", "Pending", "Completed", "Cancelled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as BookingStatus)}
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
        </ScrollView>
      </View>

      {/* --- Booking List --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.card}
              onPress={() => router.push({
                pathname: "/client/booking-details",
                params: {
                  id: booking.id,
                  artisan: booking.artisan,
                  skill: booking.skill,
                  date: booking.date,
                  time: booking.time,
                  price: booking.price,
                  status: booking.status,
                }
              } as any)}
              activeOpacity={0.9}
            >
              {/* Card Header: ID & Status */}
              <View style={styles.cardTopRow}>
                <Text style={styles.orderId}>Order #{booking.id}234</Text>
                <View style={[
                  styles.statusBadge,
                  booking.status === "Active" && { backgroundColor: "#DCFCE7", borderColor: THEME.colors.success }, // Light Green
                  booking.status === "Pending" && { backgroundColor: "#FEF9C3", borderColor: "#EAB308" }, // Light Yellow
                  booking.status === "Completed" && { backgroundColor: "#F3F4F6", borderColor: THEME.colors.muted }, // Light Gray
                  booking.status === "Cancelled" && { backgroundColor: "#FEE2E2", borderColor: THEME.colors.error }, // Light Red
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === "Active" && { color: THEME.colors.success },
                    booking.status === "Pending" && { color: "#CA8A04" },
                    booking.status === "Completed" && { color: THEME.colors.text },
                    booking.status === "Cancelled" && { color: THEME.colors.error },
                  ]}>{booking.status}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Artisan Info */}
              <View style={styles.artisanRow}>
                <Image source={booking.image} style={styles.avatar} />
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>{booking.artisan}</Text>
                  <Text style={styles.artisanSkill}>{booking.skill}</Text>
                  <View style={styles.dateTimeRow}>
                    <View style={styles.iconText}>
                      <Ionicons name="calendar-outline" size={14} color={THEME.colors.muted} />
                      <Text style={styles.metaText}>{booking.date}</Text>
                    </View>
                    <View style={[styles.iconText, { marginLeft: 12 }]}>
                      <Ionicons name="time-outline" size={14} color={THEME.colors.muted} />
                      <Text style={styles.metaText}>{booking.time}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.priceText}>₦{booking.price}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                {booking.status === "Active" && (
                  <>
                    <TouchableOpacity style={[styles.actionButton, styles.outlineButton]}>
                      <Text style={styles.outlineButtonText}>Track Artisan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                      <Ionicons name="chatbubble-ellipses-outline" size={18} color="white" style={{ marginRight: 6 }} />
                      <Text style={styles.primaryButtonText}>Message</Text>
                    </TouchableOpacity>
                  </>
                )}

                {booking.status === "Pending" && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancelBooking(booking.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                )}

                {booking.status === "Completed" && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.outlineButton]}
                      onPress={() => router.push({
                        pathname: "/client/booking-details",
                        params: {
                          id: booking.id,
                          artisan: booking.artisan,
                          skill: booking.skill,
                          date: booking.date,
                          time: booking.time,
                          price: booking.price,
                          status: booking.status,
                        }
                      } as any)}
                    >
                      <Text style={styles.outlineButtonText}>See Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => handleBookAgain(booking)}
                    >
                      <Text style={styles.primaryButtonText}>Book Again</Text>
                    </TouchableOpacity>
                  </>
                )}

                {booking.status === "Cancelled" && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.outlineButton]}
                    onPress={() => router.push({
                      pathname: "/client/booking-details",
                      params: {
                        id: booking.id,
                        artisan: booking.artisan,
                        skill: booking.skill,
                        date: booking.date,
                        time: booking.time,
                        price: booking.price,
                        status: booking.status,
                      }
                    } as any)}
                  >
                    <Text style={styles.outlineButtonText}>See Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // --- Empty State ---
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={40}
                color={THEME.colors.muted}
              />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} Bookings</Text>
            <Text style={styles.emptySubtitle}>
              You don&apos;t have any {activeTab.toLowerCase()} bookings at the moment.
            </Text>
            <TouchableOpacity 
              style={styles.findArtisanButton}
              onPress={() => router.push("/client/(tabs)/explore" as any)}
            >
              <Text style={styles.findArtisanText}>Find an Artisan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>


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
  
  // Header
 header: {
     paddingHorizontal: THEME.spacing.lg,
     marginBottom: THEME.spacing.md,
   },
   headerTitle:{
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
  },
  activeTabButton: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  tabText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
  },
  activeTabText: {
    color: THEME.colors.surface,
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
    borderWidth: 1,
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
    backgroundColor: "#FEE2E2",
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  detailLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
  },
  detailValue: {
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.base,
  },
});
