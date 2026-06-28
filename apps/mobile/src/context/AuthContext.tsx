import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { ApiError, apiRequest, setUnauthorizedHandler } from '../api/client';
import { SELLER_ONLY_MOBILE_MESSAGE, supportsBuyerMobile } from '../auth/buyerAccess';
import { clearStoredSession, loadStoredSession, storeSession } from '../auth/sessionStorage';
import { AuthResponse, AuthUser, BuyerRegistrationInput } from '../features/auth/types';

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: BuyerRegistrationInput) => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function revokeToken(token: string) {
  await apiRequest('/v1/auth/logout', {
    method: 'POST',
    accessToken: token,
  }).catch(() => {});
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authRevision = useRef(0);

  useEffect(() => {
    let active = true;

    async function loadStorageData() {
      try {
        const session = await loadStoredSession<AuthUser>();

        if (session) {
          if (!active) return;

          if (!supportsBuyerMobile(session.user)) {
            await revokeToken(session.token);
            await clearStoredSession();
            if (!active) return;
            setError(SELLER_ONLY_MOBILE_MESSAGE);
            return;
          }

          setToken(session.token);
          setUser(session.user);
          setIsLoading(false);
          const refreshRevision = authRevision.current;

          try {
            const refreshedUser = await apiRequest<AuthUser>('/v1/auth/me', {
              authenticated: true,
            });
            const mergedUser = { ...session.user, ...refreshedUser };

            if (!active || refreshRevision !== authRevision.current) return;

            if (!supportsBuyerMobile(mergedUser)) {
              await revokeToken(session.token);
              await clearStoredSession();
              if (!active || refreshRevision !== authRevision.current) return;
              setToken(null);
              setUser(null);
              setError(SELLER_ONLY_MOBILE_MESSAGE);
              return;
            }

            await storeSession(session.token, mergedUser);
            if (!active || refreshRevision !== authRevision.current) return;
            setUser(mergedUser);
          } catch (refreshError) {
            if (!active) return;

            if (refreshError instanceof ApiError && refreshError.status === 401) {
              await clearStoredSession();
              setToken(null);
              setUser(null);
              setError('Your session has expired. Please sign in again.');
            } else {
              console.warn('Using the cached buyer profile until the API is reachable.', refreshError);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load secure auth credentials', e);
        await clearStoredSession().catch(() => {});
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadStorageData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      authRevision.current += 1;
      setToken(null);
      setUser(null);
      setError('Your session has expired. Please sign in again.');
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  const signIn = async (email: string, password: string) => {
    authRevision.current += 1;
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
        throw new Error('Buyer account was not found in the authentication response.');
      }

      let resolvedUser = userVal;
      try {
        const refreshedUser = await apiRequest<AuthUser>('/v1/auth/me', {
          accessToken: tokenVal,
        });
        resolvedUser = { ...userVal, ...refreshedUser };
      } catch (profileError) {
        console.warn('Could not confirm buyer roles immediately after sign in.', profileError);
      }

      if (!supportsBuyerMobile(resolvedUser)) {
        await revokeToken(tokenVal);
        throw new Error(SELLER_ONLY_MOBILE_MESSAGE);
      }

      await storeSession(tokenVal, resolvedUser);

      setToken(tokenVal);
      setUser(resolvedUser);
    } catch (err: any) {
      const message = err?.message || 'Failed to sign in';

      setError(message);
      throw new Error(message);
    }
  };

  const signUp = async (input: BuyerRegistrationInput) => {
    authRevision.current += 1;
    setError(null);
    try {
      const authData = await apiRequest<AuthResponse>('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          password: input.password,
          password_confirmation: input.passwordConfirmation,
          role: 'user',
        }),
      });
      const tokenVal = authData.access_token || authData.token || '';
      const userVal = authData.user;

      if (!tokenVal || !userVal) {
        throw new Error('The registration response did not include a valid buyer session.');
      }

      await storeSession(tokenVal, userVal);
      setToken(tokenVal);
      setUser(userVal);
    } catch (err: any) {
      const message = err?.message || 'Failed to create your buyer account';
      setError(message);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    authRevision.current += 1;
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

  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!token || !user) return;

    authRevision.current += 1;
    const nextUser = { ...user, ...updates };
    await storeSession(token, nextUser);
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signUp,
        updateUser,
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
