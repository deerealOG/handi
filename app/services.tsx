// app/services.tsx
// Services Page for HANDI - "Find the Perfect Service"

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import mockApi, { getServices, searchAll, Service } from "@/services/mockApi";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { THEME } from "../constants/theme";

const SERVICE_CATEGORIES = [
  { id: "all", label: "All Categories", icon: "view-grid" },
  { id: "electrical", label: "Electrical", icon: "lightning-bolt" },
  { id: "plumbing", label: "Plumbing", icon: "water-pump" },
  { id: "beauty", label: "Beauty & Wellness", icon: "spa" },
  { id: "cleaning", label: "Cleaning", icon: "broom" },
  { id: "home", label: "Home Improvement", icon: "home-edit" },
  { id: "mechanical", label: "Mechanical", icon: "car-wrench" },
  { id: "construction", label: "Construction", icon: "hammer" },
  { id: "technology", label: "Technology", icon: "laptop" },
  { id: "automotive", label: "Automotive", icon: "car" },
  { id: "gardening", label: "Gardening & Landscaping", icon: "flower" },
  { id: "pest", label: "Pest Control", icon: "bug" },
  { id: "event", label: "Event & Party", icon: "party-popper" },
  { id: "moving", label: "Moving & Haulage", icon: "truck" },
  { id: "security", label: "Security", icon: "shield-lock" },
  {
    id: "appliance",
    label: "Appliance Installation & Repair",
    icon: "washing-machine",
  },
  { id: "fitness", label: "Fitness & Personal Training", icon: "dumbbell" },
  { id: "tutoring", label: "Private Tutoring & Educational", icon: "school" },
  { id: "fashion", label: "Fashion & Styling", icon: "tshirt-crew" },
  { id: "legal", label: "Legal", icon: "scale-balance" },
  { id: "pet", label: "Pet", icon: "paw" },
  { id: "photography", label: "Photography & Videography", icon: "camera" },
  { id: "handyman", label: "General Handyman", icon: "tools" },
  { id: "laundry", label: "Laundry & Dry Cleaning", icon: "tshirt-crew" },
  { id: "courier", label: "Courier & Delivery", icon: "package-variant" },
];

const CATEGORY_GRID = SERVICE_CATEGORIES.slice(1, 17); // First 16 categories for grid

