/**
 * Vite `base` must be absolute (e.g. `/` or `/seller/`) so deep SPA routes
 * still load /assets/* instead of broken relative ./assets paths.
 */
export function resolveViteBase(rawBase?: string): string {
  const raw = (rawBase || '/').trim();

  if (raw === '' || raw === '/') {
    return '/';
  }

  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}
