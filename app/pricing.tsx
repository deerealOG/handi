// app/pricing.tsx
// Pricing Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

const PRICING_PLANS = [
  {
    name: "Customer",
    price: "Free",
    description: "Perfect for individuals looking for quality services",
    features: [
      "Unlimited service bookings",
      "Secure payments",
      "Real-time provider tracking",
      "24/7 customer support",
      "Reviews and ratings",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Provider",
    price: "10%",
    priceLabel: "per booking",
    description: "For professionals offering their services",
    features: [
      "List unlimited services",
      "Receive bookings",
      "Secure payment processing",
      "Customer insights",
      "Profile verification badge",
      "Priority listing",
    ],
    cta: "Join as Provider",
    highlighted: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "For organizations with multiple locations",
    features: [
      "Bulk booking discounts",
      "Dedicated account manager",
      "Consolidated invoicing",
      "Analytics dashboard",
      "Priority scheduling",
      "API access",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Simple, Transparent Pricing</Text>
        <Text style={styles.heroSubtitle}>
          No hidden fees. Pay only for what you use.
        </Text>
      </View>

      {/* Pricing Cards */}
      <View style={styles.pricingSection}>
        <View style={styles.pricingGrid}>
          {PRICING_PLANS.map((plan, index) => (
            <View
              key={index}
              style={[
                styles.pricingCard,
                { backgroundColor: colors.surface },
                plan.highlighted && styles.pricingCardHighlighted,
              ]}
            >
              {plan.highlighted && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}
              <Text style={[styles.planName, { color: colors.text }]}>
                {plan.name}
              </Text>
              <View style={styles.priceRow}>
                <Text
                  style={[styles.planPrice, { color: THEME.colors.primary }]}
                >
                  {plan.price}
                </Text>
                {plan.priceLabel && (
                  <Text style={[styles.priceLabel, { color: colors.muted }]}>
                    {plan.priceLabel}
                  </Text>
                )}
              </View>
              <Text style={[styles.planDescription, { color: colors.muted }]}>
                {plan.description}
              </Text>

              <View style={styles.featuresList}>
                {plan.features.map((feature, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Icon name="check" size={18} color={THEME.colors.primary} />
                    <Text style={[styles.featureText, { color: colors.text }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  plan.highlighted
                    ? styles.ctaButtonPrimary
                    : styles.ctaButtonOutline,
                ]}
                onPress={() => router.push("/contact" as any)}
              >
                <Text
                  style={[
                    styles.ctaButtonText,
                    {
                      color: plan.highlighted
                        ? "#FFFFFF"
                        : THEME.colors.primary,
                    },
                  ]}
                >
                  {plan.cta}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* FAQ */}
      <View style={[styles.faqSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.faqTitle, { color: colors.text }]}>
          Pricing Questions?
        </Text>
        <Text style={[styles.faqSubtitle, { color: colors.muted }]}>
          Visit our Help Center or contact us for more information about pricing
          and plans.
        </Text>
        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => router.push("/help" as any)}
        >
          <Text style={styles.faqButtonText}>Visit Help Center</Text>
        </TouchableOpacity>
      </View>

      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 48 : 32,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  pricingSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  pricingGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: THEME.spacing.lg,
  },
  pricingCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  pricingCardHighlighted: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.pill,
  },
  popularBadgeText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  planPrice: {
    fontSize: 40,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  priceLabel: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  planDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.lg,
  },
  featuresList: {
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.xl,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  featureText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  ctaButton: {
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  ctaButtonPrimary: {
    backgroundColor: THEME.colors.primary,
  },
  ctaButtonOutline: {
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    backgroundColor: "transparent",
  },
  ctaButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  faqSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  faqTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  faqSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.lg,
    maxWidth: 400,
  },
  faqButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  faqButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
