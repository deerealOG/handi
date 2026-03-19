"use client";

import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, ChevronRight, Store, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";

export default function SellOnHandiPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleApplyVendor = () => {
    if (user) {
      router.push("/dashboard"); 
    } else {
      router.push("/auth/signup?type=vendor");
    }
  };

  const handleApplyProvider = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signup?type=provider");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Grow Your Business with HANDI
          </h1>
          <p className="text-xl md:text-2xl text-primary-light mb-10 max-w-2xl mx-auto">
            Join thousands of vendors and service providers reaching new customers every day.
          </p>
        </div>
      </section>

      {/* Options Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          
          {/* Vendor Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Vendor</h2>
            <p className="text-gray-600 mb-8 grow">
              Open your official store on HANDI and sell physical products directly to thousands of active buyers.
            </p>
            
            <div className="mb-8 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Requirements:</h3>
              <ul className="space-y-3">
                {["Business Registration Number (RC)", "Valid Government ID", "Bank Account Details", "Clear Product Images", "Store Address/Location"].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleApplyVendor}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex justify-center items-center transition-colors group"
            >
              Start Selling Products
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Provider Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Service Provider</h2>
            <p className="text-gray-600 mb-8 grow">
              Offer your professional services and skills. From plumbing to web design, find clients who need you.
            </p>
            
            <div className="mb-8 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Requirements:</h3>
              <ul className="space-y-3">
                {["Valid Government ID or NIN", "Proof of Certification (if applicable)", "Portfolio of Past Work", "Service Location/Coverage Area", "Profile Picture"].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleApplyProvider}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl flex justify-center items-center transition-colors group"
            >
              Offer Your Services
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* FAQ / Info Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-primary font-bold text-xl mb-2">0% Hidden Fees</div>
              <p className="text-gray-600 text-sm">Transparent pricing and commission structure.</p>
            </div>
            <div>
              <div className="text-primary font-bold text-xl mb-2">Huge Audience</div>
              <p className="text-gray-600 text-sm">Access to thousands of daily active users.</p>
            </div>
            <div>
              <div className="text-primary font-bold text-xl mb-2">Quick Payouts</div>
              <p className="text-gray-600 text-sm">Get paid safely and securely on time.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
