/**
 * Build theme-aware links that preserve /preview/{theme_key} routing.
 */
export function getThemeLink(path: string, _themeKey?: string): string {
  if (path.startsWith('#') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;

    if (pathname.startsWith('/preview/')) {
      const previewTheme = pathname.split('/')[2];
      if (previewTheme) {
        return `/preview/${previewTheme}${normalizedPath === '/' ? '' : normalizedPath}`;
      }
    }
  }

  return normalizedPath;
}

export function getThemeLinkFromPathname(path: string, pathname: string): string {
  if (pathname.startsWith('/preview/')) {
    const previewTheme = pathname.split('/')[2];
    if (previewTheme) {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return `/preview/${previewTheme}${normalizedPath === '/' ? '' : normalizedPath}`;
    }
  }

  return path.startsWith('/') ? path : `/${path}`;
}
