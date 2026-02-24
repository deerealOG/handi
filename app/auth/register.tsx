// app/auth/register.tsx
import { Button } from "@/components/Button";
import { DecorativeBlobs } from "@/components/DecorativeBlobs";
import { Input } from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { register } = useAuth();
  const params = useLocalSearchParams();
  const userType =
    (params.type as "client" | "artisan" | "business") || "client";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const result = await register({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
    });

    setIsLoading(false);

    if (!result.success) {
      Alert.alert("Registration Failed", result.error || "Please try again.");
    }
    // If successful, AuthContext will handle navigation
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      {/* Decorative Blobs */}
      <DecorativeBlobs />

      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===============================
            🏷 Logo Header
        =============================== */}
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

        {/* ===============================
            📝 Welcome Text
        =============================== */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.textContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Join as a{" "}
            {userType === "artisan"
              ? "Professional Artisan"
              : userType === "business"
                ? "Business"
                : "Client"}
          </Text>
        </Animated.View>

        {/* ===============================
            📝 Registration Form
        =============================== */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.formContainer}
        >
          {/* Full Name / Business Name Input */}
          <Input
            label={userType === "business" ? "Business Name" : "Full Name"}
            placeholder={
              userType === "business"
                ? "Enter business name"
                : "Enter your full name"
            }
            value={fullName}
            onChangeText={setFullName}
            icon={
              userType === "business" ? "business-outline" : "person-outline"
            }
            autoCapitalize="words"
          />

          {/* Email Input */}
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />

          {/* Phone Input */}
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />

          {/* Password Input */}
          <View>
            <Input
              label="Password"
              placeholder="Create a password"
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

          {/* Terms and Conditions */}
          <Text style={[styles.termsText, { color: colors.muted }]}>
            By signing up, you agree to our{" "}
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Terms
            </Text>{" "}
            and{" "}
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Privacy Policy
            </Text>
          </Text>

          {/* Sign Up Button */}
          <Button label="Sign Up" onPress={handleRegister} variant="primary" />
        </Animated.View>

        {/* ===============================
            🦶 Footer
        =============================== */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
            <Text style={[styles.loginText, { color: colors.primary }]}>
              Log In
            </Text>
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
    marginBottom: 30,
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
    bottom: 18,
    padding: 4,
    zIndex: 10,
  },

  termsText: {
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  linkText: {
    fontFamily: THEME.typography.fontFamily.subheading,
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
  loginText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
