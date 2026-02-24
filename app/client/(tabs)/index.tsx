// app/client/(tabs)/index.tsx
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLikedItems } from "@/context/LikedItemsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Booking, bookingService } from "@/services";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, {
    Defs,
    Rect,
    Stop,
    LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { EnhancedArtisanCard } from "../../../components/EnhancedArtisanCard";
import FilterModal, { FilterOptions } from "../../../components/FilterModal";
import Toast from "../../../components/Toast";
import { FEATURED_CATEGORIES } from "../../../constants/categories";
import { THEME } from "../../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_SLIDER_WIDTH = SCREEN_WIDTH - 32; // 16px padding each side

// Hero slides data (mirrors web)
const HERO_SLIDES = [
  {
    title: "Professional Services\nYou Can Trust",
    subtitle:
      "Everyday services you don't want to miss. Book verified professionals today!",
    cta: "Explore Now",
    route: "/client/(tabs)/explore",
    gradientColors: ["#166534", "#14532d"] as [string, string],
    image: require("../../../assets/images/hero/hero-chef.png"),
  },
  {
    title: "Find Trusted\nProviders Near You",
    subtitle:
      "Over 5,000 verified providers within your area. Quality guaranteed.",
    cta: "Find Providers",
    route: "/client/(tabs)/explore",
    gradientColors: ["#5f5c6d", "#aca9bb"] as [string, string],
    image: require("../../../assets/images/hero/hero-electrician.png"),
  },
  {
    title: "Buy Home Products\nOnline",
    subtitle: "Shop top brands at unbeatable prices. Fast delivery guaranteed.",
    cta: "Buy Now",
    route: "/client/(tabs)/shop",
    gradientColors: ["#3b3b3b", "#111111"] as [string, string],
    image: require("../../../assets/images/hero/hero-products.png"),
  },
];

// Trust badges data
const TRUST_BADGES = [
  {
    icon: "lock-closed-outline" as const,
    title: "Secure Payments",
    desc: "All transactions verified",
  },
  {
    icon: "headset-outline" as const,
    title: "24/7 Support",
    desc: "We're here for you",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Verified Providers",
    desc: "Carefully vetted",
  },
  {
    icon: "pricetag-outline" as const,
    title: "Discounted Rates",
    desc: "Discounted prices",
  },
];

// Promo product cards data
const PROMO_CARDS = [
  {
    id: "promo-drill",
    name: "Generic Multifunctional Electric Drill Set",
    priceValue: 8300,
    tag: "HOT DEAL",
    category: "Tools",
    gradientColors: ["#005D80", "#00131A"] as [string, string],
    image: require("../../../assets/images/featured.png"),
  },
  {
    id: "promo-cleaner",
    name: "Professional Home Self Use Low Carbon Cleaner",
    priceValue: 5800,
    tag: null,
    category: "Home",
    gradientColors: ["#6B2FA0", "#2D1050"] as [string, string],
    image: require("../../../assets/images/featured2.png"),
  },
  {
    id: "promo-crusher",
    name: "SILVER CREST 2L Industrial 850W Food Crusher",
    priceValue: 8300,
    tag: "BEST SELLER",
    category: "Home",
    gradientColors: ["#B8430E", "#3D1500"] as [string, string],
    image: require("../../../assets/images/hero-nigerian-family.png"),
  },
];

// ================================
// Data
// ================================
// Use first 8 featured categories from the single source of truth
const CATEGORIES = FEATURED_CATEGORIES.slice(0, 8).map((cat) => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  color: cat.color,
}));

const PROMOS = [
  {
    id: "1",
    title: "20% Off First Booking",
    subtitle: "Get professional help for less",
    image: require("../../../assets/images/featured.png"),
    color: "#E6F4EA",
  },
];

const TOP_RATED = [
  {
    id: 1,
    name: "Golden Amadi",
    skill: "Electrician",
    price: "5,000",
    rating: 4.9,
    reviews: 120,
    distance: "2.5 km",
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Jones",
    skill: "Plumber",
    price: "4,500",
    rating: 4.8,
    reviews: 85,
    distance: "3.1 km",
    verified: true,
  },
  {
    id: 3,
    name: "Mike Obi",
    skill: "Carpenter",
    price: "6,000",
    rating: 4.7,
    reviews: 92,
    distance: "1.8 km",
    verified: false,
  },
];

