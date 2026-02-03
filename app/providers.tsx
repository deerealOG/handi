// app/providers.tsx
// Providers Page for HANDI - "Discover Professional Providers"

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { THEME } from "../constants/theme";

export default function ProvidersPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching:", searchQuery, locationQuery);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="providers" />

      {/* Hero Section */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.heroSection, { backgroundColor: colors.surface }]}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Icon name="magnify" size={16} color={THEME.colors.primary} />
          <Text style={styles.badgeText}>Find Trusted Providers</Text>
        </View>

        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Discover Professional{" "}
          <Text style={styles.heroHighlight}>Providers</Text>
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
          Connect with verified service professionals and businesses in your
          {"\n"}area. Quality products and services, trusted providers.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputGroup}>
            <Icon name="magnify" size={20} color={THEME.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search providers, services..."
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
              placeholder="City, address, or postcode"
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

          <TouchableOpacity style={styles.filterButton}>
            <Icon name="close" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Location Tags */}
        <View style={styles.locationTags}>
          <Text style={[styles.locationLabel, { color: colors.muted }]}>
            Using your location:
          </Text>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>Within 50km</Text>
            <Icon name="close" size={14} color={THEME.colors.muted} />
          </View>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>Country: nigeria</Text>
          </View>
        </View>
      </Animated.View>

      {/* Providers Results Section */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <View>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              1 Provider Found
            </Text>
            <Text style={[styles.resultsSubtitle, { color: colors.muted }]}>
              Within 50km of your location
            </Text>
          </View>

          <Text style={[styles.pageInfo, { color: colors.muted }]}>
            Page 1 of 1
          </Text>
        </View>

        {/* Provider Cards */}
        <View style={styles.providerGrid}>
          {/* Provider Card */}
          <View style={styles.providerCard}>
            <View style={styles.providerBadge}>
              <Text style={styles.providerBadgeText}>Specialist</Text>
            </View>
            <View style={styles.providerImagePlaceholder}>
              <Icon name="account" size={64} color={THEME.colors.muted} />
            </View>
            <View style={styles.providerContent}>
              <Text style={[styles.providerName, { color: colors.text }]}>
                Charles Onyeje
              </Text>
              <View style={styles.providerLocationRow}>
                <Icon name="map-marker" size={14} color={THEME.colors.muted} />
                <Text
                  style={[styles.providerLocation, { color: colors.muted }]}
                >
                  Umudike Rd, Umudike, Abia, Nigeria, Umuahia
                </Text>
              </View>
              <View style={styles.providerRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="star-outline"
                    size={14}
                    color="#9CA3AF"
                  />
                ))}
                <Text style={[styles.providerReviews, { color: colors.muted }]}>
                  (0 reviews)
                </Text>
              </View>
              <View style={styles.providerStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Open</Text>
              </View>
              <View style={styles.providerActions}>
                <TouchableOpacity style={styles.callButton}>
                  <Icon name="phone" size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewProfileButton}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Are You a Service Professional CTA */}
      <View style={styles.ctaSection}>
        <Text style={[styles.ctaTitle, { color: colors.text }]}>
          Are You a Service Professional?
        </Text>
        <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
          Join the growing list of providers who trust HANDI to grow their
          business.
        </Text>
        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => router.push("/auth/register-provider" as any)}
          >
            <Text style={styles.ctaPrimaryText}>Become a Provider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary}>
            <Text style={styles.ctaSecondaryText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
  },
  badgeText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.primary,
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

  // Filter actions
  filterActions: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.xl,
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
    borderRadius: 50,
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
    borderRadius: 50,
  },
  locationTagText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.primary,
  },

  // Results section
  resultsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.xl,
  },
  resultsTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  resultsSubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  pageInfo: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },

  // Provider grid
  providerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.lg,
  },
  providerCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.lg,
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
    borderRadius: 50,
    zIndex: 1,
    ...THEME.shadow.card,
  },
  providerBadgeText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.xs,
    color: "#FFFFFF",
  },
  providerImagePlaceholder: {
    height: 180,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  providerContent: {
    padding: THEME.spacing.md,
  },
  providerName: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  providerLocationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginBottom: THEME.spacing.sm,
  },
  providerLocation: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    flex: 1,
  },
  providerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: THEME.spacing.sm,
  },
  providerReviews: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginLeft: THEME.spacing.xs,
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
    backgroundColor: THEME.colors.primary,
  },
  statusText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.primary,
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
    borderRadius: 50,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },
  viewProfileButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing.sm,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  viewProfileText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },

  // CTA Section
  ctaSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#9db541",
  },
  ctaTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },
  ctaButtons: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.md,
  },
  ctaPrimary: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    alignItems: "center",
  },
  ctaPrimaryText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },
  ctaSecondary: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  ctaSecondaryText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
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
