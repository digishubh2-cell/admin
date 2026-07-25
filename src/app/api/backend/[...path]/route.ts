import { NextRequest, NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/api/backend-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Same-origin Backend proxy.
 *
 * Browser → /api/backend/* → this handler → BACKEND_URL/api/*
 *
 * Example:
 *   Incoming: /api/backend/auth/login  (params.path = ['auth','login'])
 *   Upstream: https://<host>/api/auth/login
 *
 * Never forward request.nextUrl.pathname — that would send /api/backend/...
 * to Express, which only mounts /api/auth, /api/blogs, etc.
 *
 * Why not next.config rewrites alone?
 * Vercel/Next rewrites to an external origin often drop or mishandle
 * Set-Cookie. Auth cookies must bind to admin.shubhdigi.in so middleware
 * can read sd_access_token — we forward Set-Cookie and strip Domain.
 */

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
]);

/** Host-only cookie on the admin origin; Path=/ for middleware. */
function rewriteSetCookie(setCookie: string): string {
  const parts = setCookie
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  const out: string[] = [];
  let hasPath = false;

  for (const part of parts) {
    if (/^domain=/i.test(part)) continue;
    if (/^path=/i.test(part)) {
      hasPath = true;
      out.push("Path=/");
      continue;
    }
    out.push(part);
  }

  if (!hasPath) out.push("Path=/");
  return out.join("; ");
}

function getUpstreamSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetUrl = buildBackendApiUrl(path, request.nextUrl.search);

  const headers = new Headers();
  for (const name of [
    "authorization",
    "cookie",
    "content-type",
    "accept",
    "accept-language",
  ] as const) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, init);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Backend unreachable";
    return NextResponse.json(
      { success: false, message: `Proxy error: ${message}` },
      { status: 502 }
    );
  }

  const body = await upstream.arrayBuffer();
  const outHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || lower === "set-cookie") return;
    outHeaders.set(key, value);
  });

  for (const cookie of getUpstreamSetCookies(upstream)) {
    outHeaders.append("set-cookie", rewriteSetCookie(cookie));
  }

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
