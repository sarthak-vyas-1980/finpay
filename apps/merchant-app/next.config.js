const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    // Monorepo: allow Next to trace files from ../../packages
    outputFileTracingRoot: path.join(__dirname, "../../"),

    outputFileTracingIncludes: {
      "/*": ["../../packages/db/generated/client/**"],
    },
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      recoil: path.resolve(__dirname, "../../node_modules/recoil"),
    };
    return config;
  },
};
