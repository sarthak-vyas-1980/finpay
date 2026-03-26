/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  },
};

module.exports = nextConfig;