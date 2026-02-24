// app/landing.tsx
// Web Landing Page for HANDI - Jumia/Jiji Style Marketplace

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { Colors, THEME } from "../constants/theme";

const { width } = Dimensions.get("window");
const isDesktop = Platform.OS === "web" && width > 1024;
const isTablet = Platform.OS === "web" && width > 768 && width <= 1024;
const isMobile = Platform.OS !== "web" || width <= 768;

// Service Categories
const SERVICE_CATEGORIES = [
  { id: "electrical", label: "Electrical", icon: "lightning-bolt" },
  { id: "plumbing", label: "Plumbing", icon: "water-pump" },
  { id: "beauty", label: "Beauty & Wellness", icon: "spa" },
  { id: "cleaning", label: "Cleaning", icon: "broom" },
  { id: "home", label: "Home Improvement", icon: "home-edit" },
  { id: "mechanical", label: "Mechanical", icon: "car-wrench" },
  { id: "construction", label: "Construction", icon: "hammer" },
  { id: "technology", label: "Technology", icon: "laptop" },
  { id: "automotive", label: "Automotive", icon: "car" },
  { id: "gardening", label: "Gardening", icon: "flower" },
  { id: "pest", label: "Pest Control", icon: "bug" },
  { id: "event", label: "Event & Party", icon: "party-popper" },
  { id: "moving", label: "Moving", icon: "truck" },
  { id: "security", label: "Security", icon: "shield-lock" },
  { id: "appliance", label: "Appliance Repair", icon: "washing-machine" },
  { id: "fitness", label: "Fitness", icon: "dumbbell" },
];

