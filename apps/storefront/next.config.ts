import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  turbopack: {
    // Packages are outside the storefront directory; set root to the monorepo
    // root so Turbopack can follow node_modules junctions into packages/.
    root: path.join(__dirname, "../.."),
  },
  experimental: {
    externalDir: true,
  },
  devIndicators: false,
  allowedDevOrigins: ["192.168.0.103"],
};

export default nextConfig;
