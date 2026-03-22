// app/client/(tabs)/index.tsx
// ============================
// HANDI Client Home — Redesigned to match web
// ============================
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { useLikedItems } from "@/app/context/LikedItemsContext";
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
import FilterModal, { FilterOptions } from "../../components/FilterModal";
import Toast from "../../components/components/Toast";
import { FEATURED_CATEGORIES } from "../../constants/categories";
import { THEME } from "../../constants/theme";
import { EnhancedArtisanCard } from "../../components/EnhancedArtisanCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_SLIDER_WIDTH = SCREEN_WIDTH - 32;

// ================================
// Data (mirrors web HomeTab.tsx)
// ================================
const HERO_SLIDES = [
  {
    title: "Professional Services\nYou Can Trust",
    subtitle: "Book verified service providers for home and business needs. Compare ratings, pricing, and availability.",
    cta: "Book a Service",
    route: "/client/(tabs)/explore",
    gradientColors: ["#166534", "#14532d"] as [string, string],
    image: require("../../../assets/images/hero/hero-chef.png"),
  },
  {
    title: "Find Quality Products\nfor Every Job",
    subtitle: "From electrical tools to cleaning supplies, shop trusted products used by professionals.",
    cta: "Shop Products",
    route: "/client/(tabs)/shop",
    gradientColors: ["#5f5c6d", "#aca9bb"] as [string, string],
    image: require("../../../assets/images/hero/hero-electrician.png"),
  },
  {
    title: "Book Services\nin Minutes",
    subtitle: "Search, compare, schedule, and pay securely with a seamless booking experience.",
    cta: "Explore Deals",
    route: "/client/(tabs)/explore",
    gradientColors: ["#3b3b3b", "#111111"] as [string, string],
    image: require("../../../assets/images/hero/hero-products.png"),
  },
];

const CATEGORIES = FEATURED_CATEGORIES.slice(0, 8).map((cat) => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  color: cat.color,
}));

const MOCK_ACTIVE_BOOKINGS = [
  { id: "b1", service: "AC Servicing & Repair", provider: "CoolAir Solutions", date: "Today, 2:00 PM", status: "In Progress", statusColor: "#DBEAFE", statusTextColor: "#1D4ED8", icon: "🔧" },
  { id: "b2", service: "Home Deep Cleaning", provider: "SparkleClean NG", date: "Tomorrow, 10:00 AM", status: "Confirmed", statusColor: "#DCFCE7", statusTextColor: "#15803D", icon: "🧹" },
  { id: "b3", service: "Electrical Wiring", provider: "PowerFix Pro", date: "Feb 23, 9:00 AM", status: "Pending", statusColor: "#FEF3C7", statusTextColor: "#92400E", icon: "⚡" },
];

const TOP_RATED = [
  { id: 1, name: "Golden Amadi", skill: "Electrician", price: "5,000", rating: 4.9, reviews: 120, distance: "2.5 km", verified: true },
  { id: 2, name: "Sarah Jones", skill: "Plumber", price: "4,500", rating: 4.8, reviews: 85, distance: "3.1 km", verified: true },
  { id: 3, name: "Mike Obi", skill: "Carpenter", price: "6,000", rating: 4.7, reviews: 92, distance: "1.8 km", verified: false },
];

const PROMO_CARDS = [
  { id: "promo-drill", name: "Generic Multifunctional Electric Drill Set", priceValue: 8300, tag: "HOT DEAL", category: "Tools", image: require("../../../assets/images/featured.png") },
  { id: "promo-cleaner", name: "Professional Home Self Use Low Carbon Cleaner", priceValue: 5800, tag: null, category: "Home", image: require("../../../assets/images/featured2.png") },
  { id: "promo-crusher", name: "SILVER CREST 2L Industrial 850W Food Crusher", priceValue: 8300, tag: "BEST SELLER", category: "Home", image: require("../../../assets/images/hero-nigerian-family.png") },
];

const STORES_NEAR_YOU = [
  { id: "s1", name: "Samsung Nigeria", category: "Electronics", rating: 4.9, reviews: 312, badge: "Verified" },
  { id: "s2", name: "LG Electronics", category: "Appliances", rating: 4.8, reviews: 245, badge: "Premium" },
  { id: "s3", name: "ScanFrost Hub", category: "Home Appliances", rating: 4.7, reviews: 189, badge: "Verified" },
  { id: "s4", name: "GreenFields Groceries", category: "Groceries", rating: 4.8, reviews: 167, badge: "Premium" },
  { id: "s5", name: "TechHub Computers", category: "Computing", rating: 4.7, reviews: 213, badge: "Premium" },
];

