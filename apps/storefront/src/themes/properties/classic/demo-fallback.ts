/**
 * Demo catalogue (fallback-data.ts) is only shown when preview/demo mode is active.
 * Production storefronts must use the live API + seeded database.
 */
export function isDemoFallbackAllowed(isPreview = false): boolean {
  if (isPreview) return true;
  if (process.env.NEXT_PUBLIC_DEMO_FALLBACK === 'true') return true;
  return false;
}
