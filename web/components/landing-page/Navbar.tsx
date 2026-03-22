"use client";

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
  UserCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchFilter from "./SearchFilter";

interface SubLink {
  label: string;
  href: string;
}
interface MegaColumn {
  title: string;
  links: SubLink[];
}
interface NavItem {
  id: string;
  label: string;
  href: string;
  columns?: MegaColumn[];
}

const NAV_LINKS: NavItem[] = [
  { id: "home", label: "HOME", href: "/" },
  {
    id: "providers",
    label: "PROVIDERS",
    href: "/providers",
    columns: [
      {
        title: "Find Providers",
        links: [
          { label: "Top Rated", href: "/providers?sort=rating" },
          { label: "Near You", href: "/providers?nearby=true" },
          { label: "Verified Pros", href: "/providers?verified=true" },
          { label: "All Providers", href: "/providers" },
        ],
      },
      {
        title: "For Providers",
        links: [
          { label: "Become a Provider", href: "/become-provider" },
          { label: "Sell on HANDI", href: "/sell-on-handi" },
        ],
      },
    ],
  },
  {
    id: "services",
    label: "SERVICES",
    href: "/services",
    columns: [
      {
        title: "Home Services",
        links: [
          { label: "Electrical Work", href: "/services?q=electrical" },
          { label: "Plumbing", href: "/services?q=plumbing" },
          { label: "Cleaning", href: "/services?q=cleaning" },
          { label: "Painting", href: "/services?q=painting" },
          { label: "AC & Refrigeration", href: "/services?q=ac-repair" },
        ],
      },
      {
        title: "Personal Services",
        links: [
          { label: "Beauty & Wellness", href: "/services?q=beauty" },
          { label: "Catering", href: "/services?q=catering" },
          { label: "Photography", href: "/services?q=photography" },
          { label: "Tutoring", href: "/services?q=tutoring" },
        ],
      },
    ],
  },
  {
    id: "shop",
    label: "SHOP",
    href: "/products",
    columns: [
      {
        title: "Categories",
        links: [
          { label: "Electronics & Electrical", href: "/products?category=electrical" },
          { label: "Power Tools", href: "/products?category=tools" },
          { label: "Cleaning Supplies", href: "/products?category=cleaning" },
          { label: "Plumbing Materials", href: "/products?category=plumbing" },
          { label: "Beauty Products", href: "/products?category=beauty" },
        ],
      },
      {
        title: "Popular",
        links: [
          { label: "Best Sellers", href: "/products?sort=best-selling" },
          { label: "Top Rated", href: "/products?sort=top-rated" },
          { label: "New Arrivals", href: "/products?sort=newest" },
          { label: "Deals & Discounts", href: "/products?deals=true" },
        ],
      },
    ],
  },
  {
    id: "official-stores",
    label: "OFFICIAL STORES",
    href: "/official-stores",
    columns: [
      {
        title: "Browse Stores",
        links: [
          { label: "All Official Stores", href: "/official-stores" },
          { label: "Electronics Stores", href: "/official-stores?category=electronics" },
          { label: "Home & Garden", href: "/official-stores?category=home" },
          { label: "Tools & Hardware", href: "/official-stores?category=tools" },
        ],
      },
    ],
  },
  {
    id: "how-it-works",
    label: "HOW IT WORKS",
    href: "/how-it-works",
    columns: [
      {
        title: "Learn More",
        links: [
          { label: "For Clients", href: "/how-it-works#clients" },
          { label: "For Providers", href: "/how-it-works#providers" },
          { label: "For Vendors", href: "/how-it-works#vendors" },
          { label: "Help Center", href: "/help" },
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
  },
  {
    id: "deals",
    label: "DEALS",
    href: "/deals",
    columns: [
      {
        title: "Hot Deals",
        links: [
          { label: "Flash Deals", href: "/deals?type=flash" },
          { label: "Clearance Sale", href: "/deals?type=clearance" },
          { label: "Buy 1 Get 1", href: "/deals?type=bogo" },
          { label: "Top Picks For You", href: "/deals?type=top-picks" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [careersModalOpen, setCareersModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-[9999]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* ── Row 1: Logo + Categories Dropdown + Search + Icons ── */}
        <div className="flex items-center h-14 gap-4 justify-between ">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/handi-logo-light.webp"
              alt="HANDI"
              width={120}
              height={48}
              className="h-8 w-auto sm:h-10 sm:w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div
            className="hidden lg:flex flex-2 max-w-2xl relative"
            ref={filterRef}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100 rounded-md px-4 py-3 gap-2 w-full"
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
              {/* Dashboard Link directly on Navbar for logged in users */}
              {isLoggedIn && user?.userType === "client" && (
                <Link
                  href="/dashboard"
                  className="relative flex items-center gap-1.5 text-sm font-medium transition-colors text-gray-700 hover:text-(--color-primary)"
                >
                  <LayoutDashboard size={20} />
                  <span className="hidden lg:block">Dashboard</span>
                </Link>
              )}

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
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-(--color-primary) transition-colors"
              >
                <HelpCircle size={20} />
                <span className="hidden lg:block">Help</span>
              </Link>

              {/* Dark Mode Toggle — Desktop */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>

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
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999] animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        
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
                    <div className="relative group/acct">
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-(--color-primary) hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <UserCircle size={18} />
                        Account
                      </button>
                      {/* Hover dropdown */}
                      <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover/acct:opacity-100 group-hover/acct:visible transition-all duration-200 z-[9999]">
                        <div className="bg-white dark:bg-gray-800 rounded shadow-xl border border-gray-100 dark:border-gray-700 border-t-3 border-t-(--color-primary) min-w-[200px] p-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Welcome to HANDI</p>
                          <Link
                            href="/login"
                            className="block w-full text-center py-2.5 bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-2 rounded-md"
                          >
                            Log In
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            New here?{" "}
                            <Link href="/signup" className="text-(--color-primary) font-semibold hover:underline">
                              Sign Up
                            </Link>
                          </p>
                          <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 space-y-1">
                            <Link href="/become-provider" className="block text-xs text-gray-600 dark:text-gray-400 hover:text-(--color-primary) transition-colors py-1">
                              Become a Provider
                            </Link>
                            <Link href="/sell-on-handi" className="block text-xs text-gray-600 dark:text-gray-400 hover:text-(--color-primary) transition-colors py-1">
                              Sell on HANDI
                            </Link>
                            <Link href="/help" className="block text-xs text-gray-600 dark:text-gray-400 hover:text-(--color-primary) transition-colors py-1">
                              Help Center
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
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

        {/* ── Row 2: Nav Links with Mega Menu (Desktop) ── */}
        <div className="hidden lg:flex items-center justify-start gap-0 h-10 -mb-px relative">
          {NAV_LINKS.map((link) => (
            <div key={link.id} className="relative group/nav">
              <Link
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors border-b-2 pb-2 px-3 block ${
                  activeLink === link.id
                    ? "text-(--color-primary) border-(--color-primary)"
                    : "text-gray-600 border-transparent hover:text-(--color-primary) hover:border-(--color-primary)"
                }`}
              >
                {link.label}
              </Link>
              {/* Mega Menu Dropdown */}
              {link.columns && (
                <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-[9999]">
                  <div className="bg-white rounded-b shadow-xl border border-gray-100 border-t-3 border-t-(--color-primary) min-w-[280px] p-4">
                    <div className={`grid gap-6 ${link.columns.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {link.columns.map((col) => (
                        <div key={col.title}>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            {col.title}
                          </h4>
                          <ul className="space-y-1">
                            {col.links.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className="block py-1.5 px-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-(--color-primary) rounded transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
