// app/business-solutions.tsx
// Business Solutions Page for HANDI (marketing page)

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

const BUSINESS_FEATURES = [
  {
    icon: "domain",
    title: "Bulk Booking",
    description:
      "Book multiple services at once for your office building, staff housing, or facilities.",
  },
  {
    icon: "file-document",
    title: "Invoicing & Billing",
    description:
      "Consolidated invoicing with detailed breakdowns for easy expense management.",
  },
  {
    icon: "account-group",
    title: "Dedicated Account Manager",
    description:
      "Get personalized support from a dedicated account manager who understands your needs.",
  },
  {
    icon: "chart-line",
    title: "Analytics Dashboard",
    description:
      "Track spending, service quality, and usage patterns with detailed reports.",
  },
  {
    icon: "shield-check",
    title: "Premium Providers",
    description:
      "Access to our top-rated, thoroughly vetted service professionals.",
  },
  {
    icon: "clock-fast",
    title: "Priority Scheduling",
    description:
      "Get priority booking slots and faster response times for urgent requests.",
  },
];

export default function BusinessPage() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroLabel}>FOR BUSINESSES</Text>
        <Text style={styles.heroTitle}>HANDI for Business</Text>
        <Text style={styles.heroSubtitle}>
          Streamline facility management and maintenance for your organization
        </Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.heroButtonText}>Contact Sales</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Everything Your Business Needs
        </Text>
        <View style={styles.featuresGrid}>
          {BUSINESS_FEATURES.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: `${THEME.colors.primary}15` },
                ]}
              >
                <Icon
                  name={feature.icon as any}
                  size={28}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text
                style={[styles.featureDescription, { color: colors.muted }]}
              >
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Use Cases */}
      <View style={[styles.useCasesSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Who Uses HANDI for Business?
        </Text>
        <View style={styles.useCasesList}>
          {[
            "Corporate Offices",
            "Real Estate & Property Managers",
            "Hotels & Hospitality",
            "Retail Stores",
            "Schools & Universities",
            "Healthcare Facilities",
          ].map((useCase, i) => (
            <View key={i} style={styles.useCaseItem}>
              <Icon
                name="check-circle"
                size={20}
                color={THEME.colors.primary}
              />
              <Text style={[styles.useCaseText, { color: colors.text }]}>
                {useCase}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View
        style={[styles.ctaSection, { backgroundColor: THEME.colors.primary }]}
      >
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaSubtitle}>
          Let&apos;s discuss how HANDI can help streamline your facility management.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.ctaButtonText}>Schedule a Demo</Text>
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
  heroLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: THEME.spacing.sm,
    letterSpacing: 1,
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
    textAlign: "center",
    maxWidth: 500,
    marginBottom: THEME.spacing.xl,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  heroButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  featuresSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  featuresGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
  },
  featureCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  featureTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  featureDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },
  useCasesSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  useCasesList: {
    maxWidth: 600,
    alignSelf: "center",
    gap: THEME.spacing.md,
  },
  useCaseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
  },
  useCaseText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  ctaSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: Platform.OS === "web" ? 32 : 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
    maxWidth: 400,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing["2xl"],
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  ctaButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
