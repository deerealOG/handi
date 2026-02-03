// app/client/liked-items.tsx
// Screen showing all liked artisans and businesses

import EnhancedArtisanCard from "@/components/EnhancedArtisanCard";
import { useLikedItems } from "@/context/LikedItemsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function LikedItemsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { likedItems, clearAll } = useLikedItems();

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all your liked artisans and businesses?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAll },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        {likedItems.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
        {likedItems.length === 0 && <View style={{ width: 40 }} />}
      </View>

      {/* Content */}
      {likedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Tap the heart icon on any artisan or business to add them here.
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/client/(tabs)/explore" as any)}
          >
            <Text style={[styles.exploreButtonText, { color: colors.onPrimary }]}>Explore Artisans</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={likedItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EnhancedArtisanCard
              artisan={item}
            />
          )}
        />
      )}
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
  clearButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  exploreButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
