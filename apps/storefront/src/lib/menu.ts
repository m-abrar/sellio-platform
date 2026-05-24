import { headers } from 'next/headers';
import { api } from '@sellio/api-client';
import type { MenuLocationKey, MenuMap } from '@sellio/types';
import { MENU_LOCATIONS } from '@sellio/types';
import { getMenuDefaults } from '@/lib/menu-defaults';

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
    const menus = await api.getMenus(locations, resolvedThemeKey);
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
