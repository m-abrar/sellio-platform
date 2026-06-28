import * as SecureStore from 'expo-secure-store';
import { parseStoredSession, serializeStoredUser } from './sessionCodec';

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

  return parseStoredSession<T>(token, userJson);
}

export async function storeSession<T>(token: string, user: T) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, serializeStoredUser(user)),
  ]);
}

export async function clearStoredSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
