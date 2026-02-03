// components/VerificationBadge.tsx
// Verification badge component showing artisan verification status

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
export type VerificationLevel = "none" | "basic" | "verified" | "certified";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  style?: any;
}

// ================================
// Verification Data
// ================================
const VERIFICATION_DATA: Record<VerificationLevel, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  description: string;
}> = {
  none: {
    label: "Unverified",
    icon: "shield-outline",
    color: "#9CA3AF",
    bgColor: "#F3F4F6",
    description: "This professional has not been verified yet",
  },
  basic: {
    label: "ID Verified",
    icon: "shield-checkmark",
    color: "#3B82F6",
    bgColor: "#DBEAFE",
    description: "Identity verified through government ID",
  },
  verified: {
    label: "Verified",
    icon: "shield-checkmark",
    color: "#10B981",
    bgColor: "#D1FAE5",
    description: "Identity and background check completed",
  },
  certified: {
    label: "Verified Pro",
    icon: "ribbon",
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
    description: "Fully verified with professional certifications",
  },
};

// ================================
// Component
// ================================
export function VerificationBadge({
  level,
  size = "medium",
  showLabel = true,
  style,
}: VerificationBadgeProps) {
  const { colors } = useAppTheme();
  const data = VERIFICATION_DATA[level];

  const sizes = {
    small: { icon: 12, fontSize: 10, padding: 4, gap: 2 },
    medium: { icon: 14, fontSize: 12, padding: 6, gap: 4 },
    large: { icon: 18, fontSize: 14, padding: 8, gap: 6 },
  };

  const sizeConfig = sizes[size];

  if (level === "none" && !showLabel) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: data.bgColor,
          paddingHorizontal: sizeConfig.padding,
          paddingVertical: sizeConfig.padding - 2,
          gap: sizeConfig.gap,
        },
        style,
      ]}
    >
      <Ionicons name={data.icon} size={sizeConfig.icon} color={data.color} />
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: data.color, fontSize: sizeConfig.fontSize },
          ]}
        >
          {data.label}
        </Text>
      )}
    </View>
  );
}

// ================================
// Inline Badge (just the icon with checkmark)
// ================================
export function VerificationCheckmark({
  level,
  size = 16,
}: {
  level: VerificationLevel;
  size?: number;
}) {
  if (level === "none") return null;

  const data = VERIFICATION_DATA[level];

  return <Ionicons name={data.icon} size={size} color={data.color} />;
}

// ================================
// Full Verification Card
// ================================
export function VerificationCard({ level }: { level: VerificationLevel }) {
  const { colors } = useAppTheme();
  const data = VERIFICATION_DATA[level];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.cardIconContainer, { backgroundColor: data.bgColor }]}>
        <Ionicons name={data.icon} size={24} color={data.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{data.label}</Text>
        <Text style={[styles.cardDescription, { color: colors.muted }]}>{data.description}</Text>
      </View>
    </View>
  );
}

// ================================
// Verification Requirements List
// ================================
export function VerificationRequirements({ currentLevel }: { currentLevel: VerificationLevel }) {
  const { colors } = useAppTheme();

  const requirements = [
    { level: "basic" as const, label: "Government ID Verification", required: true },
    { level: "verified" as const, label: "Background Check", required: true },
    { level: "verified" as const, label: "Phone Number Verified", required: true },
    { level: "certified" as const, label: "Professional Certifications", required: false },
    { level: "certified" as const, label: "Skills Assessment", required: false },
  ];

  const levelOrder = ["none", "basic", "verified", "certified"];
  const currentIndex = levelOrder.indexOf(currentLevel);

  return (
    <View style={styles.requirementsList}>
      {requirements.map((req, index) => {
        const reqIndex = levelOrder.indexOf(req.level);
        const isCompleted = currentIndex >= reqIndex;

        return (
          <View key={index} style={styles.requirementItem}>
            <View
              style={[
                styles.requirementCheck,
                {
                  backgroundColor: isCompleted ? colors.success : colors.border,
                },
              ]}
            >
              <Ionicons
                name={isCompleted ? "checkmark" : "close"}
                size={12}
                color="#FFFFFF"
              />
            </View>
            <Text
              style={[
                styles.requirementLabel,
                {
                  color: isCompleted ? colors.text : colors.muted,
                  textDecorationLine: isCompleted ? "line-through" : "none",
                },
              ]}
            >
              {req.label}
              {!req.required && " (Optional)"}
            </Text>
          </View>
        );
      })}
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
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: THEME.spacing.md,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
  },
  requirementsList: {
    gap: THEME.spacing.sm,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  requirementCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  requirementLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
});

export { VERIFICATION_DATA };
export default VerificationBadge;
