import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  /* config options here */
};

export default nextConfig;
