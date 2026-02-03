// components/common/LoadingSpinner.tsx
// Reusable loading spinner for lazy-loaded components

import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "large",
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: colors.background },
      ]}
    >
      <ActivityIndicator size={size} color={THEME.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.xl,
    minHeight: 200,
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  message: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
});
