// components/Input.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { THEME } from "../constants/theme";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: string;
};

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  error,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: THEME.spacing.md }}>
      {label && (
        <Text style={styles.label as TextStyle}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer as ViewStyle,
          {
            borderColor: error
              ? THEME.colors.danger
              : isFocused
              ? THEME.colors.primary
              : THEME.colors.surface,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? THEME.colors.primary : THEME.colors.muted}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholderTextColor={THEME.colors.muted}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: THEME.colors.surface,
  },
  input: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    padding: 0,
    margin: 0,
  },
  error: {
    color: THEME.colors.danger,
    marginTop: 6,
    fontSize: THEME.typography.sizes.sm,
  },
});
