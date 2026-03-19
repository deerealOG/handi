// services/matchingService.ts
// Smart Matching Engine service layer

import { api } from "./api";

// ================================
// Types
// ================================
export interface MatchResult {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  city?: string;
  state?: string;
  isOnline: boolean;
  verificationLevel: string;
  bio?: string;
  matchScore: number;
  distanceKm: number | null;
  scores: {
    skill: number;
    distance: number;
    rating: number;
    availability: number;
    experience: number;
  };
}

export interface MatchPreference {
  id: string;
  preferredDistance: number;
  preferredMinRating: number;
  preferredPriceRange?: { min: number; max: number };
  preferGender?: string;
  preferVerified: boolean;
  preferExperienced: boolean;
}

export interface FindMatchParams {
  categoryName: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  maxResults?: number;
}

// ================================
// Service
// ================================
export const matchingService = {
  async findMatches(params: FindMatchParams) {
    return api.post<MatchResult[]>("/api/matching/find", params as unknown as Record<string, unknown>);
  },

  async getPreferences() {
    return api.get<MatchPreference>("/api/matching/preferences");
  },

  async updatePreferences(data: Partial<MatchPreference>) {
    return api.put<MatchPreference>("/api/matching/preferences", data as unknown as Record<string, unknown>);
  },
};
