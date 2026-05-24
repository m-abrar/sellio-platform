import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Sellio Theme Orchestration Middleware
 * 
 * Intercepts theme-specific URLs and query parameters to inject 
 * theme overrides into the request cycle via headers and cookies.
 */
export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const themeParam = url.searchParams.get('theme');
  const pathname = url.pathname;
  
  let themeKey: string | null = null;

  // 1. Check for dedicated preview path: /preview/[themeKey]/[...rest]
  if (pathname.startsWith('/preview/')) {
    const segments = pathname.split('/');
    themeKey = segments[2];
    const restOfPath = '/' + segments.slice(3).join('/');
    
    // Transparent rewrite to the actual path while keeping the theme URL
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-theme-key', themeKey);
    requestHeaders.set('x-preview-mode', '1');
    requestHeaders.set('x-pathname', pathname);

    const response = NextResponse.rewrite(new URL(restOfPath, request.url), {
      request: { headers: requestHeaders },
    });

    response.headers.set('x-theme-key', themeKey);
    response.headers.set('x-preview-mode', '1');
    response.headers.set('x-pathname', pathname);
    response.cookies.set('theme', themeKey, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    return response;
  } 
  
  // 2. Check for query parameter: ?theme=[themeKey]
  else if (themeParam) {
    themeKey = themeParam;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-theme-key', themeKey);
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set('x-theme-key', themeKey);
    response.cookies.set('theme', themeKey, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
