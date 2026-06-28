import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="register" options={{ presentation: 'modal' }} />
          <Stack.Screen name="forgot-password" options={{ presentation: 'modal' }} />
          <Stack.Screen name="reset-password" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="password" options={{ headerShown: false }} />
          <Stack.Screen name="reviews" options={{ headerShown: false }} />
          <Stack.Screen name="listing/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="activity/[source]/[id]" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
