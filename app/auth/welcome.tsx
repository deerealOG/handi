// app/welcome.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ===============================
          🖼 Header Image
      =============================== */}
      <Image
        source={require("../../assets/images/client-onboarding1.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* ===============================
       Title & Subtitle
      =============================== */}
      <Text style={styles.title}>Welcome to HANDI</Text>
      <Text style={styles.subtitle}>
        Nigeria&apos;s trusted platform connecting clients with skilled artisans
      </Text>

      {/* ===============================
         Action Buttons
      =============================== */}
      <View style={styles.buttonContainer}>
        {/* Continue as Client */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/client/(tabs)" as any)}
        >
          <Text style={styles.primaryButtonText}>Continue as Client</Text>
        </TouchableOpacity>

        {/* Continue as Artisan */}
        <TouchableOpacity
          style={[styles.button, styles.outlinedButton]}
          onPress={() => router.push("/artisan/(tabs)" as any)}
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
    backgroundColor: THEME.colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
  },

  // 🖼 Top image
  image: {
    width: "90%",
    height: 260,
    marginBottom: THEME.spacing.xl,
  },

  // 🏷 Title text
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    textAlign: "center",
  },

  // 💬 Subtitle text
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xl,
    lineHeight: THEME.typography.sizes.base * THEME.typography.lineHeights.relaxed,
    maxWidth: 320,
  },

  // 🔘 Button group
  buttonContainer: {
    width: "100%",
    gap: THEME.spacing.md,
  },

  // 🧱 Base button style
  button: {
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },

  // 🌊 Primary (filled) button
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    ...THEME.shadow.card,
  },
  primaryButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
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
    fontSize: THEME.typography.sizes.base,
  },

  // ⚙️ Footer
  footerText: {
    position: "absolute",
    bottom: THEME.spacing.lg,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
