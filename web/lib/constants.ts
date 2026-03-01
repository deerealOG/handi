// Application constants

export const SITE_CONFIG = {
  name: "HANDI",
  description: "Find Trusted Service Providers Near You",
  url: "https://handiapp.com.ng",
  supportPhone: "0800-HANDI-NG",
  supportEmail: "support@handiapp.com.ng",
};

export const NAV_LINKS = [
  { id: "home", label: "HOME", href: "/" },
  { id: "services", label: "SERVICES", href: "/services" },
  { id: "products", label: "PRODUCTS", href: "/products" },
  { id: "providers", label: "PROVIDERS", href: "/providers" },
  { id: "how-it-works", label: "HOW IT WORKS", href: "/how-it-works" },
];

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Electrical", href: "/services?category=electrical" },
    { label: "Plumbing", href: "/services?category=plumbing" },
    { label: "Beauty & Wellness", href: "/services?category=beauty" },
    { label: "Cleaning", href: "/services?category=cleaning" },
    { label: "View All Services", href: "/services" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "Safety Guidelines", href: "/safety" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  solutions: [
    { label: "Features", href: "/features" },
    { label: "For Businesses", href: "/business-solutions" },
    { label: "Become a Provider", href: "/become-provider" },
    { label: "How It Works", href: "/how-it-works" },
  ],
};
