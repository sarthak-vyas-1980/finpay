/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@repo/db", "@repo/ui", "@repo/store"],
};

module.exports = nextConfig;