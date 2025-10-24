// app/LoginScreen.tsx
// ===========================================
// 🔐 LOGIN SCREEN
// Allows users to log in and select their role (Client, Artisan, or Admin).
// Uses theme-driven styling, animated role buttons, and clean layout structure.
// ===========================================

import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { THEME } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();

  // --- 🧭 State management ---
  const [role, setRole] = useState<"client" | "artisan" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- 🚀 Handle Login Navigation ---
  const handleLogin = () => {
    if (!role) return alert("Please select a role first!");
    router.push(`/${role}/(tabs)` as any); // Simple direct navigation based on role
  };

  // --- 🎞 Animated button scaling values ---
  const scales = {
    client: useRef(new Animated.Value(1)).current,
    artisan: useRef(new Animated.Value(1)).current,
    admin: useRef(new Animated.Value(1)).current,
  };

  // --- ⚡ Button animation (press in/out feedback) ---
  const animatePress = (key: "client" | "artisan" | "admin") => {
    Animated.sequence([
      Animated.timing(scales[key], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scales[key], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🧱 App Title */}
      <Text style={styles.title}>FIXIT</Text>

      {/* ✉️ Email Input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={THEME.colors.muted}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      {/* 🔒 Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor={THEME.colors.muted}
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* 👥 Role Selection Section */}
      <Text style={styles.label}>Select Role</Text>

      <View style={styles.roles}>
        {(["client", "artisan", "admin"] as const).map((r) => {
          const isSelected = role === r;
          const scale = scales[r];
          const color =
            r === "client"
              ? THEME.colors.primary
              : r === "artisan"
              ? THEME.colors.secondary
              : THEME.colors.text; // fallback for admin

          return (
            <TouchableWithoutFeedback
              key={r}
              onPress={() => {
                setRole(r);
                animatePress(r);
              }}
            >
              <Animated.View
                style={[
                  styles.roleBtn,
                  {
                    transform: [{ scale }],
                    backgroundColor: isSelected ? color : `${color}15`, // light tint for inactive
                    borderColor: color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roleText,
                    { color: isSelected ? THEME.colors.surface : color },
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>

      {/* 🟢 Login Button */}
      <TouchableWithoutFeedback onPress={handleLogin}>
        <View style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ===========================================
// 🎨 STYLES — All follow THEME constants
// ===========================================
const styles = StyleSheet.create({
  // --- Main screen layout ---
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.lg,
  },

  // --- Title ---
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes["2xl"],
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xl,
  },

  // --- Text Inputs ---
  input: {
    width: "100%",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },

  // --- Label above roles ---
  label: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    marginVertical: THEME.spacing.sm,
  },

  // --- Roles container ---
  roles: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: THEME.spacing.xl,
  },

  // --- Role selection button ---
  roleBtn: {
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
  },
  roleText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },

  // --- Login Button ---
  loginBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    ...THEME.shadow.base,
  },
  loginText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
});
