import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "nayo_session";

const protectedRoutes = ["/dashboard", "/checkout"];
const authRoutes = ["/login", "/signup"];

/**
 * Optimistic auth redirects. This only checks for the presence of the session
 * cookie — full signature/expiry verification happens server-side in the Data
 * Access Layer (`requireUser`) when the route renders.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtected && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/login", "/signup"],
};
