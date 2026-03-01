import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function RegisterBusinessScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { register } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!businessName || !address || !email || !password) {
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

    const result = await register({
      firstName: businessName, // Business name as first name
      lastName: "", // No last name for business
      email,
      phone: "", // Can add phone later
      password,
      userType: "business",
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
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Logo & Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require("../../assets/images/handi-logo-light.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            For Business
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Scale your operations with enterprise tools
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Business Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Name
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.primary + 10,
                  borderColor: colors.primary + 10,
                },
              ]}
            >
              <Ionicons
                name="business-outline"
                size={20}
                color={colors.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Apex Services Ltd"
                placeholderTextColor={colors.muted}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Address
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.primary + 10,
                  borderColor: colors.primary + 10,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="123 Main Street, Lagos"
                placeholderTextColor={colors.muted}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          {/* CAC/TIN (Optional) */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              CAC / TIN (Optional)
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.primary + 10,
                  borderColor: colors.primary + 10,
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="RC123456"
                placeholderTextColor={colors.muted}
                value={cacNumber}
                onChangeText={setCacNumber}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Email
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.primary + 10,
                  borderColor: colors.primary + 10,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="contact@apexservices.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.primary + 10,
                  borderColor: colors.primary + 10,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
                Create Business Account
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Auth Section */}
        <View style={{ marginTop: 24, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: colors.border }}
            />
            <Text
              style={{
                marginHorizontal: 12,
                fontSize: 13,
                color: colors.muted,
                fontFamily: THEME.typography.fontFamily.body,
              }}
            >
              OR
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: colors.border }}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Google Sign-Up",
                "Google authentication will be configured with your OAuth credentials.",
              )
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              marginBottom: 12,
              gap: 12,
            }}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text
              style={{
                fontSize: 15,
                fontFamily: THEME.typography.fontFamily.subheading,
                color: colors.text,
              }}
            >
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Facebook Sign-Up",
                "Facebook authentication will be configured with your App ID.",
              )
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              borderRadius: 50,
              backgroundColor: "#1877F2",
              marginBottom: 12,
              gap: 12,
            }}
          >
            <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 15,
                fontFamily: THEME.typography.fontFamily.subheading,
                color: "#FFFFFF",
              }}
            >
              Sign up with Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  button: {
    height: 56,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    ...THEME.shadow.base,
  },
  buttonText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  linkText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
