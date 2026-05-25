import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginRequest, logout as logoutRequest } from '../api/auth';
import { ALLOWED_SELLER_ROLES } from '../config/api';
import { ApiError } from '../lib/apiError';
import { clearAuth, getStoredUser, getToken } from '../lib/authStorage';
import type { AuthUser } from '../types/api';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSellerAccess: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const hasAllowedRole = (roles: string[] | undefined): boolean => {
  if (!roles?.length) return false;
  return roles.some((role) => ALLOWED_SELLER_ROLES.includes(role as (typeof ALLOWED_SELLER_ROLES)[number]));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getMe();
      setUser(profile);
      return profile;
    } catch (error) {
      clearAuth();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!getToken()) {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      await refreshUser();
      if (active) {
        setIsLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest({ email, password });

    if (!hasAllowedRole(result.user.roles)) {
      clearAuth();
      setUser(null);
      throw new ApiError(
        'This account does not have partner portal access.',
        403,
      );
    }

    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user && !!getToken(),
      hasSellerAccess: hasAllowedRole(user?.roles),
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
