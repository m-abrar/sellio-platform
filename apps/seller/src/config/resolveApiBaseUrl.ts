const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

/**
 * Dev: Vite env + proxy. Production: editable public/config.js (no rebuild).
 */
export function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return trimTrailingSlash(import.meta.env.VITE_API_URL || '/api');
  }

  const runtimeUrl = window.SELLIO_CONFIG?.apiUrl?.trim();
  if (runtimeUrl) {
    return trimTrailingSlash(runtimeUrl);
  }

  return trimTrailingSlash(import.meta.env.VITE_API_URL || '/api');
}
