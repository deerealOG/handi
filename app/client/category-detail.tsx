// app/client/category-detail.tsx
// Category detail screen showing artisans in a specific category

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { VerificationBadge } from "../../components/VerificationBadge";
import { getCategoryById } from "../../constants/categories";
import { THEME } from "../../constants/theme";

// ================================
// Mock Artisans Data
// ================================
const MOCK_ARTISANS = [
  { id: "1", name: "Golden Amadi", rating: 4.9, reviews: 156, distance: "1.2 km", price: "₦5,000", verified: "certified" as const, available: true },
  { id: "2", name: "Chidi Okonkwo", rating: 4.7, reviews: 98, distance: "2.5 km", price: "₦4,500", verified: "verified" as const, available: true },
  { id: "3", name: "Adaeze Nwosu", rating: 4.8, reviews: 203, distance: "3.1 km", price: "₦6,000", verified: "certified" as const, available: false },
  { id: "4", name: "Emeka Johnson", rating: 4.5, reviews: 67, distance: "4.2 km", price: "₦4,000", verified: "basic" as const, available: true },
  { id: "5", name: "Fatima Hassan", rating: 4.9, reviews: 312, distance: "5.0 km", price: "₦7,000", verified: "certified" as const, available: true },
  { id: "6", name: "Oluwaseun Bakare", rating: 4.6, reviews: 89, distance: "5.5 km", price: "₦5,500", verified: "verified" as const, available: true },
  { id: "7", name: "Ibrahim Musa", rating: 4.4, reviews: 45, distance: "6.8 km", price: "₦3,500", verified: "basic" as const, available: false },
  { id: "8", name: "Grace Eze", rating: 4.8, reviews: 178, distance: "7.2 km", price: "₦5,000", verified: "verified" as const, available: true },
];

type SortOption = "distance" | "rating" | "price" | "reviews";

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const category = getCategoryById(id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Filter and sort artisans
  const filteredArtisans = useMemo(() => {
    let result = [...MOCK_ARTISANS];

    // Filter by availability
    if (showAvailableOnly) {
      result = result.filter(a => a.available);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "rating":
          return b.rating - a.rating;
        case "price":
          return parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""));
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortBy, showAvailableOnly]);

  const handleArtisanPress = (artisan: typeof MOCK_ARTISANS[0]) => {
    router.push({
      pathname: "/client/artisan-details",
      params: { id: artisan.id, name: artisan.name },
    });
  };

  const renderArtisanCard = ({ item }: { item: typeof MOCK_ARTISANS[0] }) => (
    <TouchableOpacity
      style={[styles.artisanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => handleArtisanPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>
          {item.name.split(" ").map(n => n[0]).join("")}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.artisanInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.artisanName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <VerificationBadge level={item.verified} size="small" showLabel={false} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="star" size={12} color={colors.star} />
            <Text style={[styles.statText, { color: colors.muted }]}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="location" size={12} color={colors.muted} />
            <Text style={[styles.statText, { color: colors.muted }]}>{item.distance}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.primary }]}>{item.price}/hr</Text>
          <View
            style={[
              styles.availabilityBadge,
              { backgroundColor: item.available ? colors.success + "20" : colors.error + "20" },
            ]}
          >
            <View
              style={[
                styles.availabilityDot,
                { backgroundColor: item.available ? colors.success : colors.error },
              ]}
            />
            <Text
              style={[
                styles.availabilityText,
                { color: item.available ? colors.success : colors.error },
              ]}
            >
              {item.available ? "Available" : "Busy"}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </TouchableOpacity>
  );

  const SortButton = ({ option, label }: { option: SortOption; label: string }) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        {
          backgroundColor: sortBy === option ? colors.primary : colors.surface,
          borderColor: sortBy === option ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setSortBy(option)}
    >
      <Text
        style={[
          styles.sortButtonText,
          { color: sortBy === option ? "#FFFFFF" : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {category?.name || name || "Category"}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            {filteredArtisans.length} professionals available
          </Text>
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="options" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search professionals..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <SortButton option="distance" label="Nearest" />
        <SortButton option="rating" label="Top Rated" />
        <SortButton option="price" label="Lowest Price" />
        <SortButton option="reviews" label="Most Reviews" />
      </View>

      {/* Available Toggle */}
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => setShowAvailableOnly(!showAvailableOnly)}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: showAvailableOnly ? colors.primary : "transparent",
              borderColor: showAvailableOnly ? colors.primary : colors.border,
            },
          ]}
        >
          {showAvailableOnly && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>Show available only</Text>
      </TouchableOpacity>

      {/* Artisans List */}
      <FlatList
        data={filteredArtisans}
        keyExtractor={(item) => item.id}
        renderItem={renderArtisanCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No professionals found matching your criteria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  headerSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.md,
    height: 44,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  sortContainer: {
    flexDirection: "row",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  sortButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  listContent: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: THEME.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  artisanInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    marginBottom: 4,
  },
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  statsRow: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginBottom: 6,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
  },
  emptyText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginTop: THEME.spacing.md,
  },
});
