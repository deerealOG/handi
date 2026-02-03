// app/become-provider.tsx
// Become a Provider Page for HANDI

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

const PROVIDER_BENEFITS = [
  {
    icon: "account-group",
    title: "Access to Customers",
    description:
      "Reach thousands of potential customers actively looking for services",
  },
  {
    icon: "credit-card-check",
    title: "Secure Payments",
    description:
      "Get paid directly to your bank account with our secure payment system",
  },
  {
    icon: "calendar-check",
    title: "Easy Scheduling",
    description:
      "Manage your appointments and availability with our intuitive tools",
  },
  {
    icon: "chart-line",
    title: "Grow Your Business",
    description:
      "Build your reputation with reviews and expand your customer base",
  },
  {
    icon: "headset",
    title: "Dedicated Support",
    description: "Our provider success team is here to help you succeed",
  },
  {
    icon: "shield-check",
    title: "Verified Badge",
    description: "Stand out with a verified badge that builds customer trust",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Sign Up",
    description: "Create your provider account in minutes",
  },
  {
    step: "2",
    title: "Complete Profile",
    description: "Add your skills, photos, and pricing",
  },
  {
    step: "3",
    title: "Get Verified",
    description: "Submit documents for verification",
  },
  {
    step: "4",
    title: "Start Earning",
    description: "Accept bookings and grow your business",
  },
];

export default function BecomeProviderPage() {
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
        <Text style={styles.heroTitle}>Become a HANDI Provider</Text>
        <Text style={styles.heroSubtitle}>
          Join thousands of service professionals earning with HANDI
        </Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            ₦5M+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Earned by Top Providers
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            5,000+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Active Providers
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            15+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            States Covered
          </Text>
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Why Join HANDI?
        </Text>
        <View style={styles.benefitsGrid}>
          {PROVIDER_BENEFITS.map((benefit, index) => (
            <View
              key={index}
              style={[styles.benefitCard, { backgroundColor: colors.surface }]}
            >
              <Icon
                name={benefit.icon as any}
                size={32}
                color={THEME.colors.primary}
              />
              <Text style={[styles.benefitTitle, { color: colors.text }]}>
                {benefit.title}
              </Text>
              <Text
                style={[styles.benefitDescription, { color: colors.muted }]}
              >
                {benefit.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* How to Join */}
      <View style={[styles.stepsSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How to Get Started
        </Text>
        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepNumber,
                  { backgroundColor: THEME.colors.primary },
                ]}
              >
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {step.title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.muted }]}>
                {step.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View
        style={[styles.ctaSection, { backgroundColor: THEME.colors.primary }]}
      >
        <Text style={styles.ctaTitle}>Ready to Start Earning?</Text>
        <Text style={styles.ctaSubtitle}>
          Join the HANDI community today and grow your business
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Apply to Become a Provider</Text>
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
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing["2xl"],
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  heroButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  statsSection: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: THEME.spacing["2xl"],
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  statItem: { alignItems: "center" },
  statNumber: {
    fontSize: Platform.OS === "web" ? 48 : 36,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  benefitsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  benefitsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.md,
  },
  benefitCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  benefitTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 20,
  },
  stepsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  stepsContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: THEME.spacing.xl,
  },
  stepItem: {
    alignItems: "center",
    maxWidth: 200,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  stepTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
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
