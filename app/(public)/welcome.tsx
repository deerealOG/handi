// app/welcome.tsx
// Sign-up selection: Client or Provider (matching web flow)
// No guest mode, no role picker – clean and focused
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { THEME } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Top decorative accent */}
      <Animated.View
        entering={FadeIn.duration(1200)}
        style={[styles.topAccent, { backgroundColor: colors.primary }]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/handi-logo-green.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Headline */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <Text style={[styles.headline, { color: colors.text }]}>
            Get Started
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Choose how you'd like to use HANDI
          </Text>
        </Animated.View>

        {/* Two cards: Client & Provider */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(800)}
          style={styles.cardRow}
        >
          {/* Client Card */}
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/auth/register-client" as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="search-outline" size={28} color={THEME.colors.primary} />
            </View>
            <Text style={[styles.roleTitle, { color: colors.text }]}>
              I need a service
            </Text>
            <Text style={[styles.roleDescription, { color: colors.muted }]}>
              Find & book trusted professionals near you
            </Text>
            <View style={[styles.roleArrow, { backgroundColor: colors.primary }]}>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Provider Card */}
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/auth/register-artisan" as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: "#EFF6FF" }]}>
              <MaterialCommunityIcons name="briefcase-outline" size={28} color="#3B82F6" />
            </View>
            <Text style={[styles.roleTitle, { color: colors.text }]}>
              I provide services
            </Text>
            <Text style={[styles.roleDescription, { color: colors.muted }]}>
              List your skills, reach customers & earn
            </Text>
            <View style={[styles.roleArrow, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer: Log In */}
      <Animated.View
        entering={FadeIn.delay(600).duration(800)}
        style={styles.footer}
      >
        <Text
          style={[styles.loginText, { color: colors.muted }]}
          onPress={() => router.push("/auth/login" as any)}
        >
          Already have an account?{" "}
          <Text
            style={{
              color: colors.primary,
              fontFamily: THEME.typography.fontFamily.subheading,
            }}
          >
            Log In
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topAccent: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.08,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  headline: {
    fontSize: 26,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: 28,
  },
  cardRow: {
    gap: 14,
    marginBottom: 20,
  },
  roleCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
    ...THEME.shadow.card,
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 17,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 19,
    paddingRight: 40,
  },
  roleArrow: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  loginText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
});
