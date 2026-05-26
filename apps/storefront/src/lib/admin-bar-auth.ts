import { getAdminBaseUrl } from '@/lib/admin-urls';

export interface AdminUser {
  id: number;
  name: string;
  email?: string;
  roles?: string[];
}

const ADMIN_BAR_ROLES = new Set(['super-admin', 'admin']);

export function canShowAdminBar(user: AdminUser | null | undefined): boolean {
  if (!user?.roles?.length) {
    return false;
  }

  return user.roles.some((role) => ADMIN_BAR_ROLES.has(role));
}

export async function fetchAdminUser(cookieHeader = ''): Promise<AdminUser | null> {
  const response = await fetch(`${getAdminBaseUrl()}/admin-bar/status`, {
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();

  if (!payload?.authenticated || !payload?.user) {
    return null;
  }

  const user = payload.user as AdminUser;

  if (!canShowAdminBar(user)) {
    return null;
  }

  return user;
}
