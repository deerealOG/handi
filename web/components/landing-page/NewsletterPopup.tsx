"use client";

import { X, Mail, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NewsletterPopupProps {
  onForceClose?: () => void;
}

export default function NewsletterPopup({ onForceClose }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only show once per session or if forcefully triggered
    const hasSeenPopup = sessionStorage.getItem("hasSeenNewsletter");
    
    // Show after 5 seconds on the page
    const timer = setTimeout(() => {
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenNewsletter", "true");
    if (onForceClose) onForceClose();
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        sessionStorage.setItem("hasSeenNewsletter", "true");
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isOpen && !onForceClose) return null; // Don't render until triggered

  // Force open if the prop is passed (e.g. from footer button)
  const showModal = isOpen || !!onForceClose;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]" 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-[scaleIn_0.3s_ease-out] overflow-hidden">
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-(--color-primary)/10 -z-10" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/50 backdrop-blur-md hover:bg-gray-100 text-gray-500 transition-colors z-10 shadow-sm"
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <>
            <div className="w-16 h-16 mx-auto mt-2 mb-6 rounded-full bg-white shadow-md border-4 border-(--color-primary)/20 flex items-center justify-center">
              <Mail size={28} className="text-(--color-primary)" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Newsletter</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Get the latest updates, special deals on services, and exclusive product discounts delivered directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) outline-none transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full py-3.5 bg-(--color-primary) text-white rounded-md font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-(--color-primary)/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-5">
              We respect your privacy. No spam, ever.
            </p>
          </>
        ) : (
          <div className="py-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-emerald-500 animate-[scaleIn_0.5s_ease-out]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">You're All Set!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 px-4">
              Thank you for subscribing to the HANDI newsletter. We've added <b className="text-gray-700">{email}</b> to our list. Look out for our next update!
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md transform active:scale-[0.98]"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
