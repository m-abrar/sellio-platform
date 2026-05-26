import { headers } from 'next/headers';
import { fetchAdminUser } from '@/lib/admin-bar-auth';

export async function getAdminUser() {
  const headerList = await headers();
  const cookieHeader = headerList.get('cookie') ?? '';

  try {
    return await fetchAdminUser(cookieHeader);
  } catch {
    return null;
  }
}
