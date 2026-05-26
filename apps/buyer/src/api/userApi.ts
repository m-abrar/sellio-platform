import { API_BASE_URL } from '../config/api';

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
  const response = await fetch(`${API_BASE_URL}/user/profile`);
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
}

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user profile');
  return response.json();
}
