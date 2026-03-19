// services/vendorService.ts
// Vendor management service layer

import { api } from "./api";

// ================================
// Types
// ================================
export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  _count?: { products: number; orders: number };
  products?: any[];
  createdAt: string;
}

export interface VendorRegistration {
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  cacNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface VendorStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  rating: number;
}

export interface AddProductData {
  name: string;
  description: string;
  price: number;
  categoryName?: string;
  brand?: string;
  stock?: number;
  images?: string[];
  isInstallable?: boolean;
  installCategoryId?: string;
}

// ================================
// Service
// ================================
export const vendorService = {
  async getVendors(params?: { city?: string; search?: string; verified?: boolean; page?: number }) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) query.append(k, String(v)); });
    return api.get<Vendor[]>(`/api/vendors?${query.toString()}`);
  },

  async getVendor(id: string) {
    return api.get<Vendor>(`/api/vendors/${id}`);
  },

  async register(data: VendorRegistration) {
    return api.post<Vendor>("/api/vendors/register", data);
  },

  async addProduct(data: AddProductData) {
    return api.post<any>("/api/vendors/products", data);
  },

  async getDashboardStats() {
    return api.get<VendorStats>("/api/vendors/dashboard/stats");
  },

  async getDashboardOrders(status?: string, page = 1) {
    const query = new URLSearchParams();
    if (status) query.append("status", status);
    query.append("page", String(page));
    return api.get<any[]>(`/api/vendors/dashboard/orders?${query.toString()}`);
  },
};
