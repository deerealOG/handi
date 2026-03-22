"use client";

import ComingSoonModal from "@/components/ui/ComingSoonModal";
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import NewsletterPopup from "./NewsletterPopup";

// Map footer link hrefs to client Quick Nav tab IDs
const FOOTER_TO_TAB_MAP: Record<string, string> = {
  "/how-it-works": "how-it-works",
  "/services": "find-pros",
  "/services?category=electrical": "find-pros",
  "/services?category=plumbing": "find-pros",
  "/services?category=beauty": "find-pros",
  "/services?category=cleaning": "find-pros",
  "/services?category=home": "find-pros",
  "/become-provider": "how-it-works",
};

const FOOTER_COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Browse Services", href: "/services" },
      { label: "Become a Provider", href: "/become-provider" },
      { label: "Sell on HANDI", href: "/sell-on-handi" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Help & Legal",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Twitter, url: "https://twitter.com/handiapp", label: "Twitter" },
  { icon: Facebook, url: "https://facebook.com/handiapp", label: "Facebook" },
  {
    icon: Instagram,
    url: "https://instagram.com/handiapp",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    url: "https://linkedin.com/company/handiapp",
    label: "LinkedIn",
  },
];

const PAYMENT_METHODS = [
  {
    name: "Visa",
    svg: (
      <svg viewBox="0 0 48 32" className="h-5 w-8">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="24" y="20" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontStyle="italic" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    name: "Mastercard",
    svg: (
      <svg viewBox="0 0 48 32" className="h-5 w-8">
        <rect width="48" height="32" rx="4" fill="#252525" />
        <circle cx="19" cy="16" r="8" fill="#EB001B" />
        <circle cx="29" cy="16" r="8" fill="#F79E1B" />
        <path d="M24 10a8 8 0 010 12 8 8 0 010-12z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: "Verve",
    svg: (
      <svg viewBox="0 0 48 32" className="h-5 w-8">
        <rect width="48" height="32" rx="4" fill="#00425F" />
        <text x="24" y="20" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">VERVE</text>
      </svg>
    ),
  },
  {
    name: "Paystack",
    svg: (
      <svg viewBox="0 0 48 32" className="h-5 w-8">
        <rect width="48" height="32" rx="4" fill="#00C3F7" />
        <rect x="17" y="8" width="14" height="3" rx="1.5" fill="#fff" />
        <rect x="17" y="14" width="14" height="3" rx="1.5" fill="#fff" />
        <rect x="17" y="20" width="10" height="3" rx="1.5" fill="#011B33" />
      </svg>
    ),
  },
];

export default function Footer({
  isLoggedIn,
  onTabChange,
}: {
  isLoggedIn?: boolean;
  onTabChange?: (tabId: string) => void;
} = {}) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [careersModalOpen, setCareersModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const handleSubscribeClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterModalOpen(true);
  };

  return (
    <>
      <footer className="bg-gray-900 border-t border-gray-800 pt-10 pb-6 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto">
          {/* Top section: Brand + Links side by side */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-8">
            {/* Brand */}
            <div className="lg:max-w-xs shrink-0">
              <Image
                src="/images/handi-logo-dark.webp"
                alt="HANDI"
                width={100}
                height={40}
                className="h-8 w-auto mb-3"
              />
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Connecting service professionals with customers. Book
                appointments and discover products with HANDI.
              </p>

              {/* Contact Info */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={14} className="text-primary" />
                  <span>+234 800 426 3400</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={14} className="text-primary" />
                  <span>support@handiapp.com.ng</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="text-primary" />
                  <span>Port Harcourt, Nigeria</span>
                </div>
              </div>

              {/* App Download Badges */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/images/badges/app-store.svg"
                    alt="Download on the App Store"
                    width={120}
                    height={36}
                    className="h-[36px] w-auto"
                  />
                </button>
                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/images/badges/google-play.svg"
                    alt="Get it on Google Play"
                    width={120}
                    height={36}
                    className="h-[36px] w-auto"
                  />
                </button>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-(--color-primary) hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex-1 grid grid-cols-2 gap-8">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="font-bold text-sm mb-3 text-white">
                    {column.title}
                  </h3>
                  <ul className="space-y-2">
                    {column.links.map((link) => {
                      const mappedTab = FOOTER_TO_TAB_MAP[link.href];
                      if (link.label === "Careers") {
                        return (
                          <li key={link.label}>
                            <button
                              onClick={() => setCareersModalOpen(true)}
                              className="text-sm text-gray-400 hover:text-(--color-primary) transition-colors"
                            >
                              {link.label}
                            </button>
                          </li>
                        );
                      }
                      if (isLoggedIn && onTabChange && mappedTab) {
                        return (
                          <li key={link.label}>
                            <button
                              onClick={() => {
                                onTabChange(mappedTab);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-sm text-gray-400 hover:text-(--color-primary) transition-colors"
                            >
                              {link.label}
                            </button>
                          </li>
                        );
                      }
                      return (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-(--color-primary) transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Newsletter Column */}
            <div className="lg:w-[300px] mt-8 lg:mt-0 lg:ml-8 shrink-0">
              <h3 className="font-bold text-sm mb-3 text-white">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get updates on new features, special deals, and more.
              </p>
              <form onSubmit={handleSubscribeClick} className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors shadow-md cursor-pointer"
                >
                  Get the Newsletter
                </button>
              </form>
            </div>
          </div>

          {/* Payment Methods — compact row */}
          <div className="border-t border-gray-800 pt-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                Payment Methods
              </p>
              <div className="flex items-center gap-2">
                {PAYMENT_METHODS.map((pm) => (
                  <div
                    key={pm.name}
                    className="h-7 w-11 rounded bg-gray-800 border border-gray-700 flex items-center justify-center"
                    title={pm.name}
                  >
                    {pm.svg}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} HANDI. All Rights Reserved
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Terms</Link>
                <Link href="/privacy" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Privacy</Link>
                <Link href="/safety" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Safety</Link>
              </div>
              <p className="text-gray-500 text-xs">
                HANDI Limited — Registered in Nigeria
              </p>
            </div>
          </div>
        </div>
      </footer>
      {typeof document !== "undefined" && createPortal(
        <>
          <ComingSoonModal
            isOpen={downloadModalOpen}
            onClose={() => setDownloadModalOpen(false)}
            title="Download App"
            message="The HANDI mobile app is coming soon! We'll notify you when it's available on App Store and Google Play."
          />
          <ComingSoonModal
            isOpen={careersModalOpen}
            onClose={() => setCareersModalOpen(false)}
            title="Careers"
            message="We're building our careers page. Check back soon for exciting opportunities to join the HANDI team!"
          />
          {isNewsletterModalOpen && (
            <NewsletterPopup onForceClose={() => setIsNewsletterModalOpen(false)} />
          )}
        </>,
        document.body
      )}
    </>
  );
}
