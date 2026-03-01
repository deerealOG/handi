"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const USER_TYPES = [
  { id: "client" as const, label: "Client", desc: "Book services" },
  { id: "provider" as const, label: "Provider", desc: "Offer services" },
  { id: "admin" as const, label: "Admin", desc: "Manage platform" },
];

// All user types route to / — the homepage renders ProviderHome or AdminDashboard based on userType

export default function LoginPage() {
  const { login, isLoggedIn, isLoading, user } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"client" | "provider" | "admin">(
    "client",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailError =
    email.trim() && !EMAIL_REGEX.test(email)
      ? "Enter a valid email address"
      : "";
  const isFormValid = EMAIL_REGEX.test(email) && password.length >= 1;

  useEffect(() => {
    if (!isLoading && isLoggedIn && user) {
      router.push("/");
    }
  }, [isLoggedIn, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    const result = await login(email, password, userType);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 flex">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-1 bg-(--color-primary) items-center justify-center p-12 relative overflow-hidden">
          <button
            className="absolute top-10 left-20 text-white flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft />
            Go back to HANDI
          </button>
          <div className="relative z-10 text-white max-w-md text-center">
            <div className="rounded-2xl flex flex-col items-center justify-center mx-auto w-50 h-50">
              <Image
                src="/images/handi-logo-dark.png"
                alt="HANDI"
                width={250}
                height={250}
              />
              <p className="text-white text-md italic mb-6">
                always lending a hand...
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mb-4">
          <div className="w-full max-w-md ">
            <div className="lg:hidden flex items-center justify-between w-full mb-6">
              <button
                className="text-(--color-primary) flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <ArrowLeft />
                Back
              </button>
            </div>

            <div className="lg:hidden rounded-2xl flex flex-col items-center justify-center mx-auto h-32">
              <Image
                src="/images/handi-logo-light.png"
                alt="HANDI"
                width={120}
                height={120}
                className="w-24 sm:w-28"
              />
              <p className="text-(--color-primary) text-md italic mb-6">
                always lending a hand...
              </p>
            </div>

            <div className="w-full  flex flex-col items-center lg:items-start">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                Welcome Back
              </h1>
              <p className="text-gray-800 text-md lg:text-lg mb-6">
                Log in to access your dashboard.
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {(session as any)?.error === "EmailNotVerified" && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                  Your email isn&apos;t verified yet.{" "}
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/auth/verify-otp?email=${encodeURIComponent(
                          (session as any)?.user?.email || "",
                        )}`,
                      )
                    }
                    className="font-semibold text-(--color-primary) hover:underline"
                  >
                    Verify now
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 w-full">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent ${
                        emailError ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500">{emailError}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-(--color-primary) font-medium hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full py-3.5 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
                <p className="text-gray-500 mb-4 text-sm lg:text-md">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-(--color-primary) font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full py-3.5 mt-4 border border-gray-200 bg-white text-gray-900 text-sm lg:text-md rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => signIn("facebook", { callbackUrl: "/" })}
                  className="w-full py-3.5 mt-4 border border-gray-200 bg-white text-gray-900 text-sm lg:text-md rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#166FE5"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
