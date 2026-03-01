import CookieConsent from "@/components/CookieConsent";
import LocationPrompt from "@/components/LocationPrompt";
import NotificationToast from "@/components/NotificationToast";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HANDI - Find Trusted Service Providers Near You",
  description:
    "Connect with trusted local businesses and service providers, manage bookings effortlessly, and grow your business with our all-in-one platform designed for success.",
  keywords: [
    "service providers",
    "local services",
    "booking platform",
    "Nigeria",
    "artisans",
    "plumbers",
    "electricians",
    "home services",
  ],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "HANDI - Find Trusted Service Providers Near You",
    description:
      "Connect with trusted local businesses and service providers in Nigeria.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <ThemeProvider>
              <NotificationProvider>
                {children}
                <NotificationToast />
                <LocationPrompt />
                <ScrollToTop />
                <CookieConsent />
              </NotificationProvider>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
