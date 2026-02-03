// app/safety.tsx
// Safety Guidelines Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

const SAFETY_TIPS = [
  {
    icon: "shield-check",
    title: "Verified Providers Only",
    description:
      "All service providers on HANDI undergo identity verification and background checks. Look for the verified badge before booking.",
  },
  {
    icon: "account-check",
    title: "Check Reviews & Ratings",
    description:
      "Read reviews from other customers before booking. High ratings and detailed feedback indicate reliable service providers.",
  },
  {
    icon: "message-text",
    title: "Communicate Through HANDI",
    description:
      "Keep all communications within the HANDI platform. This ensures your conversations are protected and can be referenced if needed.",
  },
  {
    icon: "credit-card-check",
    title: "Pay Through the Platform",
    description:
      "Always make payments through HANDI for buyer protection. Avoid cash payments or transfers outside the platform.",
  },
  {
    icon: "map-marker-check",
    title: "Share Your Location",
    description:
      "For home services, ensure someone else knows about your appointment. You can share booking details with emergency contacts.",
  },
  {
    icon: "alert-circle",
    title: "Report Suspicious Activity",
    description:
      "If something doesn't feel right, trust your instincts. Report any concerns to our support team immediately.",
  },
];

const PROVIDER_SAFETY = [
  "Verify customer identity before arriving",
  "Share your schedule with a trusted contact",
  "Keep your phone charged and accessible",
  "Trust your instincts - decline jobs that feel unsafe",
  "Document completed work with photos",
  "Report any incidents to HANDI support",
];

export default function SafetyPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Icon name="shield-check" size={64} color="#FFFFFF" />
        <Text style={styles.heroTitle}>Safety Guidelines</Text>
        <Text style={styles.heroSubtitle}>
          Your safety is our top priority. Follow these guidelines for a secure
          experience.
        </Text>
      </View>

      {/* Safety Tips */}
      <View style={styles.tipsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Safety Tips for Customers
        </Text>
        <View style={styles.tipsGrid}>
          {SAFETY_TIPS.map((tip, index) => (
            <View
              key={index}
              style={[styles.tipCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.tipIcon,
                  { backgroundColor: `${THEME.colors.primary}15` },
                ]}
              >
                <Icon
                  name={tip.icon as any}
                  size={28}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                {tip.title}
              </Text>
              <Text style={[styles.tipDescription, { color: colors.muted }]}>
                {tip.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Provider Safety */}
      <View style={[styles.providerSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Safety Tips for Providers
        </Text>
        <View style={styles.providerList}>
          {PROVIDER_SAFETY.map((tip, index) => (
            <View key={index} style={styles.providerTipItem}>
              <Icon
                name="check-circle"
                size={20}
                color={THEME.colors.primary}
              />
              <Text style={[styles.providerTipText, { color: colors.text }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.emergencySection}>
        <View style={[styles.emergencyCard, { backgroundColor: "#FEE2E2" }]}>
          <Icon name="phone-alert" size={32} color="#DC2626" />
          <Text style={styles.emergencyTitle}>In Case of Emergency</Text>
          <Text style={styles.emergencyText}>
            If you feel unsafe or encounter an emergency, contact local
            authorities immediately.
          </Text>
          <Text style={styles.emergencyNumber}>
            Emergency: 112 | Police: 199
          </Text>
        </View>
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
    marginTop: THEME.spacing.md,
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
  tipsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  tipsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
  },
  tipCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  tipIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  tipTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  tipDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },
  providerSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  providerList: {
    maxWidth: 600,
    alignSelf: "center",
    gap: THEME.spacing.md,
  },
  providerTipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
  },
  providerTipText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    flex: 1,
  },
  emergencySection: {
    padding: THEME.spacing.xl,
  },
  emergencyCard: {
    maxWidth: 500,
    alignSelf: "center",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: "#DC2626",
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  emergencyText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#991B1B",
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  emergencyNumber: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: "#DC2626",
  },
});
