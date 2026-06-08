'use client';

import { useMenuContext } from '@/components/menu/MenuProvider';
import { isDemoFallbackAllowed } from './demo-fallback';

export function useDemoFallbackAllowed(): boolean {
  const { isPreview } = useMenuContext();
  return isDemoFallbackAllowed(isPreview);
}
