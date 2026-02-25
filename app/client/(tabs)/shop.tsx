// app/client/(tabs)/shop.tsx
// Products listing tab — mirrors the web "Shop" tab

import { useCart } from "@/context/CartContext";
import { useLikedItems } from "@/context/LikedItemsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { formatNaira, getProducts, Product } from "@/services/mockApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../../constants/theme";

const PRODUCT_CATEGORIES = ["All", "Electronics", "Beauty", "Home", "Tools"];

export default function ShopScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { addItem, totalItems } = useCart();
  const { toggleLike, isLiked } = useLikedItems();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts(
        selectedCategory !== "All" ? { category: selectedCategory } : undefined,
      );
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
    });
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/client/cart" as any);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(500)}
      style={[styles.productCard, { backgroundColor: colors.surface }]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/client/product-detail",
            params: { id: item.id },
          } as any)
        }
      >
        {/* Image */}
        <View
          style={[
            styles.productImage,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.productImageFull}
            />
          ) : (
            <Ionicons name="cube-outline" size={40} color={colors.primary} />
          )}
          {item.originalPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -
                {Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) *
                    100,
                )}
                %
              </Text>
            </View>
          )}
          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          {/* Wishlist Heart */}
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() =>
              toggleLike({
                id: item.id,
                name: item.name,
                type: "product",
              } as any)
            }
          >
            <Ionicons
              name={isLiked(item.id) ? "heart" : "heart-outline"}
              size={18}
              color={isLiked(item.id) ? "#EF4444" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.productInfo}>
          <Text
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text style={[styles.productSeller, { color: colors.muted }]}>
            {item.seller}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>
              {formatNaira(item.price)}
            </Text>
            {item.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.muted }]}>
                {formatNaira(item.originalPrice)}
              </Text>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.muted }]}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: item.inStock ? colors.primary : colors.muted },
          ]}
          disabled={!item.inStock}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={14} color="#fff" />
          <Text style={styles.actionBtnText}> Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: item.inStock ? colors.text : colors.muted },
          ]}
          disabled={!item.inStock}
          onPress={() => handleBuyNow(item)}
        >
          <Text style={styles.actionBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shop</Text>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => router.push("/client/cart" as any)}
        >
          <Ionicons name="cart-outline" size={26} color={colors.text} />
          {totalItems > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>
                {totalItems > 9 ? "9+" : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PRODUCT_CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                {
                  backgroundColor:
                    selectedCategory === item ? colors.primary : colors.surface,
                  borderColor:
                    selectedCategory === item ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  {
                    color: selectedCategory === item ? "#fff" : colors.text,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadProducts();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No products found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  categoryRow: { paddingVertical: 12 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  gridContent: { paddingHorizontal: 12, paddingBottom: 100 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  productCard: {
    flex: 1,
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  productImage: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  productImageFull: { width: "100%", height: "100%", resizeMode: "cover" },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: THEME.colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.pill,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "#fff",
    fontFamily: THEME.typography.fontFamily.bodyBold,
    fontSize: 12,
  },
  wishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 14,
    padding: 4,
  },
  productInfo: { padding: 10, gap: 2 },
  productName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    lineHeight: 18,
  },
  productSeller: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  originalPrice: { fontSize: 11, textDecorationLine: "line-through" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontSize: 11 },
  buttonRow: {
    flexDirection: "row",
    gap: 4,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyContainer: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: THEME.typography.sizes.base },
});
