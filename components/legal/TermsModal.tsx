// components/legal/TermsModal.tsx
// Modal for displaying terms and agreements with acceptance checkbox

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { TermsAgreement } from '@/types/legal';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TermsModalProps {
  visible: boolean;
  agreement: TermsAgreement | null;
  onAccept: () => void;
  onClose: () => void;
  loading?: boolean;
  requireScroll?: boolean;
}

export function TermsModal({
  visible,
  agreement,
  onAccept,
  onClose,
  loading = false,
  requireScroll = true,
}: TermsModalProps) {
  const { colors } = useAppTheme();
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(!requireScroll);
  const [accepted, setAccepted] = useState(false);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50;
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setHasScrolledToEnd(true);
    }
  };

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      setAccepted(false);
      setHasScrolledToEnd(!requireScroll);
    }
  };

  if (!agreement) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {agreement.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Version info */}
          <View style={[styles.versionBar, { backgroundColor: colors.background }]}>
            <Text style={[styles.versionText, { color: colors.muted }]}>
              Version {agreement.version} • Effective {agreement.effectiveDate}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={[styles.agreementText, { color: colors.text }]}>
              {agreement.content}
            </Text>
          </ScrollView>

          {/* Scroll indicator */}
          {requireScroll && !hasScrolledToEnd && (
            <View style={[styles.scrollHint, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="arrow-down" size={16} color={colors.secondary} />
              <Text style={[styles.scrollHintText, { color: colors.secondary }]}>
                Scroll to read entire agreement
              </Text>
            </View>
          )}

          {/* Acceptance checkbox */}
          <View style={[styles.acceptanceSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAccepted(!accepted)}
              disabled={!hasScrolledToEnd}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: hasScrolledToEnd ? colors.primary : colors.muted },
                  accepted && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                {accepted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: hasScrolledToEnd ? colors.text : colors.muted },
                ]}
              >
                I have read and agree to the {agreement.title}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.acceptButton,
                { backgroundColor: accepted ? colors.primary : colors.muted },
              ]}
              onPress={handleAccept}
              disabled={!accepted || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.acceptButtonText}>Accept & Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  versionBar: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
  },
  versionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: THEME.spacing.lg,
  },
  agreementText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.sm,
    gap: 8,
  },
  scrollHintText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  acceptanceSection: {
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    gap: THEME.spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  acceptButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});

export default TermsModal;
