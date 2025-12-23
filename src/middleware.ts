// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah user punya cookie 'refreshToken' (tanda user login)
  const refreshToken = request.cookies.get('refreshToken'); 
  const pathname = request.nextUrl.pathname;

  // Daftar halaman yang WAJIB login (Protected Routes)
  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/profile');

  // Daftar halaman Khusus Tamu (Auth Routes)
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register');

  // KASUS 1: User mencoba masuk Dashboard tapi TIDAK punya token -> TENDANG KE LOGIN
  if (isProtectedPage && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // KASUS 2: User SUDAH login tapi mencoba masuk halaman Login -> TENDANG KE DASHBOARD
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};