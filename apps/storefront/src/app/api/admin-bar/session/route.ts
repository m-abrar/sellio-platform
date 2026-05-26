import { NextResponse } from 'next/server';
import { fetchAdminUser } from '@/lib/admin-bar-auth';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';

  try {
    const user = await fetchAdminUser(cookieHeader);

    return NextResponse.json({
      authenticated: Boolean(user),
      user,
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 503 });
  }
}
