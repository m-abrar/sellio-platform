const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/**
 * Router basename when the panel is hosted in a subfolder (e.g. /seller).
 * Leave unset or empty when the panel owns the subdomain root.
 */
export function resolvePortalBasePath(): string {
  const raw = window.SELLIO_CONFIG?.basePath?.trim();

  if (!raw || raw === '/') {
    return '';
  }

  const normalized = trimTrailingSlash(raw);
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}
