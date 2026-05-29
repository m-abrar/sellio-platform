'use client';

import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLink } from '@/lib/links';

/** Property detail route for properties_classic (preview + live). */
export const CLASSIC_LISTING_BASE = '/listing';

export function classicListingPath(slug: string): string {
  return `${CLASSIC_LISTING_BASE}/${slug}`;
}

export function useClassicThemeLink() {
  const { themeKey, isPreview } = useMenuContext();
  return (path: string) => getThemeLink(path, themeKey, isPreview);
}

export function useClassicListingLink() {
  const themeLink = useClassicThemeLink();
  return (slug: string) => themeLink(classicListingPath(slug));
}
