import { LanguageSettingsItem } from '@/components/LanguageSettingsItem';
import { ReferralCard } from '@/components/ReferralCard';
import { ThemeSettingsItem } from '@/components/ThemeSettingsItem';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClientSettings() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();

  // Generate a referral code from user ID or use placeholder
  const referralCode = user?.id ? `HANDI${user.id.slice(0, 6).toUpperCase()}` : 'HANDI2024';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Appearance</Text>
        <ThemeSettingsItem />

        {/* Language Section */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Language</Text>
        <LanguageSettingsItem />

        {/* Referral Section */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>Refer & Earn</Text>
        <ReferralCard 
          referralCode={referralCode}
          friendsReferred={0}
          totalEarned={0}
        />

        {/* Additional Settings */}
        <Text style={[styles.sectionTitle, { color: colors.muted, marginTop: THEME.spacing.lg }]}>More</Text>
        
        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow 
            icon="notifications-outline" 
            label="Notifications" 
            colors={colors}
            onPress={() => {}}
          />
          <SettingsRow 
            icon="shield-checkmark-outline" 
            label="Privacy & Security" 
            colors={colors}
            onPress={() => {}}
          />
          <SettingsRow 
            icon="help-circle-outline" 
            label="Help & Support" 
            colors={colors}
            onPress={() => {}}
          />
          <SettingsRow 
            icon="document-text-outline" 
            label="Terms of Service" 
            colors={colors}
            onPress={() => {}}
            isLast
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.muted }]}>HANDI v1.0.0</Text>
          <Text style={[styles.appCopyright, { color: colors.muted }]}>© 2024 HandiApp Nigeria</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Settings Row Component
function SettingsRow({ 
  icon, 
  label, 
  colors, 
  onPress, 
  isLast = false 
}: { 
  icon: string; 
  label: string; 
  colors: any; 
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.settingsRow, 
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={22} color={colors.primary} />
      <Text style={[styles.settingsLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: THEME.spacing.md,
  },
  settingsGroup: {
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  settingsLabel: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
    paddingVertical: THEME.spacing.lg,
  },
  appVersion: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
});
