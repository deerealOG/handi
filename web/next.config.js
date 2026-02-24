/** @type {import("next").NextConfig} */
const nextConfig = {
  typescript: {
    // Avoid build failures in environments where TypeScript cannot spawn.
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
