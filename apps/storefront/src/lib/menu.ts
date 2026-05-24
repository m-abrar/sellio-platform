import { headers } from 'next/headers';
import { SellioAPI } from '@sellio/api-client';
import type { MenuLocationKey, MenuMap } from '@sellio/types';
import { MENU_LOCATIONS } from '@sellio/types';
import { getMenuDefaults } from '@/lib/menu-defaults';

function createApiClient() {
  return new SellioAPI();
}

async function fetchMenusFromApi(
  locations: MenuLocationKey[],
  themeKey?: string,
): Promise<MenuMap> {
  const client = createApiClient();

  if (typeof client.getMenus === 'function') {
    return client.getMenus(locations, themeKey);
  }

  const entries = await Promise.all(
    locations.map(async (location) => {
      const menu = await client.getMenu(location, themeKey);
      return [location, menu] as const;
    }),
  );

  return Object.fromEntries(entries) as MenuMap;
}

export async function resolveThemeKeyFromHeaders(): Promise<string | undefined> {
  const headerList = await headers();
  const headerTheme = headerList.get('x-theme-key');

  if (headerTheme) {
    return headerTheme;
  }

  const cookieHeader = headerList.get('cookie');
  return cookieHeader?.match(/(?:^|; )theme=([^;]*)/)?.[1];
}

export async function getMenus(
  locations: MenuLocationKey[] = MENU_LOCATIONS,
  themeKey?: string,
): Promise<{ menus: MenuMap; offline: boolean }> {
  const resolvedThemeKey = themeKey ?? (await resolveThemeKeyFromHeaders());

  try {
    const menus = await fetchMenusFromApi(locations, resolvedThemeKey);
    return { menus, offline: false };
  } catch {
    return {
      menus: getMenuDefaults(resolvedThemeKey, locations),
      offline: true,
    };
  }
}

export async function getMenu(
  location: MenuLocationKey,
  themeKey?: string,
): Promise<{ menu: MenuMap[MenuLocationKey]; offline: boolean }> {
  const { menus, offline } = await getMenus([location], themeKey);

  return {
    menu: menus[location],
    offline,
  };
}
