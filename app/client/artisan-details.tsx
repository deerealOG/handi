// app/client/artisan-details.tsx
// ======================================
// 🧑‍🔧 Artisan Details Screen
// Displays a detailed profile of a specific artisan — including bio, stats,
// work samples, and customer reviews. Users can also book the artisan.
// ======================================

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/Header";
import { THEME } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ArtisanDetails() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  // --- 🧩 Dummy artisan data (temporary; replace later with backend data) ---
  const artisan = {
    name: "Golden Amadi",
    skill: "Electrician",
    rating: 4.8,
    price: "From ₦5,000",
    experience: "5 years experience",
    description:
      "Golden is a certified electrician specializing in home wiring, appliance repair, and smart home installations. Known for reliability, speed, and professionalism.",
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
    <ScrollView
      style={styles.bigContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* 🔝 Header with back navigation */}
      <Header title="Profile" />

      {/* 👤 Profile Image */}
      <View style={styles.headerImageContainer}>
        <View style={styles.profileWrapper}>
          <Image
            source={require("../../assets/images/profilepicture2.jpeg")}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* 🧾 Basic Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{artisan.name}</Text>
        <Text style={styles.skill}>{artisan.skill}</Text>

        {/* ⭐ Rating & Experience */}
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={18} color="#facc15" />
          <Text style={styles.ratingText}>{artisan.rating}</Text>
          <Text style={styles.experience}> • {artisan.experience}</Text>
        </View>

        <Text style={styles.price}>{artisan.price}</Text>
      </View>

      {/* 📊 Quick Stats */}
      <Text style={styles.quickStatsSectionTitle}>Quick Stats</Text>
      <View style={styles.quickStatsContainer}>
        {QUICKSTATS.map((item) => (
          <View key={item.id} style={styles.quickStatCard}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={THEME.colors.primary}
            />
            <Text style={styles.quickStatText}>{item.name}</Text>
          </View>
        ))}
      </View>

      {/* 🧠 About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{artisan.description}</Text>
      </View>

      {/* 🖼 Work Samples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Samples</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((id) => (
            <Image
              key={id}
              source={require("../../assets/images/worksamples.png")}
              style={styles.sampleImage}
            />
          ))}
        </ScrollView>
      </View>

      {/* 💬 Customer Reviews */}
      <Text style={styles.customerReviewSectionTitle}>Customer Reviews</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {reviews.map((review) => (
          <CustomerReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>

      {/* 🟢 Book Now Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push("/client/book-artisan")}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ======================================
// 💬 Reusable Customer Review Card
// Displays a single customer review with toggle to expand/collapse text
// ======================================
function CustomerReviewCard({ review }: any) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.customerReviewCard, { width: width - 40 }]}>
      <Image
        source={require("../../assets/images/profileavatar.png")}
        style={styles.avatar}
      />
      <Text style={styles.customerName}>{review.name}</Text>

      <Text
        numberOfLines={expanded ? undefined : 2}
        ellipsizeMode="tail"
        style={styles.customerComment}
      >
        {review.comment}
      </Text>

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.seeMoreText}>
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
  },

  // --- Profile Image Wrapper ---
  headerImageContainer: {
    alignItems: "center",
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  profileWrapper: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
    marginRight: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: THEME.spacing.sm,
  },
  customerName: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text,
  },
  customerComment: {
    color: THEME.colors.muted,
    marginVertical: THEME.spacing.sm,
    textAlign: "center",
  },
  seeMoreText: {
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  customerRatingRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  // --- Book Button ---
  bookButton: {
    backgroundColor: THEME.colors.primary,
    margin: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  bookButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
