const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * Dev: Vite env. Production: editable public/config.js (no rebuild).
 */
export function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    const envUrl = import.meta.env.VITE_API_URL?.trim();
    if (envUrl) return trimTrailingSlash(envUrl);
    return 'http://127.0.0.1:8000/api';
  }

  const runtimeUrl = window.SELLIO_CONFIG?.apiUrl?.trim();
  if (runtimeUrl) {
    return trimTrailingSlash(runtimeUrl);
  }

  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return trimTrailingSlash(envUrl);

  return 'http://127.0.0.1:8000/api';
}

export function resolveStorefrontBaseUrl(): string {
  if (import.meta.env.DEV) {
    return trimTrailingSlash(import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3000');
  }

  const runtimeUrl = window.SELLIO_CONFIG?.storefrontUrl?.trim();
  if (runtimeUrl) {
    return trimTrailingSlash(runtimeUrl);
  }

  const envUrl = import.meta.env.VITE_STOREFRONT_URL?.trim();
  if (envUrl) return trimTrailingSlash(envUrl);

  return 'http://localhost:3000';
}
