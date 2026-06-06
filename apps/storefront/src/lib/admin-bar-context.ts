import { getAdminBaseUrl } from '@/lib/admin-urls';

export interface AdminBarContextMenu {
  id: number;
  title: string;
  location_key: string;
}

export interface AdminBarContext {
  pages: string[];
  menus: AdminBarContextMenu[];
  enabledModules: string[];
}

export async function fetchAdminBarContext(
  themeKey: string,
  cookieHeader = '',
  hostname?: string,
): Promise<AdminBarContext | null> {
  try {
    const response = await fetch(
      `${getAdminBaseUrl(hostname)}/admin-bar/context?theme_key=${encodeURIComponent(themeKey)}`,
      {
        headers: {
          Accept: 'application/json',
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();

    return {
      pages: Array.isArray(payload?.pages) ? payload.pages : [],
      menus: Array.isArray(payload?.menus) ? payload.menus : [],
      enabledModules: Array.isArray(payload?.enabled_modules) ? payload.enabled_modules : [],
    };
  } catch {
    return null;
  }
}
