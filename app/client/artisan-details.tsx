// ======================================
// 🧑‍🔧 Professional Details Screen
// Displays a detailed profile of a specific professional — including bio, stats,
// work samples, and customer reviews. Users can also book the professional.
// ======================================

import { Button } from "@/components/Button";
import { HeroRatingCard } from "@/components/RatingDisplay";
import { VerificationBadge, VerificationLevel } from "@/components/VerificationBadge";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ArtisanDetails() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView | null>(null);

  // --- 🧩 Dummy artisan data (temporary; replace later with backend data) ---
  const artisan = {
    name: "Golden Amadi",
    skill: "Electrician",
    rating: 4.8,
    reviewCount: 127,
    price: "From ₦5,000",
    experience: "5 years experience",
    description:
      "Golden is a certified electrician specializing in home wiring, appliance repair, and smart home installations. Known for reliability, speed, and professionalism.",
    verificationLevel: "certified" as VerificationLevel,
    isEmergencyAvailable: true,
  };

  // --- ⚙️ Quick stats section (dynamic details like experience, jobs, etc.) ---
  const QUICKSTATS = [
    { id: "1", name: "Experience: 8 years", icon: "timer-sand" },
    { id: "2", name: "Location: Lekki Phase 1", icon: "map-marker" },
    { id: "3", name: "Jobs completed: 50+", icon: "hammer-screwdriver" },
    { id: "4", name: "Response time: 30 mins", icon: "clock-outline" },
  ];

  // --- 💬 Customer reviews (temporary static data) ---
  const reviews = [
    {
      id: 1,
      name: "Amina O.",
      comment:
        "Great service! Arrived on time and fixed everything fast. He even explained what caused the problem so I could avoid it in the future. Highly recommended!",
    },
    {
      id: 2,
      name: "Chuka M.",
      comment:
        "Very professional and neat. Golden did a great job rewiring our kitchen and helped install new light fixtures. Will definitely hire again.",
    },
    {
      id: 3,
      name: "Ngozi A.",
      comment:
        "Excellent job setting up my smart switches. Everything works perfectly now. Also appreciated his politeness and patience.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.bigContainer, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </Animated.View>
        

        {/* 👤 Profile Image */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.headerImageContainer}>
          <View style={[styles.profileWrapper, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
            <Image
              source={require("../../assets/images/profilepicture2.jpeg")}
              style={styles.profileImage}
            />
          </View>
        </Animated.View>

        {/* 🧾 Basic Info */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.infoContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{artisan.name}</Text>
          <Text style={[styles.skill, { color: colors.muted }]}>{artisan.skill}</Text>

          {/* Verification Badge */}
          <View style={styles.badgesRow}>
            <VerificationBadge level={artisan.verificationLevel} size="medium" />
            {artisan.isEmergencyAvailable && (
              <View style={[styles.emergencyMini, { backgroundColor: colors.error + '15' }]}>
                <Ionicons name="flash" size={12} color={colors.error} />
                <Text style={[styles.emergencyText, { color: colors.error }]}>24/7 Available</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* ⭐ PROMINENT Rating Card */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.ratingCardContainer}>
          <HeroRatingCard rating={artisan.rating} reviewCount={artisan.reviewCount} />
        </Animated.View>

        {/* 📊 Quick Stats */}
        <Animated.View entering={FadeInDown.delay(700).duration(800)}>
          <Text style={[styles.quickStatsSectionTitle, { color: colors.text }]}>Overview</Text>
          <View style={styles.quickStatsContainer}>
            {QUICKSTATS.map((item) => (
              <View key={item.id} style={[styles.quickStatCard, { backgroundColor: colors.surface }]}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.quickStatText, { color: colors.text }]}>{item.name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* 🧠 About Section */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.muted }]}>{artisan.description}</Text>
        </Animated.View>

        {/* 🖼 Work Samples */}
        <Animated.View entering={FadeInDown.delay(900).duration(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Work Portfolio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((id) => (
              <Image
                key={id}
                source={require("../../assets/images/worksamples.png")}
                style={styles.sampleImage}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* 💬 Customer Reviews */}
        <Animated.View entering={FadeInDown.delay(1000).duration(800)}>
          <Text style={[styles.customerReviewSectionTitle, { color: colors.text }]}>Reviews</Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          >
            {reviews.map((review) => (
              <CustomerReviewCard key={review.id} review={review} colors={colors} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Padding for bottom button visibility */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 🟢 Floating Book Now Button Area */}
      <View style={[styles.bottomFloatingContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: colors.muted }]}>Starting from</Text>
          <Text style={[styles.priceValue, { color: colors.primary }]}>{artisan.price}</Text>
        </View>
        <Button 
          label="Book Appointment"
          onPress={() => router.push("/client/book-artisan")}
          style={styles.floatingBookButton}
        />
      </View>
    </View>
  );
}

// ======================================
// 💬 Reusable Customer Review Card
// Displays a single customer review with toggle to expand/collapse text
// ======================================
function CustomerReviewCard({ review, colors }: any) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.customerReviewCard, { width: width - 40, backgroundColor: colors.surface }]}>
      <Image
        source={require("../../assets/images/profileavatar.png")}
        style={styles.avatar}
      />
      <Text style={[styles.customerName, { color: colors.text }]}>{review.name}</Text>

      <Text
        numberOfLines={expanded ? undefined : 2}
        ellipsizeMode="tail"
        style={[styles.customerComment, { color: colors.muted }]}
      >
        {review.comment}
      </Text>

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={[styles.seeMoreText, { color: colors.primary }]}>
          {expanded ? "See less" : "See more"}
        </Text>
      </TouchableOpacity>

      <View style={styles.customerRatingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name="star"
            size={16}
            color="#facc15"
          />
        ))}
      </View>
    </View>
  );
}

// ======================================
// 🎨 Styles (using THEME constants)
// All colors, spacing, radius, and shadows follow THEME.ts configuration
// ======================================
const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 30,
    paddingBottom:50,
  },

  // --- Profile Image Wrapper ---
  headerImageContainer: {
    alignItems: "center",
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
   header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
    headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  profileWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  profileImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },

  // --- Basic Info ---
  infoContainer: {
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  name: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
  },
  skill: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.muted,
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.sm,
  },
  emergencyMini: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  emergencyText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  ratingCardContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: THEME.spacing.sm,
  },
  ratingText: {
    marginLeft: 4,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  experience: {
    marginLeft: 4,
    color: THEME.colors.muted,
  },
  price: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.primary,
    marginTop: 6,
  },

  // --- Quick Stats Section ---
  quickStatsSectionTitle: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  quickStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  quickStatCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    alignItems: "center",
    width: "47%",
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  quickStatText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginTop: 6,
  },

  // --- About & Samples Sections ---
  section: {
    marginTop: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
  },
  sectionTitle: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  description: {
    color: THEME.colors.muted,
    lineHeight: 22,
  },
  sampleImage: {
    width: 120,
    height: 120,
    borderRadius: THEME.radius.md,
    marginRight: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },

  // --- Customer Reviews ---
  customerReviewSectionTitle: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  customerReviewCard: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    alignItems: "center",
    ...THEME.shadow.card,
    marginRight: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: THEME.spacing.sm,
  },
  customerName: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
    marginBottom: 4,
  },
  customerComment: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  seeMoreText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.xs,
    marginBottom: THEME.spacing.sm,
  },
  customerRatingRow: {
    flexDirection: "row",
    gap: 2,
  },

  // --- Bottom Floating Area ---
  bottomFloatingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    ...THEME.shadow.float,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  floatingBookButton: {
    flex: 2,
    marginLeft: THEME.spacing.md,
  },
});
