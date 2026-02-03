// services/disputeService.ts
// Dispute handling and resolution service

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Dispute,
    DisputeEvidence,
    DisputeNote,
    DisputeResolution,
    DisputeStatus,
    DisputeType,
    LEGAL_DISCLAIMERS,
} from '../types/legal';
import { ApiResponse } from './api';
import { escrowService } from './escrowService';

// Storage key
const DISPUTES_KEY = 'disputes';

// Dispute window in hours (24-48 hours)
const DISPUTE_WINDOW_HOURS = 48;

// ================================
// Mock Dispute Data for Demo
// ================================
const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'dispute_001',
    bookingId: 'booking_101',
    clientId: 'user_001',
    artisanId: 'artisan_001',
    type: 'property_damage',
    description: 'The technician accidentally damaged my kitchen cabinet while installing the AC unit. There is a large scratch and dent on the cabinet door.',
    status: 'submitted',
    evidence: [
      { id: 'ev_001', type: 'photo', url: 'https://example.com/damage1.jpg', uploadedAt: '2024-12-13T10:00:00Z', uploadedBy: 'client' }
    ],
    notes: [],
    reportedAt: '2024-12-13T14:30:00Z',
    reportedWithinWindow: true,
    payoutFrozen: true,
    payoutFrozenAt: '2024-12-13T14:30:00Z',
    priority: 'high',
    createdAt: '2024-12-13T14:30:00Z',
    updatedAt: '2024-12-13T14:30:00Z',
  },
  {
    id: 'dispute_002',
    bookingId: 'booking_102',
    clientId: 'user_002',
    artisanId: 'artisan_002',
    type: 'poor_service',
    description: 'The plumber fixed the leak but left the bathroom in a mess. Water and debris everywhere. Work was incomplete.',
    status: 'under_review',
    evidence: [],
    notes: [
      { id: 'note_001', content: 'Contacted artisan for response', createdBy: 'admin_001', createdByRole: 'admin', createdAt: '2024-12-12T16:00:00Z', isInternal: true }
    ],
    reportedAt: '2024-12-12T11:00:00Z',
    reportedWithinWindow: true,
    payoutFrozen: false,
    priority: 'medium',
    reviewedAt: '2024-12-12T15:00:00Z',
    reviewedBy: 'admin_001',
    createdAt: '2024-12-12T11:00:00Z',
    updatedAt: '2024-12-12T16:00:00Z',
  },
  {
    id: 'dispute_003',
    bookingId: 'booking_103',
    clientId: 'user_003',
    artisanId: 'artisan_003',
    type: 'theft',
    description: 'My gold necklace went missing from the bedroom after the cleaner left. I am certain it was there before the service.',
    status: 'escalated',
    evidence: [
      { id: 'ev_002', type: 'photo', url: 'https://example.com/cctv.jpg', uploadedAt: '2024-12-11T18:00:00Z', uploadedBy: 'client' }
    ],
    notes: [],
    reportedAt: '2024-12-11T17:00:00Z',
    reportedWithinWindow: true,
    payoutFrozen: true,
    payoutFrozenAt: '2024-12-11T17:00:00Z',
    priority: 'critical',
    escalatedAt: '2024-12-11T20:00:00Z',
    escalatedReason: 'Potential criminal activity',
    createdAt: '2024-12-11T17:00:00Z',
    updatedAt: '2024-12-11T20:00:00Z',
  },
  {
    id: 'dispute_004',
    bookingId: 'booking_104',
    clientId: 'user_004',
    artisanId: 'artisan_004',
    type: 'no_show',
    description: 'The artisan never showed up for the scheduled appointment. No call, no message.',
    status: 'resolved',
    resolution: 'warning_issued',
    resolutionNotes: 'First offense. Warning issued to artisan.',
    evidence: [],
    notes: [],
    reportedAt: '2024-12-10T09:00:00Z',
    reportedWithinWindow: true,
    payoutFrozen: false,
    priority: 'low',
    resolvedAt: '2024-12-10T14:00:00Z',
    resolvedBy: 'admin_001',
    createdAt: '2024-12-10T09:00:00Z',
    updatedAt: '2024-12-10T14:00:00Z',
  },
  {
    id: 'dispute_005',
    bookingId: 'booking_105',
    clientId: 'user_005',
    artisanId: 'artisan_005',
    type: 'misconduct',
    description: 'The artisan was rude and unprofessional. Used inappropriate language when I asked about the delay.',
    status: 'submitted',
    evidence: [],
    notes: [],
    reportedAt: '2024-12-13T16:00:00Z',
    reportedWithinWindow: true,
    payoutFrozen: true,
    payoutFrozenAt: '2024-12-13T16:00:00Z',
    priority: 'high',
    createdAt: '2024-12-13T16:00:00Z',
    updatedAt: '2024-12-13T16:00:00Z',
  },
];

