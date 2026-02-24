"use client";

import { Rocket, X } from "lucide-react";
import { useEffect } from "react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  title = "Coming Soon",
  message,
}: ComingSoonModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-[scaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-(--color-primary-light) flex items-center justify-center">
          <Rocket size={28} className="text-(--color-primary)" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {message ||
            `We're working hard to bring you this feature. Stay tuned for updates!`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold text-sm hover:opacity-90 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
