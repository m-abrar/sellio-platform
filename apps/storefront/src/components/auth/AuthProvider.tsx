'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@/types';
import { api } from '@/lib/storefront-api';
import { readAuthToken, writeAuthToken } from '@/lib/auth-storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const storedToken = readAuthToken();
    setToken(storedToken);
    api.setAuthToken(storedToken);

    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.getMe();
      setUser(profile);
    } catch {
      writeAuthToken(null);
      api.setAuthToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
    window.addEventListener('authUpdated', hydrate);
    return () => window.removeEventListener('authUpdated', hydrate);
  }, [hydrate]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await api.login(email, password);
    writeAuthToken(session.access_token);
    api.setAuthToken(session.access_token);
    setToken(session.access_token);
    setUser(session.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const session = await api.register(name, email, password, password);
    writeAuthToken(session.access_token);
    api.setAuthToken(session.access_token);
    setToken(session.access_token);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore expired sessions during logout.
    }

    writeAuthToken(null);
    api.setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
