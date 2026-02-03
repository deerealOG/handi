// services/notificationService.ts
// Notification service for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "./api";

// ================================
// Types
// ================================
export type NotificationType =
  | "booking_request"
  | "booking_accepted"
  | "booking_declined"
  | "booking_completed"
  | "booking_cancelled"
  | "payment_received"
  | "review_received"
  | "message"
  | "promo"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  // Optional action
  action?: {
    type: "navigate" | "open_url";
    target: string;
  };
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  bookingUpdates: boolean;
  messages: boolean;
  promotions: boolean;
  reviews: boolean;
}

// ================================
// Storage Keys
// ================================
const NOTIFICATIONS_KEY = "notifications";
const PREFERENCES_KEY = "notification_preferences";

// ================================
// Mock Data
// ================================
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    type: "booking_request",
    title: "New Booking Request",
    body: "John Adebayo requested your electrical service for Dec 15.",
    isRead: false,
    createdAt: new Date().toISOString(),
    action: { type: "navigate", target: "/artisan/job-details?id=booking_001" },
  },
  {
    id: "notif_002",
    type: "booking_accepted",
    title: "Booking Confirmed",
    body: "Golden Amadi accepted your booking for electrical service.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    action: {
      type: "navigate",
      target: "/client/booking-details?id=booking_001",
    },
  },
  {
    id: "notif_003",
    type: "review_received",
    title: "New Review",
    body: "You received a 5-star review from John Adebayo!",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    action: { type: "navigate", target: "/artisan/reviews" },
  },
  {
    id: "notif_004",
    type: "promo",
    title: "🎉 20% Off First Booking",
    body: "Get 20% off your first booking this holiday season!",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "notif_005",
    type: "payment_received",
    title: "Payment Received",
    body: "You received ₦25,000 for completing a job.",
    isRead: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    action: { type: "navigate", target: "/artisan/wallet" },
  },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  bookingUpdates: true,
  messages: true,
  promotions: true,
  reviews: true,
};

// ================================
// Helper Functions
// ================================
async function getStoredNotifications(): Promise<Notification[]> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading notifications:", e);
  }
  // Initialize with mock data
  await AsyncStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(MOCK_NOTIFICATIONS),
  );
  return MOCK_NOTIFICATIONS;
}

async function saveNotifications(notifications: Notification[]): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

// ================================
// Notification Service
// ================================
export const notificationService = {
  /**
   * Get all notifications
   */
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const notifications = await getStoredNotifications();
    return {
      success: true,
      data: notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const notifications = await getStoredNotifications();
    return notifications.filter((n) => !n.isRead).length;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    const notifications = await getStoredNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index === -1) {
      return { success: false, error: "Notification not found" };
    }

    notifications[index].isRead = true;
    await saveNotifications(notifications);

    return { success: true, data: notifications[index] };
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<null>> {
    const notifications = await getStoredNotifications();
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    await saveNotifications(updated);

    return { success: true, message: "All notifications marked as read" };
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    const notifications = await getStoredNotifications();
    const filtered = notifications.filter((n) => n.id !== notificationId);
    await saveNotifications(filtered);

    return { success: true, message: "Notification deleted" };
  },

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<ApiResponse<null>> {
    await saveNotifications([]);
    return { success: true, message: "All notifications cleared" };
  },

  /**
   * Add a new notification (used internally or for testing)
   */
  async addNotification(
    notification: Omit<Notification, "id" | "createdAt">,
  ): Promise<Notification> {
    const notifications = await getStoredNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    await saveNotifications(notifications);
    return newNotification;
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading notification preferences:", e);
    }
    return DEFAULT_PREFERENCES;
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(
    updates: Partial<NotificationPreferences>,
  ): Promise<ApiResponse<NotificationPreferences>> {
    const current = await this.getPreferences();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));

    return {
      success: true,
      data: updated,
      message: "Preferences updated",
    };
  },

  /**
   * Register push notification token (mock)
   */
  async registerPushToken(token: string): Promise<ApiResponse<null>> {
    console.log("Push token registered:", token);
    await AsyncStorage.setItem("push_token", token);
    return { success: true, message: "Push token registered" };
  },

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: NotificationType): { name: string; color: string } {
    const icons: Record<NotificationType, { name: string; color: string }> = {
      booking_request: { name: "calendar", color: "#3B82F6" },
      booking_accepted: { name: "checkmark-circle", color: "#10B981" },
      booking_declined: { name: "close-circle", color: "#EF4444" },
      booking_completed: { name: "checkmark-done-circle", color: "#10B981" },
      booking_cancelled: { name: "close-circle", color: "#F59E0B" },
      payment_received: { name: "wallet", color: "#8B5CF6" },
      review_received: { name: "star", color: "#F59E0B" },
      message: { name: "chatbubble", color: "#06B6D4" },
      promo: { name: "pricetag", color: "#EC4899" },
      system: { name: "information-circle", color: "#6B7280" },
    };
    return icons[type] || icons.system;
  },
};

export default notificationService;
