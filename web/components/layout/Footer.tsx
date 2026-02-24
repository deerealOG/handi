"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Electrical", href: "/services?category=electrical" },
      { label: "Plumbing", href: "/services?category=plumbing" },
      { label: "Beauty & Wellness", href: "/services?category=beauty" },
      { label: "Cleaning", href: "/services?category=cleaning" },
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
    title: "Solutions",
    links: [
      { label: "Features", href: "/features" },
      { label: "For Businesses", href: "/business-solutions" },
      { label: "Become a Provider", href: "/become-provider" },
      { label: "How It Works", href: "/how-it-works" },
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
  return (
    <footer className="bg-[var(--color-text)] text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
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
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting service professionals with customers. Book
              appointments, discover new products, and transform your experience
              with HANDI.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
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
                <h3 className="font-heading font-bold text-sm mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright {new Date().getFullYear()} ©HANDI. All Rights Reserved
          </p>
          <p className="text-gray-500 text-xs mt-1">
            HANDI Limited is a registered company in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
