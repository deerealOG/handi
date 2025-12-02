import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

const REVIEWS = [
  {
    id: "1",
    clientName: "Golden Amadi",
    rating: 5,
    date: "Oct 22, 2025",
    comment: "Excellent work! The electrician was very professional and fixed the issue quickly.",
    avatar: require("../../assets/images/profileavatar.png"),
  },
  {
    id: "2",
    clientName: "Sarah Jones",
    rating: 4,
    date: "Oct 15, 2025",
    comment: "Good job, but arrived a bit late. Otherwise, very satisfied with the service.",
    avatar: require("../../assets/images/profileavatar.png"),
  },
  {
    id: "3",
    clientName: "Mike Obi",
    rating: 5,
    date: "Sept 30, 2025",
    comment: "Highly recommended! Will definitely hire again for future projects.",
    avatar: require("../../assets/images/profileavatar.png"),
  },
];

export default function ReviewsScreen() {
  const router = useRouter();

  const renderReview = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Image source={item.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}.0</Text>
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Overall Rating</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.bigRating}>4.8</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name="star"
                size={24}
                color={star <= 4 ? "#FFD700" : "#E0E0E0"}
              />
            ))}
          </View>
        </View>
        <Text style={styles.totalReviews}>Based on 45 reviews</Text>
      </View>

      <FlatList
        data={REVIEWS}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  summaryTitle: {
    fontSize: 16,
    color: THEME.colors.muted,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  bigRating: {
    fontSize: 48,
    fontWeight: "700",
    color: THEME.colors.text,
  },
  starsRow: {
    flexDirection: "row",
  },
  totalReviews: {
    fontSize: 14,
    color: THEME.colors.muted,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  date: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9C4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FBC02D",
  },
  comment: {
    fontSize: 14,
    color: THEME.colors.text,
    lineHeight: 20,
  },
});
