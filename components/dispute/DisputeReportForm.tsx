// components/dispute/DisputeReportForm.tsx
// Dispute reporting form for clients

import { THEME } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { disputeService } from '@/services';
import { DisputeEvidence, DisputeType, LEGAL_DISCLAIMERS } from '@/types/legal';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DisputeReportFormProps {
  bookingId: string;
  artisanId: string;
  artisanName: string;
  onSubmit: (disputeId: string) => void;
  onCancel: () => void;
}

const DISPUTE_TYPES: { type: DisputeType; label: string; icon: string; description: string }[] = [
  { type: 'property_damage', label: 'Property Damage', icon: 'home-outline', description: 'Damage to property during service' },
  { type: 'theft', label: 'Theft', icon: 'alert-circle-outline', description: 'Items stolen during service visit' },
  { type: 'misconduct', label: 'Misconduct', icon: 'warning-outline', description: 'Inappropriate behavior by artisan' },
  { type: 'harassment', label: 'Harassment', icon: 'shield-outline', description: 'Verbal, physical, or sexual harassment' },
  { type: 'poor_service', label: 'Poor Service', icon: 'thumbs-down-outline', description: 'Work not completed or poor quality' },
  { type: 'no_show', label: 'No Show', icon: 'time-outline', description: 'Artisan did not arrive for booking' },
  { type: 'unauthorized_charges', label: 'Unauthorized Charges', icon: 'card-outline', description: 'Charged more than quoted' },
  { type: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', description: 'Other issue not listed above' },
];

export function DisputeReportForm({
  bookingId,
  artisanId,
  artisanName,
  onSubmit,
  onCancel,
}: DisputeReportFormProps) {
  const { colors } = useAppTheme();
  const [selectedType, setSelectedType] = useState<DisputeType | null>(null);
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<{ uri: string; type: 'photo' | 'video' }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newEvidence = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' as const : 'photo' as const,
      }));
      setEvidence([...evidence, ...newEvidence]);
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }

    if (description.trim().length < 20) {
      Alert.alert('Error', 'Please provide a detailed description (at least 20 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert evidence to proper format
      const evidenceData: DisputeEvidence[] = evidence.map((e, i) => ({
        id: `evidence_${Date.now()}_${i}`,
        type: e.type,
        url: e.uri,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'client',
      }));

      const result = await disputeService.fileDispute(
        'current_user_id', // Would come from auth context
        bookingId,
        artisanId,
        selectedType,
        description,
        evidenceData
      );

      if (result.success && result.data) {
        Alert.alert(
          'Report Submitted',
          'Your dispute has been submitted. Our team will review it within 24-48 hours.',
          [{ text: 'OK', onPress: () => onSubmit(result.data!.id) }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to submit dispute');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Report an Issue</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Booking Info */}
      <View style={[styles.bookingInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.bookingLabel, { color: colors.muted }]}>Reporting issue with:</Text>
        <Text style={[styles.bookingValue, { color: colors.text }]}>{artisanName}</Text>
        <Text style={[styles.bookingId, { color: colors.muted }]}>Booking #{bookingId}</Text>
      </View>

      {/* Important Notice */}
      <View style={[styles.noticeCard, { backgroundColor: colors.warningLight, borderColor: colors.secondary }]}>
        <Ionicons name="information-circle" size={20} color={colors.secondary} />
        <View style={styles.noticeTextContainer}>
          <Text style={[styles.noticeTitle, { color: colors.text }]}>Important Notice</Text>
          <Text style={[styles.noticeText, { color: colors.muted }]}>
            {LEGAL_DISCLAIMERS.NO_COMPENSATION}
          </Text>
        </View>
      </View>

      {step === 1 && (
        <>
          {/* Issue Type Selection */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What happened?</Text>
          <View style={styles.issueTypeGrid}>
            {DISPUTE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.issueTypeCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedType === type.type && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                ]}
                onPress={() => setSelectedType(type.type)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={selectedType === type.type ? colors.primary : colors.muted}
                />
                <Text
                  style={[
                    styles.issueTypeLabel,
                    { color: selectedType === type.type ? colors.primary : colors.text },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedType && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={() => setStep(2)}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </>
      )}

      {step === 2 && (
        <>
          {/* Selected Type Display */}
          <View style={[styles.selectedTypeBar, { backgroundColor: colors.primaryLight }]}>
            <Ionicons
              name={DISPUTE_TYPES.find(t => t.type === selectedType)?.icon as any}
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.selectedTypeText, { color: colors.primary }]}>
              {DISPUTE_TYPES.find(t => t.type === selectedType)?.label}
            </Text>
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={[styles.changeText, { color: colors.primary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Describe the issue</Text>
          <TextInput
            style={[styles.descriptionInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Please provide as much detail as possible about what happened..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
          <Text style={[styles.charCount, { color: colors.muted }]}>
            {description.length}/500 characters (min. 20)
          </Text>

          {/* Evidence Upload */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Add Evidence (Recommended)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Photos or videos help us review your case faster
          </Text>

          <View style={styles.evidenceContainer}>
            {evidence.map((item, index) => (
              <View key={index} style={styles.evidenceItem}>
                <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
                <TouchableOpacity
                  style={[styles.removeEvidenceButton, { backgroundColor: colors.error }]}
                  onPress={() => handleRemoveEvidence(index)}
                >
                  <Ionicons name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                {item.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
            
            {evidence.length < 5 && (
              <TouchableOpacity
                style={[styles.addEvidenceButton, { borderColor: colors.border }]}
                onPress={handlePickImage}
              >
                <Ionicons name="camera-outline" size={24} color={colors.muted} />
                <Text style={[styles.addEvidenceText, { color: colors.muted }]}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: description.length >= 20 ? colors.primary : colors.muted },
            ]}
            onPress={handleSubmit}
            disabled={description.length < 20 || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Report</Text>
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Final Disclaimer */}
          <Text style={[styles.finalDisclaimer, { color: colors.muted }]}>
            By submitting this report, you confirm the information is accurate. False reports may result in account restrictions. {LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.lg,
    paddingTop: 50,
  },
  cancelButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  bookingInfo: {
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    marginBottom: THEME.spacing.md,
  },
  bookingLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  bookingValue: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  bookingId: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  noticeCard: {
    flexDirection: 'row',
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 12,
    marginBottom: THEME.spacing.lg,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  noticeText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  issueTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  issueTypeCard: {
    width: '48%',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  issueTypeLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  selectedTypeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  selectedTypeText: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  changeText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  descriptionInput: {
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    minHeight: 120,
  },
  charCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'right',
    marginHorizontal: THEME.spacing.lg,
    marginTop: 4,
    marginBottom: THEME.spacing.lg,
  },
  evidenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  evidenceItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: THEME.radius.sm,
    overflow: 'hidden',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  removeEvidenceButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  addEvidenceButton: {
    width: 80,
    height: 80,
    borderRadius: THEME.radius.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEvidenceText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  finalDisclaimer: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
    lineHeight: 14,
  },
});

export default DisputeReportForm;
