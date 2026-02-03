// components/LanguageSettingsItem.tsx
// Language selection component for settings

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";
import { Language, useLanguage } from "../context/LanguageContext";

// ================================
// Language Options
// ================================
const LANGUAGE_OPTIONS: { id: Language; label: string; nativeLabel: string; flag: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { id: 'pidgin', label: 'Pidgin', nativeLabel: 'Naija Pidgin', flag: '🇳🇬' },
];

// ================================
// Component
// ================================
export function LanguageSettingsItem() {
  const { colors } = useAppTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="language" size={22} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Language</Text>
      </View>

      <View style={styles.optionsContainer}>
        {LANGUAGE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              { 
                backgroundColor: language === option.id ? colors.primaryLight : colors.background,
                borderColor: language === option.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setLanguage(option.id)}
          >
            <Text style={styles.flag}>{option.flag}</Text>
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
              <Text style={[styles.optionNative, { color: colors.muted }]}>{option.nativeLabel}</Text>
            </View>
            {language === option.id && (
              <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    marginBottom: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  optionsContainer: {
    gap: THEME.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  flag: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  optionNative: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageSettingsItem;
