const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Monorepo: allow Next to trace files from ../../packages
    outputFileTracingRoot: path.join(__dirname, "../../"),

    // Prisma is Node-only; keep it external for Server Components.
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

module.exports = nextConfig;
