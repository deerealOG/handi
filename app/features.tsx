// app/features.tsx
// Features Page for HANDI

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

const FEATURES = [
  {
    icon: "magnify",
    title: "Smart Search",
    description:
      "Find exactly what you need with our intelligent search that matches you with the right service providers based on location, ratings, and availability.",
  },
  {
    icon: "shield-check",
    title: "Verified Providers",
    description:
      "Every provider undergoes thorough verification including ID checks, skill assessments, and background screening for your peace of mind.",
  },
  {
    icon: "calendar-check",
    title: "Easy Booking",
    description:
      "Book appointments in seconds. Choose your preferred date, time, and provider. Receive instant confirmation and reminders.",
  },
  {
    icon: "credit-card-check",
    title: "Secure Payments",
    description:
      "Pay with confidence using our encrypted payment system. Multiple payment options including cards, bank transfers, and mobile money.",
  },
  {
    icon: "star",
    title: "Reviews & Ratings",
    description:
      "Make informed decisions with authentic reviews from real customers. Rate and review your experience to help others.",
  },
  {
    icon: "chat",
    title: "In-App Messaging",
    description:
      "Communicate directly with providers through our secure messaging system. Share details, ask questions, and coordinate seamlessly.",
  },
  {
    icon: "map-marker-radius",
    title: "Real-Time Tracking",
    description:
      "Track your provider's arrival in real-time. Know exactly when they'll arrive and follow their journey to your location.",
  },
  {
    icon: "bell",
    title: "Smart Notifications",
    description:
      "Stay updated with timely notifications for booking confirmations, reminders, provider arrivals, and special offers.",
  },
];

export default function FeaturesPage() {
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
        <Text style={styles.heroTitle}>Powerful Features</Text>
        <Text style={styles.heroSubtitle}>
          Everything you need to find, book, and manage services seamlessly
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
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
                  size={32}
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

      {/* CTA Section */}
      <View
        style={[styles.ctaSection, { backgroundColor: THEME.colors.primary }]}
      >
        <Text style={styles.ctaTitle}>Ready to Experience These Features?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of satisfied users across Nigeria
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/services" as any)}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
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
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    maxWidth: 500,
  },
  featuresSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  featuresGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
  },
  featureCard: {
    width: Platform.OS === "web" ? 280 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
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
  ctaSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: Platform.OS === "web" ? 32 : 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  ctaSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: THEME.spacing.xl,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing["2xl"],
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  ctaButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
