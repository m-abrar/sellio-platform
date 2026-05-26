import { NextResponse } from 'next/server';
import { fetchAdminUser } from '@/lib/admin-bar-auth';

function resolveHostname(request: Request): string {
  const hostHeader = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';

  return hostHeader.split(':')[0] || '127.0.0.1';
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const hostname = resolveHostname(request);

  try {
    const user = await fetchAdminUser(cookieHeader, hostname);

    return NextResponse.json({
      authenticated: Boolean(user),
      user,
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 503 });
  }
}
