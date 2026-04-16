import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the IDE browser preview (proxied on 127.0.0.1) to receive HMR from the
  // dev server running on localhost:3000. Required by Next.js 16 cross-origin check.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "**.inspiretienda.com",
      },
      {
        protocol: "https",
        hostname: "**.inspiretienda.com",
      },
      {
        protocol: "http",
        hostname: "rd.inspiretienda.com",
      },
      {
        protocol: "https",
        hostname: "rd.inspiretienda.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.shopifycdn.com",
      }
    ],
  },
};

export default nextConfig;
