"use client";

import SearchFilter from "@/components/SearchFilter";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import {
    ChevronDown,
    Download,
    Heart,
    HelpCircle,
    LayoutDashboard,
    Menu,
    Moon,
    Power,
    Search,
    Settings,
    ShoppingCart,
    SlidersHorizontal,
    Sun,
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
  const { isDark, toggleDarkMode } = useTheme();

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
        <div className="flex items-center h-14 gap-4 justify-between ">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/handi-logo-light.png"
              alt="HANDI"
              width={120}
              height={48}
              className="h-8 w-auto sm:h-10 sm:w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 relative" ref={filterRef}>
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
                className={`text-gray-400 hover:text-gray-600 cursor-pointer transition-colors ${filterOpen ? "text-(--color-primary)" : ""}`}
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
          <div className="lg:flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/cart"
                className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === "/cart"
                    ? "text-(--color-primary)"
                    : "text-gray-700 hover:text-(--color-primary)"
                }`}
              >
                <ShoppingCart size={20} />
                <span className="hidden lg:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-(--color-primary) transition-colors"
              >
                <Heart size={20} />
                <span className="hidden lg:block">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-(--color-primary) transition-colors"
              >
                <HelpCircle size={20} />
                <span className="hidden lg:block">Help</span>
              </Link>

              {/* Account - Auth-aware */}
              <div className="relative" ref={accountRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setAccountOpen(!accountOpen)}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-(--color-primary) transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-xs font-bold">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                      <span className="hidden xl:inline">
                        {user?.firstName}
                      </span>
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
                          <Power size={14} /> Log Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="hidden lg:flex items-center gap-3">
                    <Link
                      href="/login"
                      className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:text-(--color-primary) transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2 text-sm font-semibold bg-(--color-primary) text-white rounded-full hover:opacity-90 transition-opacity"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Actions: Dark Mode + Hamburger Menu */}
            <div className="flex items-center gap-1 ml-auto lg:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
              <button
                className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 2: Nav Links (Desktop) — right-aligned ── */}
        <div className="hidden lg:flex items-center justify-start gap-6 h-10 -mb-px">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`text-xs font-semibold tracking-wide transition-colors border-b-2 pb-2 ${
                activeLink === link.id
                  ? "text-(--color-primary) border-(--color-primary)"
                  : "text-gray-600 border-transparent hover:text-(--color-primary) hover:border-(--color-primary)"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Slide-out Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Panel */}
          <div
            className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col animate-[slideLeft_0.3s_ease-out] overflow-y-auto ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-4">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50 + 100}ms` }}
                  className={`px-3 py-2.5 rounded-full text-sm font-medium animate-stagger-item ${
                    activeLink === link.id
                      ? "bg-(--color-primary-light) text-(--color-primary)"
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
                style={{ animationDelay: "300ms" }}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-(--color-primary) rounded-full animate-stagger-item"
              >
                <ShoppingCart size={18} />
                <span className="text-sm">Cart</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: "350ms" }}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-(--color-primary) rounded-full animate-stagger-item"
              >
                <Heart size={18} />
                <span className="text-sm">Wishlist</span>
              </Link>
              <Link
                href="/help"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: "400ms" }}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-(--color-primary) rounded-full animate-stagger-item"
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
                style={{ animationDelay: "450ms" }}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-(--color-primary) text-(--color-primary) font-medium text-sm w-full animate-stagger-item"
              >
                <Download size={18} />
                Download App
              </button>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: "500ms" }}
                    className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-(--color-primary) text-(--color-primary) font-medium text-sm animate-stagger-item"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: "550ms" }}
                    className="inline-flex items-center justify-center h-11 rounded-full border border-gray-300 text-gray-900 font-medium text-sm animate-stagger-item"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    style={{ animationDelay: "600ms" }}
                    className="inline-flex items-center justify-center h-11 rounded-full bg-red-500 text-white font-medium text-sm animate-stagger-item"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: "500ms" }}
                    className="inline-flex items-center justify-center h-11 rounded-full border border-gray-300 text-gray-900 font-medium text-sm animate-stagger-item"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: "550ms" }}
                    className="inline-flex items-center justify-center h-11 rounded-full bg-(--color-primary) text-white font-medium text-sm animate-stagger-item"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
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
