import { api } from '@sellio/api-client';

export const login = (credentials: any) => api.auth.login(credentials);
export const logout = () => api.auth.logout();
export const me = () => api.auth.me();
