// services/legalService.ts
// Legal agreements, terms acceptance, and compliance service

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    AgreementType,
    LEGAL_DISCLAIMERS,
    TermsAgreement,
    UserAgreementAcceptance
} from '../types/legal';
import { ApiResponse } from './api';

// Storage keys
const AGREEMENTS_KEY = 'legal_agreements';
const ACCEPTANCES_KEY = 'agreement_acceptances';

// ================================
// Terms & Agreement Content
// ================================
const TERMS_CONTENT: Record<AgreementType, { title: string; content: string }> = {
  terms_of_service: {
    title: 'Terms of Service',
    content: `
HANDI TERMS OF SERVICE
Last Updated: December 2024

1. ACCEPTANCE OF TERMS
By accessing or using the HANDI platform, you agree to be bound by these Terms of Service.

2. PLATFORM DESCRIPTION
HANDI is a technology platform that connects clients seeking services with independent service providers ("Artisans"). ${LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}

3. RELATIONSHIP BETWEEN PARTIES
${LEGAL_DISCLAIMERS.INDEPENDENT_CONTRACTORS} HANDI is not an employer, agent, or partner of any Artisan. HANDI does not control, direct, or supervise Artisans or their work.

4. NO WARRANTIES OR GUARANTEES
${LEGAL_DISCLAIMERS.NO_GUARANTEE} ${LEGAL_DISCLAIMERS.NO_INSURANCE}

5. LIMITATION OF LIABILITY
HANDI's liability is limited to the platform services only. HANDI is not liable for:
- Acts or omissions of Artisans
- Quality of services provided
- Property damage or loss
- Personal injury
- Criminal acts by users

6. DISPUTE RESOLUTION
HANDI provides a dispute reporting system to facilitate communication between parties. ${LEGAL_DISCLAIMERS.NO_COMPENSATION}

7. PAYMENT TERMS
All payments are processed through HANDI's escrow system. Release of funds is subject to job completion and review period.

8. ACCOUNT TERMINATION
HANDI reserves the right to suspend or terminate accounts for violations of these terms or the Code of Conduct.

9. GOVERNING LAW
These terms are governed by the laws of the Federal Republic of Nigeria.
    `.trim()
  },
  
  privacy_policy: {
    title: 'Privacy Policy',
    content: `
HANDI PRIVACY POLICY
Last Updated: December 2024

1. INFORMATION WE COLLECT
We collect personal information including name, contact details, identification documents, and location data.

2. HOW WE USE INFORMATION
- To facilitate service bookings
- To verify user identity
- To process payments
- To resolve disputes
- To improve our services

3. INFORMATION SHARING
We may share information:
- With Artisans/Clients for service delivery
- With law enforcement if required
- With payment processors
- As required by law

4. DATA SECURITY
We implement industry-standard security measures to protect your data.

5. YOUR RIGHTS
You have the right to access, correct, or delete your personal information.

6. CONTACT
For privacy inquiries, contact privacy@handi.ng
    `.trim()
  },

  artisan_code_of_conduct: {
    title: 'Artisan Code of Conduct',
    content: `
HANDI ARTISAN CODE OF CONDUCT
Effective: December 2024

As a HANDI Artisan, you agree to the following standards:

1. PROFESSIONAL BEHAVIOR
- Arrive on time for scheduled appointments
- Maintain professional appearance and demeanor
- Communicate clearly and respectfully with clients
- Complete work to agreed specifications

2. PROHIBITED CONDUCT
The following actions are strictly prohibited and may result in immediate account termination:

❌ THEFT - Taking any client property without permission
❌ HARASSMENT - Any form of sexual, verbal, or physical harassment
❌ MISCONDUCT - Inappropriate behavior in client's premises
❌ OFF-PLATFORM JOBS - Soliciting or accepting jobs outside HANDI
❌ UNAUTHORIZED VISITORS - Bringing uninvited persons to job sites
❌ FRAUD - Misrepresenting qualifications or services

3. INCIDENT REPORTING
You must immediately report:
- Accidents or injuries
- Property damage
- Safety concerns
- Any incidents during service

4. ENFORCEMENT
Violations will result in:
- First minor offense: Written warning
- Second offense: Temporary suspension
- Severe offense: Permanent ban
- Criminal activity: Account termination + referral to authorities

5. ACKNOWLEDGMENT
By accepting this Code of Conduct, you confirm you understand these requirements and agree to comply fully.
    `.trim()
  },

  marketplace_disclaimer: {
    title: 'Marketplace Disclaimer',
    content: `
HANDI MARKETPLACE DISCLAIMER

IMPORTANT: PLEASE READ CAREFULLY

${LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}

HANDI DOES NOT:
• Employ Artisans - ${LEGAL_DISCLAIMERS.INDEPENDENT_CONTRACTORS}
• Guarantee Services - ${LEGAL_DISCLAIMERS.NO_GUARANTEE}
• Provide Insurance - ${LEGAL_DISCLAIMERS.NO_INSURANCE}
• Offer Compensation - ${LEGAL_DISCLAIMERS.NO_COMPENSATION}

YOUR RESPONSIBILITY:
${LEGAL_DISCLAIMERS.CLIENT_DISCRETION} You are responsible for:
• Verifying Artisan qualifications for your needs
• Supervising work in your premises
• Securing valuables during service visits
• Reporting issues promptly through the platform

GOODWILL ACTIONS:
${LEGAL_DISCLAIMERS.GOODWILL_DISCRETIONARY}

By using HANDI, you acknowledge and accept these terms.
    `.trim()
  },

  booking_terms: {
    title: 'Booking Terms & Conditions',
    content: `
HANDI BOOKING TERMS

1. BOOKING CONFIRMATION
By confirming a booking, you agree to:
- Pay the quoted service fee
- Provide accurate location and contact information
- Be available at the scheduled time
- Allow the Artisan access to perform the service

2. PAYMENT & ESCROW
- Payment is held in escrow until job completion
- Artisan payout occurs after review window (24-48 hours)
- Disputes may freeze payouts pending resolution

3. CANCELLATION
- Cancellations must be made through the platform
- Cancellation policies vary by service type
- No-shows may affect your account standing

4. SERVICE DELIVERY
${LEGAL_DISCLAIMERS.MARKETPLACE_ONLY}
${LEGAL_DISCLAIMERS.NO_GUARANTEE}

5. DISPUTE WINDOW
- Report issues within 24-48 hours of service completion
- Provide evidence (photos/videos) when applicable
- HANDI will review but does not provide compensation

6. ACKNOWLEDGMENT
□ I understand HANDI is a marketplace, not a service provider
□ I understand Artisans are independent contractors
□ I understand HANDI does not guarantee or insure services
    `.trim()
  },

  payment_terms: {
    title: 'Payment Terms',
    content: `
HANDI PAYMENT TERMS

1. PAYMENT PROCESSING
All payments are processed securely through HANDI's platform.

2. ESCROW SYSTEM
- Client payments are held in escrow
- Funds are released to Artisans after service completion
- A review window of 24-48 hours applies before release

3. PLATFORM FEES
HANDI charges a service fee for marketplace facilitation.

4. PAYOUT HOLDS
Payouts may be frozen if:
- A dispute is filed
- Suspicious activity is detected
- Verification issues arise

5. NO REFUND GUARANTEE
${LEGAL_DISCLAIMERS.NO_COMPENSATION}
HANDI does not redistribute funds between parties.

6. DISPUTE IMPACT
- Disputed payments remain frozen during review
- Resolution determines fund release
- HANDI does not provide financial compensation
    `.trim()
  }
};

