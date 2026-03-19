// app/onboarding.tsx
import { Button } from "@/app/components/Button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { THEME } from "../constants/theme";

const { width, height } = Dimensions.get("window");

// ========================================
// ONBOARDING SLIDES
// ========================================
const SLIDES = [
  {
    id: 1,
    title: "Find Trusted\nProfessionals",
    description:
      "Discover verified service providers near you. From plumbers to electricians, get help when you need it most.",
    image: require("../../assets/images/onboarding-2.jpg"),
    accent: "#10b981",
  },
  {
    id: 2,
    title: "Book & Pay\nSecurely",
    description:
      "Schedule services instantly, chat with providers, and pay securely — all in one place.",
    image: require("../../assets/images/onboarding-3.jpg"),
    accent: "#3b82f6",
  },
  {
    id: 3,
    title: "Grow Your\nBusiness",
    description:
      "List your services, reach new customers, and manage your bookings effortlessly.",
    image: require("../../assets/images/onboarding-1.jpg"),
    accent: "#f59e0b",
  },
];

// ========================================
// PAGINATION
// ========================================
interface PaginationDotProps {
  index: number;
  scrollX: any;
}

function PaginationDot({ index, scrollX }: PaginationDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], "clamp");
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 28, 8], "clamp");
    return { opacity, width: dotWidth };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: "#ffffff" },
        dotStyle,
      ]}
    />
  );
}

// ========================================
// MAIN COMPONENT
// ========================================
export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push("/welcome" as any);
    }
  };

  const handleSkip = () => {
    router.push("/welcome" as any);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderItem = ({ item }: { item: (typeof SLIDES)[0] }) => (
    <View style={styles.slideContainer}>
      {/* Full-bleed background image */}
      <Image
        source={item.image}
        style={styles.slideImage}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View style={styles.slideOverlay} />

      {/* Text content at the bottom */}
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
      />

      {/* Bottom controls overlay */}
      <View style={styles.controlsContainer}>
        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoRow}>
          <Image
            source={require("../../assets/images/handi-logo-green.png")}
            style={styles.miniLogo}
            resizeMode="contain"
          />
          {!isLastSlide && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Pagination */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* Next / Get Started button */}
        <Animated.View entering={FadeIn.delay(400).duration(600)} style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slideContainer: {
    width,
    height: "100%",
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    // Darker gradient towards bottom
  },
  slideContent: {
    position: "absolute",
    bottom: 220,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
  },
  slideTitle: {
    fontSize: 36,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#ffffff",
    lineHeight: 42,
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideDescription: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.body,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
  },

  // ---- Controls overlay ----
  controlsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  miniLogo: {
    width: 60,
    height: 60,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  skipText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  buttonRow: {
    width: "100%",
  },
  nextButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    letterSpacing: 0.5,
  },
});
