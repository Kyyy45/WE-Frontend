import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Backend menggunakan httpOnly cookie bernama 'refreshToken'
  const refreshToken = request.cookies.get("refreshToken");
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/google/callback")) {
    return NextResponse.next();
  }

  const isProtectedPage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Jika akses halaman terlindungi tanpa token -> Login
  if (isProtectedPage && !refreshToken) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Jika sudah login tapi akses halaman auth -> Dashboard
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
