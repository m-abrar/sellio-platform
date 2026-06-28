import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiRequest, apiResourceRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { EmptyState, ErrorState, LoadingState } from '../src/components/states/AsyncStates';

interface NotificationRecord {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  route?: string | null;
  created_at: string;
  read_at?: string | null;
}

function mobileRoute(route?: string | null): '/' | '/favorites' | '/messages' | '/activity' | null {
  if (!route) return null;
  if (route.includes('message')) return '/messages';
  if (route.includes('favorite')) return '/favorites';
  if (route.includes('booking') || route.includes('review') || route.includes('order')) return '/activity';
  return '/';
}

export default function NotificationsView() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadNotifications = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await apiResourceRequest<NotificationRecord[]>('/dashboard/user/notifications?per_page=50', { authenticated: true });
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadNotifications(); }, [loadNotifications]));

  const markRead = async (notification: NotificationRecord) => {
    try {
      if (!notification.read) {
        await apiRequest(`/dashboard/user/notifications/${notification.id}/read`, { method: 'PATCH', authenticated: true });
        setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true, read_at: new Date().toISOString() } : item));
      }
      const route = mobileRoute(notification.route);
      if (route) router.push(route);
    } catch (requestError) {
      Alert.alert('Could not open notification', requestError instanceof Error ? requestError.message : 'Please try again.');
    }
  };

  const markAllRead = async () => {
    try {
      await apiRequest('/dashboard/user/notifications/read-all', { method: 'POST', authenticated: true });
      setNotifications((current) => current.map((item) => ({ ...item, read: true, read_at: item.read_at || new Date().toISOString() })));
    } catch (requestError) {
      Alert.alert('Could not mark notifications', requestError instanceof Error ? requestError.message : 'Please try again.');
    }
  };

  const remove = async (notification: NotificationRecord) => {
    try {
      await apiRequest(`/dashboard/user/notifications/${notification.id}`, { method: 'DELETE', authenticated: true });
      setNotifications((current) => current.filter((item) => item.id !== notification.id));
    } catch (requestError) {
      Alert.alert('Could not delete notification', requestError instanceof Error ? requestError.message : 'Please try again.');
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <AuthenticatedScreen returnTo="/settings">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} tintColor="#818cf8" colors={['#6366f1']} />}
          ListHeaderComponent={(
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back to settings"><Text style={styles.backText}>{'< SETTINGS'}</Text></TouchableOpacity>
              <View style={styles.headingRow}>
                <View><Text style={styles.eyebrow}>BUYER ACCOUNT</Text><Text style={styles.title}>NOTIFICATIONS.</Text></View>
                {unreadCount > 0 && <TouchableOpacity onPress={markAllRead} accessibilityRole="button" accessibilityLabel={`Mark all ${unreadCount} notifications read`}><Text style={styles.readAll}>READ ALL ({unreadCount})</Text></TouchableOpacity>}
              </View>
            </View>
          )}
          ListEmptyComponent={loading ? <LoadingState message="Loading notifications..." /> : error ? (
            <ErrorState error={error} onRetry={() => loadNotifications()} />
          ) : <EmptyState icon="NT" title="YOU ARE ALL CAUGHT UP" message="New buyer activity and messages will appear here." />}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, !item.read && styles.cardUnread]} onPress={() => markRead(item)} accessibilityRole="button" accessibilityLabel={`${item.read ? '' : 'Unread '}${item.title}`}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{item.type.slice(0, 2).toUpperCase()}</Text></View>
              <View style={styles.body}>
                <View style={styles.cardHeading}><Text style={styles.cardTitle}>{item.title}</Text>{!item.read && <View style={styles.unreadDot} />}</View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{item.date || new Date(item.created_at).toLocaleString()}</Text>
              </View>
              <TouchableOpacity onPress={() => remove(item)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`}><Text style={styles.deleteText}>X</Text></TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 44, gap: 12 },
  header: { marginTop: 8, marginBottom: 14 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12, marginBottom: 18 },
  backText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  headingRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1.2 },
  readAll: { color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 0.8, paddingVertical: 8 },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 15, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: '#121214' },
  cardUnread: { borderColor: 'rgba(129,140,248,0.28)', backgroundColor: '#111018' },
  typeBadge: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: 'rgba(99,102,241,0.14)' },
  typeText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900' },
  body: { flex: 1 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardTitle: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '900' },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#818cf8' },
  message: { color: '#94a3b8', fontSize: 10, lineHeight: 16, marginTop: 5 },
  date: { color: '#475569', fontSize: 8, fontWeight: '700', marginTop: 8 },
  deleteText: { color: '#64748b', fontSize: 10, fontWeight: '900', padding: 3 },
});
