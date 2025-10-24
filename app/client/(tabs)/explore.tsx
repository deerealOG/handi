// app/client/explore.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

// Available artisan filters
const FILTERS = [
  "All",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Barber",
  "Gardener",
];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All"); // Track active category filter
  const router = useRouter(); // Navigation hook

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Page Header */}
      <Text style={styles.title}>Explore Artisans</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={THEME.colors.muted}
        />
        <TextInput
          placeholder="Search for artisans..."
          placeholderTextColor={THEME.colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* 🏷️ Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              activeFilter === filter && {
                backgroundColor: THEME.colors.primary,
                borderColor: THEME.colors.primaryDark,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && {
                  color: THEME.colors.surface,
                  fontFamily: THEME.typography.fontFamily.subheading,
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 👷‍♂️ Artisan List */}
      <View style={styles.artisanGrid}>
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <TouchableOpacity
              onPress={() => router.push("/client/artisan-details")}
            >
              {/* 🖼 Profile Avatar */}
              <Image
                source={require("C:\\FIXIT\\assets\\images\\profileavatar.png")}
                style={styles.avatar}
              />

              {/* 👤 Artisan Details */}
              <Text style={styles.artisanName}>Golden Amadi</Text>
              <Text style={styles.artisanSkill}>Electrician</Text>
              <Text style={styles.artisanPrice}>From ₦5,000</Text>
              <Text style={styles.artisanLocation}>2km away</Text>

              {/* ⭐ Rating */}
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color={THEME.colors.secondary}
                />
                <Text style={styles.ratingText}>4.{id}</Text>
              </View>

              {/* 🔗 View Profile Button */}
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => router.push("/client/artisan-details")}
              >
                <Text style={styles.viewProfileButtonText}>View Profile</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// 💅 STYLES (THEME-BASED)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
  },
  // --- Page Header ---
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xl,
    textAlign: "center",
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28,140,75,0.05)",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    height: 48,
    marginBottom: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // 🏷️ Filter Section
  filterScroll: {
    marginBottom: THEME.spacing.lg,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    marginRight: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
  },
  filterText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // 👷‍♂️ Artisan Grid
  artisanGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  artisanCard: {
    width: "47%",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: THEME.radius.lg,
    marginBottom: THEME.spacing.sm,
  },

  // 👤 Text Styles
  artisanName: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  artisanSkill: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  artisanPrice: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  artisanLocation: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.muted,
    marginTop: 2,
    fontFamily: THEME.typography.fontFamily.bodyLight,
  },

  // ⭐ Rating Row
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: THEME.spacing.xs,
  },
  ratingText: {
    marginLeft: 4,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // 🔗 View Profile Button
  viewProfileButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.sm,
  },
  viewProfileButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
