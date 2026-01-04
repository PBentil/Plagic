import { NextRequest, NextResponse } from "next/server";

const AUTH_PAGES = ["/", "/forgot-password", "/reset-password"];
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin", "/account-settings"],
  LECTURER: ["/dashboard", "/checker", "/archive", "/account-settings"],
  STUDENT: ["/dashboard", "/checker", "/account-settings"],
};

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/lecturer") ||
      pathname.startsWith("/student") 
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const decoded = decodeJWT(token);
  const role = decoded?.role;

  if (!role) return NextResponse.redirect(new URL("/", req.url));

  if (AUTH_PAGES.includes(pathname)) {
    switch (role) {
      case "ADMIN":
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      case "LECTURER":
        return NextResponse.redirect(new URL("/lecturer/dashboard", req.url));
      case "STUDENT":
        return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }

  const allowedRoutes = ROLE_ROUTES[role] || [];
  const isAllowed = allowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checker/:path*",
    "/archive/:path*",
    "/account-settings",
    "/",
    "/forgot-password",
    "/reset-password",
  ],
};

