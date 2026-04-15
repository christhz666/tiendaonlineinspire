import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
