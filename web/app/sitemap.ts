import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://handiapp.com.ng";

  // Static public routes that should be indexed by Google
  const routes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/help",
    "/how-it-works",
    "/privacy",
    "/terms",
    "/safety",
    "/sell-on-handi",
    "/become-provider",
    "/services",
    "/products",
    "/deals",
    "/official-stores",
    "/providers",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly", // Homepage changes often
    priority: route === "" ? 1 : 0.8, // Prioritize homepage
  }));
}
