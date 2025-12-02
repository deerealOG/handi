// app/welcome.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ===============================
          🏷 HANDI Logo Header
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
      </View>

      {/* ===============================
          🖼 Main Hero Image
      =============================== */}
      <View style={styles.heroContainer}>
        <Image
          source={require("../assets/images/welcome-hero.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* ===============================
          📝 Title & Subtitle
      =============================== */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to HANDI</Text>
        <Text style={styles.subtitle}>
          Nigeria&apos;s trusted platform connecting clients with skilled artisans
        </Text>
      </View>

      {/* ===============================
        Action Buttons
      =============================== */}
      <View style={styles.buttonContainer}>
        {/* Continue as Client */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push({ pathname: "/auth/login", params: { type: "client" } } as any)}
        >
          <Text style={styles.primaryButtonText}>Continue as Client</Text>
        </TouchableOpacity>

        {/* Continue as Artisan */}
        <TouchableOpacity
          style={[styles.button, styles.outlinedButton]}
          onPress={() => router.push({ pathname: "/auth/login", params: { type: "artisan" } } as any)}
        >
          <Text style={styles.outlinedButtonText}>Continue as Artisan</Text>
        </TouchableOpacity>
      </View>

      {/* ===============================
          ⚙️ Footer Text
      =============================== */}
      <Text style={styles.footerText}>Powered by HANDI © 2025</Text>
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
    paddingHorizontal: THEME.spacing.lg,
    alignItems: "center",
  },

  // 🏷 Header with logo
  header: {
    marginBottom: 20,
    alignItems: "center",
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

  // 🖼 Hero Image Container
  heroContainer: {
    width: width - 40,
    height: height * 0.35, // 35% of screen height
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },

  // 📝 Text Styles
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
    lineHeight: THEME.typography.sizes.base * 1.5,
  },

  // 🔘 Button group
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 10,
  },

  // 🧱 Base button style
  button: {
    paddingVertical: 16,
    borderRadius: 50, // Pill shape
    alignItems: "center",
    width: "100%",
  },

  // 🌊 Primary (filled) button
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    ...THEME.shadow.card,
  },
  primaryButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },

  // ⚪ Outlined (secondary) button
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    backgroundColor: "transparent",
  },
  outlinedButtonText: {
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },

  // ⚙️ Footer
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
