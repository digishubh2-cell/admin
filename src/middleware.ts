import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/api/config";

const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Same-origin API proxy — must not require auth cookies (login sets them).
  if (pathname.startsWith("/api/backend")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const accessToken = request.cookies.get(AUTH_COOKIE.access);

  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip static assets. Keep /api/backend in the matcher so we can
     * explicitly pass it through above (do not auth-gate the proxy).
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
