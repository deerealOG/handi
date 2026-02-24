// app/client/profile/help.tsx
// Help Center — mirrors web /help with category grid + popular topics + FAQs

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

// ── Data ─────────────────────────────────────────────────────────
const HELP_CATEGORIES = [
  {
    icon: "help-circle-outline" as const,
    title: "FAQs",
    description: "Find quick answers to common questions",
    action: "faq",
  },
  {
    icon: "mail-outline" as const,
    title: "Contact Support",
    description: "Get in touch with our support team",
    action: "email",
  },
  {
    icon: "call-outline" as const,
    title: "Call Us",
    description: "Speak directly with a representative",
    action: "call",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Safety Guidelines",
    description: "Learn about our safety protocols",
    action: "safety",
  },
];

const POPULAR_TOPICS = [
  "How to book a service",
  "Payment methods",
  "Cancellation policy",
  "Become a provider",
  "Account settings",
  "Refund requests",
];

const FAQS = [
  {
    question: "How do I book an artisan?",
    answer:
      "Browse the 'Explore' tab, select an artisan, and click 'Book Now'. You can choose a date and time that works for you.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Yes, all payments are processed securely through Paystack or Flutterwave. We do not store your card details.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "You can cancel a booking from the 'Bookings' tab as long as the artisan hasn't started the job yet. Cancellation fees may apply.",
  },
  {
    question: "How do I become an artisan?",
    answer:
      "Log out and sign up as an Artisan. You will need to provide verification documents and pass a background check.",
  },
  {
    question: "How do refunds work?",
    answer:
      "If you're unsatisfied with a service, you can request a refund within 24 hours of completion. Our team will review and process it within 3-5 business days.",
  },
  {
    question: "Can I change my account type?",
    answer:
      "You can switch between Client and Artisan accounts from the Settings page. Some features require reverification.",
  },
];

// ── Component ────────────────────────────────────────────────────
export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleCategoryPress = (action: string) => {
    switch (action) {
      case "email":
        Linking.openURL("mailto:support@handi.ng");
        break;
      case "call":
        Linking.openURL("tel:+234800442634");
        break;
      case "safety":
        router.push("/about" as any);
        break;
      case "faq":
        // Scroll to FAQ section is default behavior
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Hero Header */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={styles.heroNav}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.heroBackBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.heroSub}>How can we help you today?</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Grid */}
        <View style={styles.categoryGrid}>
          {HELP_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.title}
              style={[
                styles.categoryCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => handleCategoryPress(cat.action)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name={cat.icon} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.categoryCardTitle, { color: colors.text }]}>
                {cat.title}
              </Text>
              <Text style={[styles.categoryCardDesc, { color: colors.muted }]}>
                {cat.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Topics */}
        <View
          style={[styles.topicsSection, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Topics
          </Text>
          <View style={styles.topicsWrap}>
            {POPULAR_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[
                  styles.topicChip,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.topicText, { color: colors.text }]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequently Asked Questions
          </Text>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.faqCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={expandedFaq === i ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.muted}
                />
              </View>
              {expandedFaq === i && (
                <Text style={[styles.faqAnswer, { color: colors.muted }]}>
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact CTA */}
        <View
          style={[
            styles.contactCta,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.contactIcon, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="headset" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Still need help?
          </Text>
          <Text style={[styles.contactSub, { color: colors.muted }]}>
            Our support team is available 24/7
          </Text>
          <TouchableOpacity
            style={[styles.contactBtn, { backgroundColor: colors.primary }]}
            onPress={() => Linking.openURL("mailto:support@handi.ng")}
          >
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: THEME.spacing.lg,
  },
  heroNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroBackBtn: { padding: 8 },
  heroTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },

  scrollContent: { padding: THEME.spacing.lg, paddingBottom: 40 },

  // Categories
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryCardTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  categoryCardDesc: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 16,
  },

  // Topics
  topicsSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 12,
  },
  topicsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  topicText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // FAQ
  faqSection: { marginBottom: 24 },
  faqCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 10 },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },

  // Contact CTA
  contactCta: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  contactSub: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 16,
  },
  contactBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: THEME.radius.pill,
  },
  contactBtnText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
