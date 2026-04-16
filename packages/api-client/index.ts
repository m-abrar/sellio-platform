import axios, { AxiosInstance } from 'axios';
import { User, Application, Listing } from '@sellio/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
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

// Helper to set application key for tenant identification
export const setAppKey = (appKey: string) => {
  client.defaults.headers.common['X-App-Key'] = appKey;
};

export const api = {
  auth: {
    login: (credentials: any) => client.post('/login', credentials),
    register: (data: any) => client.post('/register', data),
    me: () => client.get<User>('/user'),
    logout: () => client.post('/logout'),
  },
  
  applications: {
    list: () => client.get<Application[]>('/applications'),
    get: (id: string | number) => client.get<Application>(`/applications/${id}`),
    active: () => client.get<Application>('/applications/active'), // Fetches current app based on domain/header
  },

  listings: {
    search: (params: any) => client.get<{ data: Listing[] }>('/search', { params }),
    get: (vertical: string, slug: string) => client.get<Listing>(`/listings/${vertical}/${slug}`),
    featured: () => client.get<Listing[]>('/listings/featured'),
  },

  orders: {
    list: () => client.get('/orders'),
    get: (id: number) => client.get(`/orders/${id}`),
    create: (data: any) => client.post('/orders', data),
  }
};

export default client;
