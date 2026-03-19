// lib/api.ts
// Web-specific API client for Next.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function request<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    requiresAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, requiresAuth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || data.message || "Request failed" };
    }

    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Network error" };
  }
}

export const webApi = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: "PUT", body }),
  patch: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: "PATCH", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// ================================
// Web Product Service
// ================================
export const webProductService = {
  async getProducts(params?: Record<string, string | number | boolean>) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) query.append(k, String(v)); });
    return webApi.get<any[]>(`/api/products?${query.toString()}`);
  },

  async getFeatured() {
    return webApi.get<any[]>("/api/products/featured");
  },

  async getCategories() {
    return webApi.get<{ name: string; count: number }[]>("/api/products/categories");
  },

  async getProduct(id: string) {
    return webApi.get<any>(`/api/products/${id}`);
  },

  async addReview(productId: string, data: { rating: number; title?: string; comment?: string }) {
    return webApi.post<any>(`/api/products/${productId}/reviews`, data);
  },
};

// ================================
// Web Order Service
// ================================
export const webOrderService = {
  async getOrders(status?: string, page = 1) {
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.append("status", status);
    return webApi.get<any[]>(`/api/orders?${query.toString()}`);
  },

  async getOrder(id: string) {
    return webApi.get<any>(`/api/orders/${id}`);
  },

  async createOrder(data: {
    vendorId: string;
    items: { productId: string; quantity: number }[];
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPhone?: string;
    paymentMethod?: string;
    pairedBookingId?: string;
  }) {
    return webApi.post<any>("/api/orders", data);
  },

  async cancelOrder(id: string) {
    return webApi.patch<any>(`/api/orders/${id}/cancel`);
  },

  async requestReturn(orderId: string, reason: string, type: string) {
    return webApi.post<any>(`/api/orders/${orderId}/return`, { reason, type });
  },
};

// ================================
// Web Vendor Service
// ================================
export const webVendorService = {
  async getVendors(params?: Record<string, string | number | boolean>) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) query.append(k, String(v)); });
    return webApi.get<any[]>(`/api/vendors?${query.toString()}`);
  },

  async getVendor(id: string) {
    return webApi.get<any>(`/api/vendors/${id}`);
  },

  async register(data: any) {
    return webApi.post<any>("/api/vendors/register", data);
  },

  async addProduct(data: any) {
    return webApi.post<any>("/api/vendors/products", data);
  },

  async getDashboardStats() {
    return webApi.get<any>("/api/vendors/dashboard/stats");
  },
};

// ================================
// Web Escrow Service
// ================================
export const webEscrowService = {
  async createHold(bookingId: string, amount: number, paymentMethod?: string) {
    return webApi.post<any>("/api/escrow/hold", { bookingId, amount, paymentMethod });
  },

  async releaseEscrow(id: string) {
    return webApi.post<any>(`/api/escrow/${id}/release`);
  },

  async requestRefund(data: {
    bookingId?: string;
    orderId?: string;
    type: string;
    reason: string;
  }) {
    return webApi.post<any>("/api/escrow/refund", data);
  },

  async getRefunds() {
    return webApi.get<any[]>("/api/escrow/refunds");
  },
};

// ================================
// Web Matching Service
// ================================
export const webMatchingService = {
  async findMatches(data: {
    categoryName: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    scheduledDate?: string;
    maxResults?: number;
  }) {
    return webApi.post<any[]>("/api/matching/find", data);
  },

  async getPreferences() {
    return webApi.get<any>("/api/matching/preferences");
  },

  async updatePreferences(data: any) {
    return webApi.put<any>("/api/matching/preferences", data);
  },
};

// ================================
// Web Emergency Service
// ================================
export const webEmergencyService = {
  async createRequest(data: {
    categoryId: string;
    categoryName: string;
    description: string;
    address: string;
    city: string;
    urgencyLevel?: number;
  }) {
    return webApi.post<any>("/api/emergency", data);
  },

  async getActive() {
    return webApi.get<any[]>("/api/emergency/active");
  },
};

// ================================
// Web Maintenance Service
// ================================
export const webMaintenanceService = {
  async getPlans() {
    return webApi.get<any[]>("/api/maintenance/plans");
  },

  async subscribe(planId: string) {
    return webApi.post<any>("/api/maintenance/subscribe", { planId });
  },

  async getSubscriptions() {
    return webApi.get<any[]>("/api/maintenance/subscriptions");
  },

  async cancelSubscription(id: string, reason?: string) {
    return webApi.patch<any>(`/api/maintenance/subscriptions/${id}/cancel`, { reason });
  },
};

// ================================
// Web Feature Service (Quotes, Home Profile, Loyalty, Guarantee, Trade)
// ================================
export const webFeatureService = {
  // Quotes
  async requestQuotes(data: any) {
    return webApi.post<any>("/api/features/quotes/request", data);
  },
  async getQuoteRequests() {
    return webApi.get<any[]>("/api/features/quotes/requests");
  },
  async acceptQuote(quoteId: string) {
    return webApi.post<any>(`/api/features/quotes/${quoteId}/accept`);
  },

  // Home Profile
  async getHomeProfile() {
    return webApi.get<any>("/api/features/home-profile");
  },
  async updateHomeProfile(data: any) {
    return webApi.put<any>("/api/features/home-profile", data);
  },

  // Loyalty
  async getLoyaltyAccount() {
    return webApi.get<any>("/api/features/loyalty");
  },
  async redeemPoints(points: number, description: string) {
    return webApi.post<any>("/api/features/loyalty/redeem", { points, description });
  },
  async applyReferralCode(referralCode: string) {
    return webApi.post<any>("/api/features/loyalty/referral", { referralCode });
  },

  // Guarantee
  async submitGuaranteeClaim(data: { bookingId: string; issue: string; description: string; evidence?: string[] }) {
    return webApi.post<any>("/api/features/guarantee/claim", data);
  },
  async getGuaranteeClaims() {
    return webApi.get<any[]>("/api/features/guarantee/claims");
  },

  // Reviews
  async respondToReview(reviewId: string, content: string) {
    return webApi.post<any>(`/api/features/reviews/${reviewId}/respond`, { content });
  },

  // Recommendations
  async getRecommendations() {
    return webApi.get<any[]>("/api/features/recommendations");
  },
};

export default webApi;
