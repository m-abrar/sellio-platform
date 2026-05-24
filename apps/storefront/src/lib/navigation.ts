'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getThemeLink } from '@/lib/links';

export function useThemePath(path: string, themeKey?: string, isPreview = false): string {
  return getThemeLink(path, themeKey, isPreview);
}

export function useNavActive(path: string, themeKey?: string, isPreview = false): boolean {
  const pathname = usePathname();
  const href = getThemeLink(path, themeKey, isPreview);
  const normalizedPath = stripPreviewPrefix(pathname);
  const normalizedHref = stripPreviewPrefix(href);

  if (normalizedHref === '/' || normalizedHref === '') {
    return normalizedPath === '' || normalizedPath === '/';
  }

  return normalizedPath === normalizedHref.replace(/^\//, '')
    || normalizedPath.startsWith(normalizedHref.replace(/^\//, '') + '/');
}

export function stripPreviewPrefix(path: string): string {
  const match = path.match(/^\/preview\/[^/]+(\/.*)?$/);
  if (!match) {
    return path.replace(/^\//, '');
  }

  return (match[1] ?? '/').replace(/^\//, '');
}

export function useResolvedMenuHref(url: string, themeKey?: string, isPreview = false): string {
  return useMemo(() => getThemeLink(url, themeKey, isPreview), [url, themeKey, isPreview]);
}
