import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import { BuyerDashboardData } from '../../src/features/buyer/types';

export default function ActivityView() {
  const { isAuthenticated, user } = useAuth();
  const [dashboard, setDashboard] = useState<BuyerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const data = await apiRequest<BuyerDashboardData>('/dashboard/user/welcome', {
        authenticated: true,
      });
      setDashboard(data);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) loadDashboard();
    }, [isAuthenticated, loadDashboard]),
  );

  const stats = dashboard?.stats;
  const cards = stats ? [
    { label: 'Favorites', value: stats.favoritesCount },
    { label: 'Bookings', value: stats.bookingsCount },
    { label: 'Messages', value: stats.messagesCount },
    { label: 'Applications', value: stats.appsCount },
    { label: 'Appointments', value: stats.appointmentsCount },
    { label: 'Inquiries', value: stats.inquiriesCount },
    { label: 'Reviews', value: stats.reviewsCount },
    { label: 'Total Activity', value: stats.totalItemsCount },
  ] : [];

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadDashboard(true)}
              tintColor="#818cf8"
              colors={['#6366f1']}
            />
          }
        >
          <Text style={styles.eyebrow}>BUYER ACCOUNT</Text>
          <Text style={styles.title}>ACTIVITY.</Text>
          <Text style={styles.subtitle}>
            {user?.name ? `Welcome back, ${user.name}.` : 'Your recent account activity.'}
          </Text>

          {loading && !dashboard ? (
            <LoadingState message="Loading your activity..." />
          ) : error && !dashboard ? (
            <ErrorState error={error} onRetry={loadDashboard} />
          ) : dashboard ? (
            <>
              <View style={styles.summaryCard}>
                <View>
                  <Text style={styles.summaryLabel}>TOTAL ITEMS</Text>
                  <Text style={styles.summaryValue}>{dashboard.stats.totalItemsCount}</Text>
                </View>
                <View style={styles.notificationBlock}>
                  <Text style={styles.summaryLabel}>NOTIFICATIONS</Text>
                  <Text style={styles.notificationValue}>{dashboard.notification_count}</Text>
                </View>
              </View>

              <View style={styles.grid}>
                {cards.map((card) => (
                  <View key={card.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{card.value}</Text>
                    <Text style={styles.statLabel}>{card.label}</Text>
                  </View>
                ))}
              </View>

              {error && (
                <Text style={styles.refreshWarning}>The latest refresh failed. Pull down to try again.</Text>
              )}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  eyebrow: { marginTop: 10, color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1.5 },
  subtitle: { marginTop: 6, marginBottom: 28, color: '#94a3b8', fontSize: 12, lineHeight: 18 },
  summaryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: 22, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.25)', backgroundColor: '#111018' },
  summaryLabel: { marginBottom: 6, color: '#64748b', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  summaryValue: { color: '#fff', fontSize: 30, fontWeight: '900' },
  notificationBlock: { alignItems: 'flex-end' },
  notificationValue: { color: '#818cf8', fontSize: 24, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '48%', minHeight: 108, justifyContent: 'center', padding: 18, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', backgroundColor: '#121214' },
  statValue: { marginBottom: 7, color: '#a5b4fc', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  refreshWarning: { marginTop: 18, color: '#f59e0b', fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
