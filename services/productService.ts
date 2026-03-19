// services/productService.ts
// Product Marketplace service layer

import { api } from "./api";
import type { ApiResponse, PaginatedResponse } from "./api";

// ================================
// Types
// ================================
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryName?: string;
  brand?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  tags: string[];
  attributes: Record<string, string>;
  stock: number;
  status: string;
  isFeatured: boolean;
  isInstallable: boolean;
  installCategoryId?: string;
  rating: number;
  reviewCount: number;
  totalSold: number;
  vendor?: VendorSummary;
  reviews?: ProductReview[];
  createdAt: string;
}

export interface VendorSummary {
  id: string;
  businessName: string;
  logo?: string;
  rating: number;
  isVerified: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  page?: number;
  perPage?: number;
  featured?: boolean;
  installable?: boolean;
}

// ================================
// Service
// ================================
export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
    const query = params.toString() ? `?${params.toString()}` : "";
    return api.get<Product[]>(`/api/products${query}`);
  },

  async getFeaturedProducts() {
    return api.get<Product[]>("/api/products/featured");
  },

  async getProductCategories() {
    return api.get<{ name: string; count: number }[]>("/api/products/categories");
  },

  async getProduct(id: string) {
    return api.get<Product>(`/api/products/${id}`);
  },

  async addReview(productId: string, data: { rating: number; title?: string; comment?: string }) {
    return api.post<ProductReview>(`/api/products/${productId}/reviews`, data);
  },
};
