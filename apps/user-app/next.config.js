const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  },
};

module.exports = nextConfig;