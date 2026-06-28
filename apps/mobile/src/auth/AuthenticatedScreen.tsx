import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { LoadingState } from '../components/states/AsyncStates';
import { useAuth } from '../context/AuthContext';
import { resolveProtectedScreenState } from '../components/states/stateModel';

export type ProtectedMobileRoute = '/favorites' | '/activity' | '/messages' | '/settings';

export function AuthenticatedScreen({
  children,
  returnTo,
}: {
  children: React.ReactNode;
  returnTo: ProtectedMobileRoute;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const screenState = resolveProtectedScreenState(isLoading, isAuthenticated);

  useEffect(() => {
    if (screenState === 'sign_in') {
      router.replace({ pathname: '/login', params: { returnTo } });
    }
  }, [returnTo, router, screenState]);

  if (screenState !== 'content') {
    return <LoadingState message={screenState === 'restoring' ? 'Restoring your session...' : 'Opening sign in...'} fullScreen />;
  }

  return <>{children}</>;
}
