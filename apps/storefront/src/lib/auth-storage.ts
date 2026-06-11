const AUTH_TOKEN_KEY = 'sellio_auth_token';

export function readAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function writeAuthToken(token: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  window.dispatchEvent(new Event('authUpdated'));
}
