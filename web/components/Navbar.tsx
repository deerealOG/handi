"use client";

import SearchFilter from "@/components/SearchFilter";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ChevronDown,
  Download,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "home", label: "HOME", href: "/" },
  { id: "services", label: "SERVICES", href: "/services" },
  { id: "products", label: "PRODUCTS", href: "/products" },
  { id: "providers", label: "PROVIDERS", href: "/providers" },
  { id: "how-it-works", label: "HOW IT WORKS", href: "/how-it-works" },
  { id: "deals", label: "DEALS", href: "/deals" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [careersModalOpen, setCareersModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const { cartItems, wishlistItems, cartCount, wishlistCount } = useCart();

  const categoriesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const activeLink = NAV_LINKS.find((l) => l.href === pathname)?.id || "home";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* ── Row 1: Logo + Categories Dropdown + Search + Icons ── */}
        <div className="flex items-center h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/handi-logo-light.png"
              alt="HANDI"
              width={120}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 relative" ref={filterRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-2"
            >
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search for services, providers..."
                className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`text-gray-400 hover:text-gray-600 cursor-pointer transition-colors ${filterOpen ? "text-[var(--color-primary)]" : ""}`}
              >
                <SlidersHorizontal size={16} />
              </button>
            </form>
            {filterOpen && (
              <SearchFilter
                searchQuery={searchQuery}
                onClose={() => setFilterOpen(false)}
              />
            )}
          </div>

          {/* Right Nav Icons - Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === "/cart"
                  ? "text-[var(--color-primary)]"
                  : "text-gray-700 hover:text-[var(--color-primary)]"
              }`}
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors"
            >
              <Heart size={20} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors"
            >
              <HelpCircle size={20} />
              <span>Help</span>
            </Link>

            {/* Account - Auth-aware */}
            <div className="relative" ref={accountRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                      {user?.firstName?.charAt(0) || "U"}
                    </div>
                    <span className="hidden xl:inline">{user?.firstName}</span>
                    <ChevronDown size={12} />
                  </button>

                  {accountOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Settings size={14} /> Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                >
                  <User size={20} className="text-(--color-primary)" />
                  <span>Account</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Row 2: Nav Links (Desktop) — right-aligned ── */}
        <div className="hidden lg:flex items-center justify-start gap-6 h-10 -mb-px">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`text-xs font-semibold tracking-wide transition-colors border-b-2 pb-2 ${
                activeLink === link.id
                  ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                  : "text-gray-600 border-transparent hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-full text-sm font-medium ${
                  activeLink === link.id
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <hr className="border-gray-200 my-2" />

            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-[var(--color-primary)] rounded-full"
            >
              <ShoppingCart size={18} />
              <span className="text-sm">Cart</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-[var(--color-primary)] rounded-full"
            >
              <Heart size={18} />
              <span className="text-sm">Wishlist</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-[var(--color-primary)] rounded-full"
            >
              <HelpCircle size={18} />
              <span className="text-sm">Help</span>
            </Link>

            <hr className="border-gray-200 my-2" />

            <button
              onClick={() => {
                setDownloadModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-medium text-sm w-full"
            >
              <Download size={18} />
              Download App
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-medium text-sm"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center h-11 rounded-full border border-gray-300 text-gray-900 font-medium text-sm"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center h-11 rounded-full bg-red-500 text-white font-medium text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center h-11 rounded-full border border-gray-300 text-gray-900 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center h-11 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      {/* Coming Soon Modals */}
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
    </header>
  );
}