// ================================
// Dispute Service
// ================================
export const disputeService = {
  /**
   * Seed mock dispute data for demo
   */
  async seedMockData(): Promise<void> {
    const existing = await this.getAllDisputes();
    if (existing.length === 0) {
      await AsyncStorage.setItem(DISPUTES_KEY, JSON.stringify(MOCK_DISPUTES));
    }
  },

  /**
   * File a new dispute
   */
  async fileDispute(
    clientId: string,
    bookingId: string,
    artisanId: string,
    type: DisputeType,
    description: string,
    evidence?: DisputeEvidence[]
  ): Promise<ApiResponse<Dispute>> {
    try {
      // Check if within dispute window
      const booking = await this.getBookingCompletionTime(bookingId);
      const withinWindow = this.isWithinDisputeWindow(booking?.completedAt);

      const dispute: Dispute = {
        id: `dispute_${Date.now()}`,
        bookingId,
        clientId,
        artisanId,
        type,
        description,
        status: 'submitted',
        evidence: evidence || [],
        notes: [],
        reportedAt: new Date().toISOString(),
        reportedWithinWindow: withinWindow,
        payoutFrozen: false,
        priority: this.determinePriority(type),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Auto-freeze payout for serious disputes
      if (['theft', 'harassment', 'misconduct', 'property_damage'].includes(type)) {
        dispute.payoutFrozen = true;
        dispute.payoutFrozenAt = new Date().toISOString();
        
        // Freeze escrow
        await escrowService.freezeEscrow(bookingId, dispute.id, `Dispute filed: ${type}`);
      }

      await this.saveDispute(dispute);

      return {
        success: true,
        data: dispute,
        message: withinWindow 
          ? 'Dispute submitted successfully. Our team will review within 24-48 hours.'
          : 'Dispute submitted. Note: This was filed outside the standard window and may affect review.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to file dispute' };
    }
  },

  /**
   * Get all disputes for a user
   */
  async getDisputesByUser(userId: string, role: 'client' | 'artisan'): Promise<Dispute[]> {
    try {
      const all = await this.getAllDisputes();
      return all.filter(d => 
        role === 'client' ? d.clientId === userId : d.artisanId === userId
      );
    } catch {
      return [];
    }
  },

  /**
   * Get dispute by ID
   */
  async getDispute(disputeId: string): Promise<Dispute | null> {
    try {
      const all = await this.getAllDisputes();
      return all.find(d => d.id === disputeId) || null;
    } catch {
      return null;
    }
  },

  /**
   * Get all disputes (admin)
   */
  async getAllDisputes(): Promise<Dispute[]> {
    try {
      const existingJson = await AsyncStorage.getItem(DISPUTES_KEY);
      return existingJson ? JSON.parse(existingJson) : [];
    } catch {
      return [];
    }
  },

  /**
   * Get disputes by status (admin filtering)
   */
  async getDisputesByStatus(status: DisputeStatus): Promise<Dispute[]> {
    const all = await this.getAllDisputes();
    return all.filter(d => d.status === status);
  },

  /**
   * Add evidence to dispute
   */
  async addEvidence(
    disputeId: string,
    evidence: Omit<DisputeEvidence, 'id' | 'uploadedAt'>,
    uploadedBy: 'client' | 'artisan' | 'admin'
  ): Promise<ApiResponse<Dispute>> {
    try {
      const dispute = await this.getDispute(disputeId);
      if (!dispute) {
        return { success: false, error: 'Dispute not found' };
      }

      const newEvidence: DisputeEvidence = {
        id: `evidence_${Date.now()}`,
        ...evidence,
        uploadedAt: new Date().toISOString(),
        uploadedBy,
      };

      dispute.evidence.push(newEvidence);
      dispute.updatedAt = new Date().toISOString();

      await this.saveDispute(dispute);

      return {
        success: true,
        data: dispute,
        message: 'Evidence added successfully.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to add evidence' };
    }
  },

  /**
   * Add note to dispute
   */
  async addNote(
    disputeId: string,
    content: string,
    createdBy: string,
    createdByRole: 'client' | 'artisan' | 'admin',
    isInternal: boolean = false
  ): Promise<ApiResponse<Dispute>> {
    try {
      const dispute = await this.getDispute(disputeId);
      if (!dispute) {
        return { success: false, error: 'Dispute not found' };
      }

      const note: DisputeNote = {
        id: `note_${Date.now()}`,
        content,
        createdBy,
        createdByRole,
        createdAt: new Date().toISOString(),
        isInternal,
      };

      dispute.notes.push(note);
      dispute.updatedAt = new Date().toISOString();

      await this.saveDispute(dispute);

      return {
        success: true,
        data: dispute,
        message: 'Note added.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to add note' };
    }
  },

  /**
   * Admin: Update dispute status
   */
  async updateStatus(
    disputeId: string,
    status: DisputeStatus,
    adminId: string
  ): Promise<ApiResponse<Dispute>> {
    try {
      const dispute = await this.getDispute(disputeId);
      if (!dispute) {
        return { success: false, error: 'Dispute not found' };
      }

      dispute.status = status;
      dispute.updatedAt = new Date().toISOString();

      if (status === 'under_review' && !dispute.reviewedAt) {
        dispute.reviewedAt = new Date().toISOString();
        dispute.reviewedBy = adminId;
      }

      if (status === 'escalated') {
        dispute.escalatedAt = new Date().toISOString();
        dispute.priority = 'critical';
      }

      await this.saveDispute(dispute);

      return {
        success: true,
        data: dispute,
        message: `Dispute status updated to ${status}.`,
      };
    } catch (error) {
      return { success: false, error: 'Failed to update status' };
    }
  },

  /**
   * Admin: Assign dispute to admin
   */
  async assignDispute(
    disputeId: string,
    adminId: string
  ): Promise<ApiResponse<Dispute>> {
    try {
      const dispute = await this.getDispute(disputeId);
      if (!dispute) {
        return { success: false, error: 'Dispute not found' };
      }

      dispute.assignedTo = adminId;
      dispute.status = 'under_review';
      dispute.reviewedAt = dispute.reviewedAt || new Date().toISOString();
      dispute.reviewedBy = adminId;
      dispute.updatedAt = new Date().toISOString();

      await this.saveDispute(dispute);

      return {
        success: true,
        data: dispute,
        message: 'Dispute assigned.',
      };
    } catch (error) {
      return { success: false, error: 'Failed to assign dispute' };
    }
  },

  /**
   * Admin: Resolve dispute
   */
  async resolveDispute(
    disputeId: string,
    resolution: DisputeResolution,
    resolutionNotes: string,
    adminId: string
  ): Promise<ApiResponse<Dispute>> {
    try {
      const dispute = await this.getDispute(disputeId);
      if (!dispute) {
        return { success: false, error: 'Dispute not found' };
      }

      dispute.status = resolution === 'referred_to_authorities' ? 'referred_to_authorities' : 'resolved';
      dispute.resolution = resolution;
      dispute.resolutionNotes = resolutionNotes;
      dispute.resolvedAt = new Date().toISOString();
      dispute.resolvedBy = adminId;
      dispute.updatedAt = new Date().toISOString();

      // Handle payout based on resolution
      if (resolution === 'no_violation') {
        // Release payout to artisan
        dispute.payoutFrozen = false;
        await escrowService.releaseEscrow(dispute.bookingId, adminId);
      } else if (['artisan_suspended', 'artisan_banned', 'referred_to_authorities'].includes(resolution)) {
        // Keep payout frozen - do NOT redistribute to client
        // This is critical for legal protection
        dispute.payoutFrozen = true;
      } else {
        // Other resolutions - release payout
        dispute.payoutFrozen = false;
        await escrowService.releaseEscrow(dispute.bookingId, adminId);
      }

      await this.saveDispute(dispute);

      // Add automatic resolution note
      await this.addNote(
        disputeId,
        `Dispute resolved: ${resolution}. ${LEGAL_DISCLAIMERS.NO_COMPENSATION}`,
        adminId,
        'admin',
        false
      );

      return {
        success: true,
        data: dispute,
        message: this.getResolutionMessage(resolution),
      };
    } catch (error) {
      return { success: false, error: 'Failed to resolve dispute' };
    }
  },

  /**
   * Admin: Escalate to authorities
   */
  async escalateToAuthorities(
    disputeId: string,
    reason: string,
    adminId: string
  ): Promise<ApiResponse<Dispute>> {
    return this.resolveDispute(
      disputeId,
      'referred_to_authorities',
      `Referred to authorities: ${reason}. ${LEGAL_DISCLAIMERS.NO_COMPENSATION}`,
      adminId
    );
  },

  /**
   * Get dispute statistics (admin dashboard)
   */
  async getDisputeStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    escalated: number;
    byType: Record<DisputeType, number>;
  }> {
    const all = await this.getAllDisputes();
    
    const byType: Record<string, number> = {};
    all.forEach(d => {
      byType[d.type] = (byType[d.type] || 0) + 1;
    });

    return {
      total: all.length,
      pending: all.filter(d => d.status === 'submitted').length,
      underReview: all.filter(d => d.status === 'under_review').length,
      resolved: all.filter(d => ['resolved', 'closed'].includes(d.status)).length,
      escalated: all.filter(d => ['escalated', 'referred_to_authorities'].includes(d.status)).length,
      byType: byType as Record<DisputeType, number>,
    };
  },

  // ================================
  // Private Helpers
  // ================================

  determinePriority(type: DisputeType): Dispute['priority'] {
    switch (type) {
      case 'theft':
      case 'harassment':
        return 'critical';
      case 'misconduct':
      case 'property_damage':
        return 'high';
      case 'poor_service':
      case 'unauthorized_charges':
        return 'medium';
      default:
        return 'low';
    }
  },

  isWithinDisputeWindow(completedAt?: string): boolean {
    if (!completedAt) return true; // If no completion time, allow dispute
    
    const completionTime = new Date(completedAt).getTime();
    const now = Date.now();
    const windowMs = DISPUTE_WINDOW_HOURS * 60 * 60 * 1000;
    
    return (now - completionTime) <= windowMs;
  },

  async getBookingCompletionTime(bookingId: string): Promise<{ completedAt?: string } | null> {
    // Mock - would integrate with booking service
    return { completedAt: undefined };
  },

  getResolutionMessage(resolution: DisputeResolution): string {
    const messages: Record<DisputeResolution, string> = {
      no_violation: 'No violation found. Payout released to artisan.',
      warning_issued: 'Warning issued to artisan. This has been recorded.',
      artisan_suspended: 'Artisan account has been suspended pending further review.',
      artisan_banned: 'Artisan account has been permanently banned from the platform.',
      client_warning: 'Advisory issued to client.',
      mutual_resolution: 'Both parties have reached a resolution.',
      referred_to_authorities: `This matter has been documented and marked for authority referral. ${LEGAL_DISCLAIMERS.NO_COMPENSATION}`,
      insufficient_evidence: 'Unable to determine outcome due to insufficient evidence.',
    };
    return messages[resolution];
  },

  async saveDispute(dispute: Dispute): Promise<void> {
    const all = await this.getAllDisputes();
    const index = all.findIndex(d => d.id === dispute.id);
    
    if (index >= 0) {
      all[index] = dispute;
    } else {
      all.push(dispute);
    }
    
    await AsyncStorage.setItem(DISPUTES_KEY, JSON.stringify(all));
  },
};

export default disputeService;
