// app/client/(tabs)/index.tsx
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Booking, bookingService } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import EnhancedArtisanCard from "../../../components/EnhancedArtisanCard";
import FilterModal, { FilterOptions } from "../../../components/FilterModal";
import Toast from "../../../components/Toast";
import { THEME } from "../../../constants/theme";

// ================================
// Data
// ================================
const CATEGORIES = [
  { id: "1", name: "Electrician", icon: "flash-outline", color: "#E6F4EA" },
  { id: "2", name: "Plumber", icon: "pipe", color: "#E6F4EA" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver", color: "#E6F4EA" },
  { id: "4", name: "Barber", icon: "scissors-cutting", color: "#E6F4EA" },
  { id: "5", name: "Painter", icon: "format-paint", color: "#E6F4EA" },
  { id: "6", name: "Gardener", icon: "leaf", color: "#E6F4EA" },
];

const PROMOS = [
  {
    id: "1",
    title: "20% Off First Booking",
    subtitle: "Get professional help for less",
    image: require("../../../assets/images/featured.png"),
    color: "#E6F4EA",
  },
];

const TOP_RATED = [
  { id: 1, name: "Golden Amadi", skill: "Electrician", price: "5,000", rating: 4.9, reviews: 120, distance: "2.5 km", verified: true },
  { id: 2, name: "Sarah Jones", skill: "Plumber", price: "4,500", rating: 4.8, reviews: 85, distance: "3.1 km", verified: true },
  { id: 3, name: "Mike Obi", skill: "Carpenter", price: "6,000", rating: 4.7, reviews: 92, distance: "1.8 km", verified: false },
];

const NEARBY = [
  { id: 4, name: "John Doe", skill: "Painter", price: "3,000", rating: 4.5, reviews: 40, distance: "0.5 km", verified: true },
  { id: 5, name: "Jane Smith", skill: "Gardener", price: "4,000", rating: 4.6, reviews: 55, distance: "1.2 km", verified: false },
];

const RECENT_BOOKINGS = [
  { id: 101, name: "Emeka Johnson", skill: "Plumber", date: "Today, 10:00 AM", status: "Pending" },
  { id: 102, name: "Sarah Jones", skill: "Electrician", date: "Yesterday, 2:00 PM", status: "Completed" },
];

const FEATURED_BUSINESSES = [
  { id: 101, name: "Apex Services Ltd", skill: "Plumbing & Electrical", price: "10,000", rating: 4.8, reviews: 200, distance: "1.5 km", verified: true, type: "business" },
  { id: 102, name: "BuildRight Construction", skill: "General Contractor", price: "50,000", rating: 4.9, reviews: 50, distance: "4.0 km", verified: true, type: "business" },
];

// ================================
// Components
// ================================

const SectionHeader = ({ title, onPressSeeAll }: { title: string; onPressSeeAll?: () => void }) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {onPressSeeAll && (
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ArtisanCard = ({ item, router }: { item: any; router: any }) => {
  return (
    <View style={{ marginRight: 16 }}>
      <EnhancedArtisanCard
        artisan={{
          ...item,
          verificationLevel: item.verified ? 'verified' : 'none',
        }}
      />
    </View>
  );
};

// ================================
// Main Screen
// ================================
export default function ClientHome() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user, isGuest } = useAuth();
  
  // Dynamic greeting
  const greeting = user?.firstName 
    ? `Hi, ${user.firstName} 👋` 
    : isGuest 
    ? "Hi there 👋" 
    : "Welcome 👋";
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("Lagos, Nigeria");

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Fetch bookings on focus
  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      // Hardcoded user ID for demo
      const response = await bookingService.getBookings('user_001', 'client', { perPage: 3 });
      if (response.success && response.data) {
        setRecentBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  /*
  useEffect(() => {
    // Simulate welcome toast
    // setTimeout(() => {
    //   setToastMessage("Welcome back, Golden! 👋");
    //   setToastVisible(true);
    // }, 1000);
  }, []);
  */

  const promoListRef = React.useRef<FlatList>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentPromoIndex((prevIndex) => {
            const nextIndex = prevIndex === PROMOS.length - 1 ? 0 : prevIndex + 1;
            promoListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            return nextIndex;
        });
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    rating: 0,
    verifiedOnly: false,
    distance: 100,
  });

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
  };

  const SUGGESTIONS = [
    "Electrician near me",
    "Plumber for emergency",
    "Cheap house cleaning",
    "AC repair",
    "Mechanic",
    "Cleaning Services",
    "Construction Company",
    "Apex Services",
  ].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#1F2937' ? "dark-content" : "light-content"} backgroundColor={colors.background} />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onDismiss={() => setToastVisible(false)}
      />

      {/* --- Header --- */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/client/(tabs)/profile" as any)}>
            <Image
              source={require("../../../assets/images/profileavatar.png")}
              style={[styles.headerAvatar, { borderColor: colors.surface }]}
            />
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>{greeting}</Text>
            <TouchableOpacity
              style={[styles.locationSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowLocationModal(true)}
            >
              <View style={[styles.locationIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="location" size={12} color={colors.primary} />
              </View>
              <Text style={[styles.locationText, { color: colors.text }]}>{location}</Text>
              <Ionicons name="chevron-down" size={12} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/client/liked-items" as any)}
          >
            <Ionicons name="heart-outline" size={22} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/client/notifications" as any)}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.notificationBadge, { borderColor: colors.surface }]} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Search Bar --- */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={22} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search services..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onSubmitEditing={() => {
                setShowSuggestions(false);
                router.push({
                  pathname: "/client/(tabs)/explore",
                  params: { query: searchQuery },
                } as any);
              }}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={22} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && SUGGESTIONS.length > 0 && (
            <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, { borderBottomColor: colors.background }]}
                  onPress={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    router.push({
                      pathname: "/client/(tabs)/explore",
                      params: { query: suggestion },
                    } as any);
                  }}
                >
                  <Ionicons name="time-outline" size={20} color={colors.muted} />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* --- Categories --- */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <SectionHeader
            title="Categories"
            onPressSeeAll={() => router.push("/client/categories" as any)}
          />
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.categoryItem}
                onPress={() =>
                  router.push({
                    pathname: "/client/(tabs)/explore",
                    params: { category: item.name },
                  } as any)
                }
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.categoryText, { color: colors.text }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* --- Featured Promos --- */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={{ marginBottom: 24 }}>
           {PROMOS.map((item) => (
               <View key={item.id} style={[styles.promoCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                  <View style={styles.promoContent}>
                    <Text style={[styles.promoTitle, { color: colors.primary }]}>{item.title}</Text>
                    <Text style={[styles.promoSubtitle, { color: colors.text }]}>{item.subtitle}</Text>
                    <TouchableOpacity
                      style={[styles.promoButton, { backgroundColor: colors.primary }]}
                      onPress={() => router.push("/client/promos" as any)}
                    >
                      <Text style={[styles.promoButtonText, { color: colors.onPrimary }]}>Claim Offer</Text>
                    </TouchableOpacity>
                  </View>
                  <Image source={item.image} style={styles.promoImage} resizeMode="contain" />
               </View>
           ))}
        </Animated.View>

        {/* --- Recent Bookings --- */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)}>
          <SectionHeader title="Recent Bookings" onPressSeeAll={() => router.push("/client/bookings" as any)} />
          <View style={styles.recentBookingsContainer}>
            {recentBookings.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.muted, fontStyle: 'italic', marginBottom: 24 }}>No recent bookings found.</Text>
            ) : (
               recentBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={[styles.recentBookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push({
                  pathname: "/client/booking-details",
                  params: { id: booking.id }
                })}
              >
                <View style={styles.recentBookingInfo}>
                  <Text style={[styles.recentBookingName, { color: colors.text }]}>
                    {booking.artisan?.fullName || booking.categoryName}
                  </Text>
                  <Text style={[styles.recentBookingSkill, { color: colors.muted }]}>{booking.serviceType}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.recentBookingDate, { color: colors.muted }]}>
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </Text>
                  <Text style={[
                    styles.recentBookingStatus,
                    { color: booking.status === "completed" ? colors.success : colors.secondary }
                  ]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            )))}
          </View>
        </Animated.View>

        {/* --- Horizontal Scroll Sections --- */}
        <SectionHeader title="Top Rated Professionals" onPressSeeAll={() => router.push({ pathname: "/client/all-artisans", params: { title: "Top Rated Professionals", filter: "top-rated" } } as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {TOP_RATED.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>

        <SectionHeader title="Nearby Professionals" onPressSeeAll={() => router.push({ pathname: "/client/all-artisans", params: { title: "Nearby Professionals", filter: "nearby" } } as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {NEARBY.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.locationModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {["Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria"].map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[styles.locationOption, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Ionicons name="location-outline" size={20} color={colors.muted} />
                <Text style={[styles.locationOptionText, { color: colors.text }]}>{loc}</Text>
                {location === loc && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: THEME.colors.surface,
  },
  greeting: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  locationIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.error,
    borderWidth: 1,
    borderColor: THEME.colors.surface,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // Search
  searchWrapper: {
    zIndex: 10,
    marginBottom: THEME.spacing.xl,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: THEME.spacing.lg,
    paddingHorizontal: 16,
    backgroundColor: THEME.colors.surface,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,

  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: THEME.spacing.lg,
    right: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.background,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  seeAllText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.primary,
  },

  // Categories
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: "space-between",
    marginBottom: THEME.spacing.xl,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8, 
  },
  categoryText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },

  // Promo Card
  promoCard: {
    marginHorizontal: THEME.spacing.lg,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primaryDark,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.primary,
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  promoImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },

  // Recent Bookings
  recentBookingsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  recentBookingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  recentBookingInfo: {
    flex: 1,
  },
  recentBookingName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  recentBookingSkill: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
  recentBookingDate: {
    fontSize: 12,
    color: THEME.colors.muted,
    marginBottom: 4,
  },
  recentBookingStatus: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Artisan Card
  horizontalList: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
  },
  artisanCard: {
    width: 200,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  heartButton: {
    padding: 4,
  },
  cardBody: {
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    flex: 1,
  },
  artisanSkill: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEFCE8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceValue: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  bookButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 12,
  },
  bookButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadow.card,
    zIndex: 100,
  },

  // Location Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  locationModalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    gap: 12,
  },
  locationOptionText: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
