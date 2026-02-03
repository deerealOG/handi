// components/WaitlistCard.tsx
// Early access waitlist component for pre-launch engagement

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface WaitlistCardProps {
  cityName?: string;
  onJoinWaitlist?: (email: string, city: string) => Promise<void>;
  compact?: boolean;
}

// ================================
// Component
// ================================
export function WaitlistCard({
  cityName = 'your city',
  onJoinWaitlist,
  compact = false,
}: WaitlistCardProps) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(cityName);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      if (onJoinWaitlist) {
        await onJoinWaitlist(email, city);
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsJoined(true);
    } catch (error) {
      Alert.alert('Error', 'Could not join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isJoined) {
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark" size={32} color="#FFFFFF" />
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>You're on the list! 🎉</Text>
        <Text style={[styles.successText, { color: colors.muted }]}>
          We'll notify you when HANDI launches in {city}. Get ready for Nigeria's #1 home services app!
        </Text>
        <View style={[styles.positionBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.positionText, { color: colors.primary }]}>Position #2,847</Text>
        </View>
      </View>
    );
  }

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.text }]}>
            Not in your area yet?
          </Text>
          <Text style={[styles.compactSubtitle, { color: colors.muted }]}>
            Join 2,000+ on our waitlist
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.compactButton, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert('Join Waitlist', 'Waitlist modal would open here')}
        >
          <Text style={styles.compactButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="notifications" size={28} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Coming Soon to {city}!</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Join 2,000+ Nigerians on the waitlist
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>2,000+</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>On Waitlist</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>Q2 2026</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Launch Date</Text>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={colors.muted} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="location-outline" size={20} color={colors.muted} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Your city"
            placeholderTextColor={colors.placeholder}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: colors.primary }]}
          onPress={handleJoin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
              <Text style={styles.joinButtonText}>Join the Waitlist</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Benefits */}
      <View style={styles.benefits}>
        <Text style={[styles.benefitsTitle, { color: colors.text }]}>Early access perks:</Text>
        {[
          { icon: 'gift', text: '₦1,000 welcome credit' },
          { icon: 'flash', text: 'Priority booking access' },
          { icon: 'star', text: 'Exclusive launch discounts' },
        ].map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Ionicons name={benefit.icon as any} size={16} color={colors.success} />
            <Text style={[styles.benefitText, { color: colors.muted }]}>{benefit.text}</Text>
          </View>
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
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  successContainer: {
    alignItems: 'center',
  },

  // Header
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

  // Form
  form: {
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    paddingVertical: 4,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.xs,
  },
  joinButtonText: {
    color: '#000000',
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Benefits
  benefits: {
    gap: THEME.spacing.xs,
  },
  benefitsTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  benefitText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Success State
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  successTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
  },
  successText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  positionBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  positionText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
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
  compactButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
  },
  compactButtonText: {
    color: '#000000',
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});

export default WaitlistCard;
