// components/legal/DisclaimerBanner.tsx
// Display legal disclaimers in UI - marketplace positioning

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LEGAL_DISCLAIMERS } from '@/types/legal';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DisclaimerType = 
  | 'marketplace'
  | 'no_guarantee'
  | 'independent_contractor'
  | 'no_compensation'
  | 'client_discretion';

interface DisclaimerBannerProps {
  type: DisclaimerType;
  variant?: 'full' | 'compact' | 'inline';
  showIcon?: boolean;
  onLearnMore?: () => void;
}

const DISCLAIMER_CONFIG: Record<DisclaimerType, { icon: string; text: string }> = {
  marketplace: {
    icon: 'information-circle',
    text: LEGAL_DISCLAIMERS.MARKETPLACE_ONLY,
  },
  no_guarantee: {
    icon: 'shield-outline',
    text: LEGAL_DISCLAIMERS.NO_GUARANTEE,
  },
  independent_contractor: {
    icon: 'person-outline',
    text: LEGAL_DISCLAIMERS.INDEPENDENT_CONTRACTORS,
  },
  no_compensation: {
    icon: 'alert-circle-outline',
    text: LEGAL_DISCLAIMERS.NO_COMPENSATION,
  },
  client_discretion: {
    icon: 'eye-outline',
    text: LEGAL_DISCLAIMERS.CLIENT_DISCRETION,
  },
};

export function DisclaimerBanner({
  type,
  variant = 'full',
  showIcon = true,
  onLearnMore,
}: DisclaimerBannerProps) {
  const { colors } = useAppTheme();
  const config = DISCLAIMER_CONFIG[type];

  if (variant === 'inline') {
    return (
      <Text style={[styles.inlineText, { color: colors.muted }]}>
        {config.text}
      </Text>
    );
  }

  if (variant === 'compact') {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.background }]}>
        {showIcon && (
          <Ionicons name={config.icon as any} size={16} color={colors.muted} />
        )}
        <Text style={[styles.compactText, { color: colors.muted }]} numberOfLines={1}>
          {config.text}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.fullContainer, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
      <View style={styles.iconContainer}>
        {showIcon && (
          <Ionicons name={config.icon as any} size={20} color={colors.primary} />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.fullText, { color: colors.text }]}>
          {config.text}
        </Text>
        {onLearnMore && (
          <TouchableOpacity onPress={onLearnMore} style={styles.learnMoreButton}>
            <Text style={[styles.learnMoreText, { color: colors.primary }]}>
              Learn More
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Booking confirmation disclaimer block
export function BookingDisclaimer() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.bookingDisclaimer, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={[styles.disclaimerTitle, { color: colors.text }]}>
        Important Information
      </Text>
      
      <View style={styles.disclaimerItem}>
        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
        <Text style={[styles.disclaimerItemText, { color: colors.muted }]}>
          {LEGAL_DISCLAIMERS.INDEPENDENT_CONTRACTORS}
        </Text>
      </View>
      
      <View style={styles.disclaimerItem}>
        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
        <Text style={[styles.disclaimerItemText, { color: colors.muted }]}>
          {LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}
        </Text>
      </View>
      
      <View style={styles.disclaimerItem}>
        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
        <Text style={[styles.disclaimerItemText, { color: colors.muted }]}>
          {LEGAL_DISCLAIMERS.CLIENT_DISCRETION}
        </Text>
      </View>
    </View>
  );
}

// Footer disclaimer for screens
export function FooterDisclaimer() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.footerDisclaimer}>
      <Text style={[styles.footerText, { color: colors.muted }]}>
        {LEGAL_DISCLAIMERS.MARKETPLACE_ONLY} {LEGAL_DISCLAIMERS.NO_GUARANTEE}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Inline
  inlineText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    fontStyle: 'italic',
  },

  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    gap: 8,
  },
  compactText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Full
  fullContainer: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  fullText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  learnMoreButton: {
    marginTop: THEME.spacing.xs,
  },
  learnMoreText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Booking
  bookingDisclaimer: {
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  disclaimerTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  disclaimerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  disclaimerItemText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
  },

  // Footer
  footerDisclaimer: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  footerText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default DisclaimerBanner;
