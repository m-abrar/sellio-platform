import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || 'localhost:3000';

  // In a real SaaS, we would look up the theme_key by hostname.
  // For development, we can use a header or a default.
  // Default to 'unifieds_default' as it's our newly seeded main theme
  const themeKey = hostname.split('.')[0] === 'localhost' || hostname === 'localhost:3000' 
    ? 'unifieds_default' 
    : hostname.split('.')[0];

  // Pass the detected themeKey to the request headers
  // so the server components can use it via 'headers()'
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-theme-key', themeKey);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
