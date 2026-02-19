import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default)
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // stellar-sdk references Node built-ins; stub them in the browser bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
      };
    }
    return config;
  },
};

export default nextConfig;
