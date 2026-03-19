import { useAuth } from "@/app/context/AuthContext";
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
import { THEME } from "../constants/theme";

export default function RegisterClientScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [otpMethod, setOtpMethod] = useState<"email" | "sms">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const detectLocation = async () => {
    // Dummy / prompt for location detection in Native
    Alert.alert("Auto-detect", "Location detection requires permission. Please enter manually for now.");
  };

  const validateStep1 = () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!city || !state || !address) {
      Alert.alert("Missing Information", "Please enter your location details.");
      return;
    }
    setIsLoading(true);

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const result = await register({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType: "client",
      city,
      state,
      address,
      otpMethod,
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
            source={require("../../assets/images/handi-logo-green.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Join as a Client to find trusted pros
          </Text>
        </View>

        {/* Social Auth — always visible above the form */}
        <View style={{ marginBottom: 20, width: "100%" }}>
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
              marginBottom: 10,
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
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
              OR sign up with email
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: colors.border }}
            />
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {step === 1 && (
            <>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <Ionicons name="person-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Your full name"
                    placeholderTextColor={colors.muted}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <Ionicons name="call-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Your phone number"
                    placeholderTextColor={colors.muted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleNext}>
                <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.label, { color: colors.text }]}>Location Details</Text>
                <TouchableOpacity onPress={detectLocation}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading }}>Auto-detect</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={[styles.inputContainer, { flex: 1, backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <TextInput style={[styles.input, { color: colors.text }]} placeholder="City" placeholderTextColor={colors.muted} value={city} onChangeText={setCity} />
                </View>
                <View style={[styles.inputContainer, { flex: 1, backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                  <TextInput style={[styles.input, { color: colors.text }]} placeholder="State" placeholderTextColor={colors.muted} value={state} onChangeText={setState} />
                </View>
              </View>

              <View style={[styles.inputContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }]}>
                <TextInput style={[styles.input, { color: colors.text }]} placeholder="Full Address" placeholderTextColor={colors.muted} value={address} onChangeText={setAddress} />
              </View>

              <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>How would you like to receive your OTP code?</Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => setOtpMethod("email")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: otpMethod === "email" ? colors.primary : colors.muted, alignItems: "center", justifyContent: "center" }}>
                    {otpMethod === "email" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}
                  </View>
                  <Text style={{ color: colors.text, fontFamily: THEME.typography.fontFamily.body }}>Email Address</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setOtpMethod("sms")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: otpMethod === "sms" ? colors.primary : colors.muted, alignItems: "center", justifyContent: "center" }}>
                    {otpMethod === "sms" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}
                  </View>
                  <Text style={{ color: colors.text, fontFamily: THEME.typography.fontFamily.body }}>SMS (Phone)</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, flex: 0.4 }]} onPress={() => setStep(1)} disabled={isLoading}>
                  <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, flex: 0.6 }]} onPress={handleRegister} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Sign Up</Text>}
                </TouchableOpacity>
              </View>
            </>
          )}
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
