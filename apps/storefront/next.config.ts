import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
