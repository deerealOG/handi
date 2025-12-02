import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FilterModal, { FilterOptions } from "../../../components/FilterModal";
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
    latitude: 6.5290,
    longitude: 3.3750,
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
    latitude: 6.5200,
    longitude: 3.3820,
  },
];

const CATEGORIES = ["All", "Electrician", "Plumber", "Carpenter", "Painter", "Barber", "Gardener"];

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(params.category?.toString() || "All");
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100000],
    rating: 0,
    verifiedOnly: false,
    distance: 100,
  });
  const [selectedArtisan, setSelectedArtisan] = useState<number | null>(null);

  const filteredArtisans = ARTISANS.filter((artisan) => {
    if (activeFilter !== "All" && artisan.skill !== activeFilter) return false;
    if (filters.verifiedOnly && !artisan.verified) return false;
    if (artisan.rating < filters.rating) return false;
    const price = parseInt(artisan.price.replace(/,/g, ""));
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    return true;
  });

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  const handleBookArtisan = (artisan: { id: number; name: string; skill: string; price: string; rating: number; reviews: number; distance: string; verified: boolean; latitude: number; longitude: number; }): void => {
    setSelectedArtisan(artisan.id);
  };

  const handleHeartPress = (id: number): void => {
    setSelectedArtisan((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Artisans</Text>
      </View>

      {/* Search Bar - Consistent with home */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={THEME.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for artisans..."
          placeholderTextColor={THEME.colors.muted}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color={THEME.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                const artisan = filteredArtisans.find((a) => a.id === selectedArtisan);
                if (!artisan) return null;
                return (
                  <View style={styles.selectedCard}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedArtisan(null)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close" size={20} color={THEME.colors.muted} />
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
                        <Text style={styles.selectedSkill}>{artisan.skill}</Text>
                        <View style={styles.selectedMetrics}>
                          <View style={styles.metricItem}>
                            <Ionicons name="star" size={14} color="#FACC15" />
                            <Text style={styles.metricText}>{artisan.rating}</Text>
                          </View>
                          <View style={styles.metricItem}>
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color={THEME.colors.muted}
                            />
                            <Text style={styles.metricText}>{artisan.distance}</Text>
                          </View>
                          <Text style={styles.selectedPrice}>₦{artisan.price}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() =>
                        router.push({
                          pathname: "/client/artisan-details",
                          params: { id: artisan.id, name: artisan.name, skill: artisan.skill, price: artisan.price, rating: artisan.rating, reviews: artisan.reviews, distance: artisan.distance, verified: String(artisan.verified) },
                        })
                      }
                    >
                      <Text style={styles.viewProfileButtonText}>View Profile</Text>
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
        >
          {filteredArtisans.map((artisan) => (
            <TouchableOpacity
              key={artisan.id}
              style={styles.artisanCard}
              onPress={() =>
                router.push({
                  pathname: "/client/artisan-details",
                  params: { id: artisan.id, name: artisan.name, skill: artisan.skill, price: artisan.price, rating: artisan.rating, reviews: artisan.reviews, distance: artisan.distance, verified: String(artisan.verified) },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Image
                  source={require("../../../assets/images/profileavatar.png")}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.heartButton} onPress={() => handleHeartPress(artisan.id)}>
                  <Ionicons name="heart-outline" size={20} color={THEME.colors.muted} />
                </TouchableOpacity>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text style={styles.artisanName} numberOfLines={1}>
                    {artisan.name}
                  </Text>
                  {artisan.verified && (
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={16}
                      color={THEME.colors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text style={styles.artisanSkill}>{artisan.skill}</Text>

                <View style={styles.infoRow}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FACC15" />
                    <Text style={styles.ratingText}>{artisan.rating}</Text>
                    <Text style={styles.reviewText}>({artisan.reviews})</Text>
                  </View>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location-outline" size={14} color={THEME.colors.muted} />
                    <Text style={styles.distanceText}>{artisan.distance}</Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.priceValue}>₦{artisan.price}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.bookButton} 
                  onPress={() =>
                    router.push({
                      pathname: "/client/book-artisan",
                      params: { artisan: artisan.name, skill: artisan.skill },
                    })
                  }
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
            color={THEME.colors.surface}
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
    backgroundColor: "#1F2937", // Dark color
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
