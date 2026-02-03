// types/legal.ts
// Legal, Verification, Dispute, and Escrow type definitions for HANDI marketplace

// ================================
// Verification & Onboarding Types
// ================================
export type VerificationStatus = 'pending' | 'verified' | 'suspended' | 'banned';

export interface GovernmentID {
  type: 'national_id' | 'drivers_license' | 'international_passport' | 'voters_card';
  number: string;
  frontImageUrl: string;
  backImageUrl?: string;
  expiryDate?: string;
  uploadedAt: string;
  verifiedAt?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface LiveSelfie {
  imageUrl: string;
  capturedAt: string;
  matchScore?: number; // AI face match score against ID photo
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

export interface Guarantor {
  fullName: string;
  phone: string;
  email?: string;
  relationship: 'family' | 'friend' | 'employer' | 'colleague' | 'other';
  address: string;
  occupation?: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface ArtisanVerificationData {
  id: string;
  artisanId: string;
  governmentId?: GovernmentID;
  liveSelfie?: LiveSelfie;
  phoneVerified: boolean;
  phoneVerifiedAt?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  homeAddress: string;
  homeAddressVerified: boolean;
  guarantor?: Guarantor;
  codeOfConductAccepted: boolean;
  codeOfConductAcceptedAt?: string;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  overallStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  suspendedAt?: string;
  suspensionReason?: string;
  bannedAt?: string;
  banReason?: string;
}

// ================================
// Terms & Agreements Types
// ================================
export type AgreementType = 
  | 'terms_of_service'
  | 'privacy_policy'
  | 'artisan_code_of_conduct'
  | 'marketplace_disclaimer'
  | 'booking_terms'
  | 'payment_terms';

export interface TermsAgreement {
  id: string;
  type: AgreementType;
  version: string;
  title: string;
  content: string;
  effectiveDate: string;
  isActive: boolean;
}

export interface UserAgreementAcceptance {
  id: string;
  userId: string;
  userType: 'client' | 'artisan';
  agreementType: AgreementType;
  agreementVersion: string;
  acceptedAt: string;
  ipAddress?: string;
  deviceInfo?: string;
}

// ================================
// Dispute Types
// ================================
export type DisputeType = 
  | 'property_damage'
  | 'theft'
  | 'misconduct'
  | 'harassment'
  | 'poor_service'
  | 'no_show'
  | 'unauthorized_charges'
  | 'other';

export type DisputeStatus = 
  | 'submitted'
  | 'under_review'
  | 'awaiting_response'
  | 'resolved'
  | 'escalated'
  | 'closed'
  | 'referred_to_authorities';

export type DisputeResolution =
  | 'no_violation'
  | 'warning_issued'
  | 'artisan_suspended'
  | 'artisan_banned'
  | 'client_warning'
  | 'mutual_resolution'
  | 'referred_to_authorities'
  | 'insufficient_evidence';

export interface DisputeEvidence {
  id: string;
  type: 'photo' | 'video' | 'document' | 'audio';
  url: string;
  description?: string;
  uploadedAt: string;
  uploadedBy: 'client' | 'artisan' | 'admin';
}

export interface DisputeNote {
  id: string;
  content: string;
  createdBy: string;
  createdByRole: 'client' | 'artisan' | 'admin';
  createdAt: string;
  isInternal: boolean; // Internal notes only visible to admin
}

export interface Dispute {
  id: string;
  bookingId: string;
  clientId: string;
  artisanId: string;
  type: DisputeType;
  description: string;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  resolutionNotes?: string;
  evidence: DisputeEvidence[];
  notes: DisputeNote[];
  reportedAt: string;
  reportedWithinWindow: boolean; // Within 24-48 hours
  reviewedAt?: string;
  reviewedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  escalatedAt?: string;
  escalatedReason?: string;
  payoutFrozen: boolean;
  payoutFrozenAt?: string;
  // Admin tracking
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

// ================================
// Escrow & Payout Types
// ================================
export type EscrowStatus = 
  | 'pending'           // Payment received, held in escrow
  | 'released'          // Released to artisan
  | 'frozen'            // Frozen due to dispute
  | 'cancelled'         // Booking cancelled, refund processed
  | 'partially_released';

export interface EscrowTransaction {
  id: string;
  bookingId: string;
  clientId: string;
  artisanId: string;
  amount: number;
  platformFee: number;
  artisanPayout: number;
  currency: string;
  status: EscrowStatus;
  paymentReceivedAt: string;
  jobCompletedAt?: string;
  reviewWindowEndsAt?: string; // 24-48 hours after completion
  releaseEligibleAt?: string;
  releasedAt?: string;
  frozenAt?: string;
  frozenReason?: string;
  disputeId?: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Code of Conduct Types
// ================================
export type ViolationType =
  | 'theft'
  | 'harassment'
  | 'misconduct'
  | 'off_platform_job'
  | 'unauthorized_visitor'
  | 'no_incident_report'
  | 'property_damage'
  | 'unprofessional_behavior'
  | 'fraud'
  | 'other';

export type ViolationSeverity = 'minor' | 'moderate' | 'severe' | 'criminal';

export interface ConductViolation {
  id: string;
  artisanId: string;
  bookingId?: string;
  disputeId?: string;
  type: ViolationType;
  severity: ViolationSeverity;
  description: string;
  evidence?: DisputeEvidence[];
  action: 'warning' | 'suspension' | 'permanent_ban' | 'refer_authorities';
  actionTakenAt: string;
  actionTakenBy: string;
  suspensionEndDate?: string; // For temporary suspensions
  notes?: string;
  createdAt: string;
}

// ================================
// Incident Flags (Admin-only)
// ================================
export interface IncidentFlag {
  id: string;
  userId: string;
  userType: 'client' | 'artisan';
  flagType: 'warning' | 'suspension' | 'ban' | 'investigation';
  reason: string;
  relatedDisputeId?: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string; // For temporary flags
  isActive: boolean;
}

// ================================
// Future-Ready Placeholders
// ================================
export interface InsuranceIntegration {
  _placeholder: true;
  enabled: false;
  provider?: string;
  plans?: never[];
}

export interface SecurityDeposit {
  _placeholder: true;
  enabled: false;
  amount?: number;
}

export interface ProtectionPlan {
  _placeholder: true;
  enabled: false;
  tiers?: never[];
}

// ================================
// Legal Copy Constants
// ================================
export const LEGAL_DISCLAIMERS = {
  MARKETPLACE_ONLY: "HANDI facilitates connections and payments only.",
  INDEPENDENT_CONTRACTORS: "Artisans are independent service providers, not HANDI employees.",
  NO_INSURANCE: "HANDI does not insure or guarantee services.",
  CLIENT_DISCRETION: "All services are provided at the client's discretion.",
  NO_COMPENSATION: "HANDI does not provide compensation but may assist with documentation and cooperation if authorities are involved.",
  NO_GUARANTEE: "HANDI does not guarantee artisan behavior, service quality, or outcomes.",
  GOODWILL_DISCRETIONARY: "Any goodwill actions taken by HANDI are discretionary and non-binding.",
};

// Words to AVOID in UI
export const FORBIDDEN_TERMS = [
  'insurance',
  'coverage', 
  'guarantee',
  'compensation',
  'refund',
  'reimbursement',
  'claim',
  'liability',
];
