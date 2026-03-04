"use client";

import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { CLIENT_TABS, type ClientTabId } from "@/data/landingData";
import {
    Bell,
    Heart,
    Menu,
    Moon,
    Power,
    Search,
    ShoppingCart,
    Sun,
    X,
} from "lucide-react";
import Image from "next/image";

interface ClientHeaderProps {
  authUser: any;
  activeClientTab: ClientTabId;
  setActiveClientTab: (tab: ClientTabId) => void;
  clientSearchQuery: string;
  setClientSearchQuery: (q: string) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (v: boolean) => void;
  setShowCartPanel: (v: boolean) => void;
  setShowWishlistPanel: (v: boolean) => void;
  setShowNotifications: (v: boolean) => void;
  setShowLogoutConfirm: (v: boolean) => void;
}

export default function ClientHeader({
  authUser,
  activeClientTab,
  setActiveClientTab,
  clientSearchQuery,
  setClientSearchQuery,
  showMobileMenu,
  setShowMobileMenu,
  setShowCartPanel,
  setShowWishlistPanel,
  setShowNotifications,
  setShowLogoutConfirm,
}: ClientHeaderProps) {
  const { isDark, toggleDarkMode } = useTheme();
  const { cartCount, wishlistCount } = useCart();

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setActiveClientTab("home")}
                className="shrink-0 cursor-pointer"
              >
                <Image
                  src="/images/handi-logo-light.png"
                  alt="HANDI"
                  width={110}
                  height={36}
                  className="h-8 w-auto"
                  priority
                />
              </button>
            </div>
            <div className="hidden sm:flex flex-1 max-w-xl mx-6 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search services, providers..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
            </div>
            <div className="hidden sm:flex items-center gap-3">
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
                onClick={() => setShowCartPanel(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Cart"
              >
                <ShoppingCart size={20} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowWishlistPanel(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Wishlist"
              >
                <Heart size={20} className="text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveClientTab("profile")}
                className="w-9 h-9 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                title="Profile"
              >
                {authUser?.firstName?.charAt(0) || "U"}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <Power size={18} className="text-gray-500 hover:text-red-600" />
              </button>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer flex items-center justify-center"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Nav Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex quick-nav-bar overflow-x-auto no-scrollbar">
            {CLIENT_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveClientTab(tab.id)}
                  className={`quick-nav-pill cursor-pointer ${activeClientTab === tab.id ? "active" : ""}`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-100 sm:hidden flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileMenu(false)}
          />
          <div
            className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl flex flex-col animate-[slideLeft_0.3s_ease-out] overflow-y-auto ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-lg">
                  {authUser?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {authUser?.firstName || "User"} {authUser?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 py-4 px-3 flex flex-col gap-1">
              <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">
                Menu
              </p>
              {CLIENT_TABS.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveClientTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    style={{ animationDelay: `${index * 50 + 100}ms` }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer animate-stagger-item ${
                      activeClientTab === tab.id
                        ? "bg-(--color-primary-light) text-(--color-primary)"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        activeClientTab === tab.id
                          ? "text-(--color-primary)"
                          : "text-gray-400"
                      }
                    />
                    {tab.label}
                  </button>
                );
              })}

              <div className="h-px bg-gray-100 my-4 mx-2" />

              <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                My Stuff
              </p>

              <button
                onClick={() => {
                  setShowCartPanel(true);
                  setShowMobileMenu(false);
                }}
                style={{ animationDelay: "400ms" }}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors animate-stagger-item"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={18} className="text-gray-400" />
                  Cart
                </div>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowWishlistPanel(true);
                  setShowMobileMenu(false);
                }}
                style={{ animationDelay: "450ms" }}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors animate-stagger-item"
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} className="text-gray-400" />
                  Wishlist
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowNotifications(true);
                  setShowMobileMenu(false);
                }}
                style={{ animationDelay: "500ms" }}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors animate-stagger-item"
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-gray-400" />
                  Notifications
                </div>
                <span className="bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-2 py-0.5">
                  3
                </span>
              </button>

              <div className="h-px bg-gray-100 my-4 mx-2" />

              <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Settings
              </p>

              <button
                onClick={() => {
                  toggleDarkMode();
                }}
                style={{ animationDelay: "550ms" }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors animate-stagger-item"
              >
                {isDark ? (
                  <Sun size={18} className="text-yellow-500" />
                ) : (
                  <Moon size={18} className="text-gray-400" />
                )}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowMobileMenu(false);
                }}
                style={{ animationDelay: "600ms" }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-100 transition-colors animate-stagger-item"
              >
                <Power size={16} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
