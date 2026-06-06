'use client';

import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLink } from '@/lib/links';

export function useModernThemeLink() {
  const { themeKey, isPreview } = useMenuContext();
  return (path = '') => getThemeLink(path, themeKey, isPreview);
}
