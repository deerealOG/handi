import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix monorepo root detection for Turbopack
  turbopack: {
    root: path.dirname(__dirname),
  },

  // Serve modern image formats and only the sizes actually used in the app
  images: {
    formats: ["image/avif", "image/webp"],
    // Breakpoints matching the card/hero sizes used across the app
    deviceSizes: [320, 480, 640, 750, 1080, 1280],
    imageSizes: [28, 48, 80, 128, 160, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Ensure gzip/Brotli compression is active
  compress: true,
};

export default nextConfig;
