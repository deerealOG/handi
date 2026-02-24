// app/onboarding.tsx
import { Button } from "@/components/Button";
import { DecorativeBlobs } from "@/components/DecorativeBlobs";
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

const { width } = Dimensions.get("window");

// Onboarding slides data
const SLIDES = [
  {
    id: 1,
    title: "Find Professionals Near You",
    description:
      "Discover, book, and schedule trusted service providers in your area.",
    image: require("../assets/images/onboarding-2.jpg"),
  },
  {
    id: 2,
    title: "Reach Customers Around You",
    description:
      "List your services, set prices, and connect with clients nearby.",
    image: require("../assets/images/onboarding-1.jpg"), // Original 1 was Provider
  },
  {
    id: 3,
    title: "Simple & Secure",
    description: "Chat, book, and pay securely in one place.",
    image: require("../assets/images/onboarding-3.jpg"),
  },
];

interface PaginationDotProps {
  index: number;
  scrollX: any;
  color: string;
}

function PaginationDot({ index, scrollX, color }: PaginationDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
      "clamp",
    );
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.8, 1.2, 0.8],
      "clamp",
    );
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [10, 24, 10],
      "clamp",
    );

    return {
      opacity,
      transform: [{ scale }],
      width: dotWidth,
    };
  });

  return (
    <Animated.View style={[styles.dot, { backgroundColor: color }, dotStyle]} />
  );
}

interface PaginationDotsProps {
  scrollX: any;
  color: string;
}

function PaginationDots({ scrollX, color }: PaginationDotsProps) {
  return (
    <View style={styles.pagination}>
      {SLIDES.map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          scrollX={scrollX}
          color={color}
        />
      ))}
    </View>
  );
}

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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderItem = ({ item }: { item: (typeof SLIDES)[0] }) => (
    <View style={styles.slideContainer}>
      <Animated.View
        entering={FadeIn.duration(800)}
        style={styles.cardContainer}
      >
        {/* Background decorative cards */}
        <View
          style={[
            styles.cardShadow,
            styles.cardShadow1,
            { backgroundColor: colors.primary },
          ]}
        />
        <View
          style={[
            styles.cardShadow,
            styles.cardShadow2,
            { backgroundColor: colors.primary },
          ]}
        />

        {/* Main content card */}
        <View style={[styles.mainCard, { backgroundColor: colors.surface }]}>
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
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Decorative Blobs */}
      <DecorativeBlobs />

      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <Image
          source={require("../assets/images/handi-logo-light.png")}
          style={styles.handIcon}
          resizeMode="contain"
        />

        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipButtonText, { color: colors.muted }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Carousel */}
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
        contentContainerStyle={styles.flatListContent}
      />

      {/* Pagination */}
      <PaginationDots scrollX={scrollX} color={THEME.colors.primary} />

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        {!isFirstSlide ? (
          <View style={{ flex: 1 }}>
            <Button label="Back" onPress={handlePrevious} variant="outline" />
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={{ flex: 2, marginLeft: THEME.spacing.md }}>
          <Button
            label={isLastSlide ? "Get Started" : "Next"}
            onPress={handleNext}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  handIcon: {
    width: 80,
    height: 80,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
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
    width: width - 60,
    height: 440,
    justifyContent: "center",
    alignItems: "center",
  },
  cardShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: THEME.radius.lg,
    opacity: 0.1,
  },
  cardShadow1: {
    transform: [{ rotate: "-2deg" }, { translateY: -8 }],
  },
  cardShadow2: {
    transform: [{ rotate: "1.5deg" }, { translateY: -4 }],
    opacity: 0.2,
  },
  mainCard: {
    width: "100%",
    height: "100%",
    borderRadius: THEME.radius.lg,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.lg,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: THEME.spacing.xs,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: THEME.spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
  },
});
