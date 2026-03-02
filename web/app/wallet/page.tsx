"use client";

import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function WalletVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: session } = useSession();

  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying payment...");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = (session as any)?.accessToken as string | undefined;
        const res = await fetch(
          `${backendUrl}/api/payment/verify/${reference}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          if (data.data?.amount) setAmount(data.data.amount);
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("A network error occurred while verifying the payment.");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-(--color-primary) animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-500">
              Please do not close this window while we securely confirm your
              payment with Paystack...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Deposit Successful!
            </h1>
            {amount && (
              <p className="text-3xl font-black text-(--color-primary) mb-4">
                ₦{amount.toLocaleString()}
              </p>
            )}
            <p className="text-gray-500 mb-8">
              Your wallet has been credited successfully. You can now use your
              balance to book services or buy products.
            </p>

            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-(--color-primary) text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-red-600 mb-8">{message}</p>

            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors mb-3"
            >
              Back to Dashboard
            </button>
            <p className="text-xs text-gray-400">
              If you were debited, please contact support with reference:{" "}
              {reference || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
        </div>
      }
    >
      <WalletVerificationContent />
    </Suspense>
  );
}
