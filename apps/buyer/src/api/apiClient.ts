import { AUTH_API_BASE_URL, BUYER_API_BASE_URL, PUBLIC_API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'sellio_buyer_access_token';

export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication required');
    this.name = 'AuthRequiredError';
  }
}

export interface LaravelResponse<T> {
  success?: boolean;
  message?: string | null;
  data?: T;
  meta?: any;
  errors?: Record<string, string[]>;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function buildHeaders(authenticated: boolean, body?: BodyInit | null) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (authenticated) {
    const token = getStoredToken();

    if (!token) {
      throw new AuthRequiredError();
    }

    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function normalizeResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<T> {
  const { authenticated = false, body, ...requestOptions } = options;
  const response = await fetch(url, {
    ...requestOptions,
    body,
    headers: {
      ...buildHeaders(authenticated, body),
      ...(requestOptions.headers as Record<string, string> | undefined),
    },
  });

  if (response.status === 401) {
    clearToken();
    throw new AuthRequiredError();
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return normalizeResponse<T>(payload);
}

export function publicUrl(path: string) {
  return `${PUBLIC_API_BASE_URL}${path}`;
}

export function buyerUrl(path: string) {
  return `${BUYER_API_BASE_URL}${path}`;
}

export function authUrl(path: string) {
  return `${AUTH_API_BASE_URL}${path}`;
}

export function collectionData(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function collectionMeta(payload: any) {
  return payload?.meta || {};
}
