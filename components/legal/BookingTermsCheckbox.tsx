// components/legal/BookingTermsCheckbox.tsx
// Booking confirmation terms acceptance checkboxes

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LEGAL_DISCLAIMERS } from '@/types/legal';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookingTermsCheckboxProps {
  onAllAccepted: (accepted: boolean) => void;
  showExpandedTerms?: boolean;
}

interface CheckboxItem {
  id: string;
  label: string;
  required: boolean;
}

const BOOKING_CHECKBOXES: CheckboxItem[] = [
  {
    id: 'marketplace',
    label: 'I understand HANDI is a marketplace that facilitates connections only',
    required: true,
  },
  {
    id: 'independent',
    label: 'I understand artisans are independent contractors, not HANDI employees',
    required: true,
  },
  {
    id: 'no_guarantee',
    label: 'I understand HANDI does not guarantee or insure services',
    required: true,
  },
  {
    id: 'discretion',
    label: 'I am booking this service at my own discretion',
    required: true,
  },
];

export function BookingTermsCheckbox({
  onAllAccepted,
  showExpandedTerms = false,
}: BookingTermsCheckboxProps) {
  const { colors } = useAppTheme();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);

    // Check if all required items are checked
    const allRequired = BOOKING_CHECKBOXES.filter(c => c.required).map(c => c.id);
    const allAccepted = allRequired.every(id => newChecked.has(id));
    onAllAccepted(allAccepted);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={20} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Booking Acknowledgment
        </Text>
      </View>

      <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
        Please confirm you understand the following:
      </Text>

      <View style={styles.checkboxList}>
        {BOOKING_CHECKBOXES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkboxRow}
            onPress={() => toggleItem(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: checkedItems.has(item.id) ? colors.primary : colors.border },
                checkedItems.has(item.id) && { backgroundColor: colors.primary },
              ]}
            >
              {checkedItems.has(item.id) && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              {item.label}
              {item.required && <Text style={{ color: colors.error }}> *</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showExpandedTerms && (
        <View style={[styles.expandedTerms, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.expandedTitle, { color: colors.muted }]}>
            Summary of Terms
          </Text>
          <Text style={[styles.expandedText, { color: colors.muted }]}>
            • {LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}{'\n'}
            • {LEGAL_DISCLAIMERS.INDEPENDENT_CONTRACTORS}{'\n'}
            • {LEGAL_DISCLAIMERS.NO_GUARANTEE}{'\n'}
            • {LEGAL_DISCLAIMERS.CLIENT_DISCRETION}
          </Text>
        </View>
      )}

      <Text style={[styles.requiredNote, { color: colors.muted }]}>
        * Required fields
      </Text>
    </View>
  );
}

// Simplified single checkbox for quick confirmation
export function QuickTermsCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={styles.quickCheckboxRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: checked ? colors.primary : colors.border },
          checked && { backgroundColor: colors.primary },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <Text style={[styles.quickCheckboxLabel, { color: colors.text }]}>
        {label || 'I agree to the Terms of Service and understand that HANDI is a marketplace facilitator only.'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  headerSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.md,
  },
  checkboxList: {
    gap: THEME.spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  expandedTerms: {
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
  },
  expandedTitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  expandedText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 18,
  },
  requiredNote: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.sm,
    textAlign: 'right',
  },
  quickCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing.sm,
  },
  quickCheckboxLabel: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
});

export default BookingTermsCheckbox;
