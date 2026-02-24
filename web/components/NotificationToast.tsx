"use client";

import { useNotification } from "@/context/NotificationContext";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";

const TOAST_ICONS = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const TOAST_STYLES = {
  success: "border-l-4 border-green-500 bg-green-50",
  info: "border-l-4 border-blue-500 bg-blue-50",
  warning: "border-l-4 border-yellow-500 bg-yellow-50",
  error: "border-l-4 border-red-500 bg-red-50",
};

const ICON_STYLES = {
  success: "text-green-500",
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export default function NotificationToast() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast, index) => {
        const Icon = TOAST_ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto ${TOAST_STYLES[toast.type]} rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-in-right`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon
              size={20}
              className={`${ICON_STYLES[toast.type]} shrink-0 mt-0.5`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {toast.title}
              </p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/50 rounded-full transition-colors shrink-0"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
