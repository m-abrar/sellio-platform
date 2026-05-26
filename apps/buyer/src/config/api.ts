// API Configuration
// Buyer panel talks directly to the Laravel API.
// Default local backend: http://127.0.0.1:8000/api

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) return envUrl.replace(/\/+$/, '');

  return 'http://127.0.0.1:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();
export const PUBLIC_API_BASE_URL = `${API_BASE_URL}/v1`;
export const BUYER_API_BASE_URL = `${API_BASE_URL}/dashboard/user`;
export const AUTH_API_BASE_URL = `${PUBLIC_API_BASE_URL}/auth`;

export const IS_EXTERNAL_BACKEND = true;

export const STOREFRONT_BASE_URL = (
  import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export const storefrontExploreUrl = () => `${STOREFRONT_BASE_URL}/explore`;

export const storefrontListingUrl = (slugOrId?: string | number | null) => {
  if (!slugOrId) return storefrontExploreUrl();
  return `${STOREFRONT_BASE_URL}/product/${encodeURIComponent(String(slugOrId))}`;
};
