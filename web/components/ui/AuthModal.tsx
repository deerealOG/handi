"use client";

import { LogIn, UserPlus, X } from "lucide-react";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  message = "Please sign in or create an account to perform this action.",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-blue-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              onClick={onClose}
            >
              <LogIn size={18} />
              Sign In to Continue
            </Link>
            <Link
              href="/signup"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <UserPlus size={18} />
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
