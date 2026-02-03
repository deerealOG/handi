// app/help.tsx
// Help Center Page for HANDI

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

const HELP_CATEGORIES = [
  {
    icon: "account",
    title: "Account & Profile",
    topics: [
      "Create an account",
      "Update profile",
      "Reset password",
      "Delete account",
    ],
  },
  {
    icon: "calendar-check",
    title: "Booking & Appointments",
    topics: [
      "Book a service",
      "Cancel booking",
      "Reschedule",
      "Track provider",
    ],
  },
  {
    icon: "credit-card",
    title: "Payments & Billing",
    topics: ["Payment methods", "Refund requests", "Invoice issues", "Pricing"],
  },
  {
    icon: "shield-check",
    title: "Safety & Trust",
    topics: [
      "Verify identity",
      "Report an issue",
      "Safety tips",
      "Background checks",
    ],
  },
  {
    icon: "briefcase",
    title: "For Providers",
    topics: [
      "Join as provider",
      "Manage services",
      "Get paid",
      "Grow business",
    ],
  },
  {
    icon: "cog",
    title: "Technical Support",
    topics: ["App not working", "Login issues", "Notifications", "Update app"],
  },
];

export default function HelpPage() {
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
        <Text style={styles.heroTitle}>Help Center</Text>
        <Text style={styles.heroSubtitle}>
          Find answers to common questions and get support
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/contact" as any)}
        >
          <Icon name="chat" size={28} color={THEME.colors.primary} />
          <Text style={[styles.quickActionTitle, { color: colors.text }]}>
            Chat with Us
          </Text>
          <Text style={[styles.quickActionText, { color: colors.muted }]}>
            24/7 support
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/how-it-works" as any)}
        >
          <Icon name="help-circle" size={28} color={THEME.colors.primary} />
          <Text style={[styles.quickActionTitle, { color: colors.text }]}>
            FAQ
          </Text>
          <Text style={[styles.quickActionText, { color: colors.muted }]}>
            Quick answers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/contact" as any)}
        >
          <Icon name="phone" size={28} color={THEME.colors.primary} />
          <Text style={[styles.quickActionTitle, { color: colors.text }]}>
            Call Us
          </Text>
          <Text style={[styles.quickActionText, { color: colors.muted }]}>
            +234 800 HANDI
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help Categories */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Browse Help Topics
        </Text>
        <View style={styles.categoriesGrid}>
          {HELP_CATEGORIES.map((category, index) => (
            <View
              key={index}
              style={[styles.categoryCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: `${THEME.colors.primary}15` },
                ]}
              >
                <Icon
                  name={category.icon as any}
                  size={24}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>
                {category.title}
              </Text>
              {category.topics.map((topic, i) => (
                <TouchableOpacity key={i} style={styles.topicItem}>
                  <Text style={[styles.topicText, { color: colors.muted }]}>
                    {topic}
                  </Text>
                  <Icon name="chevron-right" size={16} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Contact CTA */}
      <View style={[styles.ctaSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.ctaTitle, { color: colors.text }]}>
          Still need help?
        </Text>
        <Text style={[styles.ctaText, { color: colors.muted }]}>
          Our support team is available 24/7 to assist you.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.ctaButtonText}>Contact Support</Text>
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
  },
  quickActions: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: THEME.spacing.md,
    padding: THEME.spacing.xl,
    marginTop: -40,
  },
  quickActionCard: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    minWidth: Platform.OS === "web" ? 180 : "100%",
    ...THEME.shadow.card,
  },
  quickActionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: THEME.spacing.sm,
  },
  quickActionText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  categoriesSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  categoriesGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
  },
  categoryCard: {
    width: Platform.OS === "web" ? 320 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  categoryTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.md,
  },
  topicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  topicText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  ctaSection: {
    padding: THEME.spacing["2xl"],
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  ctaText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.lg,
  },
  ctaButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
