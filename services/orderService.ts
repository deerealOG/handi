// services/orderService.ts
// Order management service layer

import { api } from "./api";
import type { ApiResponse } from "./api";

// ================================
// Types
// ================================
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPhone?: string;
  trackingNumber?: string;
  paymentMethod?: string;
  pairedBookingId?: string;
  items: OrderItem[];
  vendor?: { id: string; businessName: string; logo?: string };
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | "PENDING" | "CONFIRMED" | "PROCESSING"
  | "SHIPPED" | "DELIVERED" | "CANCELLED"
  | "RETURNED" | "REFUNDED";

export interface CreateOrderData {
  vendorId: string;
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPhone?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  pairedBookingId?: string;
}

// ================================
// Service
// ================================
export const orderService = {
  async getOrders(status?: string, page = 1) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("page", String(page));
    return api.get<Order[]>(`/api/orders?${params.toString()}`);
  },

  async getOrder(id: string) {
    return api.get<Order>(`/api/orders/${id}`);
  },

  async createOrder(data: CreateOrderData) {
    return api.post<Order>("/api/orders", data);
  },

  async cancelOrder(id: string) {
    return api.patch<void>(`/api/orders/${id}/cancel`);
  },

  async requestReturn(orderId: string, reason: string, type: "DEFECTIVE_PRODUCT" | "CHANGE_OF_MIND") {
    return api.post<void>(`/api/orders/${orderId}/return`, { reason, type });
  },
};
