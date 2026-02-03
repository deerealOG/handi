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
    View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const userType = (params.type as UserType) || "client"; // 'client' or 'artisan'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: email.trim().toLowerCase(),
        password,
        userType,
      });

      if (!result.success) {
        Alert.alert("Login Failed", result.error || "Invalid credentials");
      }
      // If successful, AuthContext will handle the navigation
    } catch (error) {
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
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===============================
            🏷 Logo Header
        =============================== */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Image
            source={require("../../assets/images/handi-logo-light.png")}
            style={styles.handIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ===============================
            📝 Welcome Text
        =============================== */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Log in to continue as {userType === "admin" ? "an Administrator" : userType === "artisan" ? "a Professional" : userType === "business" ? "a Business" : "a Client"}
          </Text>
        </Animated.View>

        {/* ===============================
            🔐 Login Form
        =============================== */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.formContainer}>
          {/* Email Input */}
          <Input 
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
          />

          {/* Password Input */}
          <View>
            <Input 
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push("/auth/forgot-password" as any)}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button 
            label="Log In"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
          />
        </Animated.View>

        {/* ===============================
            🦶 Footer
        =============================== */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push(`/auth/register-${userType}` as any)}>
            <Text style={[styles.signUpText, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },

  // 🏷 Header
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  handIcon: {
    width: 100,
    height: 100,
  },

  // 📝 Text
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

  // 🔐 Form
  formContainer: {
    width: "100%",
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50, // Pill shape inputs
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
    height: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    bottom: 45,
    padding: 4,
    zIndex: 10,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // 🦶 Footer
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
