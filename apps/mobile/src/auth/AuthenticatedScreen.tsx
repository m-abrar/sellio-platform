import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#818cf8" />
        <Text style={styles.text}>{isLoading ? 'Restoring your session...' : 'Sign in required.'}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: '#070708',
  },
  text: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
