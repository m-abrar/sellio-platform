import type { Theme } from '@sellio/types';
import { headers } from 'next/headers';
import { fetchAdminBarContext } from '@/lib/admin-bar-context';
import { fetchAdminUser } from '@/lib/admin-bar-auth';
import { AdminBarClient, type AdminMenuLink } from '@/components/AdminBarClient';

interface AdminBarProps {
  theme: Theme;
}

function resolveRequestHostname(headerList: Headers): string {
  const hostHeader = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '';

  return hostHeader.split(':')[0] || '127.0.0.1';
}

export async function AdminBar({ theme }: AdminBarProps) {
  const headerList = await headers();
  const cookieHeader = headerList.get('cookie') ?? '';
  const hostname = resolveRequestHostname(headerList);

  const user = await fetchAdminUser(cookieHeader, hostname);
  const context = user
    ? await fetchAdminBarContext(theme.theme_key, cookieHeader, hostname)
    : null;

  const themePages = (context?.pages ?? []).map((page) => ({ page }));

  const adminMenus: AdminMenuLink[] = (context?.menus ?? []).map((menu) => ({
    id: menu.id,
    title: menu.title,
    locationKey: menu.location_key,
  }));

  const enabledModules = context?.enabledModules ?? [];

  return (
    <AdminBarClient
      initialAuthenticated={Boolean(user)}
      theme={theme}
      themePages={themePages}
      adminMenus={adminMenus}
      enabledModules={enabledModules}
      requestHostname={hostname}
    />
  );
}