export default function ServicesPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Lagos");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Load initial services
  useEffect(() => {
    loadServices();
  }, [activeCategory]);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await getServices({
        category: activeCategory !== "all" ? activeCategory : undefined,
        location: locationQuery || undefined,
      });
      setServices(results);
      setResultCount(results.length);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, locationQuery]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      loadServices();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchAll(searchQuery, {
        category: activeCategory !== "all" ? activeCategory : undefined,
        location: locationQuery || undefined,
      });
      setServices(results.services);
      setResultCount(results.services.length);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeCategory, locationQuery, loadServices]);

  const handleBookService = useCallback(
    async (service: Service) => {
      const result = await mockApi.bookService({
        serviceId: service.id,
        providerId: service.provider,
        date: new Date().toISOString(),
        time: "10:00",
        address: locationQuery || "Lagos, Nigeria",
      });

      if (Platform.OS === "web") {
        alert(result.message);
      } else {
        Alert.alert("Booking", result.message);
      }
    },
    [locationQuery],
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setLocationQuery("Lagos");
    setActiveCategory("all");
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="services" />

      {/* Hero Section */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.heroSection, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Find the Perfect <Text style={styles.heroHighlight}>Service</Text>
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
          Discover and book professional services from verified providers in
          your area.
          {"\n"}Quality guaranteed, satisfaction assured.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputGroup}>
            <Icon name="magnify" size={20} color={THEME.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="What service do you need?"
              placeholderTextColor={THEME.colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <View style={styles.searchDivider} />

          <View style={styles.searchInputGroup}>
            <Icon
              name="map-marker-outline"
              size={20}
              color={THEME.colors.muted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter location"
              placeholderTextColor={THEME.colors.muted}
              value={locationQuery}
              onChangeText={setLocationQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="magnify" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {SERVICE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                activeCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === category.id &&
                    styles.categoryChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service Count */}
        <Text style={[styles.serviceCount, { color: colors.muted }]}>
          {isLoading ? "Loading..." : `${resultCount} services found`}
        </Text>

        {/* Filter Actions */}
        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.filterButton}>
            <Icon
              name="navigation-variant"
              size={18}
              color={THEME.colors.text}
            />
            <Text style={styles.filterButtonText}>Use My Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune-variant" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleClearFilters}
          >
            <Icon name="close" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Location Tags */}
        <View style={styles.locationTags}>
          <Text style={[styles.locationLabel, { color: colors.muted }]}>
            Searching in:
          </Text>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>
              {locationQuery || "All Nigeria"}
            </Text>
          </View>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>Country: Nigeria</Text>
          </View>
        </View>
      </Animated.View>

      {/* All Services Section */}
      <View style={styles.servicesSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              All Services
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              Within 50km of your location
            </Text>
          </View>

          <TouchableOpacity style={styles.filtersHeaderButton}>
            <Icon name="tune-variant" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Service Card Example */}
        <View style={styles.serviceCardGrid}>
          <View style={styles.serviceCard}>
            <View style={styles.serviceCardImage}>
              <View style={styles.serviceCardBadge}>
                <Text style={styles.serviceCardBadgeText}>
                  Leak Detection & Repair
                </Text>
              </View>
              <View style={styles.serviceCardDuration}>
                <Icon name="clock-outline" size={14} color="#FFFFFF" />
                <Text style={styles.serviceCardDurationText}>1hr</Text>
              </View>
            </View>
            <View style={styles.serviceCardContent}>
              <Text style={[styles.serviceCardTitle, { color: colors.text }]}>
                Leak Fixing and Plumbing Repairs
              </Text>
              <Text style={[styles.serviceCardDesc, { color: colors.muted }]}>
                We offer same day booking and fixing of plumbing leaks in
                Port Harcourt. Professional and clean jobs
              </Text>
              <View style={styles.serviceCardRating}>
                <Icon name="star" size={14} color="#FACC15" />
                <Text style={styles.serviceCardRatingText}>5</Text>
                <Text
                  style={[styles.serviceCardReviews, { color: colors.muted }]}
                >
                  (2 reviews)
                </Text>
              </View>
              <View style={styles.serviceCardLocation}>
                <Icon name="map-marker" size={14} color={THEME.colors.muted} />
                <Text
                  style={[
                    styles.serviceCardLocationText,
                    { color: colors.muted },
                  ]}
                >
                  Port Harcourt
                </Text>
              </View>
              <View style={styles.serviceCardPricing}>
                <Text style={styles.serviceCardPrice}>NGN5000</Text>
                <Text style={styles.serviceCardOldPrice}>NGN1500</Text>
              </View>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Browse by Category Section */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(800)}
        style={styles.browseSection}
      >
        <Text style={[styles.browseSectionTitle, { color: colors.text }]}>
          Browse by Category
        </Text>
        <Text style={[styles.browseSectionSubtitle, { color: colors.muted }]}>
          Discover professional services tailored to your needs
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORY_GRID.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => setActiveCategory(category.id)}
            >
              <View style={styles.categoryIconContainer}>
                <Icon
                  name={category.icon as any}
                  size={28}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.showAllButton}>
          <Text style={styles.showAllText}>Show All 24 Categories</Text>
        </TouchableOpacity>

        <Text style={[styles.categoryStats, { color: colors.muted }]}>
          24+ categories • 1000+ service providers • 4.5+ average rating
        </Text>
      </Animated.View>

      {/* Footer */}
      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Navigation
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: Platform.OS === "web" ? 24 : 60,
    paddingBottom: THEME.spacing.md,
    backgroundColor: "#3c4a3e",
  },
  navLogo: {
    width: 70,
    height: 70,
  },
  navLinks: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navButtons: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navLinkText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },
  navLinkActive: {
    color: THEME.colors.secondary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  signUpButtonText: {
    color: "#1F2937",
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#FFF9F0",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 42 : 28,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  heroHighlight: {
    color: THEME.colors.secondary,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },

  // Search
  searchContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.sm,
    width: "100%",
    maxWidth: 600,
    ...THEME.shadow.card,
  },
  searchInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    paddingVertical: THEME.spacing.sm,
    color: "#1F2937",
  },
  searchDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
    marginHorizontal: THEME.spacing.sm,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },

  // Categories
  categoryScroll: {
    marginTop: THEME.spacing.xl,
    maxWidth: "100%",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  categoryChipText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },

  // Service count
  serviceCount: {
    marginTop: THEME.spacing.lg,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },

  // Filter actions
  filterActions: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
    backgroundColor: "#FFFFFF",
  },
  filterButtonText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },

  // Location tags
  locationTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.md,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  locationLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  locationTagText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.primary,
  },

  // Services section
  servicesSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  filtersHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
  },

  // Service Cards
  serviceCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.lg,
  },
  serviceCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  serviceCardImage: {
    height: 180,
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  serviceCardBadge: {
    position: "absolute",
    top: THEME.spacing.sm,
    left: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  serviceCardBadgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  serviceCardDuration: {
    position: "absolute",
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  serviceCardDurationText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
  },
  serviceCardContent: {
    padding: THEME.spacing.md,
  },
  serviceCardTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  serviceCardDesc: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
    marginBottom: THEME.spacing.sm,
  },
  serviceCardRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: THEME.spacing.xs,
  },
  serviceCardRatingText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  serviceCardReviews: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  serviceCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: THEME.spacing.sm,
  },
  serviceCardLocationText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  serviceCardPricing: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  serviceCardPrice: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  serviceCardOldPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textDecorationLine: "line-through",
  },
  bookNowButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    alignItems: "center",
  },
  bookNowText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },

  // Browse by Category
  browseSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  browseSectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  browseSectionSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.md,
    maxWidth: 900,
    marginBottom: THEME.spacing.lg,
  },
  categoryCard: {
    width: Platform.OS === "web" ? 140 : "45%",
    padding: THEME.spacing.lg,
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.sm,
  },
  categoryLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },
  showAllButton: {
    marginVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
  },
  showAllText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  categoryStats: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.md,
  },

  // Footer
  footer: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#1F2937",
  },
  footerMain: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing["2xl"],
    marginBottom: THEME.spacing["2xl"],
  },
  footerBrand: {
    maxWidth: 300,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: THEME.spacing.md,
  },
  footerBrandText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  footerLinks: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.xl,
  },
  footerColumn: {
    minWidth: 120,
  },
  footerColumnTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
  },
  footerLink: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.sm,
  },
  footerPayment: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
    paddingVertical: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginBottom: THEME.spacing.lg,
  },
  footerPaymentLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  footerPaymentIcons: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  paymentIcon: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#9CA3AF",
    backgroundColor: "#374151",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 4,
  },
  footerBottom: {
    alignItems: "center",
    paddingTop: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  footerCopyright: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.xs,
  },
  footerCompany: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#6B7280",
  },
});
