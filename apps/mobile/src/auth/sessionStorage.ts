import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'sellio_auth_token';
const USER_KEY = 'sellio_auth_user';

export async function getStoredToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function loadStoredSession<T>() {
  const [token, userJson] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!token || !userJson) {
    return null;
  }

  return {
    token,
    user: JSON.parse(userJson) as T,
  };
}

export async function storeSession<T>(token: string, user: T) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearStoredSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
