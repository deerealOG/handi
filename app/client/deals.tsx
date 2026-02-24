// app/client/deals.tsx
// Flash Deals screen — mirrors web /deals with countdown timer & deal cards

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// ── Types & Data ─────────────────────────────────────────────────
interface Deal {
  id: string;
  name: string;
  provider: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  endsIn: string;
  sold: number;
}

const DEAL_SERVICES: Deal[] = [
  {
    id: "d1",
    name: "Deep House Cleaning",
    provider: "Clean Pro Services",
    originalPrice: 20000,
    dealPrice: 15000,
    discount: 25,
    rating: 4.8,
    reviews: 56,
    icon: "broom",
    endsIn: "2h 30m",
    sold: 42,
  },
  {
    id: "d2",
    name: "AC Installation & Repair",
    provider: "CoolTech Solutions",
    originalPrice: 18000,
    dealPrice: 12000,
    discount: 33,
    rating: 4.9,
    reviews: 89,
    icon: "wrench",
    endsIn: "4h 15m",
    sold: 28,
  },
  {
    id: "d3",
    name: "Hair Styling & Braiding",
    provider: "Precious Beauty Lounge",
    originalPrice: 12000,
    dealPrice: 8000,
    discount: 33,
    rating: 4.7,
    reviews: 107,
    icon: "content-cut",
    endsIn: "1h 45m",
    sold: 65,
  },
  {
    id: "d4",
    name: "Plumbing Repair",
    provider: "PipeMaster NG",
    originalPrice: 15000,
    dealPrice: 10000,
    discount: 33,
    rating: 4.6,
    reviews: 34,
    icon: "water-pump",
    endsIn: "5h 20m",
    sold: 17,
  },
  {
    id: "d5",
    name: "Generator Maintenance",
    provider: "PowerFix Solutions",
    originalPrice: 30000,
    dealPrice: 22000,
    discount: 27,
    rating: 4.8,
    reviews: 45,
    icon: "flash",
    endsIn: "3h 10m",
    sold: 31,
  },
  {
    id: "d6",
    name: "Full Interior Cleaning",
    provider: "SparkleClean Pro",
    originalPrice: 25000,
    dealPrice: 18000,
    discount: 28,
    rating: 4.9,
    reviews: 72,
    icon: "spray-bottle",
    endsIn: "6h 45m",
    sold: 53,
  },
];

// ── Component ────────────────────────────────────────────────────
export default function DealsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  // Countdown timer
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="timer-outline" size={24} color="#fff" />
            <View>
              <Text style={styles.headerTitle}>Flash Deals</Text>
              <Text style={styles.headerSub}>
                Limited-time offers on top services
              </Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={styles.countdownRow}>
            <Text style={styles.endsInLabel}>Ends in:</Text>
            <View style={styles.countdownBoxes}>
              {[
                { val: pad(countdown.hours), label: "HRS" },
                { val: pad(countdown.minutes), label: "MIN" },
                { val: pad(countdown.seconds), label: "SEC" },
              ].map((t, i) => (
                <View key={i} style={styles.countdownBox}>
                  <Text style={styles.countdownVal}>{t.val}</Text>
                  <Text style={styles.countdownLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Deals Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DEAL_SERVICES.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            activeOpacity={0.8}
            onPress={() => router.push("/client/(tabs)/explore")}
          >
            {/* Image area */}
            <View
              style={[
                styles.cardImage,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name={deal.icon}
                size={40}
                color={colors.primary}
                style={{ opacity: 0.5 }}
              />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{deal.discount}%</Text>
              </View>
              <View style={styles.timerBadge}>
                <Ionicons name="timer-outline" size={10} color="#fff" />
                <Text style={styles.timerText}>{deal.endsIn}</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text
                style={[styles.dealName, { color: colors.text }]}
                numberOfLines={1}
              >
                {deal.name}
              </Text>
              <Text style={[styles.dealProvider, { color: colors.muted }]}>
                {deal.provider}
              </Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FACC15" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {deal.rating}
                </Text>
                <Text style={[styles.reviewCount, { color: colors.muted }]}>
                  ({deal.reviews})
                </Text>
                <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
                <Text style={[styles.soldText, { color: colors.muted }]}>
                  {deal.sold} booked
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={[styles.dealPrice, { color: colors.primary }]}>
                  ₦{deal.dealPrice.toLocaleString()}
                </Text>
                <Text style={[styles.originalPrice, { color: colors.muted }]}>
                  ₦{deal.originalPrice.toLocaleString()}
                </Text>
              </View>

              {/* Progress bar */}
              <View
                style={[styles.progressBar, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min((deal.sold / 80) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={[styles.slotsText, { color: colors.muted }]}>
                {deal.sold} booked — limited slots available
              </Text>

              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.bookBtnText}>Book Now</Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: THEME.spacing.lg,
  },
  backBtn: { padding: 8, marginBottom: 8 },
  headerContent: {},
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  headerSub: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  countdownRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  endsInLabel: {
    color: "#fff",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  countdownBoxes: { flexDirection: "row", gap: 8 },
  countdownBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 50,
  },
  countdownVal: {
    color: "#fff",
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  countdownLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 8,
    fontFamily: THEME.typography.fontFamily.body,
  },

  scrollContent: { padding: THEME.spacing.lg, paddingBottom: 32 },

  // Card
  card: {
    borderRadius: 16,
    ...THEME.shadow.card,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardImage: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  timerBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  timerText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Content
  cardContent: { padding: 14 },
  dealName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  dealProvider: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  reviewCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  dot: { fontSize: 10 },
  soldText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dealPrice: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  originalPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textDecorationLine: "line-through",
  },

  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#EF4444", borderRadius: 3 },
  slotsText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 10,
  },

  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: THEME.radius.pill,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
