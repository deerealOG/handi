// context/NotificationContext.tsx
// Global notification context for HANDI app

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    Notification,
    NotificationPreferences,
    notificationService,
} from "../services";

// ================================
// Types
// ================================
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences;
}

interface NotificationContextType extends NotificationState {
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updatePreferences: (
    updates: Partial<NotificationPreferences>,
  ) => Promise<void>;
}

// ================================
// Context
// ================================
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// ================================
// Provider
// ================================
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    preferences: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      bookingUpdates: true,
      messages: true,
      promotions: true,
      reviews: true,
    },
  });

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      const unreadCount = await notificationService.getUnreadCount();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          notifications: response.data!,
          unreadCount,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await notificationService.getPreferences();
      setState((prev) => ({ ...prev, preferences: prefs }));
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    }
  };

  const refreshNotifications = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await loadNotifications();
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    const response = await notificationService.markAsRead(id);
    if (response.success) {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    const response = await notificationService.markAllAsRead();
    if (response.success) {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    }
  }, []);

  const deleteNotification = useCallback(
    async (id: string): Promise<void> => {
      const notification = state.notifications.find((n) => n.id === id);
      const response = await notificationService.deleteNotification(id);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.filter((n) => n.id !== id),
          unreadCount:
            notification && !notification.isRead
              ? Math.max(0, prev.unreadCount - 1)
              : prev.unreadCount,
        }));
      }
    },
    [state.notifications],
  );

  const clearAll = useCallback(async (): Promise<void> => {
    const response = await notificationService.clearAllNotifications();
    if (response.success) {
      setState((prev) => ({
        ...prev,
        notifications: [],
        unreadCount: 0,
      }));
    }
  }, []);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>): Promise<void> => {
      const response = await notificationService.updatePreferences(updates);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          preferences: response.data!,
        }));
      }
    },
    [],
  );

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

export default NotificationContext;
