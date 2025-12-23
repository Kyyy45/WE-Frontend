import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil cookie refresh token
  const refreshToken = request.cookies.get('refreshToken'); //
  const pathname = request.nextUrl.pathname;

  // --- TAMBAHAN PENTING ---
  // Izinkan akses ke Google Callback tanpa pengecekan apa-apa
  if (pathname.startsWith('/auth/google/callback')) {
    return NextResponse.next();
  }
  // ------------------------

  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/profile');

  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register');

  // KASUS 1: Akses Dashboard tanpa token -> Login
  if (isProtectedPage && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // KASUS 2: Sudah login tapi buka Login -> Dashboard
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], //
};