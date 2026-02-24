"use client";

import { Download, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { id: "home", label: "HOME", href: "/" },
  { id: "services", label: "SERVICES", href: "/services" },
  { id: "products", label: "PRODUCTS", href: "/products" },
  { id: "providers", label: "PROVIDERS", href: "/providers" },
  { id: "how-it-works", label: "HOW IT WORKS", href: "/how-it-works" },
];

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--color-primary)] relative z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/handi-logo-dark.png"
              alt="HANDI"
              width={120}
              height={48}
              className="h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  activeTab === link.id
                    ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)] pb-1"
                    : "text-white hover:text-[var(--color-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[50px] border border-[var(--color-secondary)] text-[var(--color-secondary)] text-sm font-medium hover:bg-[var(--color-secondary)]/10 transition-colors">
              <Download size={16} />
              Download App
            </button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-10 px-5 rounded-[50px] border border-white text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-10 px-5 rounded-[50px] bg-[var(--color-secondary)] text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[var(--color-primary)] shadow-float p-6 animate-fadeIn">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-base font-medium tracking-wide py-2 ${
                    activeTab === link.id
                      ? "text-[var(--color-secondary)]"
                      : "text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-white/30 my-2" />

              <button className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[50px] border border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium">
                <Download size={18} />
                Download App
              </button>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-12 px-5 rounded-[50px] border border-white text-white font-medium"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-12 px-5 rounded-[50px] bg-[var(--color-secondary)] text-gray-900 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
