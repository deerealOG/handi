// services/featureService.ts
// Combined service for: Quotes, Home Profile, Loyalty, Guarantee, Trade, Reviews, Recommendations

import { api } from "./api";

// ================================
// QUOTE TYPES
// ================================
export interface QuoteRequest {
  id: string;
  clientId: string;
  categoryName: string;
  serviceType: string;
  description: string;
  address: string;
  city: string;
  preferredDate?: string;
  budget?: { min: number; max: number };
  status: string;
  quotes: Quote[];
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteRequestId: string;
  professionalId: string;
  amount: number;
  estimatedDuration?: number;
  message?: string;
  breakdownItems: { item: string; cost: number }[];
  validUntil: string;
  status: string;
  counterOffer?: number;
}

// ================================
// HOME PROFILE TYPES
// ================================
export interface HomeProfile {
  id: string;
  userId: string;
  nickname?: string;
  propertyType?: string;
  squareFootage?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  address?: string;
  city?: string;
  state?: string;
  appliances: any[];
  systems: any[];
  documents: any[];
  serviceHistory: any[];
  notes?: string;
}

// ================================
// LOYALTY TYPES
// ================================
export interface LoyaltyAccount {
  id: string;
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  referralCode: string;
  totalReferrals: number;
  transactions: PointsTransaction[];
}

export interface PointsTransaction {
  id: string;
  action: string;
  points: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

// ================================
// GUARANTEE TYPES
// ================================
export interface GuaranteeClaim {
  id: string;
  bookingId: string;
  issue: string;
  description: string;
  evidence: string[];
  status: string;
  resolution?: string;
  refundAmount?: number;
  createdAt: string;
}

// ================================
// SERVICE
// ================================
export const featureService = {
  // --- Quotes ---
  async requestQuotes(data: {
    categoryId: string; categoryName: string; serviceType: string;
    description: string; address: string; city: string;
    preferredDate?: string; budget?: { min: number; max: number };
  }) {
    return api.post<QuoteRequest>("/api/features/quotes/request", data);
  },

  async getQuoteRequests() {
    return api.get<QuoteRequest[]>("/api/features/quotes/requests");
  },

  async submitQuote(requestId: string, data: {
    amount: number; estimatedDuration?: number;
    message?: string; breakdownItems?: any[]; validDays?: number;
  }) {
    return api.post<Quote>(`/api/features/quotes/${requestId}/submit`, data);
  },

  async acceptQuote(quoteId: string) {
    return api.post<void>(`/api/features/quotes/${quoteId}/accept`);
  },

  // --- Home Profile ---
  async getHomeProfile() {
    return api.get<HomeProfile>("/api/features/home-profile");
  },

  async updateHomeProfile(data: Partial<HomeProfile>) {
    return api.put<HomeProfile>("/api/features/home-profile", data);
  },

  // --- Loyalty ---
  async getLoyaltyAccount() {
    return api.get<LoyaltyAccount>("/api/features/loyalty");
  },

  async redeemPoints(points: number, description: string) {
    return api.post<void>("/api/features/loyalty/redeem", { points, description });
  },

  async applyReferralCode(referralCode: string) {
    return api.post<void>("/api/features/loyalty/referral", { referralCode });
  },

  // --- Service Guarantee ---
  async submitGuaranteeClaim(data: {
    bookingId: string; issue: string; description: string; evidence?: string[];
  }) {
    return api.post<GuaranteeClaim>("/api/features/guarantee/claim", data);
  },

  async getGuaranteeClaims() {
    return api.get<GuaranteeClaim[]>("/api/features/guarantee/claims");
  },

  // --- Two-way Reviews ---
  async submitProReview(data: {
    bookingId: string; clientId: string; rating: number;
    comment?: string; punctuality?: number; communication?: number; propertyReadiness?: number;
  }) {
    return api.post<void>("/api/features/reviews/pro", data);
  },

  async respondToReview(reviewId: string, content: string) {
    return api.post<void>(`/api/features/reviews/${reviewId}/respond`, { content });
  },

  // --- Trade Purchasing ---
  async getTradeAccount() {
    return api.get<any>("/api/features/trade/account");
  },

  async createTradeAccount() {
    return api.post<any>("/api/features/trade/account");
  },

  async placeTradeOrder(data: {
    vendorId: string; items: { productId: string; quantity: number }[];
    deliveryAddress: string; deliveryCity: string; deliveryState: string;
    bookingId?: string; useCredit?: boolean;
  }) {
    return api.post<any>("/api/features/trade/order", data);
  },

  // --- SLA ---
  async getSLARecords(userId: string) {
    return api.get<any[]>(`/api/features/sla/${userId}`);
  },

  // --- Recommendations ---
  async getRecommendations() {
    return api.get<any[]>("/api/features/recommendations");
  },
};
