import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { PushNotificationsBootstrap } from '../src/notifications/PushNotificationsBootstrap';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PushNotificationsBootstrap />
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
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="payment-return" options={{ headerShown: false }} />
          <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="listing/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="activity/[source]/[id]" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
