// components/Input.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import { THEME } from "../constants/theme";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
};

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  error,
  autoCapitalize = "sentences",
  keyboardType = "default",
}: InputProps) => {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const focusValue = useDerivedValue(() => {
    return withTiming(isFocused ? 1 : 0, { duration: 200 });
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusValue.value,
      [0, 1],
      [error ? colors.error : colors.primaryLight, colors.primary]
    );

    return {
      borderColor,
      borderWidth: withTiming(isFocused ? 1.5 : 1, { duration: 200 }),
      transform: [{ scale: withTiming(isFocused ? 1.01 : 1, { duration: 200 }) }],
      elevation: withTiming(isFocused ? 4 : 0, { duration: 200 }),
      shadowOpacity: withTiming(isFocused ? 0.1 : 0, { duration: 200 }),
    };
  });

  return (
    <View style={{ marginBottom: THEME.spacing.lg }}>
      {label && (
        <Text style={[styles.label as TextStyle, { color: colors.text }]}>
          {label}
        </Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer as ViewStyle,
          containerAnimatedStyle,
          {
            backgroundColor: colors.primaryLight,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.muted}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 999,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  error: {
    marginTop: 6,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginLeft: 4,
  },
});
