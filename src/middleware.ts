import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/api/config";

const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const accessToken = request.cookies.get(AUTH_COOKIE.access);
  const refreshToken = request.cookies.get(AUTH_COOKIE.refresh);
  const hasSession = Boolean(accessToken || refreshToken);

  // No access or refresh cookie → bounce to login.
  // Refresh alone is enough: client axios interceptor /auth/refresh renews access.
  if (!isPublicRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in → leave /login for the dashboard (hard nav after login).
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip static assets AND all /api/* (Route Handler proxy must never
     * be auth-gated — login POST sets cookies via /api/backend/auth/login).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
