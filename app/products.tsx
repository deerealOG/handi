// app/products.tsx
// Products Page for HANDI - "Find the Perfect Product"

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { THEME } from "../constants/theme";

const PRODUCT_CATEGORIES = [
  { id: "all", label: "All Categories", icon: "view-grid" },
  { id: "beauty", label: "Beauty", icon: "face-woman" },
  { id: "fashion", label: "Fashion & Apparel", icon: "tshirt-crew" },
  { id: "food", label: "Food & Drinks", icon: "food" },
  { id: "building", label: "Building Materials", icon: "home-city" },
  { id: "electronics", label: "Electronics", icon: "laptop" },
  { id: "appliances", label: "Home Appliances", icon: "television" },
  { id: "furniture", label: "Furniture & Home", icon: "sofa" },
  { id: "health", label: "Health & Wellness", icon: "heart-pulse" },
  { id: "automotive", label: "Automotive", icon: "car" },
  { id: "baby", label: "Baby & Kids", icon: "baby-face-outline" },
  { id: "stationery", label: "Stationery & Office", icon: "pencil" },
  { id: "pet", label: "Pet Supplies", icon: "paw" },
];

const CATEGORY_GRID = PRODUCT_CATEGORIES.slice(1, 13); // First 12 categories for grid

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    title: "Pipe Fittings and Joints",
    category: "Pipes & Plumbing",
    stock: 110,
    description:
      "Industry grade pipe fittings and joints. Order this and get free quote from an expert professional plumber.",
    seller: "Monny Plumbing Services",
    rating: 5,
    reviews: 1,
    price: "£24.33",
    oldPrice: "£26.33",
    location: "Liverpool",
  },
  {
    id: 2,
    title: "Men's classic wears",
    category: "Fashion Accessories",
    stock: 5,
    description: "Available in all sizes",
    seller: "Dynamic global fashion",
    rating: 0,
    reviews: 0,
    price: "NGN 11.00",
    oldPrice: "NGN 12.00",
    location: "Abakaliki Eb...",
  },
  {
    id: 3,
    title: "Senator suit",
    category: "Men's Clothing",
    stock: 3,
    description: "Long sleeve",
    seller: "Dynamic global fashion",
    rating: 0,
    reviews: 0,
    price: "NGN 14.00",
    oldPrice: "NGN 15.00",
    location: "Abakaliki Eb...",
  },
  {
    id: 4,
    title: "Medium Shipping Box (18x18)",
    category: "Office Equipment",
    stock: 500,
    description:
      "Heavy-duty corrugated cardboard box. Ideal for general shipping up to 20kg.",
    seller: "Urban Swift Logistics",
    rating: 0,
    reviews: 0,
    price: "NGN 5.50",
    oldPrice: "",
    location: "Greater Lond...",
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching:", searchQuery, locationQuery);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="products" />

      {/* Hero Section */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.heroSection, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Find the Perfect <Text style={styles.heroHighlight}>Product</Text>
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
          Discover and shop premium products from verified sellers in your area.
          {"\n"}Quality guaranteed, fast delivery.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputGroup}>
            <Icon name="magnify" size={20} color={THEME.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="What product are you looking for?"
              placeholderTextColor={THEME.colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <View style={styles.searchDivider} />

          <View style={styles.searchInputGroup}>
            <Icon
              name="map-marker-outline"
              size={20}
              color={THEME.colors.muted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter location"
              placeholderTextColor={THEME.colors.muted}
              value={locationQuery}
              onChangeText={setLocationQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="magnify" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryChipsContainer}
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                activeCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === category.id &&
                    styles.categoryChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Count */}
        <Text style={[styles.productCount, { color: colors.muted }]}>
          4 products found
        </Text>

        {/* Filter Actions */}
        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.filterButton}>
            <Icon
              name="navigation-variant"
              size={18}
              color={THEME.colors.text}
            />
            <Text style={styles.filterButtonText}>Use My Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune-variant" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Icon name="close" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Location Tags */}
        <View style={styles.locationTags}>
          <Text style={[styles.locationLabel, { color: colors.muted }]}>
            Using your location:
          </Text>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>Using location</Text>
            <Icon name="close" size={14} color={THEME.colors.muted} />
          </View>
          <View style={styles.locationTag}>
            <Text style={styles.locationTagText}>Country: nigeria</Text>
          </View>
        </View>
      </Animated.View>

      {/* Featured Products Section */}
      <View style={styles.featuredSection}>
        <Text style={[styles.featuredTitle, { color: colors.text }]}>
          Featured Products
        </Text>
        <Text style={[styles.featuredSubtitle, { color: colors.muted }]}>
          Top-rated products from our trusted sellers
        </Text>

        {/* Product Cards */}
        <View style={styles.productGrid}>
          {SAMPLE_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productCardImage}>
                <View style={styles.productCardBadge}>
                  <Text style={styles.productCardBadgeText}>
                    {product.category}
                  </Text>
                </View>
                <View style={styles.productCardStock}>
                  <Text style={styles.productCardStockText}>
                    {product.stock} in stock
                  </Text>
                </View>
              </View>
              <View style={styles.productCardContent}>
                <Text style={[styles.productCardTitle, { color: colors.text }]}>
                  {product.title}
                </Text>
                <Text
                  style={[styles.productCardDesc, { color: colors.muted }]}
                  numberOfLines={2}
                >
                  {product.description}
                </Text>
                <Text
                  style={[styles.productCardSeller, { color: colors.muted }]}
                >
                  by {product.seller}
                </Text>
                <View style={styles.productCardRating}>
                  <Icon
                    name="star"
                    size={14}
                    color={product.rating > 0 ? "#FACC15" : "#9CA3AF"}
                  />
                  <Text style={styles.productCardRatingText}>
                    {product.rating}
                  </Text>
                  <Text
                    style={[styles.productCardReviews, { color: colors.muted }]}
                  >
                    ({product.reviews} reviews)
                  </Text>
                </View>
                <View style={styles.productCardPricing}>
                  <Text style={styles.productCardPrice}>{product.price}</Text>
                  {product.oldPrice && (
                    <Text style={styles.productCardOldPrice}>
                      {product.oldPrice}
                    </Text>
                  )}
                </View>
                <Text
                  style={[styles.productCardLocation, { color: colors.muted }]}
                >
                  {product.location}
                </Text>
                <View style={styles.productCardButtons}>
                  <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Products</Text>
        </TouchableOpacity>
      </View>

      {/* All Products Section */}
      <View style={styles.allProductsSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              All Products
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              Within 50km of your location
            </Text>
          </View>

          <TouchableOpacity style={styles.filtersHeaderButton}>
            <Icon name="tune-variant" size={18} color={THEME.colors.text} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Display first product as example */}
        <View style={styles.productGrid}>
          <View style={styles.productCard}>
            <View style={styles.productCardImage}>
              <View style={styles.productCardBadge}>
                <Text style={styles.productCardBadgeText}>
                  Pipes & Plumbing
                </Text>
              </View>
              <View style={styles.productCardStock}>
                <Text style={styles.productCardStockText}>110 in stock</Text>
              </View>
            </View>
            <View style={styles.productCardContent}>
              <Text style={[styles.productCardTitle, { color: colors.text }]}>
                Pipe Fittings and Joints
              </Text>
              <Text
                style={[styles.productCardDesc, { color: colors.muted }]}
                numberOfLines={2}
              >
                Industry grade pipe fittings and joints. Order this and get free
                quote from an expert professional plumber.
              </Text>
              <Text style={[styles.productCardSeller, { color: colors.muted }]}>
                by Monny Plumbing Services
              </Text>
              <View style={styles.productCardRating}>
                <Icon name="star" size={14} color="#FACC15" />
                <Text style={styles.productCardRatingText}>5</Text>
                <Text
                  style={[styles.productCardReviews, { color: colors.muted }]}
                >
                  (1 reviews)
                </Text>
              </View>
              <View style={styles.productCardPricing}>
                <Text style={styles.productCardPrice}>£24.33</Text>
                <Text style={styles.productCardOldPrice}>£26.33</Text>
              </View>
              <Text
                style={[styles.productCardLocation, { color: colors.muted }]}
              >
                Liverpool
              </Text>
              <View style={styles.productCardButtons}>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Shop by Category Section */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(800)}
        style={styles.shopBySection}
      >
        <Text style={[styles.shopBySectionTitle, { color: colors.text }]}>
          Shop by Category
        </Text>
        <Text style={[styles.shopBySectionSubtitle, { color: colors.muted }]}>
          Discover amazing products tailored to your needs
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORY_GRID.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => setActiveCategory(category.id)}
            >
              <View style={styles.categoryIconContainer}>
                <Icon
                  name={category.icon as any}
                  size={28}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.categoryStats, { color: colors.muted }]}>
          12+ categories • 1000+ sellers • 4.6+ average rating
        </Text>
      </Animated.View>

      {/* Footer */}
      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Navigation
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: Platform.OS === "web" ? 24 : 60,
    paddingBottom: THEME.spacing.md,
    backgroundColor: "#3c4a3e",
  },
  navLogo: {
    width: 70,
    height: 70,
  },
  navLinks: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navButtons: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navLinkText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },
  navLinkActive: {
    color: THEME.colors.secondary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  signUpButtonText: {
    color: "#1F2937",
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#FFF9F0",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 42 : 28,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  heroHighlight: {
    color: THEME.colors.primary,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },

  // Search
  searchContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.sm,
    width: "100%",
    maxWidth: 600,
    ...THEME.shadow.card,
  },
  searchInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    paddingVertical: THEME.spacing.sm,
    color: "#1F2937",
  },
  searchDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
    marginHorizontal: THEME.spacing.sm,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },

  // Categories
  categoryScroll: {
    marginTop: THEME.spacing.xl,
    maxWidth: "100%",
  },
  categoryChipsContainer: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  categoryChipText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },

  // Product count
  productCount: {
    marginTop: THEME.spacing.lg,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },

  // Filter actions
  filterActions: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
    backgroundColor: "#FFFFFF",
  },
  filterButtonText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
  },

  // Location tags
  locationTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.md,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  locationLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  locationTagText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.primary,
  },

  // Featured section
  featuredSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  featuredTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  featuredSubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },

  // Product Grid
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.lg,
    justifyContent: "center",
    width: "100%",
  },
  productCard: {
    width: Platform.OS === "web" ? 280 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  productCardImage: {
    height: 160,
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  productCardBadge: {
    position: "absolute",
    top: THEME.spacing.sm,
    left: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  productCardBadgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  productCardStock: {
    position: "absolute",
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
  },
  productCardStockText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
  },
  productCardContent: {
    padding: THEME.spacing.md,
  },
  productCardTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  productCardDesc: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
    marginBottom: THEME.spacing.xs,
  },
  productCardSeller: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.sm,
  },
  productCardRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: THEME.spacing.xs,
  },
  productCardRatingText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  productCardReviews: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  productCardPricing: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  productCardPrice: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  productCardOldPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textDecorationLine: "line-through",
  },
  productCardLocation: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.md,
  },
  productCardButtons: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 50,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },
  viewButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  viewButtonText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },

  viewAllButton: {
    marginTop: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 50,
  },
  viewAllText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },

  // All Products Section
  allProductsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#F9FAFB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  filtersHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: THEME.radius.sm,
    backgroundColor: "#FFFFFF",
  },

  // Shop by Category
  shopBySection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  shopBySectionTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  shopBySectionSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.md,
    maxWidth: 900,
    marginBottom: THEME.spacing.lg,
  },
  categoryCard: {
    width: Platform.OS === "web" ? 140 : "45%",
    padding: THEME.spacing.lg,
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.sm,
  },
  categoryLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },
  categoryStats: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.md,
  },

  // Footer
  footer: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#1F2937",
  },
  footerMain: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing["2xl"],
    marginBottom: THEME.spacing["2xl"],
  },
  footerBrand: {
    maxWidth: 300,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: THEME.spacing.md,
  },
  footerBrandText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  footerLinks: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.xl,
  },
  footerColumn: {
    minWidth: 120,
  },
  footerColumnTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
  },
  footerLink: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.sm,
  },
  footerPayment: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
    paddingVertical: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginBottom: THEME.spacing.lg,
  },
  footerPaymentLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  footerPaymentIcons: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  paymentIcon: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#9CA3AF",
    backgroundColor: "#374151",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 4,
  },
  footerBottom: {
    alignItems: "center",
    paddingTop: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  footerCopyright: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.xs,
  },
  footerCompany: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#6B7280",
  },
});
