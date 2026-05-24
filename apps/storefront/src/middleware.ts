import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Sellio Theme Orchestration Middleware
 * 
 * Intercepts theme-specific URLs and query parameters to inject 
 * theme overrides into the request cycle via headers and cookies.
 */
export function middleware(request: NextRequest) {
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
    const response = NextResponse.rewrite(new URL(restOfPath, request.url));

    // #region agent log
    fetch('http://127.0.0.1:7444/ingest/7299bd34-d23f-4a85-8035-1e1996ea1a56',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'706e24'},body:JSON.stringify({sessionId:'706e24',location:'middleware.ts:preview',message:'preview rewrite',data:{pathname,themeKey,restOfPath,requestCookieTheme:request.cookies.get('theme')??null},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    response.headers.set('x-theme-key', themeKey);
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
    const response = NextResponse.next();
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
