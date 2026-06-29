import type { Theme } from '@/types';

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

export function getAdminBaseUrl(hostname?: string): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_URL;

  if (configured) {
    return stripTrailingSlash(configured);
  }

  const configuredApi = process.env.NEXT_PUBLIC_API_URL;

  if (configuredApi) {
    return stripTrailingSlash(configuredApi.replace(/\/api$/, ''));
  }

  const host = hostname || '127.0.0.1';

  return `http://${host}:8000`;
}

export const ADMIN_LISTING_MODULES = [
  'properties',
  'autos',
  'events',
  'jobs',
  'services',
  'classifieds',
  'products',
] as const;

export type AdminListingModule = (typeof ADMIN_LISTING_MODULES)[number];

export interface AdminCreateUrls {
  property: string;
  auto: string;
  event: string;
  job: string;
  service: string;
  classified: string;
  product: string;
  user: string;
  page: string;
  blog: string;
}

export interface AdminUrls {
  dashboard: string;
  themeEdit: string;
  contentEdit: (page: string) => string;
  pagesIndex: string;
  menuIndex: string;
  menuEdit: (menuId: number) => string;
  create: AdminCreateUrls;
  settings: string;
  logout: string;
}

export function buildAdminUrls(theme: Theme, hostname?: string): AdminUrls {
  const base = getAdminBaseUrl(hostname);
  const themeKey = encodeURIComponent(theme.theme_key);

  return {
    dashboard: `${base}/admin/welcome`,
    themeEdit: `${base}/admin/themes/${theme.id}/edit`,
    contentEdit: (page: string) =>
      `${base}/admin/content/${encodeURIComponent(page)}/${themeKey}`,
    pagesIndex: `${base}/admin/content?theme_key=${themeKey}`,
    menuIndex: `${base}/admin/menu/${themeKey}`,
    menuEdit: (menuId: number) => `${base}/admin/menu/${menuId}/edit`,
    create: {
      property: `${base}/admin/properties/create`,
      auto: `${base}/admin/autos/create`,
      event: `${base}/admin/events/create`,
      job: `${base}/admin/jobs/create`,
      service: `${base}/admin/services/create`,
      classified: `${base}/admin/classifieds/create`,
      product: `${base}/admin/products/create`,
      user: `${base}/admin/users/create`,
      page: `${base}/admin/pages/create`,
      blog: `${base}/admin/blogs/create`,
    },
    settings: `${base}/admin/settings`,
    logout: `${base}/logout`,
  };
}

export interface ThemePageLink {
  page: string;
}
