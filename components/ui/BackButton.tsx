import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { THEME } from "../../constants/theme";

interface BackButtonProps {
  style?: ViewStyle;
  iconColor?: string;
  backgroundColor?: string;
}

export function BackButton({ style, iconColor, backgroundColor }: BackButtonProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={iconColor || colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22, // Perfectly rounded/elliptical
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Subtle border for better visibility on white backgrounds
    ...THEME.shadow.base, // Subtle shadow for depth
    zIndex: 10,
  },
});
