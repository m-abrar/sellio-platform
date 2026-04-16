// src/api/auth.ts

import api from './axios';

export const logout = () => api.post('/logout');
export const login = (data: any) => api.post('/login', data);
export const me = () => api.get('/me');