// ================================
// Legal Service
// ================================
export const legalService = {
  /**
   * Get all active terms and agreements
   */
  async getTerms(): Promise<TermsAgreement[]> {
    const terms: TermsAgreement[] = Object.entries(TERMS_CONTENT).map(([type, data]) => ({
      id: `terms_${type}`,
      type: type as AgreementType,
      version: '1.0.0',
      title: data.title,
      content: data.content,
      effectiveDate: '2024-12-01',
      isActive: true,
    }));
    return terms;
  },

  /**
   * Get a specific agreement by type
   */
  async getAgreement(type: AgreementType): Promise<TermsAgreement | null> {
    const data = TERMS_CONTENT[type];
    if (!data) return null;
    
    return {
      id: `terms_${type}`,
      type,
      version: '1.0.0',
      title: data.title,
      content: data.content,
      effectiveDate: '2024-12-01',
      isActive: true,
    };
  },

  /**
   * Record user acceptance of an agreement
   */
  async acceptAgreement(
    userId: string,
    userType: 'client' | 'artisan',
    agreementType: AgreementType
  ): Promise<ApiResponse<UserAgreementAcceptance>> {
    try {
      const acceptance: UserAgreementAcceptance = {
        id: `acceptance_${Date.now()}`,
        userId,
        userType,
        agreementType,
        agreementVersion: '1.0.0',
        acceptedAt: new Date().toISOString(),
      };

      // Store acceptance
      const existingJson = await AsyncStorage.getItem(ACCEPTANCES_KEY);
      const existing: UserAgreementAcceptance[] = existingJson ? JSON.parse(existingJson) : [];
      existing.push(acceptance);
      await AsyncStorage.setItem(ACCEPTANCES_KEY, JSON.stringify(existing));

      return {
        success: true,
        data: acceptance,
        message: 'Agreement accepted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to record agreement acceptance',
      };
    }
  },

  /**
   * Check if user has accepted all required agreements
   */
  async hasAcceptedAll(
    userId: string,
    userType: 'client' | 'artisan'
  ): Promise<{ accepted: boolean; missing: AgreementType[] }> {
    try {
      const requiredForClient: AgreementType[] = [
        'terms_of_service',
        'privacy_policy',
        'marketplace_disclaimer',
      ];
      
      const requiredForArtisan: AgreementType[] = [
        'terms_of_service',
        'privacy_policy',
        'artisan_code_of_conduct',
        'marketplace_disclaimer',
        'payment_terms',
      ];

      const required = userType === 'artisan' ? requiredForArtisan : requiredForClient;

      const existingJson = await AsyncStorage.getItem(ACCEPTANCES_KEY);
      const existing: UserAgreementAcceptance[] = existingJson ? JSON.parse(existingJson) : [];
      
      const userAcceptances = existing.filter(a => a.userId === userId);
      const acceptedTypes = new Set(userAcceptances.map(a => a.agreementType));
      
      const missing = required.filter(type => !acceptedTypes.has(type));
      
      return {
        accepted: missing.length === 0,
        missing,
      };
    } catch {
      return {
        accepted: false,
        missing: ['terms_of_service'],
      };
    }
  },

  /**
   * Get booking confirmation agreements to display
   */
  async getBookingAgreements(): Promise<TermsAgreement[]> {
    const bookingTerms = await this.getAgreement('booking_terms');
    const disclaimer = await this.getAgreement('marketplace_disclaimer');
    return [bookingTerms, disclaimer].filter(Boolean) as TermsAgreement[];
  },

  /**
   * Get legal disclaimers for UI display
   */
  getDisclaimers() {
    return LEGAL_DISCLAIMERS;
  },
};

export default legalService;
