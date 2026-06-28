import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { apiRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function routeFromNotification(route: unknown): '/' | '/favorites' | '/messages' | '/activity' | '/notifications' {
  const value = typeof route === 'string' ? route : '';
  if (value.includes('message')) return '/messages';
  if (value.includes('favorite')) return '/favorites';
  if (value.includes('booking') || value.includes('order') || value.includes('review')) return '/activity';
  return '/notifications';
}

export function PushNotificationsBootstrap() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !Device.isDevice) return;
    let active = true;

    async function register() {
      const current = await Notifications.getPermissionsAsync();
      const permission = current.status === 'granted' ? current : await Notifications.requestPermissionsAsync();
      if (permission.status !== 'granted' || !active) return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Sellio notifications',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const projectId = Constants.easConfig?.projectId
        || (Constants.expoConfig?.extra?.eas?.projectId as string | undefined);
      if (!projectId) {
        console.warn('Push registration skipped: EAS project ID is not configured.');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      await apiRequest('/dashboard/user/notifications/push-token', {
        method: 'POST',
        authenticated: true,
        body: JSON.stringify({ token, platform: Platform.OS, device_name: Device.deviceName || null }),
      });
    }

    register().catch((error) => console.warn('Push registration failed.', error));
    return () => { active = false; };
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      router.push(routeFromNotification(response.notification.request.content.data?.route));
    });
    return () => subscription.remove();
  }, [router]);

  return null;
}
