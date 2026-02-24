// app/client/product-detail.tsx
// Product detail screen — mirrors web /products/[id] with tabs, reviews, add-to-cart

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// ── Mock Data ────────────────────────────────────────────────────
const PRODUCT = {
  id: "p1",
  title: "Pipe Fittings and Joints",
  category: "Pipes & Plumbing",
  description:
    "Industry grade pipe fittings and joints. Order this and get a free quote from an expert professional plumber. Made from premium stainless steel with anti-corrosion coating.",
  seller: "Monny Plumbing Services",
  rating: 4.8,
  reviews: 56,
  price: 24330,
  oldPrice: 26330,
  stock: 110,
  location: "Lagos, Nigeria",
  features: [
    "Premium stainless steel construction",
    "Anti-corrosion coating",
    "Compatible with standard pipe sizes",
    "Easy installation",
    "1-year warranty",
  ],
  specifications: [
    { key: "Material", value: "Stainless Steel 304" },
    { key: "Size Range", value: '½" – 2"' },
    { key: "Pressure Rating", value: "300 PSI" },
    { key: "Weight", value: "0.5 kg per piece" },
    { key: "Certification", value: "ISO 9001" },
  ],
};

const REVIEWS = [
  {
    id: "r1",
    name: "Tunde A.",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Excellent quality fittings. Very durable and easy to install. The free plumber quote was a bonus!",
  },
  {
    id: "r2",
    name: "Chidi O.",
    rating: 4,
    date: "1 month ago",
    comment:
      "Good product, fast delivery. One piece had a minor scratch but works fine.",
  },
  {
    id: "r3",
    name: "Kemi L.",
    rating: 5,
    date: "1 month ago",
    comment:
      "This is my second purchase. Very reliable and durable. Highly recommended.",
  },
];

type Tab = "description" | "specs" | "reviews";

// ── Component ────────────────────────────────────────────────────
export default function ProductDetailScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [tab, setTab] = useState<Tab>("description");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const discount = Math.round(
    ((PRODUCT.oldPrice - PRODUCT.price) / PRODUCT.oldPrice) * 100,
  );

  const handleAddToCart = () => {
    Alert.alert(
      "Added to Cart",
      `${qty}× ${PRODUCT.title} added to your cart`,
      [
        { text: "Continue Shopping" },
        {
          text: "Go to Cart",
          onPress: () => router.push("/client/cart" as any),
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${PRODUCT.title} on HANDI - NGN ${PRODUCT.price.toLocaleString()}`,
      });
    } catch {}
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Product Details
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.iconBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLiked(!liked)}
            style={[styles.iconBtn, { borderColor: colors.border }]}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image placeholder */}
        <View
          style={[styles.imageArea, { backgroundColor: colors.primaryLight }]}
        >
          <MaterialCommunityIcons
            name="pipe-wrench"
            size={64}
            color={colors.primary}
            style={{ opacity: 0.4 }}
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor:
                  PRODUCT.stock > 0 ? colors.successLight : colors.errorLight,
              },
            ]}
          >
            <Text
              style={[
                styles.stockText,
                { color: PRODUCT.stock > 0 ? colors.success : colors.error },
              ]}
            >
              {PRODUCT.stock} in stock
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {PRODUCT.category}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {PRODUCT.title}
          </Text>
          <Text style={[styles.seller, { color: colors.muted }]}>
            by {PRODUCT.seller}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FACC15" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {PRODUCT.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.muted }]}>
              ({PRODUCT.reviews} reviews)
            </Text>
            <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
            <Ionicons name="location-outline" size={14} color={colors.muted} />
            <Text style={[styles.locationText, { color: colors.muted }]}>
              {PRODUCT.location}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ₦{PRODUCT.price.toLocaleString()}
            </Text>
            <Text style={[styles.oldPrice, { color: colors.muted }]}>
              ₦{PRODUCT.oldPrice.toLocaleString()}
            </Text>
            <View
              style={[styles.saveBadge, { backgroundColor: colors.errorLight }]}
            >
              <Text style={[styles.saveText, { color: colors.error }]}>
                Save ₦{(PRODUCT.oldPrice - PRODUCT.price).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabBar, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
          {(["description", "specs", "reviews"] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tabBtn,
                tab === t && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: tab === t ? colors.primary : colors.muted },
                ]}
              >
                {t === "description"
                  ? "Description"
                  : t === "specs"
                    ? "Specifications"
                    : `Reviews (${REVIEWS.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={[styles.tabContent, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
          {tab === "description" && (
            <>
              <Text style={[styles.descText, { color: colors.text }]}>
                {PRODUCT.description}
              </Text>
              <Text style={[styles.featuresTitle, { color: colors.text }]}>
                Key Features
              </Text>
              {PRODUCT.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    {f}
                  </Text>
                </View>
              ))}
            </>
          )}

          {tab === "specs" && (
            <>
              {PRODUCT.specifications.map((s, i) => (
                <View
                  key={i}
                  style={[styles.specRow, { borderBottomColor: colors.border }]}
                >
                  <Text style={[styles.specKey, { color: colors.muted }]}>
                    {s.key}
                  </Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>
                    {s.value}
                  </Text>
                </View>
              ))}
            </>
          )}

          {tab === "reviews" && (
            <>
              {REVIEWS.map((r) => (
                <View
                  key={r.id}
                  style={[
                    styles.reviewCard,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.reviewHeader}>
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: colors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[styles.avatarText, { color: colors.primary }]}
                      >
                        {r.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.reviewerName, { color: colors.text }]}
                      >
                        {r.name}
                      </Text>
                      <Text
                        style={[styles.reviewDate, { color: colors.muted }]}
                      >
                        {r.date}
                      </Text>
                    </View>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name={s <= r.rating ? "star" : "star-outline"}
                          size={12}
                          color="#FACC15"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: colors.muted }]}>
                    {r.comment}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: colors.border }]}
            onPress={() => setQty(Math.max(1, qty - 1))}
            disabled={qty <= 1}
          >
            <Ionicons
              name="remove"
              size={16}
              color={qty <= 1 ? colors.border : colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>
          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: colors.border }]}
            onPress={() => setQty(qty + 1)}
            disabled={qty >= PRODUCT.stock}
          >
            <Ionicons
              name="add"
              size={16}
              color={qty >= PRODUCT.stock ? colors.border : colors.text}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.addToCartText}>
            Add to Cart | NGN {(PRODUCT.price * qty).toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { padding: 8, borderRadius: 20, borderWidth: 1 },

  scrollContent: { paddingBottom: 120 },

  // Image
  imageArea: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  stockBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  stockText: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Info
  infoCard: { padding: THEME.spacing.lg },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
    backgroundColor: "#DCFCE7",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  seller: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  reviewCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  dot: { fontSize: 10 },
  locationText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  price: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
  },
  oldPrice: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textDecorationLine: "line-through",
  },
  saveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.pill,
  },
  saveText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Tabs
  tabBar: { flexDirection: "row", marginTop: 8 },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  tabContent: { padding: THEME.spacing.lg },

  // Description
  descText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Specs
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  specValue: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Reviews
  reviewCard: { paddingVertical: 14, borderBottomWidth: 1 },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 14, fontFamily: THEME.typography.fontFamily.heading },
  reviewerName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  reviewDate: { fontSize: 10, fontFamily: THEME.typography.fontFamily.body },
  starsRow: { flexDirection: "row", gap: 2 },
  reviewComment: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    ...THEME.shadow.float,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 14,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    width: 28,
    textAlign: "center",
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: THEME.radius.pill,
    ...THEME.shadow.card,
  },
  addToCartText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});

