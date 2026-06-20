import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  experimental: {
    externalDir: true,
  },
  devIndicators: false,
  allowedDevOrigins: ["192.168.10.8"],
};

export default nextConfig;
