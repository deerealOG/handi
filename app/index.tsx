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
  const [role, setRole] = useState<"client" | "artisan" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!role) return alert("Please select a role first!");
    router.push(`/${role}/(tabs)` as any); // simple direct navigation
  };

  // Animated scale values for buttons
  const scales = {
    client: useRef(new Animated.Value(1)).current,
    artisan: useRef(new Animated.Value(1)).current,
    admin: useRef(new Animated.Value(1)).current,
  };

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
      <Text style={styles.title}>FIXIT</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={THEME.colors.muted}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={THEME.colors.muted}
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Select Role</Text>

      <View style={styles.roles}>
        {(["client", "artisan", "admin"] as const).map((r) => {
          const isSelected = role === r;
          const roleColor = THEME.colors[r];
          const scale = scales[r];

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
                    backgroundColor: isSelected
                      ? roleColor
                      : `${roleColor}20`,
                    borderColor: roleColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roleText,
                    { color: isSelected ? THEME.colors.white : roleColor },
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>

      <TouchableWithoutFeedback onPress={handleLogin}>
        <View style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: "700",
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  input: {
    width: "100%",
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    color: THEME.colors.text,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    marginVertical: THEME.spacing.sm,
  },
  roles: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: THEME.spacing.lg,
  },
  roleBtn: {
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
  },
  roleText: {
    fontWeight: "600",
    fontSize: THEME.typography.sizes.base,
  },
  loginBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
  },
  loginText: {
    color: THEME.colors.white,
    fontWeight: "700",
  },
});
