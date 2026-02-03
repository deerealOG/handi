// components/SupportTiers.tsx
// Donation/Support tiers component

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface Tier {
  id: string;
  name: string;
  amount: string;
  amountValue: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  benefits: string[];
  popular?: boolean;
}

interface SupportTiersProps {
  onSelectTier: (tier: Tier) => void;
  selectedTierId?: string;
}

// ================================
// Tier Data
// ================================
const TIERS: Tier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: "₦5,000",
    amountValue: 5000,
    icon: "heart",
    color: "#EC4899",
    benefits: [
      "Support HANDI's mission",
      "Early access to new features",
      "Supporter badge on profile",
    ],
  },
  {
    id: "champion",
    name: "Champion",
    amount: "₦25,000",
    amountValue: 25000,
    icon: "trophy",
    color: "#F59E0B",
    benefits: [
      "All Supporter benefits",
      "Priority customer support",
      "Monthly newsletter",
      "Champion badge on profile",
    ],
    popular: true,
  },
  {
    id: "partner",
    name: "Partner",
    amount: "₦100,000",
    amountValue: 100000,
    icon: "diamond",
    color: "#8B5CF6",
    benefits: [
      "All Champion benefits",
      "Free service credits (₦10,000)",
      "Exclusive partner events",
      "Direct line to founders",
      "Partner badge on profile",
    ],
  },
];

// ================================
// Component
// ================================
export function SupportTiers({
  onSelectTier,
  selectedTierId,
}: SupportTiersProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Support HANDI</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Help us build the future of home services in Nigeria
      </Text>

      <View style={styles.tiersContainer}>
        {TIERS.map((tier) => {
          const isSelected = selectedTierId === tier.id;

          return (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tierCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? tier.color : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelectTier(tier)}
              activeOpacity={0.7}
            >
              {tier.popular && (
                <View
                  style={[styles.popularBadge, { backgroundColor: tier.color }]}
                >
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}

              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: tier.color + "20" },
                ]}
              >
                <Ionicons name={tier.icon} size={28} color={tier.color} />
              </View>

              <Text style={[styles.tierName, { color: colors.text }]}>
                {tier.name}
              </Text>
              <Text style={[styles.tierAmount, { color: tier.color }]}>
                {tier.amount}
              </Text>

              <View style={styles.benefitsList}>
                {tier.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={tier.color}
                    />
                    <Text style={[styles.benefitText, { color: colors.muted }]}>
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: isSelected ? tier.color : "transparent",
                    borderColor: tier.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectButtonText,
                    { color: isSelected ? "#FFFFFF" : tier.color },
                  ]}
                >
                  {isSelected ? "Selected" : "Select"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ================================
// Compact Version
// ================================
export function SupportTiersCompact({
  onSelectTier,
}: {
  onSelectTier: (tier: Tier) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.compactContainer}>
      {TIERS.map((tier) => (
        <TouchableOpacity
          key={tier.id}
          style={[styles.compactCard, { backgroundColor: tier.color + "15" }]}
          onPress={() => onSelectTier(tier)}
        >
          <Ionicons name={tier.icon} size={20} color={tier.color} />
          <View style={styles.compactInfo}>
            <Text style={[styles.compactName, { color: colors.text }]}>
              {tier.name}
            </Text>
            <Text style={[styles.compactAmount, { color: tier.color }]}>
              {tier.amount}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  tiersContainer: {
    gap: THEME.spacing.md,
  },
  tierCard: {
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  popularBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderBottomLeftRadius: THEME.radius.sm,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  tierName: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  tierAmount: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.md,
  },
  benefitsList: {
    width: "100%",
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  benefitText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    flex: 1,
  },
  selectButton: {
    width: "100%",
    height: 44,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  selectButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  compactContainer: {
    gap: THEME.spacing.sm,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: THEME.spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  compactAmount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});

export { TIERS };
export type { Tier };
export default SupportTiers;
