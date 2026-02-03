// app/terms.tsx
// Terms of Service Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the HANDI platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. HANDI reserves the right to modify these terms at any time, and such modifications will be effective immediately upon posting.`,
  },
  {
    title: "2. Service Description",
    content: `HANDI provides a marketplace platform connecting customers with service providers in Nigeria. We facilitate the discovery, booking, and payment for various services including but not limited to electrical work, plumbing, beauty services, cleaning, and more. HANDI does not directly provide these services but acts as an intermediary.`,
  },
  {
    title: "3. User Accounts",
    content: `To use certain features of our Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.`,
  },
  {
    title: "4. Service Provider Obligations",
    content: `Service providers on HANDI must: maintain accurate business information, hold necessary licenses and certifications, provide services as described, respond to booking requests promptly, and maintain professional conduct. HANDI reserves the right to suspend or terminate accounts that violate these obligations.`,
  },
  {
    title: "5. Customer Obligations",
    content: `Customers agree to: provide accurate booking information, be present at scheduled appointment times, pay for services rendered, treat service providers with respect, and report any issues through proper channels. Cancellations must be made at least 24 hours before the scheduled appointment.`,
  },
  {
    title: "6. Payments and Fees",
    content: `HANDI processes payments securely through our platform. Service providers receive payment after successful service completion minus our platform fee. Customers are charged at the time of booking. Refunds are processed according to our refund policy and may take 5-10 business days.`,
  },
  {
    title: "7. Dispute Resolution",
    content: `In case of disputes between customers and service providers, HANDI will act as a mediator. Both parties agree to cooperate in resolving disputes through our platform. If disputes cannot be resolved informally, they shall be settled through arbitration under Nigerian law.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `HANDI is not liable for the quality of services provided by third-party service providers. Our liability is limited to the platform fee paid. We are not responsible for any indirect, incidental, or consequential damages arising from the use of our Service.`,
  },
  {
    title: "9. Intellectual Property",
    content: `All content on the HANDI platform, including logos, text, graphics, and software, is the property of HANDI and protected by intellectual property laws. Users may not copy, modify, or distribute any content without prior written permission.`,
  },
  {
    title: "10. Termination",
    content: `HANDI may terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion. Upon termination, your right to use the Service will immediately cease.`,
  },
];

export default function TermsPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Terms of Service</Text>
        <Text style={styles.heroSubtitle}>Last updated: February 1, 2026</Text>
      </View>

      {/* Terms Content */}
      <View style={styles.contentSection}>
        <Text style={[styles.introText, { color: colors.muted }]}>
          Please read these Terms of Service carefully before using the HANDI
          platform. These terms govern your use of our website and mobile
          applications.
        </Text>

        {TERMS_SECTIONS.map((section, index) => (
          <View key={index} style={styles.termSection}>
            <Text style={[styles.termTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <Text style={[styles.termContent, { color: colors.muted }]}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={[styles.contactBox, { backgroundColor: "#F9FAFB" }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Questions About These Terms?
          </Text>
          <Text style={[styles.contactText, { color: colors.muted }]}>
            If you have any questions about these Terms of Service, please
            contact us at{" "}
            <Text style={{ color: THEME.colors.primary }}>
              legal@handiapp.com.ng
            </Text>
          </Text>
        </View>
      </View>

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
  termSection: {
    marginBottom: THEME.spacing.xl,
  },
  termTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  termContent: {
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
    lineHeight: 24,
  },
});
