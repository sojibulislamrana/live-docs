import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Clerk-hosted profile images (OAuth providers, uploaded avatars)
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        // Clerk's own image CDN used for some OAuth provider photos
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
