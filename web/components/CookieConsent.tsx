"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("handi_cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("handi_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("handi_cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + Text */}
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl mt-0.5">🍪</span>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                We use cookies to enhance your experience
              </p>
              <p className="text-xs text-gray-500 mt-1">
                We use cookies and similar technologies to personalize content,
                analyze traffic, and improve your experience. By clicking
                &quot;Accept&quot;, you consent to our use of cookies.{" "}
                <a
                  href="/privacy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-none px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-gray-600"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2 text-sm bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-colors font-medium"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
