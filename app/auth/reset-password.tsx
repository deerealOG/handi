// app/auth/reset-password.tsx
// Reset password screen for HANDI app

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";
import { authService } from "../../services";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (): boolean => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await authService.resetPassword(email || "", password);

      if (response.success) {
        setSuccess(true);
        // Navigate to login after a brief delay
        setTimeout(() => {
          router.replace("/auth/login");
        }, 2000);
      } else {
        setError(response.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (): {
    label: string;
    color: string;
    width: string;
  } => {
    if (password.length === 0)
      return { label: "", color: "transparent", width: "0%" };
    if (password.length < 6)
      return { label: "Weak", color: colors.error, width: "33%" };
    if (password.length < 10)
      return { label: "Good", color: "#F59E0B", width: "66%" };
    return { label: "Strong", color: colors.success, width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="key" size={40} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Create New Password
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Your new password must be different from previously used passwords.
        </Text>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            New Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
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
              placeholder="Enter new password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading && !success}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View
                style={[styles.strengthBar, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.strengthFill,
                    {
                      backgroundColor: strength.color,
                      width: strength.width as any,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Confirm Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.inputBackground,
                borderColor:
                  error && error.includes("match")
                    ? colors.error
                    : colors.border,
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
              placeholder="Confirm new password"
              placeholderTextColor={colors.muted}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError("");
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!isLoading && !success}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

        {/* Success Message */}
        {success && (
          <View
            style={[
              styles.successContainer,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
            />
            <Text style={[styles.successText, { color: colors.success }]}>
              Password reset successful! Redirecting to login...
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            (isLoading || success) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || success}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: THEME.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: THEME.spacing.xl,
  },
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing.md,
  },
  inputIcon: {
    marginRight: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    minWidth: 50,
  },
  errorText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.md,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
    marginBottom: THEME.spacing.lg,
  },
  successText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginLeft: THEME.spacing.sm,
    flex: 1,
  },
  submitButton: {
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: THEME.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
