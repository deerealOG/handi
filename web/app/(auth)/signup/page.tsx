"use client";

import ClientSignup from "@/components/auth/ClientSignup";
import ProviderSignup from "@/components/auth/ProviderSignup";
import VendorSignup from "@/components/auth/VendorSignup";
import { ArrowLeft, User, Wrench, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AccountType = "client" | "provider_individual" | "provider_business" | "vendor" | null;

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showSubtype, setShowSubtype] = useState(false);

  const handleSelectProvider = () => {
    setShowSubtype(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-(--color-primary) items-center justify-center p-12 relative overflow-hidden">
        <button
          className="absolute top-10 left-20 text-white flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => router.push("/")}
        >
          <ArrowLeft /> Go back to HANDI
        </button>
        <div className="relative z-10 text-white max-w-md text-center">
          <div className="rounded-2xl flex flex-col items-center justify-center mx-auto w-50 h-50">
            <Image src="/images/handi-logo-dark.webp" alt="HANDI" width={250} height={250} />
            <p className="text-white text-md italic mb-6">always lending a hand...</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mb-4 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto flex flex-col">
          <div className="lg:hidden flex items-center justify-between w-full mb-6">
            <button className="text-(--color-primary) flex items-center gap-2 cursor-pointer font-medium" onClick={() => router.push("/")}>
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <div className="lg:hidden rounded-2xl flex flex-col items-center justify-center mx-auto h-32 mb-4">
            <Image src="/images/handi-logo-light.webp" alt="HANDI" width={120} height={120} className="w-24 sm:w-28" />
            <p className="text-(--color-primary) text-md italic mb-6">always lending a hand...</p>
          </div>

          {!accountType ? (
            <div className="animate-fadeIn w-full flex flex-col items-center lg:items-start">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
              <p className="text-gray-600 mb-8 w-full text-center lg:text-left">Choose how you want to use HANDI</p>

              {!showSubtype ? (
                <div className="grid gap-4 w-full">
                  {/* Client Option */}
                  <button onClick={() => setAccountType("client")}
                    className="text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">I need services</h3>
                      <p className="text-sm text-gray-500">Hire artisans, book services, and shop for products.</p>
                    </div>
                  </button>

                  {/* Provider Option */}
                  <button onClick={handleSelectProvider}
                    className="text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Wrench size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">I provide services</h3>
                      <p className="text-sm text-gray-500">Offer your skills as an artisan or a registered company.</p>
                    </div>
                  </button>

                  {/* Vendor Option */}
                  <button onClick={() => setAccountType("vendor")}
                    className="text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50 transition-all group flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">I sell products</h3>
                      <p className="text-sm text-gray-500">List and sell your products on the HANDI marketplace.</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="animate-slideIn w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setShowSubtype(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                      <ArrowLeft size={16} />
                    </button>
                    <h2 className="font-semibold text-gray-900">Choose Provider Type</h2>
                  </div>
                  <div className="grid gap-4">
                    <button onClick={() => setAccountType("provider_individual")}
                      className="text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">Individual Artisan</h3>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-blue-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Freelance professional</p>
                    </button>

                    <button onClick={() => setAccountType("provider_business")}
                      className="text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all group">
                      <div className="flex items-center justify-between mb-2\">
                        <h3 className="font-bold text-gray-900">Registered Business</h3>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-blue-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Company or agency</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col animate-slideIn">
              <button onClick={() => { setAccountType(null); setShowSubtype(false); }} className="text-(--color-primary) flex items-center gap-2 cursor-pointer mb-6 font-medium hover:opacity-80 transition-opacity w-fit">
                <ArrowLeft size={18} /> Change Account Type
              </button>
              
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 w-full">
                {accountType === "client" && <ClientSignup />}
                {accountType === "provider_individual" && <ProviderSignup subType="individual" />}
                {accountType === "provider_business" && <ProviderSignup subType="business" />}
                {accountType === "vendor" && <VendorSignup />}
              </div>
            </div>
          )}

          {!accountType && (
            <p className="text-center text-gray-500 mt-8 pt-6 border-t border-gray-100 w-full">
              Already have an account?{" "}
              <button type="button" onClick={() => router.push("/login")} className="text-(--color-primary) font-semibold hover:underline">Sign in</button>
            </p>
          )}

        </div>
      </div>
      </main>
    </div>
  );
}
