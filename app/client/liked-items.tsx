// app/client/liked-items.tsx
// Wishlist / Favorites — mirrors web /wishlist with per-item remove + Book Now

import { EnhancedArtisanCard } from "@/components/EnhancedArtisanCard";
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
  const { likedItems, toggleLike, clearAll } = useLikedItems();

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all your liked artisans and businesses?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAll },
      ],
    );
  };

  const handleRemove = (item: any) => {
    Alert.alert(
      "Remove from Favorites",
      `Remove ${item.fullName || item.businessName || "this item"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => toggleLike(item),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Ionicons
            name="heart"
            size={20}
            color={colors.error}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Favorites
          </Text>
          {likedItems.length > 0 && (
            <View
              style={[styles.countBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.countText}>{likedItems.length}</Text>
            </View>
          )}
        </View>
        {likedItems.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={[styles.clearAllText, { color: colors.error }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Content */}
      {likedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyCircle,
              { backgroundColor: colors.errorLight || colors.primaryLight },
            ]}
          >
            <Ionicons name="heart-outline" size={48} color={colors.error} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your Wishlist is Empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Save your favorite providers and services to come back to later.
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/client/(tabs)/explore" as any)}
          >
            <Text
              style={[styles.exploreButtonText, { color: colors.onPrimary }]}
            >
              Browse Providers
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={likedItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              {/* Remove overlay button */}
              <TouchableOpacity
                style={[styles.removeBtn, { backgroundColor: colors.surface }]}
                onPress={() => handleRemove(item)}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </TouchableOpacity>

              <EnhancedArtisanCard artisan={item} />

              {/* Action buttons */}
              <View
                style={[
                  styles.actionRow,
                  {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: colors.primary }]}
                  onPress={() =>
                    router.push({
                      pathname: "/client/book-artisan",
                      params: {
                        artisan: item.fullName || item.businessName,
                        skill: item.skills?.[0] || "General",
                      },
                    } as any)
                  }
                >
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cartBtn, { borderColor: colors.border }]}
                  onPress={() => router.push("/client/cart" as any)}
                >
                  <Ionicons name="cart-outline" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  countBadge: {
    marginLeft: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  clearButton: { padding: 8 },
  clearAllText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  listContent: { paddingHorizontal: THEME.spacing.lg, paddingBottom: 100 },

  // Card wrapper with actions
  cardWrapper: { position: "relative", marginBottom: 4 },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    marginTop: -8,
    marginBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bookBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    lineHeight: 20,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  exploreButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
