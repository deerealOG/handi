"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
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
            <div className="rounded-2xl flex items-center justify-center mx-auto w-50 h-50">
              <Image
                src="/images/handi-logo-dark.png"
                alt="HANDI"
                width={250}
                height={250}
              />
            </div>
            <p className="text-white/80 mt-4 text-sm">
              Test accounts: <br />
              <code className="text-white/90">client@handi.ng</code> ·{" "}
              <code className="text-white/90">provider@handi.ng</code> ·{" "}
              <code className="text-white/90">admin@handi.ng</code>
              <br />
              Password: <code className="text-white/90">password1</code>
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-800 text-lg mb-6">
              Log in to access your dashboard.
            </p>

            {/* User Type Selector */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-full">
              {USER_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setUserType(t.id)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                    userType === t.id
                      ? "bg-[var(--color-primary)] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="text-xs text-(--color-primary) font-medium hover:underline"
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
              <p className="text-gray-500 mb-4">
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
              <button className="w-full py-3.5 mt-4 border border-gray-200 bg-white text-gray-900 rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                Continue with Google
              </button>
              <button className="w-full py-3.5 mt-4 border border-gray-200 bg-white text-gray-900 rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                Continue with Facebook
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
