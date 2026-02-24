"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

function AuthTestContent() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            NextAuth Test
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Use this page to verify credential sign-in and token refresh.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            <div>
              Status: <span className="font-medium">{status}</span>
            </div>
            <div className="mt-2 break-all">
              Session:{" "}
              <span className="text-gray-600">
                {session ? JSON.stringify(session, null, 2) : "null"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_200px]">
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in with Credentials"}
              </button>
            </form>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                Sign in with Google
              </button>
              <button
                type="button"
                onClick={() => signIn("facebook")}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                Sign in with Facebook
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthTestPage() {
  return (
    <SessionProvider>
      <AuthTestContent />
    </SessionProvider>
  );
}