const BUDGET_FINDS = [
  { id: "bf1", name: "LED Desk Lamp", priceValue: 2500, oldPrice: 4000, category: "Home" },
  { id: "bf2", name: "USB Extension Cable 2m", priceValue: 800, oldPrice: 1500, category: "Electronics" },
  { id: "bf3", name: "Microfiber Cleaning Cloth Set", priceValue: 1200, oldPrice: 2000, category: "Cleaning" },
  { id: "bf4", name: "Anti-Slip Phone Holder", priceValue: 950, oldPrice: 1800, category: "Accessories" },
  { id: "bf5", name: "LED Desk Lamp", priceValue: 2500, oldPrice: 4000, category: "Home" },
  { id: "bf6", name: "USB Extension Cable 2m", priceValue: 800, oldPrice: 1500, category: "Electronics" },
  { id: "bf7", name: "Microfiber Cleaning Cloth Set", priceValue: 1200, oldPrice: 2000, category: "Cleaning" },
  { id: "bf8", name: "Anti-Slip Phone Holder", priceValue: 950, oldPrice: 1800, category: "Accessories" },
];

const HOW_IT_WORKS = [
  { icon: "search" as const, title: "Search & Browse", desc: "Find the service you need from our wide range of categories.", color: "#DBEAFE", textColor: "#2563EB" },
  { icon: "checkmark-circle" as const, title: "Choose a Provider", desc: "Compare verified providers based on ratings and reviews.", color: "#DCFCE7", textColor: "#16A34A" },
  { icon: "calendar" as const, title: "Book & Schedule", desc: "Select your date and time. Get instant confirmation.", color: "#F3E8FF", textColor: "#7C3AED" },
  { icon: "star" as const, title: "Get Service & Rate", desc: "Your provider arrives on time. Rate your experience.", color: "#FEF3C7", textColor: "#D97706" },
];

const QUICK_ACCESS = [
  { label: "Find Pros", emoji: "👷", route: "/client/(tabs)/explore", bg: "#10B981" },
  { label: "Services", emoji: "🛠️", route: "/client/(tabs)/explore", bg: "#22C55E" },
  { label: "Top Rated", emoji: "⭐", route: "/client/(tabs)/explore", bg: "#F59E0B" },
  { label: "Near You", emoji: "📍", route: "/client/(tabs)/explore", bg: "#F87171" },
  { label: "Awoof", emoji: "🔥", route: "/client/deals", bg: "#F97316" },
  { label: "Stores", emoji: "🏪", route: "/client/(tabs)/shop", bg: "#0EA5E9" },
  { label: "Top Picks", emoji: "👑", route: "/client/deals", bg: "#8B5CF6" },
  { label: "Deals", emoji: "💰", route: "/client/deals", bg: "#EAB308" },
];

const OFFICIAL_STORES = [
  { id: "os1", name: "Samsung Nigeria", category: "Electronics", rating: 4.9, badge: "Official" },
  { id: "os2", name: "LG Electronics", category: "Appliances", rating: 4.8, badge: "Official" },
  { id: "os3", name: "Dangote Group", category: "Building", rating: 4.7, badge: "Official" },
  { id: "os4", name: "Innoson Motors", category: "Automotive", rating: 4.6, badge: "Official" },
  { id: "os5", name: "Konga Store", category: "General", rating: 4.8, badge: "Official" },
];

// ================================
// Reusable Components
// ================================
const GradientBlock = ({ colors, gradientId, style, horizontal, children }: {
  colors: [string, string]; gradientId: string; style: any; horizontal?: boolean; children: React.ReactNode;
}) => (
  <View style={[style, { overflow: "hidden" }]}>
    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Defs>
        <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2={horizontal ? "100%" : "100%"} y2={horizontal ? "0%" : "100%"}>
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[1]} />
        </SvgLinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
    {children}
  </View>
);

