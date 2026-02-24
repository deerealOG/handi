import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix monorepo root detection for Turbopack
  turbopack: {
    root: path.dirname(__dirname),
  },
};

export default nextConfig;
