// app/client/(tabs)/index.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FilterModal, { FilterOptions } from "../../../components/FilterModal";
import Toast from "../../../components/Toast";
import { THEME } from "../../../constants/theme";

// ================================
// Data
// ================================
const CATEGORIES = [
  { id: "1", name: "Electrician", icon: "flash-outline", color: "#E6F4EA"},
  { id: "2", name: "Plumber", icon: "pipe", color: "#E6F4EA" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver", color: "#E6F4EA" },
  { id: "4", name: "Barber", icon: "scissors-cutting", color: "#E6F4EA" },
  { id: "5", name: "Painter", icon: "format-paint", color: "#E6F4EA" },
  { id: "6", name: "Gardener", icon: "leaf", color: "#E6F4EA" },
];

const FEATURED_PROMO = {
  title: "20% Off First Booking",
  subtitle: "Get professional help for less",
  image: require("../../../assets/images/featured.png"),
  color: "#E6F4EA",
};

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

// ================================
// Components
// ================================

const SectionHeader = ({ title, onPressSeeAll }: { title: string; onPressSeeAll?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPressSeeAll && (
      <TouchableOpacity onPress={onPressSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ArtisanCard = ({ item, router }: { item: any; router: any }) => (
  <TouchableOpacity
    style={styles.artisanCard}
    onPress={() =>
      router.push({
        pathname: "/client/artisan-details",
        params: { id: item.id, name: item.name, skill: item.skill, price: item.price, rating: item.rating, reviews: item.reviews, distance: item.distance, verified: item.verified },
      })
    }
  >
    <View style={styles.cardHeader}>
      <Image
        source={require("../../../assets/images/profileavatar.png")}
        style={styles.avatar}
      />
      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart-outline" size={20} color={THEME.colors.muted} />
      </TouchableOpacity>
    </View>

    <View style={styles.cardBody}>
      <View style={styles.nameRow}>
        <Text style={styles.artisanName} numberOfLines={1}>{item.name}</Text>
        {item.verified && (
          <MaterialCommunityIcons name="check-decagram" size={16} color={THEME.colors.primary} style={{ marginLeft: 4 }} />
        )}
      </View>
      <Text style={styles.artisanSkill}>{item.skill}</Text>
      
      <View style={styles.infoRow}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FACC15" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-outline" size={14} color={THEME.colors.muted} />
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>From</Text>
        <Text style={styles.priceValue}>₦{item.price}</Text>
      </View>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() =>
          router.push({
            pathname: "/client/book-artisan",
            params: { artisan: item.name, skill: item.skill },
          })
        }
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// ================================
// Main Screen
// ================================
export default function ClientHome() {
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("Lagos, Nigeria");
  
  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Simulate welcome toast
    // setTimeout(() => {
    //   setToastMessage("Welcome back, Golden! 👋");
    //   setToastVisible(true);
    // }, 1000);
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
  ].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <Toast 
        visible={toastVisible} 
        message={toastMessage} 
        type="success"
        onDismiss={() => setToastVisible(false)} 
      />

      {/* --- Header --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/client/(tabs)/profile" as any)}>
            <Image
              source={require("../../../assets/images/profileavatar.png")}
              style={styles.headerAvatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hi, Golden 👋</Text>
            <TouchableOpacity 
              style={styles.locationSelector}
              onPress={() => setShowLocationModal(true)}
            >
              <View style={styles.locationIconContainer}>
                <Ionicons name="location" size={12} color={THEME.colors.primary} />
              </View>
              <Text style={styles.locationText}>{location}</Text>
              <Ionicons name="chevron-down" size={12} color={THEME.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push("/client/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={24} color={THEME.colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Search Bar --- */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color={THEME.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services or artisans..."
              placeholderTextColor={THEME.colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={22} color={THEME.colors.surface} />
            </TouchableOpacity>
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && SUGGESTIONS.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    router.push({
                      pathname: "/client/(tabs)/explore",
                      params: { search: suggestion },
                    } as any);
                  }}
                >
                  <Ionicons name="time-outline" size={20} color={THEME.colors.muted} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Ionicons name="arrow-forward" size={18} color={THEME.colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- Categories --- */}
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
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={THEME.colors.text}
                />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Featured Promo --- */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{FEATURED_PROMO.title}</Text>
            <Text style={styles.promoSubtitle}>{FEATURED_PROMO.subtitle}</Text>
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => router.push("/client/promos" as any)}
            >
              <Text style={styles.promoButtonText}>Claim Offer</Text>
            </TouchableOpacity>
          </View>
          <Image source={FEATURED_PROMO.image} style={styles.promoImage} resizeMode="contain" />
        </View>

        {/* --- Recent Bookings --- */}
        <SectionHeader title="Recent Bookings" onPressSeeAll={() => router.push("/client/bookings" as any)} />
        <View style={styles.recentBookingsContainer}>
          {RECENT_BOOKINGS.map((booking) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.recentBookingCard}
              onPress={() => router.push({
                pathname: "/client/booking-details",
                params: { id: booking.id }
              })}
            >
              <View style={styles.recentBookingInfo}>
                <Text style={styles.recentBookingName}>{booking.name}</Text>
                <Text style={styles.recentBookingSkill}>{booking.skill}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.recentBookingDate}>{booking.date}</Text>
                <Text style={[
                  styles.recentBookingStatus, 
                  { color: booking.status === "Completed" ? THEME.colors.success : THEME.colors.secondary }
                ]}>
                  {booking.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Top Rated Artisans --- */}
        <SectionHeader title="Top Rated Artisans" onPressSeeAll={() => router.push("/client/(tabs)/explore" as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {TOP_RATED.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>

        {/* --- Nearby Artisans --- */}
        <SectionHeader title="Nearby Artisans" onPressSeeAll={() => router.push("/client/(tabs)/explore" as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {NEARBY.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>

        {/* --- Recommended for You --- */}
        <SectionHeader title="Recommended for You" onPressSeeAll={() => router.push("/client/(tabs)/explore" as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {TOP_RATED.map((item) => (
            <ArtisanCard key={`rec-${item.id}`} item={item} router={router} />
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
        <View style={styles.modalOverlay}>
          <View style={styles.locationModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
            {["Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria"].map((loc) => (
              <TouchableOpacity
                key={loc}
                style={styles.locationOption}
                onPress={() => {
                  setLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Ionicons name="location-outline" size={20} color={THEME.colors.muted} />
                <Text style={styles.locationOptionText}>{loc}</Text>
                {location === loc && <Ionicons name="checkmark" size={20} color={THEME.colors.primary} />}
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
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
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

  // Search
  searchWrapper: {
    zIndex: 10,
    marginBottom: THEME.spacing.xl,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.lg,
    paddingHorizontal: 16,
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    backgroundColor: "#E6F4EA",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
    overflow: "hidden",
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
