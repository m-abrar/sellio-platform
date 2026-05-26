import { toUserProfile } from './adapters';
import { apiRequest, buyerUrl } from './apiClient';

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
    }),
  });
  return toUserProfile(payload?.user || payload);
}
