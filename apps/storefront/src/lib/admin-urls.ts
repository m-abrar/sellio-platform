import type { Theme } from '@sellio/types';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;

  if (configured) {
    return stripTrailingSlash(configured);
  }

  return 'http://127.0.0.1:8000/api';
}

export function getAdminBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_URL;

  if (configured) {
    return stripTrailingSlash(configured);
  }

  return stripTrailingSlash(getApiBaseUrl().replace(/\/api$/, ''));
}

export interface AdminUrls {
  dashboard: string;
  themeEdit: string;
  contentEdit: (page: string) => string;
  pagesIndex: string;
  menuIndex: string;
  settings: string;
  logout: string;
}

export function buildAdminUrls(theme: Theme): AdminUrls {
  const base = getAdminBaseUrl();

  return {
    dashboard: `${base}/admin/welcome`,
    themeEdit: `${base}/admin/themes/${theme.id}/edit`,
    contentEdit: (page: string) =>
      `${base}/admin/content/${encodeURIComponent(page)}/${encodeURIComponent(theme.theme_key)}`,
    pagesIndex: `${base}/admin/content`,
    menuIndex: `${base}/admin/menu/${encodeURIComponent(theme.theme_key)}`,
    settings: `${base}/admin/settings`,
    logout: `${base}/logout`,
  };
}

export interface ThemePageLink {
  page: string;
}

export function getThemePages(_themeKey: string): ThemePageLink[] {
  const pages = ['home', 'explore', 'product', 'cart'];

  return pages.map((page) => ({ page }));
}
