import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // LOGGING UTAMA: Lihat cookie apa saja yang masuk
  const allCookies = request.cookies.getAll();
  console.log("Middleware Cookies:", allCookies.map(c => c.name)); 

  const refreshToken = request.cookies.get('refreshToken'); 
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/auth/google/callback')) {
    return NextResponse.next();
  }

  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/profile');

  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register');

  // KASUS 1: Akses Dashboard tanpa token
  if (isProtectedPage && !refreshToken) {
    console.log(`[BLOCKED] Access to ${pathname} denied. Missing refreshToken.`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // KASUS 2: Sudah login tapi buka Login
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};