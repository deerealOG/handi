// app/client/explore.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { THEME } from "../../../constants/theme";
import { Header } from "..//../../components/Header";

const FILTERS = ["All", "Electrician", "Plumber", "Carpenter", "Painter", "Barber", "Gardener"];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All");// State to track the active filter
  const router = useRouter(); // Initialize the router
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >

      {/* Header */}
      <Header title="Explore Artisans" showBack={false}/>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color={THEME.colors.muted} />
        <TextInput
          placeholder="Search for artisans..."
          placeholderTextColor={THEME.colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              activeFilter === filter && {
                backgroundColor: THEME.colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && { color: THEME.colors.white },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Artisan List */}
      <View style={styles.artisanGrid}>
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <TouchableOpacity onPress={() => router.push("/client/artisan-details")}>
            <Image
              source={require("C:\\FIXIT\\assets\\images\\profileavatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.artisanName}>Golden Amadi</Text>
            <Text style={styles.artisanSkill}>Electrician</Text>
            <Text style={styles.artisanPrice}>From ₦5,000</Text>
            <Text style={styles.artisanLocation}>2km away</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color="#facc15" />
              <Text style={styles.ratingText}>4.{id}</Text>
            </View>
            <TouchableOpacity style={styles.viewProfileButton} onPress={() => router.push("/client/artisan-details")}>
              <Text style={styles.viewProfileButtonText}>View Profile</Text>
            </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Style for the Explore Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {// Header container
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {// Title text
    fontSize: THEME.typography.sizes.title,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
    marginTop: 53,
  },
  searchContainer: {// Search bar container
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primary + "10",
    borderRadius: THEME.radius.xl,
    marginBottom: 16,
    borderWidth: 0,
    height: 48,
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 25,
  },
  searchInput: {// Search input field
    flex: 1,
    marginLeft: 20,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },
  filterScroll: {// Filter tabs container
    marginBottom: 20,
  },
  filterButton: {// Individual filter button
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    borderRadius:THEME.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  filterText: {// Filter button text
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "500",
  },
  artisanGrid: {// Grid container for artisan cards
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  artisanCard: {// Individual artisan card
    width: "47%",
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  avatar: {// Artisan avatar image
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  artisanName: {// Artisan name text
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
  },
  artisanSkill: {// Artisan skill text
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
  },
  artisanPrice: {// Artisan price text
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginTop: 4,
  },
  artisanLocation: { // Artisan location text
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.text,
    marginTop: 2,
  },
  viewProfileButton: {// View Profile button style
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewProfileButtonText: {// View Profile button text style
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "600",
  },
  ratingRow: {// Rating row style
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {// Rating text style
    marginLeft: 4,
    color: THEME.colors.text,
  },
});
