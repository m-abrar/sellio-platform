import { toUserProfile } from './adapters';
import { apiRequest, buyerUrl, authUrl } from './apiClient';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  location?: string;
  member_since?: string;
  settings?: any;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const payload = await apiRequest<any>(buyerUrl('/settings'), { authenticated: true });
  return toUserProfile(payload?.user || payload);
}

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const payload = await apiRequest<any>(buyerUrl('/profile'), {
    method: 'PUT',
    authenticated: true,
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      settings: data.settings,
    }),
  });
  return toUserProfile(payload?.user || payload);
}

export async function updatePassword(data: {
  current_password: string;
  password:  string;
  password_confirmation: string;
}): Promise<void> {
  await apiRequest<any>(authUrl('/profile/password'), {
    method: 'PUT',
    authenticated: true,
    body: JSON.stringify(data),
  });
}
