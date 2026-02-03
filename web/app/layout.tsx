import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { Red_Hat_Display, Roboto } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
      <body
        className={`${redHatDisplay.variable} ${roboto.variable} antialiased`}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
