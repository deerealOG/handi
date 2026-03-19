import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CookieConsent from "@/components/landing-page/CookieConsent";
import LocationPrompt from "@/components/landing-page/LocationPrompt";
import NewsletterPopup from "@/components/landing-page/NewsletterPopup";
import NotificationToast from "@/components/landing-page/NotificationToast";
import ScrollToTop from "@/components/ui/ScrollToTop";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://handiapp.com.ng"),
  title: {
    default: "HANDI - Find Trusted Service Providers Near You",
    template: "%s | HANDI",
  },
  description:
    "Connect with trusted local businesses and service providers in Nigeria. Book artisans, plumbers, electricians, cleaners, and buy quality products effortlessly.",
  keywords: [
    "service providers",
    "local services",
    "booking platform",
    "Nigeria",
    "artisans",
    "plumbers",
    "electricians",
    "home services",
    "verified professionals",
    "buy products online",
  ],
  authors: [{ name: "HANDI Team" }],
  creator: "HANDI",
  publisher: "HANDI Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    description: "Connect with trusted local businesses and service providers in Nigeria. Book professionals and buy quality products effortlessly.",
    url: "https://handiapp.com.ng",
    siteName: "HANDI",
    images: [
      {
        url: "/images/og-image.jpg", // Fallback OG image (can be added later)
        width: 1200,
        height: 630,
        alt: "HANDI - Trusted service providers in Nigeria",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HANDI - Trusted Service Providers in Nigeria",
    description: "Connect with trusted local businesses and artisans. Book services and buy products effortlessly.",
    images: ["/images/twitter-card.jpg"], // Fallback Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
