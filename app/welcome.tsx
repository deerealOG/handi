// app/welcome.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/client-onboarding1.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to FixItPro</Text>
      <Text style={styles.subtitle}>
        Get professional artisans or offer your skills to clients in your area.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: THEME.colors.primary }]}
          onPress={() => router.push("../client/(tabs)/home")}
        >
          <Text style={styles.buttonText}>Continue as Client</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.outlinedButton]}
          onPress={() => router.push("../artisan/(tabs)/home")}
        >
          <Text style={[styles.buttonText, { color: THEME.colors.primary }]}>
            Continue as Artisan
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Powered by FixItPro © 2025</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: "90%",
    height: 260,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: THEME.colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.muted,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: THEME.colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: THEME.colors.muted,
  },
});
