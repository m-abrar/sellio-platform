import { apiClient, unwrapData } from '../lib/apiClient';
import { clearAuth, setStoredUser, setToken } from '../lib/authStorage';
import type { AuthUser, LoginResponseData } from '../types/api';

export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post(`/v1/auth/login`, credentials);
  const data = unwrapData<LoginResponseData>(response);

  setToken(data.access_token);

  const user = await getMe();
  return { ...data, user };
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/v1/auth/logout');
  } finally {
    clearAuth();
  }
};

export const refreshToken = async (): Promise<string> => {
  const response = await apiClient.post('/v1/auth/refresh-token');
  const data = unwrapData<{ access_token: string }>(response);
  setToken(data.access_token);
  return data.access_token;
};

export const getMe = async (): Promise<AuthUser> => {
  const response = await apiClient.get('/v1/auth/me');
  const user = unwrapData<AuthUser>(response);
  setStoredUser(user);
  return user;
};
