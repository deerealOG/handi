// app/privacy.tsx
// Privacy Policy Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly, including: name, email, phone number, address, payment information, and profile details. We also automatically collect device information, location data (with permission), and usage analytics to improve our services.`,
  },
  {
    title: "How We Use Your Information",
    content: `Your information is used to: provide and improve our services, process transactions, communicate with you, personalize your experience, ensure platform safety, comply with legal obligations, and send promotional content (with consent).`,
  },
  {
    title: "Information Sharing",
    content: `We share information with: service providers/customers for booking purposes, payment processors, analytics providers, and law enforcement when required. We never sell your personal information to third parties.`,
  },
  {
    title: "Data Security",
    content: `We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to: access your data, correct inaccuracies, delete your account, opt-out of marketing, and data portability. Contact us at privacy@handiapp.com.ng to exercise these rights.`,
  },
  {
    title: "Cookies and Tracking",
    content: `We use cookies and similar technologies to enhance your experience, analyze usage, and deliver targeted content. You can manage cookie preferences through your browser settings.`,
  },
  {
    title: "Children's Privacy",
    content: `HANDI is not intended for users under 18 years of age. We do not knowingly collect information from children. If we learn we have collected such information, we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this privacy policy periodically. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Privacy Policy</Text>
        <Text style={styles.heroSubtitle}>Last updated: February 1, 2026</Text>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={[styles.introText, { color: colors.muted }]}>
          At HANDI, we take your privacy seriously. This policy explains how we
          collect, use, and protect your personal information when you use our
          platform.
        </Text>

        {PRIVACY_SECTIONS.map((section, index) => (
          <View key={index} style={styles.policySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, { color: colors.muted }]}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={[styles.contactBox, { backgroundColor: "#F9FAFB" }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Privacy Questions?
          </Text>
          <Text style={[styles.contactText, { color: colors.muted }]}>
            Contact our Data Protection Officer at{" "}
            <Text style={{ color: THEME.colors.primary }}>
              privacy@handiapp.com.ng
            </Text>
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
    marginBottom: THEME.spacing.md,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  contentSection: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  introText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 28,
    marginBottom: THEME.spacing["2xl"],
  },
  policySection: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  sectionContent: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 26,
  },
  contactBox: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    marginTop: THEME.spacing.xl,
  },
  contactTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  contactText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
