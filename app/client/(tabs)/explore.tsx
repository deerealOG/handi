import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, { FadeInDown } from "react-native-reanimated";
import { EnhancedArtisanCard } from "../../../components/EnhancedArtisanCard";
import FilterModal, { FilterOptions } from "../../../components/FilterModal";
import {
    ADDITIONAL_CATEGORIES,
    FEATURED_CATEGORIES,
} from "../../../constants/categories";
import { THEME } from "../../../constants/theme";

// Sample artisan data with locations
const ARTISANS = [
  {
    id: 1,
    name: "Golden Amadi",
    skill: "Electrician",
    price: "5,000",
    rating: 4.9,
    reviews: 120,
    distance: "2.5 km",
    verified: true,
    latitude: 6.5244,
    longitude: 3.3792,
    type: "artisan",
  },
  {
    id: 2,
    name: "Sarah Jones",
    skill: "Plumber",
    price: "4,500",
    rating: 4.8,
    reviews: 85,
    distance: "3.1 km",
    verified: true,
    latitude: 6.5355,
    longitude: 3.3889,
    type: "artisan",
  },
  {
    id: 3,
    name: "Mike Obi",
    skill: "Carpenter",
    price: "6,000",
    rating: 4.7,
    reviews: 92,
    distance: "1.8 km",
    verified: false,
    latitude: 6.5145,
    longitude: 3.3695,
    type: "artisan",
  },
  {
    id: 4,
    name: "John Doe",
    skill: "Painter",
    price: "3,000",
    rating: 4.5,
    reviews: 40,
    distance: "0.5 km",
    verified: true,
    latitude: 6.529,
    longitude: 3.375,
    type: "artisan",
  },
  {
    id: 5,
    name: "Jane Smith",
    skill: "Gardener",
    price: "4,000",
    rating: 4.6,
    reviews: 55,
    distance: "1.2 km",
    verified: false,
    latitude: 6.52,
    longitude: 3.382,
    type: "artisan",
  },
];

const BUSINESSES = [
  {
    id: 101,
    name: "Apex Services Ltd",
    skill: "Plumbing & Electrical",
    price: "10,000",
    rating: 4.8,
    reviews: 200,
    distance: "1.5 km",
    verified: true,
    latitude: 6.522,
    longitude: 3.37,
    type: "business",
  },
  {
    id: 102,
    name: "BuildRight Construction",
    skill: "General Contractor",
    price: "50,000",
    rating: 4.9,
    reviews: 50,
    distance: "4.0 km",
    verified: true,
    latitude: 6.53,
    longitude: 3.39,
    type: "business",
  },
  {
    id: 103,
    name: "CleanSweep Pro",
    skill: "Cleaning Service",
    price: "8,000",
    rating: 4.5,
    reviews: 80,
    distance: "2.0 km",
    verified: true,
    latitude: 6.518,
    longitude: 3.375,
    type: "business",
  },
];

// Derive categories from single source of truth
const ALL_CATEGORIES = [
  ...FEATURED_CATEGORIES,
  ...(ADDITIONAL_CATEGORIES || []),
];
const ARTISAN_CATEGORIES = [
  "All",
  ...ALL_CATEGORIES.slice(0, 8).map((c) => c.name),
];
const BUSINESS_CATEGORIES = [
  "All",
  ...ALL_CATEGORIES.filter((c) =>
    [
      "construction",
      "cleaning-service",
      "plumber",
      "electrician",
      "logistics",
      "event-planner",
    ].includes(c.id),
  ).map((c) => c.name),
];

