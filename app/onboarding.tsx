// app/onboarding.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from "react-native";
import { THEME } from "../constants/theme";

const { width } = Dimensions.get("window");

// Onboarding slides data
const SLIDES = [
  {
    id: 1,
    title: "Get More Jobs",
    description: "Join thousands of trusted professionals delivering services to homes daily.",
    image: require("../assets/images/onboarding-1.png"),
  },
  {
    id: 2,
    title: "Find Trusted Artisans",
    description: "Connect with verified, skilled professionals ready to help with any task.",
    image: require("../assets/images/onboarding-2.png"),
  },
  {
    id: 3,
    title: "Secure & Safe Payments",
    description: "Safe and secure payment system protecting both clients and artisans.",
    image: require("../assets/images/onboarding-3.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to welcome screen after last slide
      router.push("/welcome" as any);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.push("/welcome" as any);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slideContainer}>
      <View style={styles.cardContainer}>
        {/* Background decorative cards */}
        <View style={[styles.cardShadow, styles.cardShadow1]} />
        <View style={[styles.cardShadow, styles.cardShadow2]} />

        {/* Main content card */}
        <View style={styles.mainCard}>
          <Image
            source={item.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ===============================
          🏷 HANDI Logo Header with Skip Button
      =============================== */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/handi-hand-logo.png")}
            style={styles.handIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>HANDI</Text>
        </View>

        {/* Skip Button */}
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ===============================
          🎴 Carousel
      =============================== */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        contentContainerStyle={styles.flatListContent}
      />

      {/* ===============================
          📍 Pagination Dots
      =============================== */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
              });
            }}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* ===============================
          🔘 Navigation Buttons
      =============================== */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        {!isFirstSlide && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {/* Next/Get Started Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            isFirstSlide && styles.nextButtonFull,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🌿 Page container
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // 🏷 Header with logo and skip
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: THEME.spacing.lg,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  handIcon: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.muted,
  },

  // 🎴 Carousel
  flatListContent: {
    alignItems: "center",
  },
  slideContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "relative",
    width: width - 80,
    height: 480,
    justifyContent: "center",
    alignItems: "center",
  },

  // 🎨 Decorative shadow cards (layered effect)
  cardShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: THEME.colors.primary,
    borderRadius: 24,
    opacity: 0.15,
  },
  cardShadow1: {
    transform: [{ rotate: "-3deg" }, { translateY: -10 }],
  },
  cardShadow2: {
    transform: [{ rotate: "2deg" }, { translateY: -5 }],
    opacity: 0.25,
  },

  // 🖼 Main card
  mainCard: {
    width: "100%",
    height: "100%",
    backgroundColor: THEME.colors.surface,
    borderRadius: 24,
    overflow: "hidden",
    ...THEME.shadow.card,
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.surface,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.surface,
    textAlign: "center",
    lineHeight: THEME.typography.sizes.base * THEME.typography.lineHeights.relaxed,
    opacity: 0.95,
  },

  // 📍 Pagination dots
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginVertical: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.border,
  },
  activeDot: {
    backgroundColor: THEME.colors.primary,
    width: 28,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: THEME.colors.border,
  },

  // 🔘 Navigation buttons container
  navigationContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    paddingHorizontal: THEME.spacing.lg,
  },

  navButton: {
    paddingVertical: 16,
    borderRadius: 50, // Fully rounded (pill)
    alignItems: "center",
    justifyContent: "center",
  },

  // ⬅️ Back button
  backButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: "transparent",
  },
  backButtonText: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // ▶️ Next button
  nextButton: {
    flex: 2,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadow.base,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
