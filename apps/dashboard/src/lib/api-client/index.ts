import axios, { AxiosInstance } from 'axios';
import { User, Theme, Product, Property } from '@/types';

const API_BASE_URL = typeof window !== 'undefined' 
  ? (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
    links?: any[];
  };
  errors?: Record<string, string[]>;
}

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Helper to set authorization token
export const setAuthToken = (token: string | null) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
};

// Helper to set theme key for tenant identification
export const setThemeKey = (themeKey: string) => {
  client.defaults.headers.common['X-Theme-Key'] = themeKey;
};

export const api = {
  auth: {
    login: (credentials: any) => client.post<ApiResponse<any>>('/auth/login', credentials),
    register: (data: any) => client.post<ApiResponse<any>>('/auth/register', data),
    me: () => client.get<ApiResponse<User>>('/auth/me'),
    logout: () => client.post<ApiResponse<any>>('/auth/logout'),
  },
  
  themes: {
    list: () => client.get<ApiResponse<Theme[]>>('/themes'),
    get: (id: string | number) => client.get<ApiResponse<Theme>>(`/themes/${id}`),
    active: () => client.get<ApiResponse<Theme>>('/themes/active'),
  },

  products: {
    list: (params?: any) => client.get<ApiResponse<Product[]>>('/v1/products', { params }),
    get: (slug: string) => client.get<ApiResponse<Product>>(`/v1/products/${slug}`),
  },

  properties: {
    list: (params?: any) => client.get<ApiResponse<Property[]>>('/v1/properties', { params }),
    get: (slug: string) => client.get<ApiResponse<Property>>(`/v1/properties/${slug}`),
  },

  dashboard: {
    partner: {
      properties: {
        list: () => client.get<ApiResponse<Property[]>>('/dashboard/partner/properties'),
        get: (id: number) => client.get<ApiResponse<Property>>(`/dashboard/partner/properties/${id}`),
        create: (data: FormData) => client.post<ApiResponse<Property>>('/dashboard/partner/properties', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        update: (id: number, data: FormData) => client.post<ApiResponse<Property>>(`/dashboard/partner/properties/${id}/update`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        delete: (id: number) => client.delete<ApiResponse<any>>(`/dashboard/partner/properties/${id}`),
      },
      products: {
        list: () => client.get<ApiResponse<Product[]>>('/dashboard/partner/products'),
        get: (id: number) => client.get<ApiResponse<Product>>(`/dashboard/partner/products/${id}`),
        create: (data: FormData) => client.post<ApiResponse<Product>>('/dashboard/partner/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        update: (id: number, data: FormData) => client.post<ApiResponse<Product>>(`/dashboard/partner/products/${id}/update`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        delete: (id: number) => client.delete<ApiResponse<any>>(`/dashboard/partner/products/${id}`),
      }
    }
  },

  orders: {
    list: () => client.get<ApiResponse<any[]>>('/v1/orders'),
    get: (id: number) => client.get<ApiResponse<any>>(`/v1/orders/${id}`),
    create: (data: any) => client.post<ApiResponse<any>>('/v1/orders', data),
  }
};

export default client;
