// app/client/help.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

const FAQ_ITEMS = [
  {
    q: "How do I book a service?",
    a: "Browse services or providers on the Explore tab, select one, choose your preferred date/time, and confirm your booking.",
  },
  {
    q: "How do I cancel a booking?",
    a: "Go to My Bookings, tap the booking you want to cancel, and select 'Cancel Booking'. Cancellations within 2 hours of booking are free.",
  },
  {
    q: "How are payments handled?",
    a: "Payments are processed securely through the app. You can use your wallet balance, bank transfer, or card payment at checkout.",
  },
  {
    q: "What if I'm not satisfied with a service?",
    a: "You can raise a dispute from the booking details screen within 48 hours of service completion. Our team will review and resolve it promptly.",
  },
  {
    q: "How do I become a provider?",
    a: "Tap 'Join as Pro' from the welcome screen and follow the registration steps. You'll need to provide your skills, location, and ID verification.",
  },
];

const CONTACT = [
  {
    icon: "mail-outline" as const,
    label: "Email Support",
    value: "support@handi.ng",
    action: () => Linking.openURL("mailto:support@handi.ng"),
  },
  {
    icon: "call-outline" as const,
    label: "Phone Support",
    value: "+234 800 HANDI (42634)",
    action: () => Linking.openURL("tel:+2348004263"),
  },
  {
    icon: "chatbubble-ellipses-outline" as const,
    label: "Live Chat",
    value: "Available 8am – 10pm",
    action: null,
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = React.useState<number | null>(null);

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
          Help & Support
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.hero, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="help-buoy" size={36} color="#fff" />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroDesc}>
            Find answers to common questions or reach out to our support team.
          </Text>
        </Animated.View>

        {/* FAQ */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Frequently Asked Questions
        </Text>
        {FAQ_ITEMS.map((item, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 60).duration(500)}
          >
            <TouchableOpacity
              onPress={() => setExpanded(expanded === i ? null : i)}
              style={[styles.faqCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQ, { color: colors.text }]}>
                  {item.q}
                </Text>
                <Ionicons
                  name={expanded === i ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.muted}
                />
              </View>
              {expanded === i && (
                <Text style={[styles.faqA, { color: colors.muted }]}>
                  {item.a}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Contact */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.text, marginTop: THEME.spacing.lg },
          ]}
        >
          Contact Us
        </Text>
        {CONTACT.map((c, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(300 + i * 80).duration(500)}
          >
            <TouchableOpacity
              onPress={c.action || undefined}
              style={[styles.contactCard, { backgroundColor: colors.surface }]}
              activeOpacity={c.action ? 0.7 : 1}
            >
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: colors.primaryLight || "#E8F5E9" },
                ]}
              >
                <Ionicons name={c.icon} size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  {c.label}
                </Text>
                <Text style={[styles.contactValue, { color: colors.muted }]}>
                  {c.value}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
  hero: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.xl,
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  heroTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.sm,
  },
  heroDesc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginTop: THEME.spacing.xs,
  },
  sectionLabel: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  faqCard: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.card,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQ: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  faqA: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
    marginTop: THEME.spacing.sm,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  contactLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  contactValue: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
});
