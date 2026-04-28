import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: Turbopack was walking up to C:\Users\debja\package.json (a stray MediaPipe file)
  // and treating it as the workspace root. Anchoring to "." fixes all module resolution.
  turbopack: {
    root: ".",
  },
  // Ensure ESM-only packages are transpiled correctly by Next.js
  transpilePackages: [
    "@creit.tech/stellar-wallets-kit",
    "@stellar/stellar-sdk",
    "@stellar/stellar-base",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // stellar-sdk references Node built-ins and axios in SSR; stub them in browser bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        axios: false,
      };
    }
    return config;
  },
};

export default nextConfig;

