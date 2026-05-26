import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginRequest, logout as logoutRequest } from '../api/authApi';
import { AuthRequiredError, getStoredToken } from '../api/apiClient';
import { fetchUserProfile, UserProfile } from '../api/userApi';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    if (!getStoredToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setUser(data);
      setError(null);
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setUser(null);
      } else {
        setError('Failed to load user profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginRequest(email, password);
      setUser(data);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
