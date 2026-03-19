"use client";

import ComingSoonModal from "@/components/ui/ComingSoonModal";
import Image from "next/image";
import { useState } from "react";

export default function AppDownloadSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="bg-linear-to-br from-(--color-primary) to-emerald-700 rounded-2xl shadow-lg border-0 p-6 sm:p-8 mt-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-white mb-1">
              Get the HANDI App
            </h2>
            <p className="text-sm text-white/80 mb-4">
              Book services faster, manage appointments, and track providers
              from your phone.
            </p>
            <div className="flex flex-row gap-3 justify-center sm:justify-start">
              {/* App Store Badge */}
              <button
                onClick={() => setModalOpen(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/badges/app-store.svg"
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </button>
              {/* Google Play Badge */}
              <button
                onClick={() => setModalOpen(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/badges/google-play.svg"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </button>
            </div>
          </div>
          <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
            📱
          </div>
        </div>
      </section>
      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Download App"
        message="The HANDI mobile app is coming soon! We'll notify you when it's available on App Store and Google Play."
      />
    </>
  );
}
