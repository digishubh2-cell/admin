import type { NextConfig } from "next";

/**
 * Admin auth relies on HttpOnly cookies readable by middleware on this host.
 * Browser must call same-origin `/api/backend/*` (NEXT_PUBLIC_API_URL=/api/backend)
 * so Set-Cookie attaches to admin.shubhdigi.in — not the API host.
 * BACKEND_URL is server-only and powers the rewrite destination.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_URL || "http://localhost:5001"
    ).replace(/\/$/, "");
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
