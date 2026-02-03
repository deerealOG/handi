// app/landing.tsx
// Web Landing Page for HANDI

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
const isDesktop = Platform.OS === "web" && width > 768;

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
];

export default function LandingPage() {
  const router = useRouter();
  // Marketing pages always use light theme for consistent branding
  const colors = Colors.light;
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}` as any,
      );
    }
  };

  const popularSearches = [
    "Plumber",
    "Hair Salon",
    "Massage Therapy",
    "House Cleaning",
    "Photography",
  ];

  return (
    <ScrollView
      style={[styles.scrollContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="home" />

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={[styles.heroSection, { backgroundColor: colors.surface }]}
      >
        {/* Hero Content - Split Layout */}
        <View style={styles.heroSplit}>
          {/* Left Side - Text Content */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(800)}
            style={styles.heroLeft}
          >
            <Text style={[styles.heroTitle, { color: THEME.colors.text }]}>
              Let's connect you to reliable{" "}
              <Text style={styles.heroTitleHighlight}>service providers</Text>
              {"\n"}
            </Text>
            <Text style={[styles.heroSubtitle, { color: THEME.colors.text }]}>
              Connect with trusted local businesses and service providers,
              manage bookings effortlessly, and grow your business with our
              all-in-one platform designed for success.
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputGroup}>
                <Icon name="magnify" size={20} color={THEME.colors.primary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="What service do you need?"
                  placeholderTextColor={THEME.colors.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
              </View>

              <View style={styles.searchInputGroup}>
                <Icon
                  name="map-marker-outline"
                  size={20}
                  color={THEME.colors.primary}
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

              <TouchableOpacity style={styles.filtersButton}>
                <Icon
                  name="tune-variant"
                  size={18}
                  color={THEME.colors.primary}
                />
                <Text style={styles.filtersText}>Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Icon name="magnify" size={18} color={THEME.colors.surface} />
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Popular Searches */}
            <View style={styles.popularSearches}>
              <Text
                style={[styles.popularLabel, { color: THEME.colors.primary }]}
              >
                Popular searches:
              </Text>
              <View style={styles.popularChips}>
                {popularSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.popularChip,
                      { borderColor: THEME.colors.primary },
                    ]}
                    onPress={() => {
                      setSearchQuery(search);
                      handleSearch();
                    }}
                  >
                    <Text
                      style={[
                        styles.popularChipText,
                        { color: THEME.colors.primary },
                      ]}
                    >
                      {search}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.ctaPrimary}
                onPress={() => router.push("/auth/register-client" as any)}
              >
                <Text style={styles.ctaPrimaryText}>Get Started Free</Text>
                <Icon name="arrow-right" size={18} color={THEME.colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ctaSecondary}
                onPress={() => router.push("/services" as any)}
              >
                <Icon
                  name="calendar-check"
                  size={18}
                  color={THEME.colors.primary}
                />
                <Text style={styles.ctaSecondaryText}>Book Services</Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} name="star" size={16} color="#FACC15" />
                ))}
              </View>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                <Text style={styles.ratingBold}>4.9/5</Text>
                {"  "}From platform reviews
              </Text>
            </View>
          </Animated.View>

          {/* Right Side - Hero Image with Floating Cards */}
          <Animated.View
            entering={FadeIn.delay(500).duration(1000)}
            style={styles.heroRight}
          >
            {/* Floating Card - Booking Confirmed */}
            <View style={styles.floatingCardTop}>
              <View style={styles.floatingCardIcon}>
                <Icon
                  name="check-circle"
                  size={20}
                  color={THEME.colors.primary}
                />
              </View>
              <View>
                <Text style={styles.floatingCardTitle}>Booking Confirmed</Text>
                <Text style={styles.floatingCardSubtitle}>
                  Hair appointment at 2 PM
                </Text>
              </View>
            </View>

            {/* Hero Image */}
            <Image
              source={require("../assets/images/hero-nigerian-family.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Floating Card - Payment Received */}
            <View style={styles.floatingCardBottom}>
              <View
                style={[
                  styles.floatingCardIcon,
                  { backgroundColor: "#EBF5FF" },
                ]}
              >
                <Icon
                  name="currency-ngn"
                  size={20}
                  color={THEME.colors.primary}
                />
              </View>
              <View>
                <Text style={styles.floatingCardTitle}>Payment Received</Text>
                <Text style={styles.floatingCardSubtitle}>
                  ₦150,000 from Sarah M.
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>


      {/* ========================================
          SERVICE CATEGORIES SECTION
      ======================================== */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(800)}
        style={styles.categoriesSection}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Service Categories
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          Discover Amazing Services Near You
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.muted }]}>
          From everyday needs to special occasions, find verified professionals
          who deliver exceptional results every time.
        </Text>

        <View style={styles.categoriesGrid}>
          {SERVICE_CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() =>
                router.push(`/services?category=${category.id}` as any)
              }
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

        <Text style={[styles.categoriesStats, { color: colors.muted }]}>
          24+ categories • 1000+ service providers • 4.5+ average rating
        </Text>
      </Animated.View>

      {/* ========================================
          READY TO GET STARTED CTA
      ======================================== */}
      <View style={styles.readySection}>
        <Text style={[styles.readyTitle, { color: colors.text }]}>
          Ready to Get Started?
        </Text>
        <Text style={[styles.readySubtitle, { color: colors.text }]}>
          Transform Your Service Experience Today
        </Text>
        <Text style={[styles.readyDescription, { color: colors.text }]}>
          Join the growing list of satisfied customers who have discovered the
          easiest way to book professional services. Your perfect service
          provider is just a click away.
        </Text>

        <View style={styles.readyButtons}>
          <TouchableOpacity
            style={styles.readyPrimaryBtn}
            onPress={() => router.push("/services" as any)}
          >
            <Text style={styles.readyPrimaryText}>Book Your First Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.readySecondaryBtn}>
            <Text style={styles.readySecondaryText}>Explore Features</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.readyNote, { color: colors.text }]}>
          No setup fees • Cancel anytime • 100% satisfaction guaranteed
        </Text>
      </View>

      {/* ========================================
          BENEFITS SECTION
      ======================================== */}
      <View style={styles.benefitsSection}>
        <View style={styles.benefitCard}>
          <View style={[styles.benefitIcon, { backgroundColor: "#E8F5E9" }]}>
            <Icon name="sale" size={24} color={THEME.colors.primary} />
          </View>
          <Text style={[styles.benefitTitle, { color: colors.text }]}>
            Some Providers offer 20% Off First Booking
          </Text>
          <Text style={[styles.benefitText, { color: colors.muted }]}>
            Most of our providers give new customers instant discount
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <View style={[styles.benefitIcon, { backgroundColor: "#E8F5E9" }]}>
            <Icon name="shield-check" size={24} color={THEME.colors.primary} />
          </View>
          <Text style={[styles.benefitTitle, { color: colors.text }]}>
            100% Satisfaction Guarantee
          </Text>
          <Text style={[styles.benefitText, { color: colors.muted }]}>
            Your happiness is our priority
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <View style={[styles.benefitIcon, { backgroundColor: "#E8F5E9" }]}>
            <Icon name="headset" size={24} color={THEME.colors.primary} />
          </View>
          <Text style={[styles.benefitTitle, { color: colors.text }]}>
            24/7 Customer Support
          </Text>
          <Text style={[styles.benefitText, { color: colors.muted }]}>
            We're here whenever you need us
          </Text>
        </View>
      </View>

      {/* ========================================
          NEWSLETTER SECTION
      ======================================== */}
      <View style={styles.newsletterSection}>
        <Text style={[styles.newsletterTitle, { color: colors.text }]}>
          Stay Updated with Exclusive Offers
        </Text>
        <Text style={[styles.newsletterSubtitle, { color: colors.muted }]}>
          Get the latest updates, special discounts, and insider tips delivered
          to your inbox.
        </Text>

        <View style={styles.newsletterForm}>
          <TextInput
            style={styles.newsletterInput}
            placeholder="Enter your email address"
            placeholderTextColor={THEME.colors.muted}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.newsletterButton}>
            <Text style={styles.newsletterButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.newsletterNote, { color: colors.muted }]}>
          We respect your privacy. Unsubscribe at any time.
        </Text>

        <View style={styles.newsletterRating}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} name="star" size={16} color="#FACC15" />
            ))}
          </View>
          <Text style={[styles.newsletterRatingText, { color: colors.text }]}>
            Rated 4.9/5 by over customers
          </Text>
        </View>
      </View>

      {/* ========================================
          FINAL CTA SECTION
      ======================================== */}
      <View
        style={[styles.finalCtaSection, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.finalCtaTitle}>What Are You Waiting For?</Text>
        <Text style={styles.finalCtaSubtitle}>
          Join the service revolution today and experience the difference of
          professional, reliable, and convenient service booking.
        </Text>
        <TouchableOpacity
          style={styles.finalCtaButton}
          onPress={() => router.push("/auth/register-client" as any)}
        >
          <Text style={styles.finalCtaButtonText}>Get Started Now</Text>
          <Icon name="arrow-right" size={18} color={THEME.colors.primary} />
        </TouchableOpacity>
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

  // ========== NAV HEADER ==========
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: Platform.OS === "web" ? 24 : 60,
    paddingBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.primary,
  },
  navLogo: {
    width: 70,
    height: 70,
  },
  navItems: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  navLinks: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtons: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  navLink: {
    color: THEME.colors.secondary,
    fontFamily: THEME.typography.fontFamily.bodyMedium, // Roboto-Regular
    fontSize: THEME.typography.sizes.base,
  },
  navLinkText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.bodyMedium, // Roboto-Regular
    fontSize: THEME.typography.sizes.base,
  },
  navLinkActive: {
    color: THEME.colors.secondary,
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

  // ========== HERO SECTION ==========
  heroSection: {
    minHeight: Platform.OS === "web" ? 600 : "auto",
    backgroundColor: THEME.colors.surface,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" && width > 900 ? 48 : 32,
    fontFamily: THEME.typography.fontFamily.heading,
    lineHeight: Platform.OS === "web" && width > 900 ? 58 : 42,
    marginBottom: THEME.spacing.lg,
    textAlign: Platform.OS === "web" && width > 900 ? "left" : "center",
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 26,
    marginBottom: THEME.spacing.lg,
    maxWidth: 500,
    textAlign: Platform.OS === "web" && width > 900 ? "left" : "center",
  },
  // ========== HERO SPLIT LAYOUT ==========
  heroSplit: {
    flexDirection:
      Platform.OS === "web" && width > 900 ? "row" : "column-reverse",
    paddingHorizontal:
      Platform.OS === "web" ? THEME.spacing["2xl"] : THEME.spacing.md,
    paddingTop: Platform.OS === "web" ? THEME.spacing["2xl"] : THEME.spacing.lg,
    paddingBottom: THEME.spacing["2xl"],
    gap:
      Platform.OS === "web" && width > 900
        ? THEME.spacing["2xl"]
        : THEME.spacing.lg,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 1400,
    backgroundColor: THEME.colors.surface,
  },
  heroLeft: {
    flex: 1,
    maxWidth: Platform.OS === "web" && width > 900 ? 600 : "100%",
    alignItems: Platform.OS === "web" && width > 900 ? "flex-start" : "center",
  },
  heroRight: {
    flex: Platform.OS === "web" && width > 900 ? 1 : 0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: Platform.OS === "web" && width > 900 ? "auto" : "100%",
  },
  heroTitleHighlight: {
    color: THEME.colors.secondary,
  },
  heroImage: {
    width: Platform.OS === "web" && width > 900 ? 600 : "100%",
    height: Platform.OS === "web" && width > 900 ? 600 : 320,
    borderRadius: 20,
    maxWidth: "100%",
  },

  // ========== SEARCH BAR ==========
  searchContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.colors.surface,

    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.md,
    width: "100%",
    ...THEME.shadow.card,
  },
  searchInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: THEME.spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    paddingVertical: THEME.spacing.sm,
    color: THEME.colors.surface,
  },

  filtersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    borderRadius: 50,
    backgroundColor: THEME.colors.surface,
  },

  filtersText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.primary,
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
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },

  // ========== POPULAR SEARCHES ==========
  popularSearches: {
    marginTop: THEME.spacing.xl,
    alignItems: Platform.OS === "web" && width > 900 ? "flex-start" : "center",
    width: "100%",
  },
  popularLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.md,
    marginBottom: THEME.spacing.md,
    alignSelf: Platform.OS === "web" && width > 900 ? "flex-start" : "center",
  },
  popularChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.sm,
  },
  popularChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    backgroundColor: THEME.colors.surface,
  },
  popularChipText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },

  // ========== CTA BUTTONS ==========
  ctaButtons: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
    flexWrap: "wrap",
    justifyContent:
      Platform.OS === "web" && width > 900 ? "flex-start" : "center",
  },
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  ctaPrimaryText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },
  ctaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    color: THEME.colors.primary,
  },
  ctaSecondaryText: {
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },

  // ========== RATING SECTION ==========
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.xl,
    justifyContent:
      Platform.OS === "web" && width > 900 ? "flex-start" : "center",
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  ratingBold: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // ========== FLOATING CARDS ==========
  floatingCardTop: {
    position: "absolute",
    top: 80,
    right: Platform.OS === "web" ? -20 : 0,
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    ...THEME.shadow.float,
    zIndex: 10,
    display: Platform.OS === "web" && width > 900 ? "flex" : "none",
  },
  floatingCardBottom: {
    position: "absolute",
    bottom: 140,
    right: Platform.OS === "web" ? 0 : 20,
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    ...THEME.shadow.float,
    zIndex: 10,
    display: Platform.OS === "web" && width > 900 ? "flex" : "none",
  },
  floatingCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCardTitle: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },
  floatingCardSubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.muted,
  },

  // ========== TRUSTED BY SECTION ==========
  trustedSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  trustedLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    letterSpacing: 1,
    marginBottom: THEME.spacing.md,
  },
  trustedLogos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.xl,
  },
  trustedLogo: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#9CA3AF",
  },

  // ========== CATEGORIES SECTION ==========
  categoriesSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 600,
    marginBottom: THEME.spacing.xl,
  },
  categoriesGrid: {
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
    backgroundColor: THEME.colors.primary + "10",
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.sm,
    backgroundColor: "#E8F5E9",
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
  categoriesStats: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.md,
  },

  // ========== READY CTA SECTION ==========
  readySection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#8ea733",
  },
  readyTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  readySubtitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  readyDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 600,
    marginBottom: THEME.spacing.xl,
    color: THEME.colors.text,
  },
  readyButtons: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  readyPrimaryBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  readyPrimaryText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
  readySecondaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  readySecondaryText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
  readyNote: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    color: THEME.colors.text,
  },

  // ========== BENEFITS SECTION ==========
  benefitsSection: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: THEME.spacing.xl,
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#FFFFFF",
  },
  benefitCard: {
    width: Platform.OS === "web" ? 300 : "100%",
    padding: THEME.spacing.xl,
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  benefitTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  benefitText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },

  // ========== FAQ SECTION ==========
  faqSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  faqTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  faqSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },
  faqList: {
    width: "100%",
    maxWidth: 800,
    gap: THEME.spacing.md,
  },
  faqItem: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
    ...THEME.shadow.card,
  },
  faqQuestion: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  faqAnswer: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },

  // ========== NEWSLETTER SECTION ==========
  newsletterSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  newsletterTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  newsletterSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },
  newsletterForm: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.sm,
    width: "100%",
    maxWidth: 500,
    marginBottom: THEME.spacing.md,
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  newsletterButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    alignItems: "center",
  },
  newsletterButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
  newsletterNote: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.lg,
  },
  newsletterRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  newsletterRatingText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // ========== FINAL CTA SECTION ==========
  finalCtaSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  finalCtaTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  finalCtaSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 600,
    marginBottom: THEME.spacing.xl,
  },
  finalCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  finalCtaButtonText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },

  // ========== FOOTER ==========
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
    marginBottom: THEME.spacing.xs,
  },
  footerCompany: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
