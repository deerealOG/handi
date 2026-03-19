// hooks/useApi.ts
// React hooks for web API integration

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  webProductService,
  webOrderService,
  webVendorService,
  webMatchingService,
  webEmergencyService,
  webMaintenanceService,
  webFeatureService,
  webEscrowService,
} from "@/lib/api";

// ================================
// Generic fetcher hook
// ================================
export function useApiQuery<T>(
  fetcher: () => Promise<{ success: boolean; data?: T; error?: string }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Failed to fetch");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ================================
// Product hooks
// ================================
export function useProducts(params?: Record<string, string | number | boolean>) {
  return useApiQuery(
    () => webProductService.getProducts(params),
    [JSON.stringify(params)]
  );
}

export function useFeaturedProducts() {
  return useApiQuery(() => webProductService.getFeatured());
}

export function useProductCategories() {
  return useApiQuery(() => webProductService.getCategories());
}

export function useProduct(id: string) {
  return useApiQuery(() => webProductService.getProduct(id), [id]);
}

// ================================
// Order hooks
// ================================
export function useOrders(status?: string, page = 1) {
  return useApiQuery(
    () => webOrderService.getOrders(status, page),
    [status, page]
  );
}

export function useOrder(id: string) {
  return useApiQuery(() => webOrderService.getOrder(id), [id]);
}

// ================================
// Vendor hooks
// ================================
export function useVendors(params?: Record<string, string | number | boolean>) {
  return useApiQuery(
    () => webVendorService.getVendors(params),
    [JSON.stringify(params)]
  );
}

export function useVendor(id: string) {
  return useApiQuery(() => webVendorService.getVendor(id), [id]);
}

// ================================
// Matching hooks
// ================================
export function useMatchingPreferences() {
  return useApiQuery(() => webMatchingService.getPreferences());
}

// ================================
// Maintenance hooks
// ================================
export function useMaintenancePlans() {
  return useApiQuery(() => webMaintenanceService.getPlans());
}

export function useSubscriptions() {
  return useApiQuery(() => webMaintenanceService.getSubscriptions());
}

// ================================
// Feature hooks
// ================================
export function useQuoteRequests() {
  return useApiQuery(() => webFeatureService.getQuoteRequests());
}

export function useHomeProfile() {
  return useApiQuery(() => webFeatureService.getHomeProfile());
}

export function useLoyaltyAccount() {
  return useApiQuery(() => webFeatureService.getLoyaltyAccount());
}

export function useGuaranteeClaims() {
  return useApiQuery(() => webFeatureService.getGuaranteeClaims());
}

export function useRecommendations() {
  return useApiQuery(() => webFeatureService.getRecommendations());
}

export function useActiveEmergencies() {
  return useApiQuery(() => webEmergencyService.getActive());
}

export function useRefunds() {
  return useApiQuery(() => webEscrowService.getRefunds());
}

// Re-export services for mutations (non-hook usage)
export {
  webProductService,
  webOrderService,
  webVendorService,
  webMatchingService,
  webEmergencyService,
  webMaintenanceService,
  webFeatureService,
  webEscrowService,
};
