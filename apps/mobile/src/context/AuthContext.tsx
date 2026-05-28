import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'sellio_auth_token';
const USER_KEY = 'sellio_auth_user';

// Resolve host machines dynamically for Android emulator vs iOS simulator
const LOCAL_API_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const API_URL = `http://${LOCAL_API_HOST}:8000/api`;

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_partner?: boolean;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted tokens on mount
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to load secure auth credentials', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }

      const tokenVal = result.access_token || result.token || '';
      const userVal = result.user || {};

      if (!tokenVal) {
        throw new Error('Token not found in authentication payload');
      }

      // Save securely
      await SecureStore.setItemAsync(TOKEN_KEY, tokenVal);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userVal));

      setToken(tokenVal);
      setUser(userVal);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      if (token) {
        // Optional: Call logout endpoint silently
        await fetch(`${API_URL}/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      // Clear local states
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