// Mock Provider Data
const MOCK_PROVIDERS = [
  {
    id: "1",
    name: "Adebayo Electricals",
    category: "Electrical",
    image: null,
    location: "Ikeja, Lagos",
    rating: 4.8,
    reviews: 156,
    price: "₦5,000 - ₦50,000",
    isOnline: true,
    badge: "Top Rated",
  },
  {
    id: "2",
    name: "QueenB Beauty Lounge",
    category: "Beauty & Wellness",
    image: null,
    location: "Lekki, Lagos",
    rating: 4.9,
    reviews: 312,
    price: "₦3,000 - ₦25,000",
    isOnline: true,
    badge: "Featured",
  },
  {
    id: "3",
    name: "FastFix Plumbing",
    category: "Plumbing",
    image: null,
    location: "Yaba, Lagos",
    rating: 4.6,
    reviews: 89,
    price: "₦8,000 - ₦80,000",
    isOnline: false,
    badge: null,
  },
  {
    id: "4",
    name: "CleanPro Services",
    category: "Cleaning",
    image: null,
    location: "Victoria Island, Lagos",
    rating: 4.7,
    reviews: 203,
    price: "₦10,000 - ₦60,000",
    isOnline: true,
    badge: "Verified",
  },
  {
    id: "5",
    name: "TechMasters NG",
    category: "Technology",
    image: null,
    location: "Surulere, Lagos",
    rating: 4.5,
    reviews: 67,
    price: "₦15,000 - ₦100,000",
    isOnline: true,
    badge: null,
  },
  {
    id: "6",
    name: "AutoCare Mechanics",
    category: "Automotive",
    image: null,
    location: "Agege, Lagos",
    rating: 4.4,
    reviews: 124,
    price: "₦20,000 - ₦200,000",
    isOnline: false,
    badge: "Specialist",
  },
  {
    id: "7",
    name: "HomeStyle Interiors",
    category: "Home Improvement",
    image: null,
    location: "Ikoyi, Lagos",
    rating: 4.9,
    reviews: 78,
    price: "₦50,000 - ₦500,000",
    isOnline: true,
    badge: "Premium",
  },
  {
    id: "8",
    name: "GreenThumb Gardens",
    category: "Gardening",
    image: null,
    location: "Magodo, Lagos",
    rating: 4.3,
    reviews: 45,
    price: "₦15,000 - ₦80,000",
    isOnline: true,
    badge: null,
  },
  {
    id: "9",
    name: "EventPro Planners",
    category: "Event & Party",
    image: null,
    location: "Ajah, Lagos",
    rating: 4.8,
    reviews: 167,
    price: "₦100,000 - ₦2,000,000",
    isOnline: true,
    badge: "Top Rated",
  },
  {
    id: "10",
    name: "SecureGuard Services",
    category: "Security",
    image: null,
    location: "Oshodi, Lagos",
    rating: 4.6,
    reviews: 92,
    price: "₦30,000 - ₦150,000",
    isOnline: false,
    badge: "Verified",
  },
  {
    id: "11",
    name: "FitLife Personal Training",
    category: "Fitness",
    image: null,
    location: "Gbagada, Lagos",
    rating: 4.7,
    reviews: 134,
    price: "₦20,000 - ₦100,000",
    isOnline: true,
    badge: null,
  },
  {
    id: "12",
    name: "BuildRight Construction",
    category: "Construction",
    image: null,
    location: "Ojota, Lagos",
    rating: 4.5,
    reviews: 56,
    price: "₦500,000 - ₦10,000,000",
    isOnline: true,
    badge: "Specialist",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const colors = Colors.light;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}` as any);
    }
  };

  const filteredProviders = selectedCategory
    ? MOCK_PROVIDERS.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      )
    : MOCK_PROVIDERS;

  const getGridColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };

  return (
    <ScrollView
      style={[styles.scrollContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="home" />

      {/* ========================================
          TOP BANNER / SEARCH BAR
      ======================================== */}
      <View style={styles.topBanner}>
        <View style={styles.topBannerContent}>
          <Text style={styles.bannerTitle}>
            Find Trusted{" "}
            <Text style={styles.bannerHighlight}>Service Providers</Text>
          </Text>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={20} color={THEME.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services, providers..."
              placeholderTextColor={THEME.colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ========================================
          MAIN THREE-COLUMN LAYOUT
      ======================================== */}
      <View style={styles.mainLayout}>
        {/* LEFT SIDEBAR - Categories */}
        {(isDesktop || isTablet) && (
          <Animated.View
            entering={FadeIn.duration(600)}
            style={styles.leftSidebar}
          >
            <Text style={styles.sidebarTitle}>Categories</Text>
            <ScrollView
              style={styles.categoryList}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  !selectedCategory && styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Icon
                  name="view-grid"
                  size={18}
                  color={
                    !selectedCategory
                      ? THEME.colors.primary
                      : THEME.colors.muted
                  }
                />
                <Text
                  style={[
                    styles.categoryItemText,
                    !selectedCategory && styles.categoryItemTextActive,
                  ]}
                >
                  All Services
                </Text>
              </TouchableOpacity>
              {SERVICE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat.id && styles.categoryItemActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Icon
                    name={cat.icon as any}
                    size={18}
                    color={
                      selectedCategory === cat.id
                        ? THEME.colors.primary
                        : THEME.colors.muted
                    }
                  />
                  <Text
                    style={[
                      styles.categoryItemText,
                      selectedCategory === cat.id &&
                        styles.categoryItemTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* CENTER - Provider Grid */}
        <View style={styles.centerContent}>
          {/* Mobile Category Toggle */}
          {isMobile && (
            <TouchableOpacity
              style={styles.mobileCategoryToggle}
              onPress={() => setShowMobileCategories(!showMobileCategories)}
            >
              <Icon name="menu" size={20} color={THEME.colors.primary} />
              <Text style={styles.mobileCategoryText}>
                {selectedCategory
                  ? SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)
                      ?.label
                  : "All Categories"}
              </Text>
              <Icon
                name={showMobileCategories ? "chevron-up" : "chevron-down"}
                size={20}
                color={THEME.colors.primary}
              />
            </TouchableOpacity>
          )}

          {/* Mobile Categories Dropdown */}
          {isMobile && showMobileCategories && (
            <View style={styles.mobileCategoryDropdown}>
              <TouchableOpacity
                style={[
                  styles.mobileCategoryItem,
                  !selectedCategory && styles.mobileCategoryItemActive,
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setShowMobileCategories(false);
                }}
              >
                <Text style={styles.mobileCategoryItemText}>All Services</Text>
              </TouchableOpacity>
              {SERVICE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.mobileCategoryItem,
                    selectedCategory === cat.id &&
                      styles.mobileCategoryItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    setShowMobileCategories(false);
                  }}
                >
                  <Text style={styles.mobileCategoryItemText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Hero Banner */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.heroBanner}
          >
            <View style={styles.heroBannerContent}>
              <Text style={styles.heroBannerTitle}>
                Professional Services,{"\n"}
                <Text style={styles.heroBannerHighlight}>
                  Right at Your Fingertips
                </Text>
              </Text>
              <Text style={styles.heroBannerSubtitle}>
                Connect with verified professionals today
              </Text>
              <TouchableOpacity
                style={styles.heroBannerButton}
                onPress={() => router.push("/services" as any)}
              >
                <Text style={styles.heroBannerButtonText}>
                  Explore Services
                </Text>
                <Icon name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Image
              source={require("../assets/images/hero-nigerian-family.png")}
              style={styles.heroBannerImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {filteredProviders.length} Provider
              {filteredProviders.length !== 1 ? "s" : ""} Available
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="sort" size={18} color={THEME.colors.text} />
              <Text style={styles.sortButtonText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Provider Grid */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={[
              styles.providerGrid,
              {
                // @ts-ignore - web-only CSS
                gridTemplateColumns:
                  Platform.OS === "web"
                    ? `repeat(${getGridColumns()}, 1fr)`
                    : undefined,
              },
            ]}
          >
            {filteredProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.providerCard}
                onPress={() => router.push(`/providers/${provider.id}` as any)}
              >
                {/* Badge */}
                {provider.badge && (
                  <View style={styles.providerBadge}>
                    <Text style={styles.providerBadgeText}>
                      {provider.badge}
                    </Text>
                  </View>
                )}

                {/* Image Placeholder */}
                <View style={styles.providerImageContainer}>
                  <Icon name="account" size={48} color={THEME.colors.muted} />
                </View>

                {/* Content */}
                <View style={styles.providerContent}>
                  <Text style={styles.providerName} numberOfLines={1}>
                    {provider.name}
                  </Text>
                  <Text style={styles.providerCategory}>
                    {provider.category}
                  </Text>

                  <View style={styles.providerLocationRow}>
                    <Icon
                      name="map-marker"
                      size={14}
                      color={THEME.colors.muted}
                    />
                    <Text style={styles.providerLocation} numberOfLines={1}>
                      {provider.location}
                    </Text>
                  </View>

                  <View style={styles.providerRatingRow}>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name={
                            star <= Math.floor(provider.rating)
                              ? "star"
                              : "star-outline"
                          }
                          size={14}
                          color="#FACC15"
                        />
                      ))}
                    </View>
                    <Text style={styles.providerReviews}>
                      ({provider.reviews})
                    </Text>
                  </View>

                  <Text style={styles.providerPrice}>{provider.price}</Text>

                  <View style={styles.providerStatus}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: provider.isOnline
                            ? "#22C55E"
                            : "#9CA3AF",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: provider.isOnline ? "#22C55E" : "#9CA3AF" },
                      ]}
                    >
                      {provider.isOnline ? "Available" : "Offline"}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.providerActions}>
                    <TouchableOpacity style={styles.callButton}>
                      <Icon name="phone" size={14} color="#FFFFFF" />
                      <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Load More */}
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Providers</Text>
            <Icon name="chevron-down" size={18} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* RIGHT SIDEBAR - CTAs (Desktop Only) */}
        {isDesktop && (
          <Animated.View
            entering={FadeIn.delay(300).duration(600)}
            style={styles.rightSidebar}
          >
            {/* Call to Order */}
            <View style={styles.rightSidebarCard}>
              <View style={styles.ctaIconCircle}>
                <Icon name="phone" size={24} color={THEME.colors.primary} />
              </View>
              <Text style={styles.ctaCardTitle}>Need Help?</Text>
              <Text style={styles.ctaCardPhone}>0800-HANDI-NG</Text>
              <Text style={styles.ctaCardSubtitle}>24/7 Customer Support</Text>
            </View>

            {/* Become a Provider */}
            <View
              style={[
                styles.rightSidebarCard,
                { backgroundColor: THEME.colors.primary },
              ]}
            >
              <Icon name="account-plus" size={32} color="#FFFFFF" />
              <Text style={[styles.ctaCardTitle, { color: "#FFFFFF" }]}>
                Become a Provider
              </Text>
              <Text
                style={[
                  styles.ctaCardSubtitle,
                  { color: "rgba(255,255,255,0.8)" },
                ]}
              >
                Start earning by offering your services
              </Text>
              <TouchableOpacity
                style={styles.ctaCardButton}
                onPress={() => router.push("/auth/register-provider" as any)}
              >
                <Text style={styles.ctaCardButtonText}>Sign Up Free</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Badges */}
            <View style={styles.rightSidebarCard}>
              <Text style={styles.ctaCardTitle}>Why Choose HANDI?</Text>
              <View style={styles.trustBadge}>
                <Icon
                  name="shield-check"
                  size={18}
                  color={THEME.colors.primary}
                />
                <Text style={styles.trustBadgeText}>Verified Providers</Text>
              </View>
              <View style={styles.trustBadge}>
                <Icon name="cash-lock" size={18} color={THEME.colors.primary} />
                <Text style={styles.trustBadgeText}>Secure Payments</Text>
              </View>
              <View style={styles.trustBadge}>
                <Icon name="headset" size={18} color={THEME.colors.primary} />
                <Text style={styles.trustBadgeText}>24/7 Support</Text>
              </View>
              <View style={styles.trustBadge}>
                <Icon name="star" size={18} color={THEME.colors.primary} />
                <Text style={styles.trustBadgeText}>Top-Rated Services</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ========================================
          BOTTOM CTA SECTION
      ======================================== */}
      <View style={styles.bottomCta}>
        <Text style={styles.bottomCtaTitle}>Ready to Get Started?</Text>
        <Text style={styles.bottomCtaSubtitle}>
          Join thousands of satisfied customers and providers on HANDI
        </Text>
        <View style={styles.bottomCtaButtons}>
          <TouchableOpacity
            style={styles.bottomCtaPrimary}
            onPress={() => router.push("/auth/register-client" as any)}
          >
            <Text style={styles.bottomCtaPrimaryText}>Find Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomCtaSecondary}
            onPress={() => router.push("/auth/register-provider" as any)}
          >
            <Text style={styles.bottomCtaSecondaryText}>Become a Provider</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ========== TOP BANNER ==========
  topBanner: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
  },
  topBannerContent: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: Platform.OS === "web" && width > 768 ? 28 : 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  bannerHighlight: {
    color: THEME.colors.secondary,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.pill,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    width: "100%",
    maxWidth: 600,
    ...THEME.shadow.card,
  },
  searchInput: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    paddingVertical: THEME.spacing.sm,
    marginLeft: THEME.spacing.sm,
    color: THEME.colors.text,
  },
  searchButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },

  // ========== MAIN LAYOUT ==========
  mainLayout: {
    flexDirection: Platform.OS === "web" && width > 768 ? "row" : "column",
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.lg,
    gap: THEME.spacing.lg,
  },

  // ========== LEFT SIDEBAR ==========
  leftSidebar: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
    maxHeight: 700,
  },
  sidebarTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    marginBottom: THEME.spacing.xs,
  },
  categoryItemActive: {
    backgroundColor: THEME.colors.primary + "15",
  },
  categoryItemText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    flex: 1,
  },
  categoryItemTextActive: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.primary,
  },

  // ========== CENTER CONTENT ==========
  centerContent: {
    flex: 1,
  },

  // Mobile Category Toggle
  mobileCategoryToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: "#FFFFFF",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  mobileCategoryText: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  mobileCategoryDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
    maxHeight: 300,
    overflow: "hidden",
  },
  mobileCategoryItem: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  mobileCategoryItemActive: {
    backgroundColor: THEME.colors.primary + "15",
  },
  mobileCategoryItemText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },

  // Hero Banner
  heroBanner: {
    flexDirection: Platform.OS === "web" && width > 768 ? "row" : "column",
    backgroundColor: "#FFF9F0",
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.card,
  },
  heroBannerContent: {
    flex: 1,
    padding: THEME.spacing.xl,
    justifyContent: "center",
  },
  heroBannerTitle: {
    fontSize: Platform.OS === "web" && width > 768 ? 28 : 22,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  heroBannerHighlight: {
    color: THEME.colors.primary,
  },
  heroBannerSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginBottom: THEME.spacing.lg,
  },
  heroBannerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    alignSelf: "flex-start",
  },
  heroBannerButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },
  heroBannerImage: {
    width: Platform.OS === "web" && width > 768 ? 280 : "100%",
    height: Platform.OS === "web" && width > 768 ? 200 : 180,
  },

  // Results Header
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  resultsTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
  },
  sortButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },

  // Provider Grid
  providerGrid: {
    ...(Platform.OS === "web"
      ? ({
          display: "grid",
          gap: 16,
        } as any)
      : {
          flexDirection: "column",
          gap: 16,
        }),
  },

  // Provider Card
  providerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.md,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  providerBadge: {
    position: "absolute",
    top: THEME.spacing.sm,
    left: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.pill,
    zIndex: 1,
  },
  providerBadgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  providerImageContainer: {
    height: 140,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  providerContent: {
    padding: THEME.spacing.md,
  },
  providerName: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  providerCategory: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  providerLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: THEME.spacing.sm,
  },
  providerLocation: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    flex: 1,
  },
  providerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  starsContainer: {
    flexDirection: "row",
  },
  providerReviews: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  providerPrice: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  providerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  providerActions: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.xs,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
  },
  callButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  viewButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  viewButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },

  // Load More
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    paddingVertical: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.md,
  },
  loadMoreText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.primary,
  },

  // ========== RIGHT SIDEBAR ==========
  rightSidebar: {
    width: 280,
    gap: THEME.spacing.md,
  },
  rightSidebarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  ctaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  ctaCardTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  ctaCardPhone: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  ctaCardSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
  },
  ctaCardButton: {
    marginTop: THEME.spacing.md,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  ctaCardButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.primary,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    width: "100%",
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  trustBadgeText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },

  // ========== BOTTOM CTA ==========
  bottomCta: {
    backgroundColor: THEME.colors.secondary,
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  bottomCtaTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  bottomCtaSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
    maxWidth: 500,
  },
  bottomCtaButtons: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.md,
  },
  bottomCtaPrimary: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  bottomCtaPrimaryText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  bottomCtaSecondary: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.text,
  },
  bottomCtaSecondaryText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
});
