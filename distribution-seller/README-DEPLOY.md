# Sellio Partner (Seller) Panel — deploy package

Generated: 2026-06-07T17:35:39.491Z
Source repo: D:\Sellio

Upload **everything in this folder** to your seller subdomain document root
(for example `seller.yourdomain.com`). Files must sit next to `index.html`.

## 1. Configure API URL (no rebuild)

Edit `config.js` in this folder:

```js
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
};
```

Save and refresh the browser.

## 2. Laravel admin (CORS)

In Laravel admin → **Settings → General**, set **Partner Portal URL** to this panel's full URL
(for example `https://seller-panel.sellio.vebdez.com`). CORS updates automatically.

## 3. Demo login (after backend seed)

See `apps/backend/README.md` on the main site for partner demo credentials.

---
Build API URL used: `https://demo.sellio.vebdez.com/api`
Expected panel URL: `https://seller-panel.sellio.vebdez.com`
