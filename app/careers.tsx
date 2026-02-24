// app/careers.tsx
// Careers Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
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

const JOB_OPENINGS = [
  {
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Lagos, Nigeria",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Operations",
    location: "Abuja, Nigeria",
    type: "Full-time",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Lagos, Nigeria",
    type: "Full-time",
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote (Nigeria)",
    type: "Full-time",
  },
];

const BENEFITS = [
  {
    icon: "cash",
    title: "Competitive Salary",
    description: "Market-leading compensation packages",
  },
  {
    icon: "heart-pulse",
    title: "Health Insurance",
    description: "Comprehensive medical coverage",
  },
  {
    icon: "laptop",
    title: "Remote Flexibility",
    description: "Work from home options available",
  },
  {
    icon: "school",
    title: "Learning Budget",
    description: "Annual training and development fund",
  },
  {
    icon: "calendar",
    title: "Paid Time Off",
    description: "Generous vacation and leave policy",
  },
  {
    icon: "trending-up",
    title: "Career Growth",
    description: "Clear progression pathways",
  },
];

export default function CareersPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Join Our Team</Text>
        <Text style={styles.heroSubtitle}>
          Help us build the future of service discovery in Nigeria
        </Text>
      </View>

      {/* Why Join Us */}
      <View style={styles.whySection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Why Work at HANDI?
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          We&apos;re on a mission to transform how Nigerians access quality services.
          Join us and be part of something meaningful.
        </Text>
      </View>

      {/* Benefits */}
      <View style={[styles.benefitsSection, { backgroundColor: "#F9FAFB" }]}>
        <View style={styles.benefitsGrid}>
          {BENEFITS.map((benefit, index) => (
            <View
              key={index}
              style={[styles.benefitCard, { backgroundColor: colors.surface }]}
            >
              <Icon
                name={benefit.icon as any}
                size={28}
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

      {/* Open Positions */}
      <View style={styles.positionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Open Positions
        </Text>
        <View style={styles.jobsList}>
          {JOB_OPENINGS.map((job, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.jobCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.jobMain}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>
                  {job.title}
                </Text>
                <View style={styles.jobMeta}>
                  <Text
                    style={[
                      styles.jobDepartment,
                      { color: THEME.colors.primary },
                    ]}
                  >
                    {job.department}
                  </Text>
                  <Text style={[styles.jobLocation, { color: colors.muted }]}>
                    {job.location}
                  </Text>
                  <Text style={[styles.jobType, { color: colors.muted }]}>
                    {job.type}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Apply CTA */}
      <View
        style={[styles.ctaSection, { backgroundColor: THEME.colors.primary }]}
      >
        <Text style={styles.ctaTitle}>Don&apos;t See a Role for You?</Text>
        <Text style={styles.ctaSubtitle}>
          We&apos;re always looking for talented individuals. Send your resume to
          careers@handiapp.com.ng
        </Text>
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
  whySection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    maxWidth: 600,
  },
  benefitsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  benefitsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.md,
  },
  benefitCard: {
    width: Platform.OS === "web" ? 180 : "100%",
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  benefitTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
  positionsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  jobsList: {
    gap: THEME.spacing.md,
  },
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    ...THEME.shadow.card,
  },
  jobMain: {
    flex: 1,
  },
  jobTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xs,
  },
  jobMeta: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.sm,
  },
  jobDepartment: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  jobLocation: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  jobType: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  ctaSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: THEME.typography.sizes.xl,
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
    textAlign: "center",
    maxWidth: 500,
  },
});
