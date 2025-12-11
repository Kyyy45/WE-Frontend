import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Pastikan JWT_ACCESS_SECRET ada di .env.local dan SAMA dengan backend
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // 1. Proteksi Halaman Auth (Login/Register) -> Redirect jika sudah login
  if (accessToken && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    try {
      if (JWT_SECRET) {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(accessToken, secret);
        const role = payload.role as string;

        if (role === "admin") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else {
          return NextResponse.redirect(new URL("/dashboard/student", request.url));
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Token expired/invalid -> Hapus cookie & lempar ke login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // 2. Proteksi Halaman Dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      // Belum login -> lempar ke login
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Opsional: simpan URL tujuan agar bisa redirect balik setelah login
      return response;
    }

    try {
      if (JWT_SECRET) {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(accessToken, secret);
        const role = payload.role as string;

        // 3. Proteksi Role-Based
        
        // Jika User biasa coba masuk Admin -> Lempar ke Student Dashboard
        if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard/student", request.url));
        }

        // Jika Admin coba masuk Student (Opsional, biasanya admin punya akses, tapi kita pisah biar rapi)
        // Kita redirect admin ke dashboard admin jika dia nyasar ke student area
        if (pathname.startsWith("/dashboard/student") && role !== "user") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      // Token expired/invalid -> Hapus cookie & lempar ke login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

// Konfigurasi path yang akan dicek middleware
export const config = {
  matcher: [
    // Match semua path dashboard
    "/dashboard/:path*",
    // Match halaman auth
    "/login",
    "/register",
  ],
};