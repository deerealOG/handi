// app/auth/login.tsx
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { UserType } from "@/services";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const userType = (params.type as UserType) || "client";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: email.trim().toLowerCase(),
        password: password,
        userType,
      });

      if (!result.success) {
        Alert.alert("Login Failed", result.error || "Invalid credentials");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Animated.View
        entering={FadeIn.duration(1200)}
        style={[styles.decorBlob, { backgroundColor: colors.primary }]}
      />

      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.header}
        >
          <Image
            source={require("../../assets/images/handi-logo-light.png")}
            style={styles.handIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Welcome Text */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.textContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Log in to continue as{" "}
            {userType === "admin"
              ? "an Administrator"
              : userType === "artisan"
                ? "a Professional"
                : userType === "business"
                  ? "a Business"
                  : "a Client"}
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.formContainer}
        >
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
          />

          <View>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password" as any)}
            style={styles.forgotButton}
          >
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            label="Log In"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/auth/register-${userType}` as any)}
          >
            <Text style={[styles.signUpText, { color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
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
  header: {
    marginTop: 120,
    marginBottom: 0,
    alignItems: "center",
  },
  handIcon: { width: 100, height: 100 },
  textContainer: {
    width: "100%",
    marginBottom: 32,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    gap: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 38,
    padding: 4,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
    paddingTop: 40,
  },
  footerText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  signUpText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
