// app/client/all-artisans.tsx
// Screen to display all professionals with filters

import { EnhancedArtisanCard } from "@/components/EnhancedArtisanCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// Mock data
const ALL_ARTISANS = [
  { id: 1, name: "Golden Amadi", skill: "Electrician", price: "5,000", rating: 4.9, reviews: 120, distance: "2.5 km", verified: true },
  { id: 2, name: "Sarah Jones", skill: "Plumber", price: "4,500", rating: 4.8, reviews: 85, distance: "3.1 km", verified: true },
  { id: 3, name: "Mike Obi", skill: "Carpenter", price: "6,000", rating: 4.7, reviews: 92, distance: "1.8 km", verified: false },
  { id: 4, name: "John Doe", skill: "Painter", price: "3,000", rating: 4.5, reviews: 40, distance: "0.5 km", verified: true },
  { id: 5, name: "Jane Smith", skill: "Gardener", price: "4,000", rating: 4.6, reviews: 55, distance: "1.2 km", verified: false },
  { id: 6, name: "Emeka Johnson", skill: "Electrician", price: "5,500", rating: 4.8, reviews: 78, distance: "2.0 km", verified: true },
  { id: 7, name: "Chidi Okonkwo", skill: "Plumber", price: "4,800", rating: 4.7, reviews: 65, distance: "1.5 km", verified: true },
  { id: 8, name: "Amaka Eze", skill: "Carpenter", price: "5,200", rating: 4.6, reviews: 48, distance: "3.0 km", verified: false },
];

export default function AllArtisansScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const title = (params.title as string) || "All Professionals";

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtisans = ALL_ARTISANS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search professionals..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Artisan List */}
      <FlatList
        data={filteredArtisans}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EnhancedArtisanCard
            artisan={{
              ...item,
              verificationLevel: item.verified ? 'verified' : 'none',
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            No professionals found matching your search.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  searchContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: THEME.typography.sizes.base,
  },
});
