/**
 * Build theme-aware links that preserve /preview/{theme_key} routing.
 */
export function getThemeLink(path: string, themeKey?: string, isPreview = false): string {
  if (path.startsWith('#') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (isPreview && themeKey) {
    return `/preview/${themeKey}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  return normalizedPath;
}

export function getThemeLinkFromPathname(path: string, pathname: string, themeKey?: string): string {
  const isPreview = pathname.startsWith('/preview/');

  if (isPreview) {
    const previewTheme = pathname.split('/')[2] ?? themeKey;
    if (previewTheme) {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return `/preview/${previewTheme}${normalizedPath === '/' ? '' : normalizedPath}`;
    }
  }

  return path.startsWith('/') ? path : `/${path}`;
}
