/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@repo/db", "@repo/ui", "@repo/store"],

  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  },
};

module.exports = nextConfig;