import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get("is_authenticated")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isAdminRoot = request.nextUrl.pathname === "/";
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // 1. If not authenticated or not an admin and trying to access /admin/* pages
  if (isAdminPath) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
    }

    // Check admin role (if userRole cookie exists)
    if (userRole && userRole !== "admin") {
      // If not an admin, can redirect to error page or logout
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }
  }

  // 2. If already authenticated and trying to access /login page
  if (isAuthenticated && isLoginPage) {
    const error = request.nextUrl.searchParams.get("error");
    // If we have an unauthorized error, stay on the login page to show it
    if (error === "unauthorized") {
      return NextResponse.next();
    }

    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin/patients";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // 3. Redirect home page based on status
  if (isAdminRoot) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/patients", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
