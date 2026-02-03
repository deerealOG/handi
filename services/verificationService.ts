// services/verificationService.ts
// Artisan verification, onboarding, and vetting service

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ArtisanVerificationData,
    ConductViolation,
    GovernmentID,
    Guarantor,
    IncidentFlag,
    ViolationSeverity,
    ViolationType
} from '../types/legal';
import { ApiResponse } from './api';

// Storage keys
const VERIFICATION_KEY = 'artisan_verifications';
const VIOLATIONS_KEY = 'conduct_violations';
const FLAGS_KEY = 'incident_flags';

// ================================
// Verification Service
// ================================
export const verificationService = {
  /**
   * Initialize verification record for new artisan
   */
  async initializeVerification(artisanId: string): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification: ArtisanVerificationData = {
        id: `ver_${Date.now()}`,
        artisanId,
        phoneVerified: false,
        emailVerified: false,
        homeAddress: '',
        homeAddressVerified: false,
        codeOfConductAccepted: false,
        termsAccepted: false,
        overallStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Verification initialized',
      };
    } catch (error) {
      return { success: false, error: 'Failed to initialize verification' };
    }
  },

  /**
   * Get artisan verification data
   */
  async getVerification(artisanId: string): Promise<ArtisanVerificationData | null> {
    try {
      const allJson = await AsyncStorage.getItem(VERIFICATION_KEY);
      const all: ArtisanVerificationData[] = allJson ? JSON.parse(allJson) : [];
      return all.find(v => v.artisanId === artisanId) || null;
    } catch {
      return null;
    }
  },

  /**
   * Upload government ID
   */
  async uploadGovernmentId(
    artisanId: string,
    idData: Omit<GovernmentID, 'uploadedAt' | 'verificationStatus'>
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.governmentId = {
        ...idData,
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'pending',
      };
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Government ID uploaded successfully. Pending verification.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to upload government ID' };
    }
  },

  /**
   * Upload live selfie
   */
  async uploadLiveSelfie(
    artisanId: string,
    imageUrl: string
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.liveSelfie = {
        imageUrl,
        capturedAt: new Date().toISOString(),
        verificationStatus: 'pending',
      };
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Selfie uploaded successfully. Pending verification.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to upload selfie' };
    }
  },

  /**
   * Add guarantor information
   */
  async addGuarantor(
    artisanId: string,
    guarantor: Omit<Guarantor, 'verified' | 'verifiedAt'>
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.guarantor = {
        ...guarantor,
        verified: false,
      };
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Guarantor information added.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to add guarantor' };
    }
  },

  /**
   * Update home address
   */
  async updateHomeAddress(
    artisanId: string,
    address: string
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.homeAddress = address;
      verification.homeAddressVerified = false; // Requires admin verification
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Home address updated.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to update address' };
    }
  },

  /**
   * Accept Code of Conduct
   */
  async acceptCodeOfConduct(artisanId: string): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.codeOfConductAccepted = true;
      verification.codeOfConductAcceptedAt = new Date().toISOString();
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Code of Conduct accepted.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to accept Code of Conduct' };
    }
  },

  /**
   * Accept Terms of Service
   */
  async acceptTerms(artisanId: string): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.termsAccepted = true;
      verification.termsAcceptedAt = new Date().toISOString();
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Terms accepted.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to accept terms' };
    }
  },

  /**
   * Mark phone as verified
   */
  async verifyPhone(artisanId: string): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.phoneVerified = true;
      verification.phoneVerifiedAt = new Date().toISOString();
      verification.updatedAt = new Date().toISOString();

      // Check if all requirements met for verified status
      await this.updateOverallStatus(verification);
      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Phone verified.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to verify phone' };
    }
  },

  /**
   * Mark email as verified
   */
  async verifyEmail(artisanId: string): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification record not found' };
      }

      verification.emailVerified = true;
      verification.emailVerifiedAt = new Date().toISOString();
      verification.updatedAt = new Date().toISOString();

      await this.updateOverallStatus(verification);
      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Email verified.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to verify email' };
    }
  },

  /**
   * Admin: Approve government ID
   */
  async approveGovernmentId(
    artisanId: string,
    adminId: string
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification || !verification.governmentId) {
        return { success: false, error: 'Verification or ID not found' };
      }

      verification.governmentId.verificationStatus = 'approved';
      verification.governmentId.verifiedAt = new Date().toISOString();
      verification.updatedAt = new Date().toISOString();

      await this.updateOverallStatus(verification);
      await this.saveVerification(verification);

      return {
        success: true,
        data: verification,
        message: 'Government ID approved.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to approve ID' };
    }
  },

  /**
   * Admin: Suspend artisan
   */
  async suspendArtisan(
    artisanId: string,
    reason: string,
    adminId: string
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification not found' };
      }

      verification.overallStatus = 'suspended';
      verification.suspendedAt = new Date().toISOString();
      verification.suspensionReason = reason;
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      // Create incident flag
      await this.createIncidentFlag(artisanId, 'artisan', 'suspension', reason, adminId);

      return {
        success: true,
        data: verification,
        message: 'Artisan suspended.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to suspend artisan' };
    }
  },

  /**
   * Admin: Ban artisan permanently
   */
  async banArtisan(
    artisanId: string,
    reason: string,
    adminId: string
  ): Promise<ApiResponse<ArtisanVerificationData>> {
    try {
      const verification = await this.getVerification(artisanId);
      if (!verification) {
        return { success: false, error: 'Verification not found' };
      }

      verification.overallStatus = 'banned';
      verification.bannedAt = new Date().toISOString();
      verification.banReason = reason;
      verification.updatedAt = new Date().toISOString();

      await this.saveVerification(verification);

      // Create incident flag
      await this.createIncidentFlag(artisanId, 'artisan', 'ban', reason, adminId);

      return {
        success: true,
        data: verification,
        message: 'Artisan permanently banned.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to ban artisan' };
    }
  },

  /**
   * Record a conduct violation
   */
  async recordViolation(
    artisanId: string,
    violation: {
      type: ViolationType;
      severity: ViolationSeverity;
      description: string;
      bookingId?: string;
      disputeId?: string;
    },
    adminId: string
  ): Promise<ApiResponse<ConductViolation>> {
    try {
      // Determine action based on severity
      let action: ConductViolation['action'];
      switch (violation.severity) {
        case 'minor':
          action = 'warning';
          break;
        case 'moderate':
          action = 'suspension';
          break;
        case 'severe':
          action = 'permanent_ban';
          break;
        case 'criminal':
          action = 'refer_authorities';
          break;
      }

      const record: ConductViolation = {
        id: `violation_${Date.now()}`,
        artisanId,
        bookingId: violation.bookingId,
        disputeId: violation.disputeId,
        type: violation.type,
        severity: violation.severity,
        description: violation.description,
        action,
        actionTakenAt: new Date().toISOString(),
        actionTakenBy: adminId,
        createdAt: new Date().toISOString(),
      };

      // Store violation
      const existingJson = await AsyncStorage.getItem(VIOLATIONS_KEY);
      const existing: ConductViolation[] = existingJson ? JSON.parse(existingJson) : [];
      existing.push(record);
      await AsyncStorage.setItem(VIOLATIONS_KEY, JSON.stringify(existing));

      // Apply action
      if (action === 'suspension') {
        await this.suspendArtisan(artisanId, violation.description, adminId);
      } else if (action === 'permanent_ban' || action === 'refer_authorities') {
        await this.banArtisan(artisanId, violation.description, adminId);
      }

      return {
        success: true,
        data: record,
        message: `Violation recorded. Action: ${action}`,
      };
    } catch (error) {
      return { success: false, error: 'Failed to record violation' };
    }
  },

  /**
   * Get artisan violations history
   */
  async getViolations(artisanId: string): Promise<ConductViolation[]> {
    try {
      const existingJson = await AsyncStorage.getItem(VIOLATIONS_KEY);
      const existing: ConductViolation[] = existingJson ? JSON.parse(existingJson) : [];
      return existing.filter(v => v.artisanId === artisanId);
    } catch {
      return [];
    }
  },

  /**
   * Create incident flag
   */
  async createIncidentFlag(
    userId: string,
    userType: 'client' | 'artisan',
    flagType: IncidentFlag['flagType'],
    reason: string,
    createdBy: string,
    relatedDisputeId?: string
  ): Promise<IncidentFlag> {
    const flag: IncidentFlag = {
      id: `flag_${Date.now()}`,
      userId,
      userType,
      flagType,
      reason,
      relatedDisputeId,
      createdBy,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const existingJson = await AsyncStorage.getItem(FLAGS_KEY);
    const existing: IncidentFlag[] = existingJson ? JSON.parse(existingJson) : [];
    existing.push(flag);
    await AsyncStorage.setItem(FLAGS_KEY, JSON.stringify(existing));

    return flag;
  },

  /**
   * Get user's incident flags (admin only)
   */
  async getIncidentFlags(userId: string): Promise<IncidentFlag[]> {
    try {
      const existingJson = await AsyncStorage.getItem(FLAGS_KEY);
      const existing: IncidentFlag[] = existingJson ? JSON.parse(existingJson) : [];
      return existing.filter(f => f.userId === userId && f.isActive);
    } catch {
      return [];
    }
  },

  /**
   * Calculate verification progress percentage
   */
  getVerificationProgress(verification: ArtisanVerificationData): number {
    const steps = [
      verification.phoneVerified,
      verification.emailVerified,
      verification.governmentId?.verificationStatus === 'approved',
      verification.liveSelfie?.verificationStatus === 'approved',
      verification.homeAddress.length > 0,
      verification.guarantor?.fullName.length > 0,
      verification.codeOfConductAccepted,
      verification.termsAccepted,
    ];
    
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  },

  /**
   * Check if artisan is allowed to accept jobs
   */
  async canAcceptJobs(artisanId: string): Promise<{ allowed: boolean; reason?: string }> {
    const verification = await this.getVerification(artisanId);
    
    if (!verification) {
      return { allowed: false, reason: 'Verification not found' };
    }

    if (verification.overallStatus === 'banned') {
      return { allowed: false, reason: 'Account permanently banned' };
    }

    if (verification.overallStatus === 'suspended') {
      return { allowed: false, reason: 'Account temporarily suspended' };
    }

    if (verification.overallStatus === 'pending') {
      return { allowed: false, reason: 'Verification incomplete' };
    }

    return { allowed: true };
  },

  // ================================
  // Private Helpers
  // ================================
  
  async updateOverallStatus(verification: ArtisanVerificationData): Promise<void> {
    // Check if all required verifications are complete
    const isComplete = 
      verification.phoneVerified &&
      verification.emailVerified &&
      verification.governmentId?.verificationStatus === 'approved' &&
      verification.liveSelfie?.verificationStatus === 'approved' &&
      verification.codeOfConductAccepted &&
      verification.termsAccepted;

    if (isComplete && verification.overallStatus === 'pending') {
      verification.overallStatus = 'verified';
    }
  },

  async saveVerification(verification: ArtisanVerificationData): Promise<void> {
    const allJson = await AsyncStorage.getItem(VERIFICATION_KEY);
    const all: ArtisanVerificationData[] = allJson ? JSON.parse(allJson) : [];
    
    const index = all.findIndex(v => v.artisanId === verification.artisanId);
    if (index >= 0) {
      all[index] = verification;
    } else {
      all.push(verification);
    }
    
    await AsyncStorage.setItem(VERIFICATION_KEY, JSON.stringify(all));
  },
};

export default verificationService;
