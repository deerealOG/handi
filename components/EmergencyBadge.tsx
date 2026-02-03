// components/EmergencyBadge.tsx
// Emergency service badge for 24/7 priority services

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface EmergencyBadgeProps {
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  style?: any;
}

// ================================
// Component
// ================================
export function EmergencyBadge({
  size = "medium",
  showLabel = true,
  style,
}: EmergencyBadgeProps) {
  const { colors } = useAppTheme();

  const sizes = {
    small: { icon: 10, fontSize: 9, padding: 4, gap: 2 },
    medium: { icon: 12, fontSize: 10, padding: 6, gap: 4 },
    large: { icon: 16, fontSize: 12, padding: 8, gap: 6 },
  };

  const sizeConfig = sizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.error + '15',
          paddingHorizontal: sizeConfig.padding,
          paddingVertical: sizeConfig.padding - 2,
          gap: sizeConfig.gap,
        },
        style,
      ]}
    >
      <Ionicons name="flash" size={sizeConfig.icon} color={colors.error} />
      {showLabel && (
        <Text style={[styles.label, { color: colors.error, fontSize: sizeConfig.fontSize }]}>
          24/7
        </Text>
      )}
    </View>
  );
}

// ================================
// Available 24/7 Full Badge
// ================================
export function Available24_7Badge({ style }: { style?: any }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.fullBadge, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.error }]}>
        <Ionicons name="flash" size={14} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.mainText, { color: colors.error }]}>Emergency Available</Text>
        <Text style={[styles.subText, { color: colors.muted }]}>24/7 Priority Service</Text>
      </View>
    </View>
  );
}

// ================================
// Priority Booking Badge
// ================================
export function PriorityBadge({ style }: { style?: any }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.priorityContainer, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' + '30' }, style]}>
      <Ionicons name="rocket" size={14} color="#F59E0B" />
      <Text style={[styles.priorityText, { color: '#B45309' }]}>Priority Booking</Text>
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
  },
  label: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontWeight: '600',
  },

  // Full Badge
  fullBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  subText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Priority Badge
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});

export default EmergencyBadge;
