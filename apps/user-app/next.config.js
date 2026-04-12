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
    serverComponentsExternalPackages: ["@prisma/client"],

    // Prisma Client is generated into a custom folder; include it (and its engine files)
    // in the serverless/standalone output so runtime DB calls work on Vercel.
    outputFileTracingIncludes: {
      "/*": ["../../packages/db/generated/client/**"],
    },
  },
};

module.exports = nextConfig;
