/**
 * Demo catalogue is only shown in preview or when NEXT_PUBLIC_DEMO_FALLBACK=true.
 */
export function isDemoFallbackAllowed(isPreview = false): boolean {
  if (isPreview) return true;
  if (process.env.NEXT_PUBLIC_DEMO_FALLBACK === 'true') return true;
  return false;
}
