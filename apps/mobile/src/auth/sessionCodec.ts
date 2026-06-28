export interface StoredSession<T> {
  token: string;
  user: T;
}

export function parseStoredSession<T>(token: string | null, userJson: string | null): StoredSession<T> | null {
  if (!token || !userJson) return null;
  try {
    const user = JSON.parse(userJson) as T;
    if (!user || typeof user !== 'object') return null;
    return { token, user };
  } catch {
    return null;
  }
}

export function serializeStoredUser<T>(user: T) {
  return JSON.stringify(user);
}
