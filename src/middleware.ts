import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const pathname = request.nextUrl.pathname;

  // Izinkan callback Google lewat
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

  // KASUS 1: Akses Halaman Terlindungi tanpa Token -> Login
  if (isProtectedPage && !refreshToken) {
    const url = new URL("/login", request.url);
    // Simpan returnUrl agar bisa redirect balik (opsional)
    // url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // KASUS 2: Sudah Login tapi buka Login/Register -> Dashboard
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher mengecualikan file statis, gambar, api routes nextjs
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
