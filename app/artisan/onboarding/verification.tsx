// app/artisan/onboarding/verification.tsx
// Artisan verification onboarding flow

import { TermsModal } from '@/components/legal/TermsModal';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { legalService, verificationService } from '@/services';
import { GovernmentID, TermsAgreement } from '@/types/legal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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

type VerificationStep = 
  | 'welcome'
  | 'phone'
  | 'email'
  | 'government_id'
  | 'selfie'
  | 'address'
  | 'guarantor'
  | 'code_of_conduct'
  | 'terms'
  | 'complete';

const STEPS: VerificationStep[] = [
  'welcome',
  'phone',
  'email',
  'government_id',
  'selfie',
  'address',
  'guarantor',
  'code_of_conduct',
  'terms',
  'complete',
];

const ID_TYPES: { value: GovernmentID['type']; label: string }[] = [
  { value: 'national_id', label: 'National ID (NIN)' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'international_passport', label: 'International Passport' },
  { value: 'voters_card', label: "Voter's Card" },
];

const RELATIONSHIPS = ['family', 'friend', 'employer', 'colleague', 'other'] as const;

export default function VerificationScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<VerificationStep>('welcome');
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentAgreement, setCurrentAgreement] = useState<TermsAgreement | null>(null);

  // Form states
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [idType, setIdType] = useState<GovernmentID['type']>('national_id');
  const [idNumber, setIdNumber] = useState('');
  const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
  const [idBackImage, setIdBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [homeAddress, setHomeAddress] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorRelationship, setGuarantorRelationship] = useState<typeof RELATIONSHIPS[number]>('family');
  const [guarantorAddress, setGuarantorAddress] = useState('');

  const initializeVerification = useCallback(async () => {
    if (!user?.id) return;

    let data = await verificationService.getVerification(user.id);
    if (!data) {
      const result = await verificationService.initializeVerification(user.id);
      if (result.success && result.data) {
        data = result.data;
      }
    }
  }, [user?.id]);

  useEffect(() => {
    initializeVerification();
  }, [initializeVerification]);

  const getCurrentStepIndex = () => STEPS.indexOf(currentStep);
  const getProgress = () => (getCurrentStepIndex() / (STEPS.length - 1)) * 100;

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const handlePhoneVerification = async () => {
    if (phoneOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    await verificationService.verifyPhone(user!.id);
    setLoading(false);
    goToNextStep();
  };

  const handleEmailVerification = async () => {
    if (emailOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await verificationService.verifyEmail(user!.id);
    setLoading(false);
    goToNextStep();
  };

  const pickImage = async (type: 'id_front' | 'id_back' | 'selfie') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'selfie' ? [1, 1] : [3, 2],
      quality: 0.8,
    };

    const result = type === 'selfie' 
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      switch (type) {
        case 'id_front':
          setIdFrontImage(uri);
          break;
        case 'id_back':
          setIdBackImage(uri);
          break;
        case 'selfie':
          setSelfieImage(uri);
          break;
      }
    }
  };

  const handleIdSubmit = async () => {
    if (!idFrontImage || !idNumber) {
      Alert.alert('Error', 'Please provide ID number and front image');
      return;
    }

    setLoading(true);
    await verificationService.uploadGovernmentId(user!.id, {
      type: idType,
      number: idNumber,
      frontImageUrl: idFrontImage,
      backImageUrl: idBackImage || undefined,
    });
    setLoading(false);
    goToNextStep();
  };

  const handleSelfieSubmit = async () => {
    if (!selfieImage) {
      Alert.alert('Error', 'Please take a selfie');
      return;
    }

    setLoading(true);
    await verificationService.uploadLiveSelfie(user!.id, selfieImage);
    setLoading(false);
    goToNextStep();
  };

  const handleAddressSubmit = async () => {
    if (homeAddress.length < 10) {
      Alert.alert('Error', 'Please provide a complete address');
      return;
    }

    setLoading(true);
    await verificationService.updateHomeAddress(user!.id, homeAddress);
    setLoading(false);
    goToNextStep();
  };

  const handleGuarantorSubmit = async () => {
    if (!guarantorName || !guarantorPhone || !guarantorAddress) {
      Alert.alert('Error', 'Please fill all guarantor fields');
      return;
    }

    setLoading(true);
    await verificationService.addGuarantor(user!.id, {
      fullName: guarantorName,
      phone: guarantorPhone,
      relationship: guarantorRelationship,
      address: guarantorAddress,
    });
    setLoading(false);
    goToNextStep();
  };

  const openCodeOfConduct = async () => {
    const agreement = await legalService.getAgreement('artisan_code_of_conduct');
    setCurrentAgreement(agreement);
    setShowTermsModal(true);
  };

  const handleCodeOfConductAccept = async () => {
    setShowTermsModal(false);
    setLoading(true);
    await verificationService.acceptCodeOfConduct(user!.id);
    await legalService.acceptAgreement(user!.id, 'artisan', 'artisan_code_of_conduct');
    setLoading(false);
    goToNextStep();
  };

  const openTerms = async () => {
    const agreement = await legalService.getAgreement('terms_of_service');
    setCurrentAgreement(agreement);
    setShowTermsModal(true);
  };

  const handleTermsAccept = async () => {
    setShowTermsModal(false);
    setLoading(true);
    await verificationService.acceptTerms(user!.id);
    await legalService.acceptAgreement(user!.id, 'artisan', 'terms_of_service');
    await legalService.acceptAgreement(user!.id, 'artisan', 'marketplace_disclaimer');
    await legalService.acceptAgreement(user!.id, 'artisan', 'payment_terms');
    setLoading(false);
    goToNextStep();
  };

  const handleComplete = () => {
    router.replace('/artisan');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons name="shield-check" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Your Identity</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Complete verification to start accepting jobs on HANDI. This helps us maintain a trusted community for clients and professionals.
            </Text>
            
            <View style={styles.requirementsList}>
              <Text style={[styles.requirementsTitle, { color: colors.text }]}>You&apos;ll need:</Text>
              {[
                'Valid government-issued ID',
                'Phone number for verification',
                'Home address',
                'One guarantor contact',
              ].map((item, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={[styles.requirementText, { color: colors.muted }]}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={goToNextStep}
            >
              <Text style={styles.primaryButtonText}>Start Verification</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );

      case 'phone':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="phone-portrait" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Phone Number</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              We&apos;ve sent a 6-digit code to {user?.phone || 'your phone'}
            </Text>
            
            <TextInput
              style={[styles.otpInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={6}
              value={phoneOtp}
              onChangeText={setPhoneOtp}
            />

            <TouchableOpacity style={styles.resendLink}>
              <Text style={[styles.resendText, { color: colors.primary }]}>Resend Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phoneOtp.length === 6 ? colors.primary : colors.muted }]}
              onPress={handlePhoneVerification}
              disabled={phoneOtp.length !== 6 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Verify Phone</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'email':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="mail" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Email Address</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              We&apos;ve sent a 6-digit code to {user?.email || 'your email'}
            </Text>
            
            <TextInput
              style={[styles.otpInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={6}
              value={emailOtp}
              onChangeText={setEmailOtp}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: emailOtp.length === 6 ? colors.primary : colors.muted }]}
              onPress={handleEmailVerification}
              disabled={emailOtp.length !== 6 || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Verify Email</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'government_id':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Government ID</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Upload a valid government-issued ID for identity verification
            </Text>

            {/* ID Type Selection */}
            <View style={styles.idTypeContainer}>
              {ID_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.idTypeButton,
                    { borderColor: colors.border },
                    idType === type.value && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => setIdType(type.value)}
                >
                  <Text style={[styles.idTypeText, { color: idType === type.value ? colors.primary : colors.text }]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ID Number */}
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter ID Number"
              placeholderTextColor={colors.muted}
              value={idNumber}
              onChangeText={setIdNumber}
            />

            {/* ID Images */}
            <View style={styles.idImagesContainer}>
              <TouchableOpacity
                style={[styles.idImageBox, { borderColor: colors.border }]}
                onPress={() => pickImage('id_front')}
              >
                {idFrontImage ? (
                  <Image source={{ uri: idFrontImage }} style={styles.idImage} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={32} color={colors.muted} />
                    <Text style={[styles.idImageLabel, { color: colors.muted }]}>Front of ID</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.idImageBox, { borderColor: colors.border }]}
                onPress={() => pickImage('id_back')}
              >
                {idBackImage ? (
                  <Image source={{ uri: idBackImage }} style={styles.idImage} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={32} color={colors.muted} />
                    <Text style={[styles.idImageLabel, { color: colors.muted }]}>Back of ID</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: idFrontImage && idNumber ? colors.primary : colors.muted }]}
              onPress={handleIdSubmit}
              disabled={!idFrontImage || !idNumber || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'selfie':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Live Selfie</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Take a clear selfie to verify your identity matches your ID
            </Text>

            <TouchableOpacity
              style={[styles.selfieBox, { borderColor: colors.border }]}
              onPress={() => pickImage('selfie')}
            >
              {selfieImage ? (
                <Image source={{ uri: selfieImage }} style={styles.selfieImage} />
              ) : (
                <>
                  <Ionicons name="person-circle-outline" size={64} color={colors.muted} />
                  <Text style={[styles.selfieLabel, { color: colors.muted }]}>Tap to take selfie</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={[styles.tipBox, { backgroundColor: colors.background }]}>
              <Ionicons name="bulb-outline" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.muted }]}>
                Make sure your face is clearly visible and well-lit
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: selfieImage ? colors.primary : colors.muted }]}
              onPress={handleSelfieSubmit}
              disabled={!selfieImage || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'address':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Home Address</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Provide your current residential address
            </Text>

            <TextInput
              style={[styles.textAreaInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter your full address..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={homeAddress}
              onChangeText={setHomeAddress}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: homeAddress.length >= 10 ? colors.primary : colors.muted }]}
              onPress={handleAddressSubmit}
              disabled={homeAddress.length < 10 || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'guarantor':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Guarantor Information</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Provide details of someone who can vouch for you
            </Text>

            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Guarantor's Full Name"
              placeholderTextColor={colors.muted}
              value={guarantorName}
              onChangeText={setGuarantorName}
            />

            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Guarantor's Phone Number"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              value={guarantorPhone}
              onChangeText={setGuarantorPhone}
            />

            <View style={styles.relationshipContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Relationship</Text>
              <View style={styles.relationshipButtons}>
                {RELATIONSHIPS.map((rel) => (
                  <TouchableOpacity
                    key={rel}
                    style={[
                      styles.relationshipButton,
                      { borderColor: colors.border },
                      guarantorRelationship === rel && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => setGuarantorRelationship(rel)}
                  >
                    <Text style={{ color: guarantorRelationship === rel ? colors.primary : colors.text }}>
                      {rel.charAt(0).toUpperCase() + rel.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[styles.textAreaInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Guarantor's Address"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={guarantorAddress}
              onChangeText={setGuarantorAddress}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: guarantorName && guarantorPhone && guarantorAddress ? colors.primary : colors.muted }]}
              onPress={handleGuarantorSubmit}
              disabled={!guarantorName || !guarantorPhone || !guarantorAddress || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'code_of_conduct':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="document-text" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Code of Conduct</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Review and accept the HANDI Artisan Code of Conduct to maintain our trusted community standards.
            </Text>

            <View style={[styles.conductHighlights, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {[
                'Professional behavior at all times',
                'No theft, harassment, or misconduct',
                'No off-platform jobs',
                'Immediate incident reporting',
              ].map((item, index) => (
                <View key={index} style={styles.conductItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  <Text style={[styles.conductItemText, { color: colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={openCodeOfConduct}
            >
              <Text style={styles.primaryButtonText}>Read & Accept Code of Conduct</Text>
            </TouchableOpacity>
          </View>
        );

      case 'terms':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Review and accept the HANDI Terms of Service. By accepting, you acknowledge that:
            </Text>

            <View style={[styles.termsHighlights, { backgroundColor: colors.warningLight, borderColor: colors.secondary }]}>
              <Text style={[styles.termsHighlightText, { color: colors.text }]}>
                • You are an independent contractor{'\n'}
                • HANDI facilitates connections only{'\n'}
                • HANDI does not guarantee services{'\n'}
                • You are responsible for your work quality
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={openTerms}
            >
              <Text style={styles.primaryButtonText}>Read & Accept Terms</Text>
            </TouchableOpacity>
          </View>
        );

      case 'complete':
        return (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Verification Submitted!</Text>
            <Text style={[styles.stepDescription, { color: colors.muted }]}>
              Your verification documents are being reviewed. This usually takes 24-48 hours. We&apos;ll notify you once your account is verified.
            </Text>

            <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statusLabel, { color: colors.muted }]}>Status</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: colors.warningLight }]}>
                  <Text style={[styles.statusBadgeText, { color: colors.secondary }]}>Pending Review</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleComplete}
            >
              <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Bar */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <View style={styles.progressContainer}>
          <TouchableOpacity onPress={goToPreviousStep} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${getProgress()}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.muted }]}>
            {getCurrentStepIndex()}/{STEPS.length - 2}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Terms Modal */}
      <TermsModal
        visible={showTermsModal}
        agreement={currentAgreement}
        onAccept={currentStep === 'code_of_conduct' ? handleCodeOfConductAccept : handleTermsAccept}
        onClose={() => setShowTermsModal(false)}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  backButton: {
    padding: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  stepContent: {
    paddingTop: THEME.spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: THEME.spacing.lg,
  },
  stepTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  stepDescription: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: THEME.spacing.lg,
  },
  requirementsList: {
    marginBottom: THEME.spacing.xl,
  },
  requirementsTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  requirementText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    gap: 8,
    marginTop: THEME.spacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  otpInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: THEME.spacing.lg,
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: 'center',
    letterSpacing: 8,
  },
  resendLink: {
    alignSelf: 'center',
    marginTop: THEME.spacing.md,
  },
  resendText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  idTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  idTypeButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  idTypeText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  textInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.md,
  },
  textAreaInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: THEME.spacing.md,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    minHeight: 100,
    marginBottom: THEME.spacing.md,
  },
  idImagesContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  idImageBox: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  idImage: {
    width: '100%',
    height: '100%',
  },
  idImageLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
  selfieBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: THEME.spacing.lg,
    overflow: 'hidden',
  },
  selfieImage: {
    width: '100%',
    height: '100%',
  },
  selfieLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderRadius: 12,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  fieldLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xs,
  },
  relationshipContainer: {
    marginBottom: THEME.spacing.md,
  },
  relationshipButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
  },
  relationshipButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  conductHighlights: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  conductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  conductItemText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  termsHighlights: {
    padding: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: THEME.spacing.lg,
  },
  termsHighlightText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },
  statusCard: {
    padding: THEME.spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: THEME.spacing.lg,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  statusBadgeText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
