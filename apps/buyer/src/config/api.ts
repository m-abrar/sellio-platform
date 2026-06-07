import { resolveApiBaseUrl, resolveStorefrontBaseUrl } from './resolveApiBaseUrl';

// Production buyers edit public/config.js — no rebuild required.
export const API_BASE_URL = resolveApiBaseUrl();
export const PUBLIC_API_BASE_URL = `${API_BASE_URL}/v1`;
export const BUYER_API_BASE_URL = `${API_BASE_URL}/dashboard/user`;
export const AUTH_API_BASE_URL = `${PUBLIC_API_BASE_URL}/auth`;

export const IS_EXTERNAL_BACKEND = true;

export const STOREFRONT_BASE_URL = resolveStorefrontBaseUrl();

export { storefrontExploreUrl, storefrontListingUrl, normalizeStorefrontModule } from './storefrontUrls';
