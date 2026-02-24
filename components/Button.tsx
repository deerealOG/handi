// components/Button.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { THEME } from "../constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "role";
  roleColor?: "client" | "artisan" | "admin";
  loading?: boolean;
  style?: any;
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  label,
  onPress,
  variant = "primary",
  roleColor = "client",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // pick color depending on variant
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
      ? colors.secondary
      : variant === "role"
      ? (colors as any)[roleColor]
      : variant === "outline"
      ? colors.surface
      : "transparent";

  const textColor = variant === "outline" ? colors.text : "#FFFFFF";
  const borderColor = variant === "outline" ? colors.primary : "transparent";

  return (
    <AnimatedPressable
      style={[
        styles.button,
        animatedStyle,
        { backgroundColor, borderColor, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    borderWidth: 0.1,
    alignItems: "center",
    justifyContent: "center",
    ...THEME.shadow.base,
  },
  label: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
