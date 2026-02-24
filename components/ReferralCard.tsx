// components/ReferralCard.tsx
// Viral referral system component for user acquisition

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import React, { useState } from "react";
import {
    Alert, Share, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface ReferralCardProps {
  referralCode: string;
  friendsReferred?: number;
  totalEarned?: number;
  compact?: boolean;
}

// ================================
// Main Component
// ================================
export function ReferralCard({
  referralCode,
  friendsReferred = 0,
  totalEarned = 0,
  compact = false,
}: ReferralCardProps) {
  const { colors } = useAppTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Error', 'Could not copy code');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on HANDI - Nigeria's #1 home services app! Use my referral code "${referralCode}" to get ₦500 off your first booking. Download now: https://handiapp.com.ng`,
        title: 'Join HANDI App',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
        onPress={handleShare}
      >
        <View style={[styles.compactIconContainer, { backgroundColor: colors.primary }]}>
          <Ionicons name="gift" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.text }]}>Refer & Earn ₦500</Text>
          <Text style={[styles.compactSubtitle, { color: colors.muted }]}>
            Get ₦500 for each friend you refer
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Ionicons name="gift" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Refer a Friend</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Get ₦500 for each friend who signs up!
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{friendsReferred}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Friends Referred</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>₦{totalEarned.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Total Earned</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.codeSection}>
        <Text style={[styles.codeLabel, { color: colors.muted }]}>Your Referral Code</Text>
        <View style={[styles.codeContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.codeText, { color: colors.text }]}>{referralCode}</Text>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: copied ? colors.success : colors.primary }]}
            onPress={handleCopyCode}
          >
            <Ionicons name={copied ? "checkmark" : "copy"} size={16} color="#FFFFFF" />
            <Text style={styles.copyButtonText}>{copied ? "Copied!" : "Copy"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.primary }]}
        onPress={handleShare}
      >
        <Ionicons name="share-social" size={20} color="#FFFFFF" />
        <Text style={styles.shareButtonText}>Share with Friends</Text>
      </TouchableOpacity>

      {/* How it works */}
      <View style={styles.howItWorks}>
        <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How it works</Text>
        <View style={styles.stepsList}>
          {[
            { icon: 'share-outline', text: 'Share your code with friends' },
            { icon: 'person-add-outline', text: 'They sign up using your code' },
            { icon: 'wallet-outline', text: 'You both get ₦500 credit!' },
          ].map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={step.icon as any} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.stepText, { color: colors.muted }]}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  statValue: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Code Section
  codeSection: {
    marginBottom: THEME.spacing.lg,
  },
  codeLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    paddingLeft: THEME.spacing.md,
    paddingRight: 4,
    paddingVertical: 4,
  },
  codeText: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    gap: 4,
  },
  copyButtonText: {
    color: '#000000',
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Share Button
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  shareButtonText: {
    color: '#000000',
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // How it works
  howItWorks: {
    marginTop: THEME.spacing.sm,
  },
  howItWorksTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  stepsList: {
    gap: THEME.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    flex: 1,
  },

  // Compact version
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
  },
  compactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  compactSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
});

export default ReferralCard;
