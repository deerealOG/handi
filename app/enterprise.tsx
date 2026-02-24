// app/enterprise.tsx
// Enterprise Solutions Page for HANDI

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

const ENTERPRISE_FEATURES = [
  {
    icon: "api",
    title: "API Integration",
    description: "Seamlessly integrate HANDI into your existing systems",
  },
  {
    icon: "shield-lock",
    title: "Enterprise Security",
    description: "SOC 2 compliant with advanced encryption",
  },
  {
    icon: "cog-sync",
    title: "Custom Workflows",
    description: "Tailored approval flows and processes",
  },
  {
    icon: "chart-box",
    title: "Advanced Analytics",
    description: "Custom reports and business intelligence",
  },
  {
    icon: "account-tie",
    title: "White Glove Service",
    description: "24/7 priority support with dedicated team",
  },
  {
    icon: "office-building",
    title: "Multi-Location",
    description: "Manage services across all your facilities",
  },
];

export default function EnterprisePage() {
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
        <Text style={styles.heroLabel}>ENTERPRISE</Text>
        <Text style={styles.heroTitle}>Scale With Confidence</Text>
        <Text style={styles.heroSubtitle}>
          Enterprise-grade solutions for organizations with complex needs
        </Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.heroButtonText}>Talk to Sales</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Enterprise-Grade Features
        </Text>
        <View style={styles.featuresGrid}>
          {ENTERPRISE_FEATURES.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.surface }]}
            >
              <Icon
                name={feature.icon as any}
                size={32}
                color={THEME.colors.primary}
              />
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

      {/* Trusted By */}
      <View style={[styles.trustedSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.trustedTitle, { color: colors.text }]}>
          Trusted by Leading Organizations
        </Text>
        <Text style={[styles.trustedSubtitle, { color: colors.muted }]}>
          Join 100+ enterprises across Nigeria using HANDI for their facility
          management needs.
        </Text>
      </View>

      {/* CTA */}
      <View
        style={[styles.ctaSection, { backgroundColor: THEME.colors.primary }]}
      >
        <Text style={styles.ctaTitle}>Ready for Enterprise?</Text>
        <Text style={styles.ctaSubtitle}>
          Let&apos;s build a custom solution for your organization.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.ctaButtonText}>Contact Enterprise Sales</Text>
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
    alignItems: "center",
    ...THEME.shadow.card,
  },
  featureTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
  trustedSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  trustedTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  trustedSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    maxWidth: 500,
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
