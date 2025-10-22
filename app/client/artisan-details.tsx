// app/client/artisan-details.tsx

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

  // --- Dummy artisan data (replace later with dynamic data) ---
  const artisan = {
    name: "Golden Amadi",
    skill: "Electrician",
    rating: 4.8,
    price: "From ₦5,000",
    experience: "5 years experience",
    description:
      "Golden is a certified electrician specializing in home wiring, appliance repair, and smart home installations. Known for reliability, speed, and professionalism.",
  };

  const QUICKSTATS = [
    { id: "1", name: "Experience: 8 years", icon: "timer-sand" },
    { id: "2", name: "Location: Lekki Phase 1", icon: "map-marker" },
    { id: "3", name: "Jobs completed: 50+", icon: "hammer-screwdriver" },
    { id: "4", name: "Response time: 30 mins", icon: "clock-outline" },
  ];

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
    <ScrollView style={styles.bigContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Header title="Profile" />

      <View style={styles.headerImageContainer}>
        <View style={styles.profileWrapper}>
          {/* Header Image */}
          <Image
            source={require("../../assets/images/profilepicture2.jpeg")}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Basic Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{artisan.name}</Text>
        <Text style={styles.skill}>{artisan.skill}</Text>

        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={18} color="#facc15" />
          <Text style={styles.ratingText}>{artisan.rating}</Text>
          <Text style={styles.experience}> • {artisan.experience}</Text>
        </View>

        <Text style={styles.price}>{artisan.price}</Text>
      </View>

      {/* Quick Stats */}
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

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{artisan.description}</Text>
      </View>

      {/* Work Samples */}
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

      {/* Customer Reviews */}
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

      {/* Book Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push("/client/book-artisan")}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Reusable Review Card ---
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
          <MaterialCommunityIcons key={star} name="star" size={16} color="#facc15" />
        ))}
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerImageContainer: {
  alignItems: "center",
  marginTop: 40,
  marginBottom: 16,
},

profileWrapper: {
  width: 170,
  height: 170,
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: THEME.colors.primary, // your app's theme color
  borderRadius: 85, // make it fully circular
  backgroundColor: THEME.colors.white, // inner background color
  shadowColor: THEME.shadow.base.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 4, // Android shadow
},

profileImage: {
  width: 150,
  height: 150,
  borderRadius: 75, // must be half of width/height for perfect circle
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
},
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: "center",
  },
  name: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "bold",
    color: THEME.colors.text,
  },
  skill: {
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.muted,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "600",
    color: THEME.colors.text,
  },

  experience: {
    marginLeft: 4,
    color: THEME.colors.muted,
  },
  price: {
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.primary,
    marginTop: 6,
    fontWeight: "600",
  },

  quickStatsSectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "bold",
    color: THEME.colors.text,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  quickStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickStatCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: 12,
    alignItems: "center",
    width: "47%",
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  quickStatText: {
    marginTop: 6,
    fontSize: THEME.typography.sizes.sm,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "bold",
    color: THEME.colors.text,
    marginBottom: 8,
  },
  description: {
    color: THEME.colors.muted,
    lineHeight: 22,
  },
  sampleImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  customerReviewSectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "bold",
    color: THEME.colors.text,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  customerReviewCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
    marginRight: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  customerName: {
    fontWeight: "600",
    color: THEME.colors.text,
    fontSize: 16,
  },
  customerComment: {
    color: THEME.colors.muted,
    marginVertical: 10,
    textAlign: "center",
  },
  seeMoreText: {
    color: THEME.colors.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  customerRatingRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bookButton: {
    backgroundColor: THEME.colors.primary,
    margin: 20,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  bookButtonText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.base,
    fontWeight: "600",
  },
});
