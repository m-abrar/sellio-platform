'use client';

import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLink } from '@/lib/links';

export function useRentalThemeLink() {
  const { themeKey, isPreview } = useMenuContext();
  return (path = '') => getThemeLink(path, themeKey, isPreview);
}
