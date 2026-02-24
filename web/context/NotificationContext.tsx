"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
};

type NotificationContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  notifyVerificationApproved: (name: string) => void;
  notifyVerificationRejected: (name: string, reason: string) => void;
  notifyAccountSuspended: (name: string, reason: string) => void;
  notifyAccountReinstated: (name: string) => void;
  notifyDisputeResolved: (name: string, resolution: string) => void;
  notifyBookingCompleted: (name: string, service: string) => void;
  notifyPaymentReceived: (name: string, amount: string) => void;
  notifyNewBooking: (provider: string, service: string, date: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notifyVerificationApproved = useCallback(
    (name: string) => {
      addToast({
        type: "success",
        title: "✅ Verification Approved",
        message: `${name}'s provider account has been verified successfully.`,
      });
    },
    [addToast],
  );

  const notifyVerificationRejected = useCallback(
    (name: string, reason: string) => {
      addToast({
        type: "error",
        title: "❌ Verification Rejected",
        message: `${name}'s verification was rejected. Reason: ${reason}`,
      });
    },
    [addToast],
  );

  const notifyAccountSuspended = useCallback(
    (name: string, reason: string) => {
      addToast({
        type: "warning",
        title: "⚠️ Account Suspended",
        message: `${name}'s account has been suspended. Reason: ${reason}`,
      });
    },
    [addToast],
  );

  const notifyAccountReinstated = useCallback(
    (name: string) => {
      addToast({
        type: "success",
        title: "✅ Account Reinstated",
        message: `${name}'s account has been reinstated successfully.`,
      });
    },
    [addToast],
  );

  const notifyDisputeResolved = useCallback(
    (name: string, resolution: string) => {
      addToast({
        type: "success",
        title: "✅ Dispute Resolved",
        message: `Dispute with ${name} resolved: ${resolution}`,
      });
    },
    [addToast],
  );

  const notifyBookingCompleted = useCallback(
    (name: string, service: string) => {
      addToast({
        type: "success",
        title: "🎉 Booking Completed",
        message: `${service} booking for ${name} has been completed.`,
      });
    },
    [addToast],
  );

  const notifyPaymentReceived = useCallback(
    (name: string, amount: string) => {
      addToast({
        type: "success",
        title: "💰 Payment Received",
        message: `${amount} has been credited to ${name}'s wallet.`,
      });
    },
    [addToast],
  );

  const notifyNewBooking = useCallback(
    (provider: string, service: string, date: string) => {
      addToast({
        type: "info",
        title: "📋 New Booking",
        message: `New ${service} booking for ${provider} on ${date}.`,
      });
    },
    [addToast],
  );

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifyVerificationApproved,
        notifyVerificationRejected,
        notifyAccountSuspended,
        notifyAccountReinstated,
        notifyDisputeResolved,
        notifyBookingCompleted,
        notifyPaymentReceived,
        notifyNewBooking,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
