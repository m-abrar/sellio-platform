import { API_URL } from '../config/api';
import { clearStoredSession, getStoredToken } from '../auth/sessionStorage';

type ValidationErrors = Record<string, string[]>;

interface LaravelEnvelope<T> {
  success?: boolean;
  message?: string | null;
  data?: T;
  errors?: ValidationErrors | null;
  meta?: unknown;
}

export interface ApiResourceResponse<T> {
  data: T;
  meta: unknown;
}

interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  timeoutMs?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly errors: ValidationErrors | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function resolveUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function validationMessage(errors?: ValidationErrors | null) {
  if (!errors) return null;

  return Object.values(errors).flat().find(Boolean) || null;
}

async function performApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  includeMeta = false,
): Promise<T | ApiResourceResponse<T>> {
  const {
    authenticated = false,
    timeoutMs = 15_000,
    body,
    headers,
    ...requestOptions
  } = options;
  const url = resolveUrl(path);
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = await getStoredToken();

    if (!token) {
      throw new ApiError('Please sign in to continue.', 401);
    }

    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...requestOptions,
      body,
      headers: requestHeaders,
      signal: controller.signal,
    });
    const text = await response.text();
    let payload: LaravelEnvelope<T> | T | null = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        throw new ApiError('The server returned an invalid response.', response.status);
      }
    }

    const envelope = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? payload as LaravelEnvelope<T>
      : null;

    if (response.status === 401) {
      await clearStoredSession();
      unauthorizedHandler?.();
    }

    if (!response.ok) {
      const errors = envelope?.errors || null;
      throw new ApiError(
        validationMessage(errors) || envelope?.message || `Request failed (${response.status}).`,
        response.status,
        errors,
      );
    }

    if (envelope && Object.prototype.hasOwnProperty.call(envelope, 'data')) {
      if (includeMeta) {
        return {
          data: envelope.data as T,
          meta: envelope.meta ?? null,
        };
      }

      return envelope.data as T;
    }

    if (includeMeta) {
      return {
        data: payload as T,
        meta: null,
      };
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(`The request to ${url} timed out.`, null);
    }

    throw new ApiError(
      `Cannot reach the Sellio API at ${API_URL}. Confirm the phone and development computer are on the same network.`,
      null,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return performApiRequest<T>(path, options, false) as Promise<T>;
}

export async function apiResourceRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResourceResponse<T>> {
  return performApiRequest<T>(path, options, true) as Promise<ApiResourceResponse<T>>;
}
