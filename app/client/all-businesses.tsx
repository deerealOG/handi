// app/client/all-businesses.tsx
// Screen to display all businesses

import EnhancedArtisanCard from "@/components/EnhancedArtisanCard";
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
const ALL_BUSINESSES = [
  { id: 101, name: "Apex Services Ltd", skill: "Plumbing & Electrical", price: "10,000", rating: 4.8, reviews: 200, distance: "1.5 km", verified: true, type: "business" as const },
  { id: 102, name: "BuildRight Construction", skill: "General Contractor", price: "50,000", rating: 4.9, reviews: 50, distance: "4.0 km", verified: true, type: "business" as const },
  { id: 103, name: "CleanPro Services", skill: "Cleaning & Maintenance", price: "8,000", rating: 4.7, reviews: 150, distance: "2.0 km", verified: true, type: "business" as const },
  { id: 104, name: "TechFix Solutions", skill: "IT & Electronics", price: "15,000", rating: 4.6, reviews: 80, distance: "3.5 km", verified: false, type: "business" as const },
];

export default function AllBusinessesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const title = (params.title as string) || "All Businesses";

  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = ALL_BUSINESSES.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.skill.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search businesses..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Business List */}
      <FlatList
        data={filteredBusinesses}
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
            No businesses found matching your search.
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
