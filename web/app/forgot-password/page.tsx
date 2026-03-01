"use client";

import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = EMAIL_REGEX.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError("");
    setLoading(true);

    try {
      // TODO: Wire to Supabase Auth resetPasswordForEmail()
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Left Panel — matches login/signup */}
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <button
          className="lg:hidden absolute top-6 left-6 text-(--color-primary) flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft />
          Back
        </button>

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden rounded-2xl flex flex-col items-center justify-center mx-auto h-40 mt-10">
            <Image
              src="/images/handi-logo-light.png"
              alt="HANDI"
              width={200}
              height={200}
              className="w-40"
            />
            <p className="text-(--color-primary) text-md italic mb-6">
              always lending a hand...
            </p>
          </div>

          <div className="w-full flex flex-col items-center lg:items-start">
            {!sent ? (
              <>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 text-sm lg:text-md mb-6">
                  Enter your email and we&apos;ll send you a link to reset your
                  password.
                </p>

                {error && (
                  <div className="w-full mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
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
                          email && !isValid
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                    {email && !isValid && (
                      <p className="mt-1 text-xs text-red-500">
                        Enter a valid email address
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className="w-full py-3.5 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center w-full">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-semibold text-gray-700">{email}</span>.
                  <br />
                  Check your inbox and follow the instructions.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-(--color-primary) font-medium hover:underline mb-4"
                >
                  Didn&apos;t receive it? Send again
                </button>
              </div>
            )}

            <p className="text-gray-500 text-sm mt-6 text-center w-full">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-(--color-primary) font-medium hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
