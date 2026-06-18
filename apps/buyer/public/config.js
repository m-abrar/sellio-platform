/**
 * Sellio Buyer Panel — API connection (edit after upload, no rebuild needed)
 *
 * apiUrl        — Laravel backend URL + /api
 * storefrontUrl — Public storefront base URL
 */
window.SELLIO_CONFIG = {
  storefrontUrl: 'http://localhost:3003',
  apiUrl: 'http://127.0.0.1:8000/api',
  pusherKey: '2ee3bd5fd02d6c400553',
  pusherCluster: 'ap2',
  // Set when this panel lives in a subfolder, e.g. '/buyer'. Leave empty on a dedicated subdomain.
  basePath: '',
};
