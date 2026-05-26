import { apiRequest, authUrl, clearToken, storeToken } from './apiClient';
import { toUserProfile } from './adapters';

export async function login(email: string, password: string) {
  const data = await apiRequest<any>(authUrl('/login'), {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.access_token) {
    storeToken(data.access_token);
  }

  return toUserProfile(data?.user);
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const payload = await apiRequest<any>(authUrl('/register'), {
    method: 'POST',
    body: JSON.stringify({ ...data, role: 'buyer' }),
  });

  if (payload?.access_token) {
    storeToken(payload.access_token);
  }

  return toUserProfile(payload?.user);
}

export async function logout() {
  try {
    await apiRequest(authUrl('/logout'), {
      method: 'POST',
      authenticated: true,
    });
  } finally {
    clearToken();
  }
}
