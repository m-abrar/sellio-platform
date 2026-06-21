import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { LoadingState } from '../components/states/AsyncStates';
import { useAuth } from '../context/AuthContext';

export type ProtectedMobileRoute = '/favorites' | '/messages' | '/settings';

export function AuthenticatedScreen({
  children,
  returnTo,
}: {
  children: React.ReactNode;
  returnTo: ProtectedMobileRoute;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace({ pathname: '/login', params: { returnTo } });
    }
  }, [isAuthenticated, isLoading, returnTo, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingState message={isLoading ? 'Restoring your session...' : 'Opening sign in...'} fullScreen />;
  }

  return <>{children}</>;
}
