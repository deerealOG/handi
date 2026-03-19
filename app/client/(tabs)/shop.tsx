// app/client/(tabs)/shop.tsx
// Redesigned to match web ShopTab with search, filter pills, 2-col grid

import { useCart } from "@/app/context/CartContext";
import { useLikedItems } from "@/app/context/LikedItemsContext";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddToCart = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, category: product.category });
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/client/cart" as any);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push({ pathname: "/client/product-detail", params: { id: item.id } } as any)}>
        {/* Image */}
        <View style={[styles.productImageWrap, { backgroundColor: colors.background }]}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <Ionicons name="cube-outline" size={36} color={colors.muted} />
          )}
          {item.originalPrice && (
            <View style={[styles.discountTag, { backgroundColor: colors.error }]}>
              <Text style={styles.discountText}>-{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%</Text>
            </View>
          )}
          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          <TouchableOpacity style={styles.heartBtn} onPress={() => toggleLike({ id: item.id, name: item.name, type: "product" } as any)}>
            <Ionicons name={isLiked(item.id) ? "heart" : "heart-outline"} size={16} color={isLiked(item.id) ? "#EF4444" : "#fff"} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
          <Text style={[styles.sellerText, { color: colors.muted }]}>{item.seller}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>{formatNaira(item.price)}</Text>
            {item.originalPrice && <Text style={[styles.originalPrice, { color: colors.muted }]}>{formatNaira(item.originalPrice)}</Text>}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.muted }]}>{item.rating} ({item.reviews})</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.cartBtn, { backgroundColor: item.inStock ? colors.primary : colors.muted }]} disabled={!item.inStock} onPress={() => handleAddToCart(item)}>
          <Ionicons name="cart-outline" size={14} color="#fff" />
          <Text style={styles.cartBtnText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buyBtn, { backgroundColor: item.inStock ? colors.text : colors.muted }]} disabled={!item.inStock} onPress={() => handleBuyNow(item)}>
          <Text style={styles.cartBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"} backgroundColor={colors.background} />

      {/* Header with search */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Shop</Text>
          <TouchableOpacity style={{ position: "relative" }} onPress={() => router.push("/client/cart" as any)}>
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {totalItems > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeText}>{totalItems > 9 ? "9+" : totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.pillRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PRODUCT_CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.pill, { backgroundColor: selectedCategory === item ? colors.primary : colors.surface, borderColor: selectedCategory === item ? colors.primary : colors.border }]}
              onPress={() => setSelectedCategory(item)}>
              <Text style={[styles.pillText, { color: selectedCategory === item ? "#fff" : colors.text }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadProducts(); }} tintColor={colors.primary} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="cube-outline" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, borderBottomWidth: 0.5 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  headerTitle: { fontSize: 22, fontFamily: THEME.typography.fontFamily.heading },
  badge: { position: "absolute", top: -6, right: -8, minWidth: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { color: "#fff", fontSize: 10, fontFamily: THEME.typography.fontFamily.bodyBold },
  searchBar: { flexDirection: "row", alignItems: "center", height: 42, borderRadius: 21, borderWidth: 1, paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: THEME.typography.fontFamily.body },
  pillRow: { paddingVertical: 10 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: THEME.typography.fontFamily.bodyMedium },

  // Product Card
  productCard: { flex: 1, borderRadius: 16, overflow: "hidden", borderWidth: 1, ...THEME.shadow.base },
  productImageWrap: { height: 130, alignItems: "center", justifyContent: "center", position: "relative" },
  productImage: { width: "100%", height: "100%", resizeMode: "cover" },
  discountTag: { position: "absolute", top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 50 },
  discountText: { color: "#fff", fontSize: 10, fontFamily: THEME.typography.fontFamily.bodyBold },
  outOfStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  outOfStockText: { color: "#fff", fontFamily: THEME.typography.fontFamily.bodyBold, fontSize: 12 },
  heartBtn: { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  productInfo: { padding: 10, gap: 2 },
  productName: { fontSize: 13, fontFamily: THEME.typography.fontFamily.bodyMedium, lineHeight: 17 },
  sellerText: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 4 },
  productPrice: { fontSize: 15, fontFamily: THEME.typography.fontFamily.bodyBold },
  originalPrice: { fontSize: 11, textDecorationLine: "line-through" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  ratingText: { fontSize: 11 },
  btnRow: { flexDirection: "row", gap: 4, marginHorizontal: 10, marginBottom: 10 },
  cartBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 8, borderRadius: 10 },
  buyBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 8, borderRadius: 10 },
  cartBtnText: { color: "#fff", fontSize: 12, fontFamily: THEME.typography.fontFamily.bodyBold },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14 },
});
