import type { NextConfig } from "next";

/**
 * Admin auth relies on HttpOnly cookies readable by middleware on this host.
 * Browser must call same-origin `/api/backend/*` (NEXT_PUBLIC_API_URL=/api/backend)
 * so Set-Cookie attaches to admin.shubhdigi.in — not the API host.
 *
 * Primary proxy: `src/app/api/backend/[...path]/route.ts` (forwards Set-Cookie,
 * strips Domain). BACKEND_URL is server-only.
 *
 * Rewrite below is a fallback only; the Route Handler takes precedence for
 * /api/backend when both exist.
 *
 * Destination is `${origin}/api/:path*` — never `/api/backend/:path*`.
 */
function normalizeBackendUrl(raw?: string): string {
  let url = (raw || "http://localhost:5001").trim().replace(/\/+$/, "");
  url = url.replace(/\/api\/backend$/i, "").replace(/\/api$/i, "");
  return url.replace(/\/+$/, "");
}

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
    const backendUrl = normalizeBackendUrl(process.env.BACKEND_URL);
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
