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

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Features", href: "/features" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/about" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Electrical", href: "/services?category=electrical" },
      { label: "Plumbing", href: "/services?category=plumbing" },
      { label: "Beauty & Wellness", href: "/services?category=beauty" },
      { label: "Cleaning", href: "/services?category=cleaning" },
      { label: "Home Improvement", href: "/services?category=home" },
      { label: "View All Services", href: "/services" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Safety Guidelines", href: "/safety" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { label: "Become a Provider", href: "/become-provider" },
      { label: "Provider Dashboard", href: "/become-provider" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "For Businesses", href: "/become-provider" },
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

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [careersModalOpen, setCareersModalOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <>
      {/* ========================================
          MAIN FOOTER
      ======================================== */}
      <footer className="bg-[#1a1a2e] text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">
            {/* Brand Section */}
            <div className="lg:max-w-xs flex-shrink-0">
              <Image
                src="/images/handi-logo-dark.png"
                alt="HANDI"
                width={100}
                height={40}
                className="h-10 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Connecting service professionals with customers. Book
                appointments, discover new products, and transform your
                experience with HANDI.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={14} className="text-[var(--color-secondary)]" />
                  <span>+234 800 426 3400</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={14} className="text-[var(--color-secondary)]" />
                  <span>support@handiapp.com.ng</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="text-[var(--color-secondary)]" />
                  <span>Port Harcourt, Nigeria</span>
                </div>
              </div>

              {/* App Download Badges */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.27 2.33-1.96 4.15-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] leading-none opacity-70">
                      Download on
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      App Store
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.324l-2.302 2.303L5.864 2.658z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] leading-none opacity-70">
                      Get it on
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      Google Play
                    </p>
                  </div>
                </button>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="font-heading font-bold text-sm mb-4 text-white">
                    {column.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        {link.label === "Careers" ? (
                          <button
                            onClick={() => setCareersModalOpen(true)}
                            className="text-sm text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                Payment Methods
              </p>
              <div className="flex items-center gap-3">
                {/* Visa */}
                <div
                  className="h-8 w-12 rounded bg-white flex items-center justify-center"
                  title="Visa"
                >
                  <svg viewBox="0 0 48 32" className="h-5 w-8">
                    <rect width="48" height="32" rx="4" fill="#1A1F71" />
                    <text
                      x="24"
                      y="20"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      fontStyle="italic"
                      fontFamily="Arial"
                    >
                      VISA
                    </text>
                  </svg>
                </div>
                {/* Mastercard */}
                <div
                  className="h-8 w-12 rounded bg-white flex items-center justify-center"
                  title="Mastercard"
                >
                  <svg viewBox="0 0 48 32" className="h-5 w-8">
                    <rect width="48" height="32" rx="4" fill="#252525" />
                    <circle cx="19" cy="16" r="8" fill="#EB001B" />
                    <circle cx="29" cy="16" r="8" fill="#F79E1B" />
                    <path
                      d="M24 10a8 8 0 010 12 8 8 0 010-12z"
                      fill="#FF5F00"
                    />
                  </svg>
                </div>
                {/* Verve */}
                <div
                  className="h-8 w-12 rounded bg-white flex items-center justify-center"
                  title="Verve"
                >
                  <svg viewBox="0 0 48 32" className="h-5 w-8">
                    <rect width="48" height="32" rx="4" fill="#00425F" />
                    <text
                      x="24"
                      y="20"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Arial"
                    >
                      VERVE
                    </text>
                  </svg>
                </div>
                {/* Paystack */}
                <div
                  className="h-8 w-12 rounded bg-white flex items-center justify-center"
                  title="Paystack"
                >
                  <svg viewBox="0 0 48 32" className="h-5 w-8">
                    <rect width="48" height="32" rx="4" fill="#00C3F7" />
                    <rect
                      x="17"
                      y="8"
                      width="14"
                      height="3"
                      rx="1.5"
                      fill="#fff"
                    />
                    <rect
                      x="17"
                      y="14"
                      width="14"
                      height="3"
                      rx="1.5"
                      fill="#fff"
                    />
                    <rect
                      x="17"
                      y="20"
                      width="10"
                      height="3"
                      rx="1.5"
                      fill="#011B33"
                    />
                  </svg>
                </div>
                {/* Bank Transfer */}
                <div
                  className="h-8 w-12 rounded bg-white flex items-center justify-center"
                  title="Bank Transfer"
                >
                  <svg viewBox="0 0 48 32" className="h-5 w-8">
                    <rect width="48" height="32" rx="4" fill="#245e37" />
                    <rect
                      x="14"
                      y="9"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#fff"
                    />
                    <polygon points="24,6 34,12 14,12" fill="#fff" />
                    <rect x="16" y="14" width="2" height="8" fill="#fff" />
                    <rect x="21" y="14" width="2" height="8" fill="#fff" />
                    <rect x="26" y="14" width="2" height="8" fill="#fff" />
                    <rect x="30" y="14" width="2" height="8" fill="#fff" />
                    <rect
                      x="14"
                      y="23"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#fff"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-500 text-sm">
                Copyright {new Date().getFullYear()} ©HANDI. All Rights Reserved
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/terms"
                  className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/safety"
                  className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                >
                  Safety
                </Link>
              </div>
              <p className="text-gray-600 text-xs">
                HANDI Limited is a registered company in Nigeria
              </p>
            </div>
          </div>
        </div>
      </footer>
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
    </>
  );
}
