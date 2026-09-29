import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // pdfjs-dist uses Node-only modules (canvas, fs) that don't exist in the
      // browser bundle.  Tell webpack to ignore them instead of erroring.
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
