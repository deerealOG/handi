// app/splash.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo opacity and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 2.5s
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo */}
        <Image
          source={require("../assets/images/FIXIT.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App Title */}
        <Text style={styles.title}>FixItPro</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Connecting Clients with Skilled Artisans</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🌿 Page container
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // 🧱 Logo container
  logoContainer: {
    alignItems: "center",
  },

  // 🖼 Logo image
  logo: {
    width: 100,
    height: 100,
    marginBottom: THEME.spacing.lg,
  },

  // 🏷 Title text
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
    color: THEME.colors.surface,
  },

  // 💬 Subtitle text
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "rgba(255,255,255,0.8)", // subtle white overlay
    marginTop: THEME.spacing.sm,
    textAlign: "center",
  },
});
