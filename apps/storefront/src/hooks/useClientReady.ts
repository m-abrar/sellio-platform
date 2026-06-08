'use client';

import { useSyncExternalStore } from 'react';

/**
 * False during SSR and the first client render; true after hydration.
 * Use to defer markup that depends on browser-only state or mismatched SSR caches.
 */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
