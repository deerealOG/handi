// components/Button.tsx
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { THEME } from "../constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "role";
  roleColor?: "client" | "artisan" | "admin";
  loading?: boolean;
  disabled?: boolean;
};

export const Button = ({
  label,
  onPress,
  variant = "primary",
  roleColor = "client",
  loading = false,
  disabled = false,
}: ButtonProps) => {
  // pick color depending on variant
  const backgroundColor =
    variant === "primary"
      ? THEME.colors.primary
      : variant === "secondary"
      ? THEME.colors.secondary
      : variant === "role"
      ? (THEME.colors as any)[roleColor]
      : "transparent";

  const textColor = variant === "outline" ? THEME.colors.text : THEME.colors.surface;
  const borderColor = variant === "outline" ? THEME.colors.muted : "transparent";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...THEME.shadow.base,
  },
  label: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.fontFamily.bodyMedium as any,
  },
});
