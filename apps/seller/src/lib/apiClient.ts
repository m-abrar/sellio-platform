import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';
import { ApiError } from './apiError';
import { clearAuth, getToken, setToken } from './authStorage';
import type { LaravelResponse } from '../types/api';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

const parseAxiosError = (error: AxiosError<LaravelResponse>): ApiError => {
  const status = error.response?.status ?? 500;
  const payload = error.response?.data;
  const message = payload?.message || error.message || 'Request failed';
  const errors =
    payload?.errors && typeof payload.errors === 'object' ? payload.errors : undefined;

  return new ApiError(message, status, errors ?? undefined);
};

const refreshAccessToken = async (): Promise<string | null> => {
  const currentToken = getToken();
  if (!currentToken) {
    clearAuth();
    return null;
  }

  try {
    const response = await axios.post<LaravelResponse<{ access_token: string }>>(
      `${API_BASE_URL}/v1/auth/refresh-token`,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      },
    );

    const nextToken = response.data.data?.access_token;
    if (!nextToken) {
      clearAuth();
      return null;
    }

    setToken(nextToken);
    return nextToken;
  } catch {
    clearAuth();
    return null;
  }
};

const queueTokenRefresh = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<LaravelResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';

    const isAuthLogin = requestUrl.includes('/v1/auth/login');
    const isAuthRefresh = requestUrl.includes('/v1/auth/refresh-token');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthLogin && !isAuthRefresh) {
      originalRequest._retry = true;

      const nextToken = await queueTokenRefresh();
      if (nextToken) {
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return apiClient(originalRequest);
      }

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    throw parseAxiosError(error);
  },
);

export const unwrapData = <T>(response: AxiosResponse<LaravelResponse<T>>): T => {
  return response.data.data;
};

export const unwrapMessage = (response: AxiosResponse<LaravelResponse<unknown>>): string => {
  return response.data.message;
};

export const extractListData = <T>(response: AxiosResponse<LaravelResponse<unknown>>): T[] => {
  const payload = response.data?.data;

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: T[] }).data)) {
    return (payload as { data: T[] }).data;
  }

  return [];
};
