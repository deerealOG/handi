// app/splash.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { THEME } from "../constants/theme";

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Logo bounce and fade-in
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 1000 });

    // Navigate to onboarding after 2.5s
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router, scale, opacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Logo */}
      <Animated.Image
        source={require("../../assets/images/handi-splash.png")}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
      />

      {/* Tagline */}
      <Animated.Text
        entering={FadeInUp.delay(800).duration(600)}
        style={styles.tagline}
      >
        Nigeria's #1 Service Marketplace
      </Animated.Text>

      {/* Bottom branding */}
      <Animated.View entering={FadeIn.delay(1200).duration(600)} style={styles.bottomBrand}>
        <Animated.Text style={styles.versionText}>HANDI v1.0</Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  tagline: {
    color: "rgba(255,255,255,0.85)",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  bottomBrand: {
    position: "absolute",
    bottom: 48,
    alignItems: "center",
  },
  versionText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
