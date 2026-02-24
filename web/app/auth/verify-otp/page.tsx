"use client";

import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = useMemo(
    () => searchParams.get("email") || "",
    [searchParams],
  );
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [touched, setTouched] = useState({ email: false, otp: false });

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const emailError =
    touched.email && !EMAIL_REGEX.test(email)
      ? email.trim() === ""
        ? "Email is required"
        : "Enter a valid email address"
      : "";
  const otpError =
    touched.otp && otp.length !== 6
      ? otp.trim() === ""
        ? "OTP is required"
        : "OTP must be 6 digits"
      : "";
  const isFormValid = EMAIL_REGEX.test(email) && otp.length === 6;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, otp: true });
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || "OTP verification failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("OTP verification failed");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTouched((t) => ({ ...t, email: true }));
    if (!EMAIL_REGEX.test(email)) {
      setError("Enter a valid email address to resend OTP.");
      return;
    }

    setError("");
    setResendLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }
      setCooldown(30);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-(--color-primary) items-center justify-center p-12 relative overflow-hidden">
        <button
          className="absolute top-10 left-20 text-white flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft />
          Go back to HANDI
        </button>

        <div className="relative z-10 text-white max-w-md text-center">
          <div className=" rounded-2xl flex items-center justify-center mx-auto mb-6 w-50 h-50">
            <Image
              src="/images/handi-logo-dark.png"
              alt="HANDI"
              width={250}
              height={250}
            />
          </div>
          <h2 className="text-2xl font-medium mb-4">Verify your email</h2>
          <p className="text-white/80 text-lg mb-8">
            Enter the 6-digit code sent to your email to activate your account.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Verify OTP
          </h1>
          <p className="text-gray-500 mb-8">
            Already verified?{" "}
            <Link
              href="/login"
              className="text-(--color-primary) font-medium hover:underline"
            >
              Log in
            </Link>
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
              Email verified. Redirecting to login...
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
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
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

            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                One-time password (OTP)
              </label>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, otp: true }))}
                  placeholder="Enter 6-digit code"
                  className={`w-full pl-10 pr-4 py-3 border rounded-full text-sm tracking-[0.2em] text-center outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent ${
                    otpError ? "border-red-400" : "border-gray-200"
                  }`}
                />
              </div>
              {otpError && (
                <p className="mt-1 text-xs text-red-500">{otpError}</p>
              )}
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
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Didn&apos;t receive a code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className="text-sm font-medium text-(--color-primary) hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resendLoading
                ? "Resending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