const NEARBY = [
  {
    id: 4,
    name: "John Doe",
    skill: "Painter",
    price: "3,000",
    rating: 4.5,
    reviews: 40,
    distance: "0.5 km",
    verified: true,
  },
  {
    id: 5,
    name: "Jane Smith",
    skill: "Gardener",
    price: "4,000",
    rating: 4.6,
    reviews: 55,
    distance: "1.2 km",
    verified: false,
  },
];

// ================================
// Components
// ================================

// ================================
// Hero Slider Component
// ================================
const HeroSlider = ({ router, colors }: { router: any; colors: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / HERO_SLIDER_WIDTH,
      );
      if (index >= 0 && index < HERO_SLIDES.length) {
        setCurrentSlide(index);
      }
    },
    [],
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={HERO_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={HERO_SLIDER_WIDTH}
        decelerationRate="fast"
        keyExtractor={(_, i) => `hero-${i}`}
        getItemLayout={(_, index) => ({
          length: HERO_SLIDER_WIDTH,
          offset: HERO_SLIDER_WIDTH * index,
          index,
        })}
        renderItem={({ item: slide }) => (
          <GradientBlock
            colors={slide.gradientColors}
            gradientId={`hero-${slide.title}`}
            horizontal
            style={[styles.heroSlide, { width: HERO_SLIDER_WIDTH }]}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{slide.title}</Text>
              <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
              <TouchableOpacity
                style={styles.heroCTA}
                onPress={() => router.push(slide.route as any)}
              >
                <Text style={styles.heroCTAText}>{slide.cta}</Text>
                <Ionicons name="arrow-forward" size={14} color="#333" />
              </TouchableOpacity>
            </View>
            <Image
              source={slide.image}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </GradientBlock>
        )}
      />
      {/* Dots */}
      <View style={styles.heroDots}>
        {HERO_SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.heroDot,
              {
                backgroundColor:
                  i === currentSlide ? colors.primary : colors.border,
                width: i === currentSlide ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// ================================
// Components
// ================================

const SectionHeader = ({
  title,
  onPressSeeAll,
}: {
  title: string;
  onPressSeeAll?: () => void;
}) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {onPressSeeAll && (
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const GradientBlock = ({
  colors,
  gradientId,
  style,
  horizontal,
  children,
}: {
  colors: [string, string];
  gradientId: string;
  style: any;
  horizontal?: boolean;
  children: React.ReactNode;
}) => (
  <View style={[style, { overflow: "hidden" }]}>
    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Defs>
        <SvgLinearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2={horizontal ? "100%" : "100%"}
          y2={horizontal ? "0%" : "100%"}
        >
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[1]} />
        </SvgLinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
    {children}
  </View>
);

const ArtisanCard = ({ item, router }: { item: any; router: any }) => {
  return (
    <View style={{ marginRight: 16 }}>
      <EnhancedArtisanCard
        artisan={{
          ...item,
          verificationLevel: item.verified ? "verified" : "none",
        }}
        onBookPress={() =>
          router.push({
            pathname: "/client/(tabs)/explore",
            params: { category: item.skill },
          } as any)
        }
        onPress={() =>
          router.push({
            pathname: "/client/artisan-profile",
            params: { id: item.id },
          } as any)
        }
      />
    </View>
  );
};

// ================================
// Main Screen
// ================================
export default function ClientHome() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user, isGuest } = useAuth();
  const { totalItems: cartCount, addItem } = useCart();
  const { toggleLike, isLiked } = useLikedItems();

  // Dynamic greeting
  const greeting = user?.firstName
    ? `Hi, ${user.firstName} 👋`
    : isGuest
      ? "Hi there 👋"
      : "Welcome 👋";

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("Lagos, Nigeria");

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings on focus
  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, []),
  );

  const loadBookings = async () => {
    try {
      // Hardcoded user ID for demo
      const response = await bookingService.getBookings("user_001", "client", {
        perPage: 3,
      });
      if (response.success && response.data) {
        setRecentBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  /*
  useEffect(() => {
    // Simulate welcome toast
    // setTimeout(() => {
    //   setToastMessage("Welcome back, Golden! 👋");
    //   setToastVisible(true);
    // }, 1000);
  }, []);
  */

  const handleApplyFilters = (_newFilters: FilterOptions) => {
    setFilterModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
  };

  const SUGGESTIONS = [
    "Electrician near me",
    "Plumber for emergency",
    "Cheap house cleaning",
    "AC repair",
    "Mechanic",
    "Cleaning Services",
    "Construction Company",
    "Apex Services",
  ].filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onDismiss={() => setToastVisible(false)}
      />

      {/* --- Header --- */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.push("/client/(tabs)/profile" as any)}
          >
            <Image
              source={require("../../../assets/images/profileavatar.png")}
              style={[styles.headerAvatar, { borderColor: colors.surface }]}
            />
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greeting}
            </Text>
            <TouchableOpacity
              style={[
                styles.locationSelector,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowLocationModal(true)}
            >
              <View
                style={[
                  styles.locationIconContainer,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name="location" size={12} color={colors.primary} />
              </View>
              <Text style={[styles.locationText, { color: colors.text }]}>
                {location}
              </Text>
              <Ionicons name="chevron-down" size={12} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push("/client/liked-items" as any)}
          >
            <Ionicons name="heart-outline" size={22} color={colors.error} />
          </TouchableOpacity>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={[
                styles.headerIconButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => router.push("/client/cart" as any)}
            >
              <Ionicons name="cart-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            {cartCount > 0 && (
              <View
                style={[
                  styles.cartBadge,
                  {
                    backgroundColor: colors.error,
                    borderColor: colors.surface,
                  },
                ]}
              >
                <Text style={styles.cartBadgeText}>
                  {cartCount > 9 ? "9+" : cartCount}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push("/client/notifications" as any)}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <View
              style={[
                styles.notificationBadge,
                { borderColor: colors.surface },
              ]}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* --- Search Bar --- */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.searchWrapper}
        >
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search-outline" size={22} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search services..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onSubmitEditing={() => {
                setShowSuggestions(false);
                router.push({
                  pathname: "/client/(tabs)/explore",
                  params: { query: searchQuery },
                } as any);
              }}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={22}
                color={colors.onPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && SUGGESTIONS.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionItem,
                    { borderBottomColor: colors.background },
                  ]}
                  onPress={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    router.push({
                      pathname: "/client/(tabs)/explore",
                      params: { query: suggestion },
                    } as any);
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.muted}
                  />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {suggestion}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* --- Hero Slider --- */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(800)}
          style={styles.heroSliderContainer}
        >
          <HeroSlider router={router} colors={colors} />
        </Animated.View>

        {/* --- Trust Badges --- */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.trustBadgesRow}
        >
          {TRUST_BADGES.map((badge, i) => (
            <View key={i} style={styles.trustBadge}>
              <View
                style={[
                  styles.trustBadgeIcon,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name={badge.icon} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.trustBadgeTitle, { color: colors.text }]}>
                {badge.title}
              </Text>
              <Text style={[styles.trustBadgeDesc, { color: colors.muted }]}>
                {badge.desc}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* --- Categories --- */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <SectionHeader
            title="Categories"
            onPressSeeAll={() => router.push("/client/categories" as any)}
          />
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.categoryItem}
                onPress={() =>
                  router.push({
                    pathname: "/client/(tabs)/explore",
                    params: { category: item.name },
                  } as any)
                }
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: item.color + "33" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* --- Flash Deals Banner --- */}
        <Animated.View
          entering={FadeInDown.delay(550).duration(800)}
          style={{ marginBottom: 24 }}
        >
          <SectionHeader
            title="Flash Deals"
            onPressSeeAll={() => router.push("/client/deals" as any)}
          />
          <TouchableOpacity
            style={[styles.dealsBanner, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/client/deals" as any)}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.dealsBannerTitle}>Up to 50% Off Today</Text>
              <Text style={styles.dealsBannerSub}>
                Limited time - ends at midnight
              </Text>
            </View>
            <View style={styles.dealsBannerBadge}>
              <Text style={styles.dealsBannerBadgeText}>View Deals</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* --- Featured Promos --- */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={{ marginBottom: 24 }}
        >
          {PROMOS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.promoCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.promoContent}>
                <Text style={[styles.promoTitle, { color: colors.primary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.promoSubtitle, { color: colors.text }]}>
                  {item.subtitle}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.promoButton,
                    {
                      backgroundColor: promoApplied
                        ? colors.muted
                        : colors.primary,
                    },
                  ]}
                  disabled={promoApplied}
                  onPress={() => {
                    setPromoApplied(true);
                    setToastMessage(
                      "🎉 20% discount applied to your next booking!",
                    );
                    setToastVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.promoButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    {promoApplied ? "✓ Applied" : "Claim Offer"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Image
                source={item.image}
                style={styles.promoImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </Animated.View>

        {/* --- Promo Product Cards (mirrors web) --- */}
        <Animated.View
          entering={FadeInDown.delay(650).duration(800)}
          style={{ marginBottom: 24 }}
        >
          <SectionHeader
            title="Trending Products"
            onPressSeeAll={() => router.push("/client/(tabs)/shop" as any)}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {PROMO_CARDS.map((card, index) => (
              <GradientBlock
                key={card.id}
                colors={card.gradientColors}
                gradientId={`promo-${index}`}
                style={styles.promoProductCard}
                horizontal={false}
              >
                {card.tag && (
                  <View style={styles.promoTag}>
                    <Text style={styles.promoTagText}>{card.tag}</Text>
                  </View>
                )}
                <Image
                  source={card.image}
                  style={styles.promoProductImage}
                  resizeMode="contain"
                />
                <Text style={styles.promoProductName} numberOfLines={2}>
                  {card.name}
                </Text>
                <Text style={styles.promoProductPrice}>
                  NGN {card.priceValue.toLocaleString()}
                </Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                  <TouchableOpacity
                    style={[styles.promoProductCta, { flex: 1 }]}
                    onPress={() => {
                      addItem({
                        id: card.id,
                        name: card.name,
                        price: card.priceValue,
                        quantity: 1,
                        category: card.category,
                      });
                      setToastMessage(`${card.name} added to cart`);
                      setToastVisible(true);
                    }}
                  >
                    <Ionicons name="cart-outline" size={14} color="#fff" />
                    <Text style={styles.promoProductCtaText}> Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promoProductCta,
                      { flex: 1, backgroundColor: "#fff" },
                    ]}
                    onPress={() => {
                      addItem({
                        id: card.id,
                        name: card.name,
                        price: card.priceValue,
                        quantity: 1,
                        category: card.category,
                      });
                      router.push("/client/cart" as any);
                    }}
                  >
                    <Text
                      style={[styles.promoProductCtaText, { color: "#000" }]}
                    >
                      Buy Now
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{ position: "absolute", top: 8, right: 8 }}
                  onPress={() =>
                    toggleLike({
                      id: card.id,
                      name: card.name,
                      type: "product",
                    } as any)
                  }
                >
                  <Ionicons
                    name={isLiked(card.id) ? "heart" : "heart-outline"}
                    size={22}
                    color={isLiked(card.id) ? "#EF4444" : "#fff"}
                  />
                </TouchableOpacity>
              </GradientBlock>
            ))}
          </ScrollView>
        </Animated.View>

        {/* --- Recent Bookings --- */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)}>
          <SectionHeader
            title="Recent Bookings"
            onPressSeeAll={() => router.push("/client/bookings" as any)}
          />
          <View style={styles.recentBookingsContainer}>
            {recentBookings.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.muted,
                  fontStyle: "italic",
                  marginBottom: 24,
                }}
              >
                No recent bookings found.
              </Text>
            ) : (
              recentBookings.map((booking) => (
                <TouchableOpacity
                  key={booking.id}
                  style={[
                    styles.recentBookingCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/client/booking-details",
                      params: { id: booking.id },
                    })
                  }
                >
                  <View style={styles.recentBookingInfo}>
                    <Text
                      style={[styles.recentBookingName, { color: colors.text }]}
                    >
                      {booking.artisan?.fullName || booking.categoryName}
                    </Text>
                    <Text
                      style={[
                        styles.recentBookingSkill,
                        { color: colors.muted },
                      ]}
                    >
                      {booking.serviceType}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <Text
                      style={[
                        styles.recentBookingDate,
                        { color: colors.muted },
                      ]}
                    >
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </Text>
                    <Text
                      style={[
                        styles.recentBookingStatus,
                        {
                          color:
                            booking.status === "completed"
                              ? colors.success
                              : colors.secondary,
                        },
                      ]}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Text>
                    {booking.status === "completed" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                        }}
                        onPress={() =>
                          router.push({
                            pathname: "/client/(tabs)/explore",
                            params: { category: booking.categoryName },
                          } as any)
                        }
                      >
                        <Text
                          style={{
                            color: colors.onPrimary,
                            fontSize: 11,
                            fontFamily: THEME.typography.fontFamily.bodyMedium,
                          }}
                        >
                          Book Again
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.View>

        {/* --- Horizontal Scroll Sections --- */}
        <SectionHeader
          title="Top Rated Professionals"
          onPressSeeAll={() =>
            router.push({
              pathname: "/client/all-artisans",
              params: { title: "Top Rated Professionals", filter: "top-rated" },
            } as any)
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {TOP_RATED.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>

        <SectionHeader
          title="Nearby Professionals"
          onPressSeeAll={() =>
            router.push({
              pathname: "/client/all-artisans",
              params: { title: "Nearby Professionals", filter: "nearby" },
            } as any)
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {NEARBY.map((item) => (
            <ArtisanCard key={item.id} item={item} router={router} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View
          style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
        >
          <View
            style={[
              styles.locationModalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Location
              </Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {["Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria"].map(
              (loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.locationOption,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => {
                    setLocation(loc);
                    setShowLocationModal(false);
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.muted}
                  />
                  <Text
                    style={[styles.locationOptionText, { color: colors.text }]}
                  >
                    {loc}
                  </Text>
                  {location === loc && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: THEME.colors.surface,
  },
  greeting: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  locationIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.error,
    borderWidth: 1,
    borderColor: THEME.colors.surface,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.subheading,
    lineHeight: 13,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // Search
  searchWrapper: {
    zIndex: 10,
    marginBottom: THEME.spacing.xl,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: THEME.spacing.lg,
    paddingHorizontal: 16,
    backgroundColor: THEME.colors.surface,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: THEME.spacing.lg,
    right: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.background,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  seeAllText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.primary,
  },

  // Categories
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: "space-between",
    marginBottom: THEME.spacing.xl,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },

  // Promo Card
  promoCard: {
    marginHorizontal: THEME.spacing.lg,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primaryDark,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.primary,
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  promoImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },

  // Deals Banner
  dealsBanner: {
    marginHorizontal: THEME.spacing.lg,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...THEME.shadow.card,
  },
  dealsBannerTitle: {
    color: "#fff",
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  dealsBannerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  dealsBannerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.pill,
  },
  dealsBannerBadgeText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Recent Bookings
  recentBookingsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  recentBookingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  recentBookingInfo: {
    flex: 1,
  },
  recentBookingName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  recentBookingSkill: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
  recentBookingDate: {
    fontSize: 12,
    color: THEME.colors.muted,
    marginBottom: 4,
  },
  recentBookingStatus: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Artisan Card
  horizontalList: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
  },
  artisanCard: {
    width: 200,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  heartButton: {
    padding: 4,
  },
  cardBody: {
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    flex: 1,
  },
  artisanSkill: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEFCE8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceValue: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  bookButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 12,
  },
  bookButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...THEME.shadow.card,
    zIndex: 100,
  },

  // Location Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  locationModalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    gap: 12,
  },
  locationOptionText: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Hero Slider
  heroSliderContainer: {
    marginBottom: 16,
  },
  heroSlide: {
    height: 180,
    borderRadius: THEME.radius.xl,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroContent: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    color: THEME.colors.text,
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: THEME.colors.text,
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
    marginBottom: 12,
  },
  heroCTA: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    gap: 6,
  },
  heroCTAText: {
    color: THEME.colors.surface,
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  heroImage: {
    width: 120,
    height: 140,
  },
  heroDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  heroDot: {
    height: 8,
    borderRadius: 4,
  },

  // Trust Badges
  trustBadgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  trustBadge: {
    alignItems: "center",
    flex: 1,
  },
  trustBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  trustBadgeTitle: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textAlign: "center",
  },
  trustBadgeDesc: {
    fontSize: 9,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },

  // Promo Product Cards
  promoProductCard: {
    width: 160,
    borderRadius: THEME.radius.lg,
    padding: 12,
    minHeight: 200,
    justifyContent: "flex-end",
    position: "relative",
  },
  promoTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  promoTagText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    letterSpacing: 0.5,
  },
  promoProductImage: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 8,
  },
  promoProductName: {
    color: "#fff",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    lineHeight: 16,
    marginBottom: 4,
  },
  promoProductPrice: {
    color: "#fff",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  promoProductCta: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.pill,
  },
  promoProductCtaText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
