import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest, setUnauthorizedHandler } from '../api/client';
import { clearStoredSession, loadStoredSession, storeSession } from '../auth/sessionStorage';
import { AuthResponse, AuthUser } from '../features/auth/types';

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const session = await loadStoredSession<AuthUser>();

        if (session) {
          setToken(session.token);
          setUser(session.user);
        }
      } catch (e) {
        console.warn('Failed to load secure auth credentials', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
      setError('Your session has expired. Please sign in again.');
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const authData = await apiRequest<AuthResponse>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const tokenVal = authData.access_token || authData.token || '';
      const userVal = authData.user;

      if (!tokenVal) {
        throw new Error('Token not found in authentication payload');
      }

      if (!userVal) {
        throw new Error('User not found in authentication payload');
      }

      await storeSession(tokenVal, userVal);

      setToken(tokenVal);
      setUser(userVal);
    } catch (err: any) {
      const message = err?.message || 'Failed to sign in';

      setError(message);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      if (token) {
        await apiRequest('/v1/auth/logout', {
          method: 'POST',
          authenticated: true,
        }).catch(() => {});
      }
    } finally {
      await clearStoredSession();
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
