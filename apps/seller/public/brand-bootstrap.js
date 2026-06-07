/**
 * Apply admin brand settings before React mounts (title, favicon, touch icon).
 * Reads API URL from public/config.js; React applies the same settings again after mount.
 */
(function () {
  var panelLabel = window.SELLIO_PANEL_LABEL || 'Partner Dashboard';

  function resolveApiBaseUrl() {
    var runtimeUrl = window.SELLIO_CONFIG && window.SELLIO_CONFIG.apiUrl;
    if (runtimeUrl) {
      return String(runtimeUrl).replace(/\/+$/, '');
    }

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return location.origin + '/api';
    }

    return location.origin + '/api';
  }

  function updateLink(rel, href, type) {
    var link = document.querySelector('link[rel="' + rel + '"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function faviconMimeType(url) {
    if (/\.ico($|\?)/i.test(url)) return 'image/x-icon';
    if (/\.svg($|\?)/i.test(url)) return 'image/svg+xml';
    if (/\.png($|\?)/i.test(url)) return 'image/png';
    if (/\.webp($|\?)/i.test(url)) return 'image/webp';
    return undefined;
  }

  function applyBrand(data) {
    if (!data) return;

    if (data.site_name) {
      document.title = data.site_name + ' - ' + panelLabel;
    }
    if (data.site_favicon) {
      var type = faviconMimeType(data.site_favicon);
      updateLink('icon', data.site_favicon, type);
      updateLink('alternate icon', data.site_favicon, type || 'image/x-icon');
    }
    if (data.site_logo) {
      updateLink('apple-touch-icon', data.site_logo);
    }
  }

  var apiBaseUrl = resolveApiBaseUrl();
  if (!apiBaseUrl) return;

  fetch(apiBaseUrl + '/v1/brand-settings', {
    headers: { Accept: 'application/json' },
    credentials: 'omit',
  })
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .then(function (payload) {
      applyBrand(payload && payload.data ? payload.data : payload);
    })
    .catch(function () {});
})();