const SectionHeader = ({ title, onPressSeeAll, colors }: { title: string; onPressSeeAll?: () => void; colors: any }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    {onPressSeeAll && (
      <TouchableOpacity onPress={onPressSeeAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    )}
  </View>
);

// ================================
// Hero Slider (matches web HeroSection)
// ================================
const HeroSlider = ({ router, colors }: { router: any; colors: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / HERO_SLIDER_WIDTH);
    if (index >= 0 && index < HERO_SLIDES.length) setCurrentSlide(index);
  }, []);

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
        getItemLayout={(_, index) => ({ length: HERO_SLIDER_WIDTH, offset: HERO_SLIDER_WIDTH * index, index })}
        renderItem={({ item: slide, index }) => (
          <GradientBlock colors={slide.gradientColors} gradientId={`hero-${index}`} horizontal style={[styles.heroSlide, { width: HERO_SLIDER_WIDTH }]}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{slide.title}</Text>
              <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
              <TouchableOpacity style={styles.heroCTA} onPress={() => router.push(slide.route as any)}>
                <Text style={styles.heroCTAText}>{slide.cta}</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image source={slide.image} style={styles.heroImage} resizeMode="contain" />
          </GradientBlock>
        )}
      />
      <View style={styles.heroDots}>
        {HERO_SLIDES.map((_, i) => (
          <View key={i} style={[styles.heroDot, { backgroundColor: i === currentSlide ? colors.primary : colors.border, width: i === currentSlide ? 20 : 8 }]} />
        ))}
      </View>
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => { loadBookings(); }, []),
  );

  const loadBookings = async () => {
    try {
      const response = await bookingService.getBookings("user_001", "client", { perPage: 3 });
      if (response.success && response.data) setRecentBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyFilters = (_newFilters: FilterOptions) => {
    setFilterModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
  };

  const SUGGESTIONS = [
    "Electrician near me", "Plumber for emergency", "House cleaning", "AC repair", "Mechanic", "Cleaning Services",
  ].filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === "#1F2937" ? "dark-content" : "light-content"} backgroundColor={colors.background} />
      <Toast visible={toastVisible} message={toastMessage} type="success" onDismiss={() => setToastVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadBookings(); }} />}>

        {/* ===== HEADER (matches web ClientHeader style) ===== */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.push("/client/(tabs)/profile" as any)}>
                <Image source={require("../../../assets/images/profileavatar.png")} style={[styles.avatar, { borderColor: colors.surface }]} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.greetingSub, { color: colors.muted }]}>Good day,</Text>
                <Text style={[styles.greetingName, { color: colors.text }]}>{user?.firstName || "Guest"}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/client/notifications" as any)}>
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
                <View style={[styles.notifDot, { backgroundColor: colors.error }]} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/client/liked-items" as any)}>
                <Ionicons name="heart-outline" size={20} color={colors.text} />
              </TouchableOpacity>
              <View style={{ position: "relative" }}>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/client/cart" as any)}>
                  <Ionicons name="cart-outline" size={20} color={colors.text} />
                </TouchableOpacity>
                {cartCount > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: colors.error, borderColor: colors.surface }]}>
                    <Text style={styles.cartBadgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search services, providers..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onSubmitEditing={() => { setShowSuggestions(false); router.push({ pathname: "/client/(tabs)/explore", params: { query: searchQuery } } as any); }}
              returnKeyType="search"
            />
          </View>

          {/* Search Suggestions */}
          {showSuggestions && SUGGESTIONS.length > 0 && (
            <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity key={index} style={[styles.suggestionItem, { borderBottomColor: colors.background }]}
                  onPress={() => { setSearchQuery(suggestion); setShowSuggestions(false); router.push({ pathname: "/client/(tabs)/explore", params: { query: suggestion } } as any); }}>
                  <Ionicons name="time-outline" size={18} color={colors.muted} />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* ===== HERO SLIDER ===== */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ marginBottom: 20 }}>
          <HeroSlider router={router} colors={colors} />
        </Animated.View>

        {/* ===== CATEGORIES (circular icons in 4x2 grid — matches web) ===== */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <SectionHeader title="Categories" onPressSeeAll={() => router.push("/client/categories" as any)} colors={colors} />
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryItem}
                onPress={() => router.push({ pathname: "/client/(tabs)/explore", params: { category: item.name } } as any)}>
                <View style={[styles.categoryCircle, { backgroundColor: item.color, borderColor: colors.border }]}>
                  <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={[styles.categoryText, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ===== QUICK ACCESS CARDS ===== */}
        <Animated.View entering={FadeInDown.delay(350).duration(600)} style={{ marginBottom: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
            {QUICK_ACCESS.map((item) => (
              <TouchableOpacity key={item.label} style={styles.quickAccessItem}
                onPress={() => router.push(item.route as any)}>
                <View style={[styles.quickAccessIcon, { backgroundColor: item.bg }]}>
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                </View>
                <Text style={[styles.quickAccessLabel, { color: colors.text }]} numberOfLines={1}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ===== RECENT BOOKINGS (matches web card style) ===== */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <SectionHeader title="Recent Bookings" onPressSeeAll={() => router.push("/client/(tabs)/bookings" as any)} colors={colors} />
          <View style={styles.bookingsContainer}>
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <TouchableOpacity key={booking.id} style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push({ pathname: "/client/booking-details", params: { id: booking.id } })}>
                  <View style={[styles.bookingIcon, { backgroundColor: colors.background }]}>
                    <Text style={{ fontSize: 20 }}>🔧</Text>
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text style={[styles.bookingService, { color: colors.text }]} numberOfLines={1}>{booking.artisan?.fullName || booking.categoryName}</Text>
                    <Text style={[styles.bookingProvider, { color: colors.muted }]}>{booking.serviceType}</Text>
                    <Text style={[styles.bookingDate, { color: colors.muted }]}>{new Date(booking.scheduledDate).toLocaleDateString()}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: booking.status === "completed" ? "#DCFCE7" : "#DBEAFE" }]}>
                    <Text style={[styles.statusText, { color: booking.status === "completed" ? "#15803D" : "#1D4ED8" }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Fallback mock bookings when no real data
              MOCK_ACTIVE_BOOKINGS.map((b) => (
                <View key={b.id} style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.bookingIcon, { backgroundColor: colors.background }]}>
                    <Text style={{ fontSize: 20 }}>{b.icon}</Text>
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text style={[styles.bookingService, { color: colors.text }]}>{b.service}</Text>
                    <Text style={[styles.bookingProvider, { color: colors.muted }]}>{b.provider}</Text>
                    <Text style={[styles.bookingDate, { color: colors.muted }]}>{b.date}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: b.statusColor }]}>
                    <Text style={[styles.statusText, { color: b.statusTextColor }]}>{b.status}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </Animated.View>

        {/* ===== TRENDING PRODUCTS (2-col grid — matches web ShopTab) ===== */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <SectionHeader title="Trending Products" onPressSeeAll={() => router.push("/client/(tabs)/shop" as any)} colors={colors} />
          <View style={styles.productsGrid}>
            {PROMO_CARDS.map((card) => (
              <TouchableOpacity key={card.id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push({ pathname: "/client/product-detail", params: { id: card.id } } as any)}>
                <View style={[styles.productImageWrap, { backgroundColor: colors.background }]}>
                  <Image source={card.image} style={styles.productImage} resizeMode="cover" />
                  {card.tag && (
                    <View style={[styles.productTag, { backgroundColor: colors.primary }]}>
                      <Text style={styles.productTagText}>{card.tag}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.productHeart}
                    onPress={() => toggleLike({ id: card.id, name: card.name, type: "product" } as any)}>
                    <Ionicons name={isLiked(card.id) ? "heart" : "heart-outline"} size={16} color={isLiked(card.id) ? "#EF4444" : "#fff"} />
                  </TouchableOpacity>
                </View>
                <View style={styles.productDetails}>
                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{card.name}</Text>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>₦{card.priceValue.toLocaleString()}</Text>
                  <TouchableOpacity style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
                    onPress={() => { addItem({ id: card.id, name: card.name, price: card.priceValue, quantity: 1, category: card.category }); setToastMessage(`${card.name} added!`); setToastVisible(true); }}>
                    <Ionicons name="cart-outline" size={14} color="#fff" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ===== TOP RATED PROFESSIONALS ===== */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <SectionHeader title="Top Rated Professionals" onPressSeeAll={() => router.push({ pathname: "/client/all-artisans", params: { title: "Top Rated", filter: "top-rated" } } as any)} colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
            {TOP_RATED.map((item) => (
              <View key={item.id} style={{ marginRight: 4 }}>
                <EnhancedArtisanCard
                  artisan={{ ...item, verificationLevel: item.verified ? "verified" : "none" }}
                  onBookPress={() => router.push({ pathname: "/client/(tabs)/explore", params: { category: item.skill } } as any)}
                  onPress={() => router.push({ pathname: "/client/artisan-profile", params: { id: item.id } } as any)}
                />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ===== STORES NEAR YOU (mirrors web StoresNearYouSection) ===== */}
        <Animated.View entering={FadeInDown.delay(650).duration(600)}>
          <SectionHeader title="Stores Near You" onPressSeeAll={() => router.push("/client/(tabs)/shop" as any)} colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
            {STORES_NEAR_YOU.map((store) => (
              <TouchableOpacity key={store.id} style={[styles.storeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push("/client/(tabs)/shop" as any)}>
                <View style={[styles.storeIconWrap, { backgroundColor: store.badge === "Premium" ? "#F3E8FF" : "#DBEAFE" }]}>
                  <Ionicons name="storefront" size={24} color={store.badge === "Premium" ? "#7C3AED" : "#2563EB"} />
                </View>
                <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>{store.name}</Text>
                <Text style={[styles.storeCategory, { color: colors.muted }]}>{store.category}</Text>
                <View style={styles.storeRatingRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.storeRating, { color: colors.text }]}>{store.rating}</Text>
                  <Text style={[styles.storeReviews, { color: colors.muted }]}>({store.reviews})</Text>
                </View>
                <View style={[styles.storeBadge, { backgroundColor: store.badge === "Premium" ? "#F3E8FF" : "#DBEAFE" }]}>
                  <Text style={[styles.storeBadgeText, { color: store.badge === "Premium" ? "#7C3AED" : "#2563EB" }]}>{store.badge}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ===== OFFICIAL STORES ===== */}
        <Animated.View entering={FadeInDown.delay(680).duration(600)}>
          <SectionHeader title="Official Stores" onPressSeeAll={() => router.push("/client/(tabs)/shop" as any)} colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
            {OFFICIAL_STORES.map((store) => (
              <TouchableOpacity key={store.id} style={[styles.storeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push("/client/(tabs)/shop" as any)}>
                <View style={[styles.storeIconWrap, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="storefront" size={24} color="#2563EB" />
                </View>
                <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>{store.name}</Text>
                <Text style={[styles.storeCategory, { color: colors.muted }]}>{store.category}</Text>
                <View style={styles.storeRatingRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.storeRating, { color: colors.text }]}>{store.rating}</Text>
                </View>
                <View style={[styles.storeBadge, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={[styles.storeBadgeText, { color: "#15803D" }]}>{store.badge}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ===== BUDGET-FRIENDLY FINDS (mirrors web CheapProductsSection) ===== */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={{ marginTop: 8 }}>
          <SectionHeader title="Budget-Friendly Finds" onPressSeeAll={() => router.push("/client/deals" as any)} colors={colors} />
          <View style={styles.budgetGrid}>
            {BUDGET_FINDS.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.budgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push({ pathname: "/client/product-detail", params: { id: item.id } } as any)}>
                <View style={[styles.budgetImageWrap, { backgroundColor: colors.background }]}>
                  <Ionicons name="pricetag" size={28} color={colors.primary} />
                  <View style={[styles.budgetDiscount, { backgroundColor: "#EF4444" }]}>
                    <Text style={styles.budgetDiscountText}>{Math.round((1 - item.priceValue / item.oldPrice) * 100)}% OFF</Text>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={[styles.budgetName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.budgetPriceRow}>
                    <Text style={[styles.budgetPrice, { color: colors.primary }]}>₦{item.priceValue.toLocaleString()}</Text>
                    <Text style={styles.budgetOldPrice}>₦{item.oldPrice.toLocaleString()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ===== SELL ON HANDI (vendor/seller CTA) ===== */}
        <Animated.View entering={FadeInDown.delay(750).duration(600)} style={{ marginTop: 8, paddingHorizontal: 16, marginBottom: 8 }}>
          <GradientBlock colors={["#166534", "#14532d"]} gradientId="sell-cta" style={styles.sellBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellTitle}>Sell on HANDI</Text>
              <Text style={styles.sellDesc}>Become a vendor or service provider. Reach thousands of customers across Nigeria.</Text>
              <TouchableOpacity style={styles.sellCTA} onPress={() => router.push("/client/(tabs)/explore" as any)}>
                <Text style={styles.sellCTAText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={14} color="#166534" />
              </TouchableOpacity>
            </View>
            <Ionicons name="storefront-outline" size={56} color="rgba(255,255,255,0.3)" />
          </GradientBlock>
        </Animated.View>

        {/* ===== HOW IT WORKS (matches web StepsSection) ===== */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={{ marginTop: 8 }}>
          <SectionHeader title="How It Works" colors={colors} />
          <View style={styles.stepsContainer}>
            {HOW_IT_WORKS.map((step, i) => (
              <View key={i} style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                  <Ionicons name={step.icon} size={20} color={step.textColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDesc, { color: colors.muted }]}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ===== TRUST BADGES (matches web AboutSection) ===== */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={{ marginTop: 8, marginBottom: 16 }}>
          <View style={styles.trustRow}>
            {[
              { icon: "lock-closed" as const, title: "Secure\nPayments", color: "#DBEAFE", textColor: "#2563EB" },
              { icon: "headset" as const, title: "24/7\nSupport", color: "#DCFCE7", textColor: "#16A34A" },
              { icon: "shield-checkmark" as const, title: "Verified\nProviders", color: "#F3E8FF", textColor: "#7C3AED" },
              { icon: "pricetag" as const, title: "Best\nPrices", color: "#FEF3C7", textColor: "#D97706" },
            ].map((badge, i) => (
              <View key={i} style={styles.trustBadge}>
                <View style={[styles.trustIcon, { backgroundColor: badge.color }]}>
                  <Ionicons name={badge.icon} size={20} color={badge.textColor} />
                </View>
                <Text style={[styles.trustTitle, { color: colors.text }]}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Modals */}
      <FilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} onApply={handleApplyFilters} />
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.locationModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
            </View>
            {["Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria"].map((loc) => (
              <TouchableOpacity key={loc} style={[styles.locationOption, { borderBottomColor: colors.border }]}
                onPress={() => { setLocation(loc); setShowLocationModal(false); }}>
                <Ionicons name="location-outline" size={20} color={colors.muted} />
                <Text style={[styles.locationOptionText, { color: colors.text }]}>{loc}</Text>
                {location === loc && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },

  // Header
  headerContainer: { paddingHorizontal: 16, marginBottom: 16, zIndex: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2 },
  greetingSub: { fontSize: 12, fontFamily: THEME.typography.fontFamily.body },
  greetingName: { fontSize: 16, fontFamily: THEME.typography.fontFamily.heading },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", borderWidth: 1, position: "relative" },
  notifDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5 },
  cartBadge: { position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, borderWidth: 1.5, justifyContent: "center", alignItems: "center", paddingHorizontal: 3 },
  cartBadgeText: { color: "#fff", fontSize: 10, fontFamily: THEME.typography.fontFamily.subheading, lineHeight: 13 },

  // Search
  searchBar: { flexDirection: "row", alignItems: "center", height: 46, borderRadius: 23, borderWidth: 1, paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: THEME.typography.fontFamily.body },
  suggestionsContainer: { position: "absolute", top: 108, left: 0, right: 0, borderRadius: 16, padding: 8, borderWidth: 1, ...THEME.shadow.card, zIndex: 20 },
  suggestionItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, gap: 10 },
  suggestionText: { flex: 1, fontSize: 14, fontFamily: THEME.typography.fontFamily.body },

  // Section Header
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontFamily: THEME.typography.fontFamily.heading },
  seeAllText: { fontSize: 13, fontFamily: THEME.typography.fontFamily.subheading },

  // Hero
  heroSlide: { height: 180, borderRadius: 20, overflow: "hidden", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 },
  heroContent: { flex: 1, paddingRight: 8 },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: THEME.typography.fontFamily.heading, lineHeight: 26, marginBottom: 6 },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: THEME.typography.fontFamily.body, lineHeight: 17, marginBottom: 12 },
  heroCTA: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, gap: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  heroCTAText: { color: "#fff", fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading },
  heroImage: { width: 120, height: 140 },
  heroDots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 10 },
  heroDot: { height: 8, borderRadius: 4 },

  // Categories (circular — matches web)
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, marginBottom: 8 },
  categoryItem: { width: "25%", alignItems: "center", marginBottom: 16 },
  categoryCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", marginBottom: 6, borderWidth: 1, ...THEME.shadow.base },
  categoryText: { fontSize: 11, fontFamily: THEME.typography.fontFamily.bodyMedium, textAlign: "center" },

  // Bookings (matches web card style)
  bookingsContainer: { paddingHorizontal: 16, marginBottom: 8 },
  bookingCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, gap: 12, ...THEME.shadow.base },
  bookingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  bookingInfo: { flex: 1 },
  bookingService: { fontSize: 14, fontFamily: THEME.typography.fontFamily.subheading, marginBottom: 2 },
  bookingProvider: { fontSize: 12, fontFamily: THEME.typography.fontFamily.body, marginBottom: 2 },
  bookingDate: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  statusText: { fontSize: 10, fontFamily: THEME.typography.fontFamily.subheading },

  // Products (2-col grid — matches web)
  productsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  productCard: { width: (SCREEN_WIDTH - 44) / 2, borderRadius: 16, overflow: "hidden", borderWidth: 1, ...THEME.shadow.base },
  productImageWrap: { width: "100%", height: 120, position: "relative" },
  productImage: { width: "100%", height: "100%" },
  productTag: { position: "absolute", top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  productTagText: { color: "#fff", fontSize: 9, fontFamily: THEME.typography.fontFamily.subheading },
  productHeart: { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  productDetails: { padding: 10 },
  productName: { fontSize: 13, fontFamily: THEME.typography.fontFamily.subheading, lineHeight: 17, marginBottom: 4 },
  productPrice: { fontSize: 14, fontFamily: THEME.typography.fontFamily.heading, marginBottom: 8 },
  addToCartBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 7, borderRadius: 8, gap: 6 },
  addToCartText: { color: "#fff", fontSize: 11, fontFamily: THEME.typography.fontFamily.subheading },

  // How It Works
  stepsContainer: { paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  stepCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, borderWidth: 1, gap: 12 },
  stepIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  stepTitle: { fontSize: 14, fontFamily: THEME.typography.fontFamily.subheading, marginBottom: 2 },
  stepDesc: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body, lineHeight: 16 },

  // Trust Badges
  trustRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 16 },
  trustBadge: { alignItems: "center", width: 70 },
  trustIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  trustTitle: { fontSize: 10, fontFamily: THEME.typography.fontFamily.bodyMedium, textAlign: "center", lineHeight: 14 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  locationModalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 18, fontFamily: THEME.typography.fontFamily.heading },
  locationOption: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  locationOptionText: { flex: 1, fontSize: 16, fontFamily: THEME.typography.fontFamily.body },

  // Stores Near You
  storeCard: { width: 140, borderRadius: 16, padding: 12, borderWidth: 1, alignItems: "center", ...THEME.shadow.base },
  storeIconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  storeName: { fontSize: 13, fontFamily: THEME.typography.fontFamily.subheading, textAlign: "center", marginBottom: 2 },
  storeCategory: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body, textAlign: "center", marginBottom: 6 },
  storeRatingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 6 },
  storeRating: { fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading },
  storeReviews: { fontSize: 10, fontFamily: THEME.typography.fontFamily.body },
  storeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  storeBadgeText: { fontSize: 9, fontFamily: THEME.typography.fontFamily.subheading },

  // Budget-Friendly Finds
  budgetGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  budgetCard: { width: (SCREEN_WIDTH - 44) / 2, borderRadius: 16, overflow: "hidden", borderWidth: 1, ...THEME.shadow.base },
  budgetImageWrap: { width: "100%", height: 90, justifyContent: "center", alignItems: "center", position: "relative" },
  budgetDiscount: { position: "absolute", top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  budgetDiscountText: { color: "#fff", fontSize: 9, fontFamily: THEME.typography.fontFamily.subheading },
  budgetName: { fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading, lineHeight: 16, marginBottom: 4 },
  budgetPriceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  budgetPrice: { fontSize: 14, fontFamily: THEME.typography.fontFamily.heading },
  budgetOldPrice: { fontSize: 11, fontFamily: THEME.typography.fontFamily.body, color: "#9CA3AF", textDecorationLine: "line-through" },

  // Quick Access Cards
  quickAccessItem: { alignItems: "center", width: 68 },
  quickAccessIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 4, ...THEME.shadow.base },
  quickAccessLabel: { fontSize: 10, fontFamily: THEME.typography.fontFamily.bodyMedium, textAlign: "center" },

  // Sell on HANDI Banner
  sellBanner: { borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  sellTitle: { color: "#fff", fontSize: 18, fontFamily: THEME.typography.fontFamily.heading, marginBottom: 4 },
  sellDesc: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: THEME.typography.fontFamily.body, lineHeight: 17, marginBottom: 12 },
  sellCTA: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, gap: 6 },
  sellCTAText: { color: "#166534", fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading },
});
