// services/maintenanceService.ts
// Maintenance Plans & Subscriptions service layer

import { api } from "./api";

// ================================
// Types
// ================================
export interface MaintenancePlan {
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  interval: "MONTHLY" | "QUARTERLY" | "BIANNUAL" | "ANNUAL";
  price: number;
  currency: string;
  includedVisits: number;
  features: string[];
  isActive: boolean;
}

export interface PlanSubscription {
  id: string;
  userId: string;
  planId: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
  startDate: string;
  nextBillingDate: string;
  endDate?: string;
  visitsUsed: number;
  visitsRemaining: number;
  autoRenew: boolean;
  scheduledVisits: RecurringVisit[];
}

export interface RecurringVisit {
  id: string;
  scheduledDate: string;
  categoryName: string;
  serviceType: string;
  status: string;
}

// ================================
// Service
// ================================
export const maintenanceService = {
  async getPlans() {
    return api.get<MaintenancePlan[]>("/api/maintenance/plans");
  },

  async subscribe(planId: string, paymentMethod?: string) {
    return api.post<PlanSubscription>("/api/maintenance/subscribe", { planId, paymentMethod });
  },

  async getSubscriptions() {
    return api.get<PlanSubscription[]>("/api/maintenance/subscriptions");
  },

  async cancelSubscription(id: string, reason?: string) {
    return api.patch<PlanSubscription>(`/api/maintenance/subscriptions/${id}/cancel`, { reason });
  },
};
