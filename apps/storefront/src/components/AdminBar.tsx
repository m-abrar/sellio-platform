import type { MenuMap } from '@sellio/types';
import type { Theme } from '@sellio/types';
import { getAdminUser } from '@/lib/admin-auth.server';
import { getThemePages } from '@/lib/admin-urls';
import { AdminBarClient, type AdminMenuLink } from '@/components/AdminBarClient';

interface AdminBarProps {
  theme: Theme;
  menus: MenuMap;
}

function buildAdminMenus(menus: MenuMap): AdminMenuLink[] {
  return Object.values(menus)
    .filter((menu): menu is NonNullable<typeof menu> => Boolean(menu?.title))
    .map((menu) => ({
      title: menu.title,
      locationKey: menu.location_key,
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

export async function AdminBar({ theme, menus }: AdminBarProps) {
  const user = await getAdminUser();

  return (
    <AdminBarClient
      initialAuthenticated={Boolean(user)}
      theme={theme}
      themePages={getThemePages(theme.theme_key)}
      adminMenus={buildAdminMenus(menus)}
    />
  );
}
