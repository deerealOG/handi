// app/client/privacy.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

const SECTIONS = [
  {
    title: "Data Collection",
    icon: "document-text-outline" as const,
    content:
      "We collect personal information you provide when creating an account, making bookings, and using our services. This includes your name, email, phone number, and location data.",
  },
  {
    title: "How We Use Your Data",
    icon: "analytics-outline" as const,
    content:
      "Your data is used to provide and improve our services, process payments, match you with service providers, and send relevant notifications about your bookings.",
  },
  {
    title: "Data Sharing",
    icon: "share-social-outline" as const,
    content:
      "We share necessary information with service providers to facilitate bookings. We never sell your data to third parties. Payment processing is handled by secure, PCI-compliant partners.",
  },
  {
    title: "Data Security",
    icon: "shield-checkmark-outline" as const,
    content:
      "We use industry-standard encryption and security measures to protect your personal information. All data transmissions are secured via SSL/TLS protocols.",
  },
  {
    title: "Your Rights",
    icon: "person-outline" as const,
    content:
      "Under NDPR, you have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time from your account settings.",
  },
  {
    title: "Cookies & Tracking",
    icon: "eye-outline" as const,
    content:
      "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage cookie preferences in your device settings.",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Privacy & Security
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.summaryCard, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
          <Text style={styles.summaryTitle}>Your data is protected</Text>
          <Text style={styles.summaryDesc}>
            We comply with NDPR and follow industry-best security practices to
            keep your information safe.
          </Text>
        </Animated.View>

        {/* Sections */}
        {SECTIONS.map((s, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 80).duration(500)}
            style={[styles.sectionCard, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primaryLight || "#E8F5E9" },
              ]}
            >
              <Ionicons name={s.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {s.title}
              </Text>
              <Text style={[styles.sectionContent, { color: colors.muted }]}>
                {s.content}
              </Text>
            </View>
          </Animated.View>
        ))}

        <Text style={[styles.footer, { color: colors.muted }]}>
          Last updated: February 2026
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  content: { padding: THEME.spacing.lg, paddingBottom: 40 },
  summaryCard: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.xl,
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.sm,
  },
  summaryDesc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginTop: THEME.spacing.xs,
  },
  sectionCard: {
    flexDirection: "row",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: THEME.typography.sizes.xs,
    marginTop: THEME.spacing.lg,
  },
});
