import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || 'localhost:3000';

  // In a real SaaS, we would look up the app_key by hostname.
  // For development, we can use a header or a default.
  const appKey = hostname.split('.')[0] === 'localhost:3000' 
    ? 'default_ecommerce' 
    : hostname.split('.')[0];

  // Pass the detected appKey to the request headers
  // so the server components can use it via 'headers()'
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-app-key', appKey);

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