const PROMO_SERVICES = [
  {
    id: "priority-booking",
    title: "Priority Booking",
    subtitle: "Get matched with top-rated providers in minutes.",
    cta: "Book Fast",
    icon: "flash-outline" as const,
  },
  {
    id: "same-day",
    title: "Same-Day Home Fix",
    subtitle: "Find available pros for urgent service requests.",
    cta: "Find Now",
    icon: "construct-outline" as const,
  },
  {
    id: "trusted-business",
    title: "Trusted Business Teams",
    subtitle: "Verified companies for bigger projects.",
    cta: "View Teams",
    icon: "business-outline" as const,
  },
];

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState(
    params.query?.toString() || "",
  );
  const [activeFilter, setActiveFilter] = useState(
    params.category?.toString() || "All",
  );
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [searchType, setSearchType] = useState<"artisan" | "business">(
    (params.type as "business") || "artisan",
  ); // Init from params
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    rating: 0,
    verifiedOnly: false,
    distance: 100,
  });
  const [selectedArtisan, setSelectedArtisan] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate reload
    setTimeout(() => setRefreshing(false), 1200);
  };

  const dataToFilter = searchType === "artisan" ? ARTISANS : BUSINESSES;
  const currentCategories =
    searchType === "artisan" ? ARTISAN_CATEGORIES : BUSINESS_CATEGORIES;

  // Reset filter when search type changes
  React.useEffect(() => {
    setActiveFilter("All");
  }, [searchType]);

  const filteredArtisans = dataToFilter.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter !== "All" && !item.skill.includes(activeFilter))
      return false; // Relaxed skill check
    if (filters.verifiedOnly && !item.verified) return false;
    if (item.rating < filters.rating) return false;
    const price = parseInt(item.price.replace(/,/g, ""));
    if (price < filters.priceRange[0] || price > filters.priceRange[1])
      return false;
    return true;
  });

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
      </Animated.View>
      {/* Search Bar - Consistent with home */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(800)}
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search-outline" size={22} color={colors.muted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={
            searchType === "artisan"
              ? "Search for professionals..."
              : "Search for businesses..."
          }
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={{ marginRight: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.filterContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {currentCategories.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeFilter === filter && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: colors.text },
                  activeFilter === filter && { color: colors.onPrimary },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 6.5244,
              longitude: 3.3792,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={() => setSelectedArtisan(null)}
          >
            {filteredArtisans.map((artisan) => (
              <Marker
                key={artisan.id}
                coordinate={{
                  latitude: artisan.latitude,
                  longitude: artisan.longitude,
                }}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedArtisan(artisan.id);
                }}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.marker,
                      selectedArtisan === artisan.id && styles.markerSelected,
                    ]}
                  >
                    <Image
                      source={require("../../../assets/images/profileavatar.png")}
                      style={styles.markerAvatar}
                    />
                    <View style={styles.markerArrow} />
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Zoom Buttons */}
          <View style={styles.zoomContainer}>
            <TouchableOpacity style={styles.zoomButton}>
              <Ionicons name="add" size={24} color={THEME.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton}>
              <Ionicons name="remove" size={24} color={THEME.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Selected Artisan Card Overlay */}
          {selectedArtisan && (
            <View style={styles.selectedCardOverlay}>
              {(() => {
                const artisan = filteredArtisans.find(
                  (a) => a.id === selectedArtisan,
                );
                if (!artisan) return null;
                return (
                  <View style={styles.selectedCard}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedArtisan(null)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={THEME.colors.muted}
                      />
                    </TouchableOpacity>
                    <View style={styles.selectedCardContent}>
                      <Image
                        source={require("../../../assets/images/profileavatar.png")}
                        style={styles.selectedAvatar}
                      />
                      <View style={styles.selectedInfo}>
                        <View style={styles.nameVerifiedRow}>
                          <Text style={styles.selectedName} numberOfLines={1}>
                            {artisan.name}
                          </Text>
                          {artisan.verified && (
                            <MaterialCommunityIcons
                              name="check-decagram"
                              size={16}
                              color={THEME.colors.primary}
                            />
                          )}
                        </View>
                        <Text style={styles.selectedSkill}>
                          {artisan.skill}
                        </Text>
                        <View style={styles.selectedMetrics}>
                          <View style={styles.metricItem}>
                            <Ionicons
                              name="star"
                              size={14}
                              color={colors.star}
                            />
                            <Text style={styles.metricText}>
                              {artisan.rating}
                            </Text>
                          </View>
                          <View style={styles.metricItem}>
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color={THEME.colors.muted}
                            />
                            <Text style={styles.metricText}>
                              {artisan.distance}
                            </Text>
                          </View>
                          <Text style={styles.selectedPrice}>
                            NGN {artisan.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() =>
                        router.push({
                          pathname:
                            artisan.type === "business"
                              ? "/client/business-details"
                              : "/client/artisan-details",
                          params: {
                            id: artisan.id,
                            name: artisan.name,
                            businessName: artisan.name,
                            skill: artisan.skill,
                            price: artisan.price,
                            rating: artisan.rating,
                            reviews: artisan.reviews,
                            distance: artisan.distance,
                            verified: String(artisan.verified),
                          },
                        })
                      }
                    >
                      <Text style={styles.viewProfileButtonText}>
                        View Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })()}
            </View>
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={THEME.colors.primary}
              colors={[THEME.colors.primary]}
            />
          }
        >
          {filteredArtisans.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Ionicons
                name="search-outline"
                size={64}
                color={colors.muted}
                style={{ opacity: 0.5 }}
              />
              <Text
                style={{
                  marginTop: 16,
                  color: colors.muted,
                  fontFamily: THEME.typography.fontFamily.subheading,
                }}
              >
                No results found
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  color: colors.muted,
                  textAlign: "center",
                }}
              >
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredArtisans.map((artisan) => (
              <EnhancedArtisanCard
                key={artisan.id}
                artisan={{
                  ...artisan,
                  type: artisan.type as "individual" | "business",
                  verificationLevel: artisan.verified ? "verified" : "none",
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* View Toggle - Floating Button */}
      {!selectedArtisan && (
        <TouchableOpacity
          style={styles.floatingToggle}
          onPress={() => setViewMode(viewMode === "map" ? "list" : "map")}
        >
          <Ionicons
            name={viewMode === "map" ? "list" : "map"}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.floatingToggleText}>
            {viewMode === "map" ? "List View" : "Map View"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes["2xl"],
    color: THEME.colors.text,
    marginBottom: 16,
  },
  typeToggle: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // Search Bar
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
    marginBottom: THEME.spacing.md,
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

  // Filter Chips
  filterContainer: {
    marginBottom: THEME.spacing.md,
  },
  promoSection: {
    marginBottom: THEME.spacing.md,
  },
  promoSectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 10,
  },
  promoScrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 10,
  },
  promoCard: {
    width: 220,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    padding: 14,
    ...THEME.shadow.card,
  },
  promoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  promoTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 16,
    marginBottom: 10,
  },
  promoCta: {
    alignSelf: "flex-start",
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  promoCtaText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 8, // Avoid shadow clipping
  },
  filterChip: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: THEME.colors.surface,
    ...THEME.shadow.card, // Added shadow for better visibility
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterChipText: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  filterChipTextActive: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Map View
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    ...THEME.shadow.card,
    position: "relative",
  },
  markerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  markerArrow: {
    position: "absolute",
    bottom: -6,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: THEME.colors.primary,
  },
  markerSelected: {
    backgroundColor: THEME.colors.secondary,
    transform: [{ scale: 1.2 }],
    zIndex: 10,
  },
  zoomContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    gap: 12,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
  },

  // Selected Artisan Card Overlay
  selectedCardOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  selectedCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: 16,
    ...THEME.shadow.card,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  selectedCardContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  selectedAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  selectedInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  selectedName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    flex: 1,
  },
  selectedSkill: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginBottom: 6,
  },
  selectedMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  selectedPrice: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
    marginLeft: "auto",
  },
  viewProfileButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewProfileButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // List View
  listContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  artisanCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
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
    backgroundColor: THEME.colors.warningLight,
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
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // Floating Toggle
  floatingToggle: {
    position: "absolute",
    bottom: 100, // Above tab bar
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: THEME.colors.text, // Inverted for contrast
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    ...THEME.shadow.card,
    zIndex: 10,
  },
  floatingToggleText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },
});
