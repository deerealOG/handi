// app/about.tsx
// About Us Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

const TEAM_VALUES = [
  {
    icon: "shield-check",
    title: "Trust & Safety",
    description:
      "We verify all service providers to ensure quality and reliability.",
  },
  {
    icon: "handshake",
    title: "Community First",
    description:
      "Building lasting relationships between customers and professionals.",
  },
  {
    icon: "lightning-bolt",
    title: "Innovation",
    description: "Continuously improving our platform to serve you better.",
  },
  {
    icon: "heart",
    title: "Customer Care",
    description:
      "Your satisfaction is our top priority, 24/7 support available.",
  },
];

export default function AboutPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>About HANDI</Text>
        <Text style={styles.heroSubtitle}>
          Connecting Nigeria with trusted service professionals since 2024
        </Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Our Mission
        </Text>
        <Text style={[styles.sectionText, { color: colors.muted }]}>
          HANDI was founded with a simple mission: to make it easy for Nigerians
          to find, book, and pay for quality services from trusted
          professionals. We believe everyone deserves access to reliable service
          providers, whether you need an electrician, a hair stylist, or a
          plumber.
        </Text>
        <Text style={[styles.sectionText, { color: colors.muted }]}>
          Our platform brings together skilled artisans, tradespeople, and
          service providers with customers who need their expertise. By creating
          a trusted marketplace, we&apos;re empowering local businesses while making
          life easier for millions of Nigerians.
        </Text>
      </View>

      {/* Values Section */}
      <View style={[styles.valuesSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Our Values
        </Text>
        <View style={styles.valuesGrid}>
          {TEAM_VALUES.map((value, index) => (
            <View
              key={index}
              style={[styles.valueCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.valueIcon,
                  { backgroundColor: `${THEME.colors.primary}15` },
                ]}
              >
                <Icon
                  name={value.icon as any}
                  size={28}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.valueTitle, { color: colors.text }]}>
                {value.title}
              </Text>
              <Text style={[styles.valueText, { color: colors.muted }]}>
                {value.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            50,000+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Active Users
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            5,000+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Verified Providers
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
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>
            100,000+
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Jobs Completed
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
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    maxWidth: 600,
  },
  section: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
  },
  sectionText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 28,
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  valuesSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  valuesGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
    maxWidth: 1000,
    alignSelf: "center",
  },
  valueCard: {
    width: Platform.OS === "web" ? 220 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  valueIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  valueTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  valueText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "center",
    gap: THEME.spacing["2xl"],
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: Platform.OS === "web" ? 48 : 36,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
