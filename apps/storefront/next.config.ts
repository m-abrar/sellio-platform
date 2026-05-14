import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sellio/types", "@sellio/api-client"],
  experimental: {
    externalDir: true,
    turbo: {
      resolveAlias: {
        "@sellio/types": "D:/Sellio/packages/types/src/index.ts",
        "@sellio/api-client": "D:/Sellio/packages/api-client/src/index.ts",
      },
    },
  },
};

export default nextConfig;
