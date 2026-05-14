import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  experimental: {
    externalDir: true,
    turbo: {
      resolveAlias: {
        "@sellio/types": "../../packages/types/src/index.ts",
        "@sellio/api-client": "../../packages/api-client/src/index.ts",
      },
    },
  },
};

export default nextConfig;
