/**
 * Sellio Partner Panel — API connection (edit after upload, no rebuild needed)
 *
 * Set apiUrl to your Laravel backend URL + /api
 * Example: https://marketplace.yourdomain.com/api
 */
window.SELLIO_CONFIG = {
  // Production: set this to your Laravel backend URL + /api, e.g. 'https://marketplace.yourdomain.com/api'
  // Development: leave empty — brand-bootstrap falls back to location.origin + '/api'
  apiUrl: '',
  // Set when this panel lives in a subfolder, e.g. '/seller'. Leave empty on a dedicated subdomain.
  basePath: '',
};
