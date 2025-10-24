// app/client/home.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

// ================================
// 🔝 Top Navigation Icons
// ================================
const TOPNAVIGATION = [
  { id: "7", name: "Profile", icon: "account-outline" },
  { id: "8", name: "Notifications", icon: "bell-outline" },
];

// ================================
// Categories
// ================================
const CATEGORIES = [
  { id: "1", name: "Electrician", icon: "flash-outline" },
  { id: "2", name: "Plumber", icon: "pipe" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver" },
  { id: "4", name: "Barber", icon: "scissors-cutting" },
  { id: "5", name: "Painter", icon: "format-paint" },
  { id: "6", name: "Gardener", icon: "leaf" },
];

// ================================
// Main Component
// ================================
export default function ClientHome() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: THEME.spacing.xl * 3 }}
      showsVerticalScrollIndicator={false}
    >
      {/* --- Top Navigation --- */}
      <View style={styles.topNav}>
        {TOPNAVIGATION.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => router.push(`./client/${item.name.toLowerCase()}`)}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={THEME.colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Header Greeting --- */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Golden</Text>
        <Text style={styles.subText}>What do you need fixed today?</Text>
      </View>

      {/* --- Search Bar --- */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={THEME.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services or artisans..."
          placeholderTextColor={THEME.colors.muted}
          returnKeyType="search"
        />
      </View>

      {/* --- Categories --- */}
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryCard}
            onPress={() =>
              router.push({
                pathname: "./client/artisan", // I will come back here
                params: { category: item.name },
              })
            }
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={THEME.colors.primary}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Featured Section --- */}
      <Text style={styles.sectionTitle}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: THEME.spacing.lg }}
      >
        {[1, 2, 3, 4].map((id) => (
          <View key={id} style={styles.featuredCardContainer}>
            <View style={styles.featuredCardFirstChild}>
              <Image
                source={require("../../../assets/images/featured2.png")}
                style={{ width: 73, height: 73, marginBottom: 10 }}
              />
              <Text style={styles.featureText}>20% Off First Booking</Text>
              <TouchableOpacity
                style={styles.hireButton}
                onPress={() =>
                  router.push({
                    pathname: "./client/book-artisan",
                    params: { promo: "first" },
                  })
                }
              >
                <Text style={styles.hireButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../../assets/images/featured.png")}
              style={{ width: 117, height: 156 }}
            />
          </View>
        ))}
      </ScrollView>

      {/* --- Top Rated Artisans --- */}
      <Text style={styles.sectionTitle}>Top Rated Artisans</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: THEME.spacing.lg }}
        style={{ marginBottom: THEME.spacing.md }}
      >
        {[1, 2, 3, 4, 5].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <Image
              source={require("../../../assets/images/profileavatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.artisanName}>Golden Amadi</Text>
            <Text style={styles.artisanSkill}>Electrician</Text>
            <Text style={styles.artisanPrice}>From ₦5,000</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color="#FACC15" />
              <Text style={styles.ratingText}>4.{id}</Text>
            </View>
            <TouchableOpacity
              style={styles.hireButton}
              onPress={() =>
                router.push({
                  pathname: "/client/book-artisan",
                  params: { artisan: "Golden Amadi", skill: "Electrician" },
                })
              }
            >
              <Text style={styles.hireButtonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* --- Nearby Artisans --- */}
      <Text style={styles.sectionTitle}>Nearby Artisans</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: THEME.spacing.lg }}
      >
        {[9, 10, 11, 12, 13].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <Image
              source={require("../../../assets/images/profileavatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.artisanName}>Golden Amadi</Text>
            <Text style={styles.artisanSkill}>Plumber</Text>
            <Text style={styles.artisanPrice}>From ₦5,000</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color="#FACC15" />
              <Text style={styles.ratingText}>4.{id}</Text>
            </View>
            <TouchableOpacity
              style={styles.hireButton}
              onPress={() =>
                router.push({
                  pathname: "/client/book-artisan",
                  params: { artisan: "Golden Amadi", skill: "Plumber" },
                })
              }
            >
              <Text style={styles.hireButtonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

// ================================
// STYLES
// ================================
const styles = StyleSheet.create({
  // --- Base Screen Layout ---
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
  },

  // --- Top Navigation ---
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.lg,
    marginTop: THEME.spacing.xl,
  },
  navItem: {
    alignItems: "center",
  },

  // --- Header ---
  header: {
    alignItems: "center",
    marginBottom: THEME.spacing.sm,
  },
  greeting: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  subText: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginTop: THEME.spacing.xs,
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
  },

  // --- Search Bar ---
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
  },
  searchInput: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // --- Section Titles ---
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginVertical: THEME.spacing.md,
  },

  // --- Categories ---
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.lg,
  },
  categoryCard: {
    height: 100,
    width: "30%",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.xl,
    alignItems: "center",
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  categoryText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginTop: THEME.spacing.xs,
    color: THEME.colors.text,
  },

  // --- Featured Section ---
  featuredCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(28,140,75,0.10)",
    borderRadius: THEME.radius.lg,
    marginRight: THEME.spacing.md,
    marginBottom:THEME.spacing.md,
    alignItems: "center",
    width: 300,
    padding: THEME.spacing.md,
  },
  featuredCardFirstChild: {
    alignItems: "center",
  },
  featureText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.xs,
  },

  // --- Buttons ---
  hireButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    marginTop: THEME.spacing.sm,
  },
  hireButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // --- Artisan Cards ---
  artisanCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginRight: THEME.spacing.md,
    alignItems: "center",
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: THEME.spacing.sm,
  },
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  artisanSkill: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  artisanPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
    marginTop: THEME.spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: THEME.spacing.xs,
  },
  ratingText: {
    marginLeft: THEME.spacing.xs,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
