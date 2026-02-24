// app/client/terms.tsx
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
    title: "1. Acceptance of Terms",
    content:
      "By creating an account or using HANDI, you agree to these Terms of Service. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Services Provided",
    content:
      "HANDI is a marketplace that connects clients with service providers. We facilitate bookings and payments but do not directly provide any services listed on the platform.",
  },
  {
    title: "3. Account Responsibilities",
    content:
      "You are responsible for maintaining the security of your account and for all activities that occur under your account. You must provide accurate and complete information.",
  },
  {
    title: "4. Booking & Payments",
    content:
      "All bookings are agreements between clients and providers. Payments are processed securely through our platform. Cancellation policies vary by provider and are displayed before booking.",
  },
  {
    title: "5. Provider Obligations",
    content:
      "Service providers must deliver services as described, maintain professional standards, and comply with all applicable laws and regulations in Nigeria.",
  },
  {
    title: "6. Prohibited Conduct",
    content:
      "Users may not engage in fraudulent activity, harassment, discrimination, or any conduct that violates Nigerian law. Violations may result in account suspension.",
  },
  {
    title: "7. Dispute Resolution",
    content:
      "Disputes between clients and providers should first be reported through the app. HANDI will mediate and may issue refunds or take action as appropriate.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "HANDI is not liable for the quality of services provided by third-party providers. We provide the platform 'as is' and make no guarantees regarding service outcomes.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We may update these terms from time to time. Continued use of HANDI after changes constitutes acceptance of the updated terms.",
  },
];

export default function TermsScreen() {
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
          Terms of Service
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.introCard, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="document-text" size={32} color="#fff" />
          <Text style={styles.introTitle}>Terms of Service</Text>
          <Text style={styles.introDesc}>
            Please read these terms carefully before using HANDI.
          </Text>
        </Animated.View>

        {SECTIONS.map((s, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 60).duration(500)}
            style={[styles.sectionCard, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {s.title}
            </Text>
            <Text style={[styles.sectionContent, { color: colors.muted }]}>
              {s.content}
            </Text>
          </Animated.View>
        ))}

        <Text style={[styles.footer, { color: colors.muted }]}>
          Effective: February 2026 · HANDI Nigeria Ltd
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
  introCard: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.xl,
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  introTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.sm,
  },
  introDesc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginTop: THEME.spacing.xs,
  },
  sectionCard: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 6,
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
