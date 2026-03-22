"use client";

import { useAuth } from "@/context/AuthContext";
import { AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UnverifiedEmailBanner() {
  const { user, isLoggedIn } = useAuth();
  const pathname = usePathname();

  // Don't show if not logged in, if email is verified, or if we're on the auth pages
  if (!isLoggedIn || !user || user.emailVerified || pathname.includes("/auth")) {
    return null;
  }

  // Admin doesn't need to see this
  if (user.userType === "admin") {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertCircle size={16} className="shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            Please verify your email address ({user.email}) to unlock all features.
          </p>
        </div>
        <Link
          href={`/auth/verify-otp?email=${encodeURIComponent(user.email)}&method=email`}
          className="text-xs font-bold text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          Verify Now <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
