// app/welcome.tsx
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { THEME } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { setGuestMode } = useAuth();

  const handleGuestBrowse = () => {
    setGuestMode(true);
    router.push("/client/(tabs)" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Decorative gradient blob */}
      <Animated.View
        entering={FadeIn.duration(1200)}
        style={[styles.decorBlob, { backgroundColor: colors.primary }]}
      />
      
      {/* Centered Content */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(800)} >
          <Image
            source={require("../assets/images/handi-logo-light.png")}
            style={styles.handIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title & Subtitle */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Connect with nearby service providers and professionals around you.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
            entering={FadeInUp.delay(500).duration(800)}
            style={styles.buttonGroup}
        >
          <Button 
            label="🔧  I need a service" 
            onPress={() => router.push("/auth/register-client" as any)}
            variant="outline"
          />
          
          <Button 
            label="💼  I provide services" 
            onPress={() => router.push("/auth/register-artisan" as any)}
            variant="outline"
          />

          <Button 
            label="🏢  I run a business" 
            onPress={() => router.push("/auth/register-business" as any)}
            variant="outline"
          />
        </Animated.View>

        {/* Guest Browse Option */}
        <Animated.View entering={FadeInUp.delay(700).duration(800)}>
          <Text 
            style={[styles.guestText, { color: colors.muted }]}
            onPress={handleGuestBrowse}
          >
            Just browsing? <Text style={{ color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading }}>Explore first</Text>
          </Text>
        </Animated.View>
      </View>

      {/* Footer Links */}
      <Animated.View entering={FadeIn.delay(900).duration(800)} style={styles.footer}>
        <Text 
          style={[styles.loginText, { color: colors.muted }]}
          onPress={() => router.push("/auth/login" as any)}
        >
          Already have an account? <Text style={{ color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading }}>Log In</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  
  handIcon: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing["2xl"],
    lineHeight: 24,
    paddingHorizontal: THEME.spacing.lg,
  },
  buttonGroup: {
    width: "100%",
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loginText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  guestText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center" as const,
    marginTop: THEME.spacing.lg,
  },
  decorBlob: {
    position: "absolute" as const,
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.08,
  },
});
