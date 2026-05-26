import { headers } from 'next/headers';
import { fetchAdminUser } from '@/lib/admin-bar-auth';

export async function getAdminUser() {
  const headerList = await headers();
  const cookieHeader = headerList.get('cookie') ?? '';
  const hostHeader = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '';
  const hostname = hostHeader.split(':')[0] || '127.0.0.1';

  return fetchAdminUser(cookieHeader, hostname);
}
