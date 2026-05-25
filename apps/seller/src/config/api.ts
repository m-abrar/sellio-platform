const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

// In dev, use same-origin `/api` so Vite proxies to Laravel and avoids CORS issues.
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || '/api',
);

export const AUTH_BASE = `${API_BASE_URL}/v1/auth`;
export const PARTNER_BASE = `${API_BASE_URL}/dashboard/partner`;

export const ALLOWED_SELLER_ROLES = ['partner', 'admin', 'super-admin'] as const;
export type SellerRole = (typeof ALLOWED_SELLER_ROLES)[number];
