import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  experimental: {
    externalDir: true,
  },
  devIndicators: false,
  allowedDevOrigins: ["192.168.0.112"],
};

export default nextConfig;
