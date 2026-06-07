/**
 * Sellio Buyer Panel — API connection (edit after upload, no rebuild needed)
 *
 * apiUrl        — Laravel backend URL + /api
 * storefrontUrl — Public storefront base URL
 */
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
  storefrontUrl: 'https://your-laravel-domain.com',
  // Set when this panel lives in a subfolder, e.g. '/buyer'. Leave empty on a dedicated subdomain.
  basePath: '',
};
