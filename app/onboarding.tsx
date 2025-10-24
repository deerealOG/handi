// app/onboarding.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../constants/theme";

const { width } = Dimensions.get("window");

// 🖼 Onboarding slides content
const slides = [
  {
    id: "1",
    image: require("../assets/images/onboarding1.png"),
    title: "Find Trusted Artisans",
    subtitle: "Quickly locate reliable professionals near you for any job.",
  },
  {
    id: "2",
    image: require("../assets/images/onboarding2.png"),
    title: "Book Instantly",
    subtitle: "Schedule services and get instant confirmations in one tap.",
  },
  {
    id: "3",
    image: require("../assets/images/onboarding3.png"),
    title: "Pay Securely",
    subtitle: "Fast, safe, and transparent payments directly from your phone.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  // 🎯 Track the current visible slide index
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // ⏭ Move to the next slide or go to welcome screen
  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/welcome");
    }
  };

  return (
    <View style={styles.container}>
      {/* ===============================
          🖼 Onboarding Slides
      =============================== */}
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* ===============================
          ⚪ Pagination Dots
      =============================== */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* ===============================
          🔘 Skip & Next Buttons
      =============================== */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={() => router.push("/welcome")}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={scrollToNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🌿 Main container
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  // 🎞 Each onboarding slide
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: THEME.spacing.lg,
  },

  // 🖼 Slide image
  image: {
    width: "80%",
    height: 300,
    marginBottom: THEME.spacing.lg,
  },

  // 🏷 Slide title
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    textAlign: "center",
  },

  // 💬 Slide subtitle
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
    marginTop: THEME.spacing.sm,
    lineHeight: THEME.typography.sizes.base * THEME.typography.lineHeights.relaxed,
    maxWidth: 320,
  },

  // ⚪ Pagination dots
  dotsContainer: {
    flexDirection: "row",
    height: 20,
    marginVertical: THEME.spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.primary,
    marginHorizontal: 4,
  },

  // 🔘 Bottom buttons
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: THEME.spacing.xl,
  },

  // ⏭ Skip button
  skipButton: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
  },
  skipText: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // 🚀 Next / Get Started button
  nextButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.radius.pill,
    ...THEME.shadow.card,
  },
  nextText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
