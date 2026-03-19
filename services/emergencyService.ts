// services/emergencyService.ts
// Emergency Services service layer

import { api } from "./api";

// ================================
// Types
// ================================
export interface EmergencyRequest {
  id: string;
  bookingId?: string;
  clientId: string;
  categoryId: string;
  categoryName: string;
  description: string;
  address: string;
  city: string;
  urgencyLevel: number;
  surgeMultiplier: number;
  isResolved: boolean;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface CreateEmergencyData {
  categoryId: string;
  categoryName: string;
  description: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  urgencyLevel?: number; // 1=critical, 2=urgent, 3=same-day
}

// ================================
// Service
// ================================
export const emergencyService = {
  async createRequest(data: CreateEmergencyData) {
    return api.post<EmergencyRequest>("/api/emergency", data as unknown as Record<string, unknown>);
  },

  async respondToEmergency(id: string) {
    return api.post<EmergencyRequest>(`/api/emergency/${id}/respond`);
  },

  async getActiveEmergencies() {
    return api.get<EmergencyRequest[]>("/api/emergency/active");
  },

  async joinEmergencyPool(categoryIds: string[], maxDistance = 15) {
    return api.post<void>("/api/emergency/pool/join", { categoryIds, maxDistance });
  },
};
