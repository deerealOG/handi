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

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/welcome");
    }
  };

  return (
    <View style={styles.container}>
      {/* Slides */}
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
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

      {/* Pagination Dots */}
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

      {/* Buttons */}
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
  container: {
    flex: 1,
    backgroundColor: THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "80%",
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: THEME.colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  dotsContainer: {
    flexDirection: "row",
    height: 20,
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
    marginHorizontal: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 40,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    color: THEME.colors.muted,
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextText: {
    color: THEME.colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
