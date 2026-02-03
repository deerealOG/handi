// components/web/EmptySearchResults.tsx
// Empty state component for when no search results are found

import { Colors, THEME } from "@/constants/theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmptySearchResultsProps {
  title?: string;
  subtitle?: string;
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export default function EmptySearchResults({
  title = "No services found",
  subtitle = "We couldn't find any services matching your criteria. Try adjusting your search terms or filters.",
  onClearFilters,
  showClearButton = true,
}: EmptySearchResultsProps) {
  const colors = Colors.light;

  return (
    <View style={styles.container}>
      {/* Search Icon Circle */}
      <View style={styles.iconCircle}>
        <Icon name="magnify" size={40} color={colors.muted} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>

      {/* Clear Filters Button */}
      {showClearButton && onClearFilters && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: "#F59E0B" }]}
          onPress={onClearFilters}
        >
          <Text style={styles.clearButtonText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    minHeight: 400,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 400,
    marginBottom: THEME.spacing.xl,
  },
  clearButton: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});
