import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import {
  toAutoInquiryActivityCard,
  toBookingActivityCard,
  toClassifiedInquiryActivityCard,
  toJobApplicationActivityCard,
  toOrderActivityCard,
  toServiceQuoteActivityCard,
} from '../../src/features/buyer/adapters';
import {
  BuyerActivityCard,
  BuyerAutoInquiryRecord,
  BuyerBookingsData,
  BuyerClassifiedInquiriesData,
  BuyerDashboardData,
  BuyerJobApplicationRecord,
  BuyerOrderRecord,
  BuyerServiceQuoteRecord,
} from '../../src/features/buyer/types';
import { LISTING_CATEGORIES } from '../../src/features/listings/catalog';

function activityTypeLabel(item: BuyerActivityCard) {
  switch (item.kind) {
    case 'property_booking': return 'PROPERTY STAY';
    case 'property_visit': return 'PROPERTY VISIT';
    case 'event_booking': return 'EVENT BOOKING';
    case 'service_appointment': return 'SERVICE APPOINTMENT';
    case 'product_order': return 'PRODUCT ORDER';
    case 'job_application': return 'JOB APPLICATION';
    case 'vehicle_inquiry': return 'VEHICLE INQUIRY';
    case 'service_quote': return 'SERVICE QUOTE';
    case 'classified_inquiry': return 'CLASSIFIED INQUIRY';
  }
}

function statusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (['confirmed', 'completed', 'delivered', 'paid', 'approved'].includes(normalized)) {
    return styles.statusPositive;
  }

  if (['cancelled', 'failed', 'rejected', 'refunded'].includes(normalized)) {
    return styles.statusNegative;
  }

  return styles.statusPending;
}

function ActivityRecordCard({ item, onPress }: { item: BuyerActivityCard; onPress?: () => void }) {
  const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageRetryKey, setImageRetryKey] = useState(0);
  const canShowImage = Boolean(item.imageUrl) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
    setImageRetryKey(0);
  }, [item.imageUrl]);

  return (
    <TouchableOpacity
      style={styles.activityCard}
      activeOpacity={0.82}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Open ${item.reference}` : item.reference}
    >
      <View style={styles.activityImageFrame}>
        <Text style={styles.activityImageFallback}>{category?.icon || '*'}</Text>
        {canShowImage && item.imageUrl && (
          <Image
            key={`${item.imageUrl}-${imageRetryKey}`}
            source={{ uri: item.imageUrl }}
            style={styles.activityImage}
            resizeMode="cover"
            accessibilityLabel={`${item.title} image`}
            onError={() => setImageFailed(true)}
          />
        )}
        {item.imageUrl && imageFailed && (
          <TouchableOpacity
            style={styles.imageRetryButton}
            onPress={() => {
              setImageFailed(false);
              setImageRetryKey((current) => current + 1);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Retry loading ${item.title} image`}
          >
            <Text style={styles.imageRetryText}>RETRY</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.activityBody}>
        <View style={styles.activityTopRow}>
          <Text style={styles.activityType}>{activityTypeLabel(item)}</Text>
          <View style={[styles.statusPill, statusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.activityDetail} numberOfLines={1}>{item.detail}</Text>

        <View style={styles.activityMetaRow}>
          <View style={styles.activityMetaBlock}>
            <Text style={styles.activityMetaLabel}>DATE</Text>
            <Text style={styles.activityMetaValue}>{item.dateLabel}</Text>
          </View>
          {item.amount && (
            <View style={[styles.activityMetaBlock, styles.activityMetaEnd]}>
              <Text style={styles.activityMetaLabel}>
                {item.kind === 'job_application' ? 'SALARY' : 'TOTAL'}
              </Text>
              <Text style={styles.activityAmount}>{item.amount}</Text>
            </View>
          )}
        </View>

        <View style={styles.referenceRow}>
          <Text style={styles.referenceText}>{item.reference}</Text>
          {item.secondaryStatus && (
            <Text style={styles.paymentText}>{item.secondaryStatus.toUpperCase()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ActivityView() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [dashboard, setDashboard] = useState<BuyerDashboardData | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<BuyerActivityCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<BuyerActivityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [activityWarning, setActivityWarning] = useState<string | null>(null);

  const loadActivity = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);
    setActivityWarning(null);

    const [
      dashboardResult,
      bookingsResult,
      ordersResult,
      applicationsResult,
      autoInquiriesResult,
      serviceQuotesResult,
      classifiedInquiriesResult,
    ] = await Promise.allSettled([
      apiRequest<BuyerDashboardData>('/dashboard/user/welcome', { authenticated: true }),
      apiRequest<BuyerBookingsData>('/dashboard/user/bookings', { authenticated: true }),
      apiRequest<BuyerOrderRecord[]>('/v1/orders?per_page=15', { authenticated: true }),
      apiRequest<BuyerJobApplicationRecord[]>('/dashboard/user/inquiries/applications', {
        authenticated: true,
      }),
      apiRequest<BuyerAutoInquiryRecord[]>('/dashboard/user/inquiries/auto-inquiries', {
        authenticated: true,
      }),
      apiRequest<BuyerServiceQuoteRecord[]>('/dashboard/user/inquiries/service-quotes', {
        authenticated: true,
      }),
      apiRequest<BuyerClassifiedInquiriesData>(
        '/dashboard/user/inquiries/classified-inquiries',
        { authenticated: true },
      ),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      setDashboard(dashboardResult.value);
    } else {
      setError(dashboardResult.reason);
    }

    const warnings: string[] = [];
    let upcoming: BuyerActivityCard[] = [];
    let recent: BuyerActivityCard[] = [];

    if (bookingsResult.status === 'fulfilled') {
      upcoming = bookingsResult.value.upcomingBookings.map((record) =>
        toBookingActivityCard(record, true),
      );
      recent = bookingsResult.value.pastBookings.map((record) =>
        toBookingActivityCard(record, false),
      );
    } else {
      warnings.push('bookings');
    }

    if (ordersResult.status === 'fulfilled') {
      recent.push(...ordersResult.value.map(toOrderActivityCard));
    } else {
      warnings.push('orders');
    }

    if (applicationsResult.status === 'fulfilled') {
      recent.push(...applicationsResult.value.map(toJobApplicationActivityCard));
    } else {
      warnings.push('job applications');
    }

    if (autoInquiriesResult.status === 'fulfilled') {
      recent.push(...autoInquiriesResult.value.map(toAutoInquiryActivityCard));
    } else {
      warnings.push('vehicle inquiries');
    }

    if (serviceQuotesResult.status === 'fulfilled') {
      recent.push(...serviceQuotesResult.value.map(toServiceQuoteActivityCard));
    } else {
      warnings.push('service quotes');
    }

    if (classifiedInquiriesResult.status === 'fulfilled') {
      const collection = classifiedInquiriesResult.value.inquiries;
      const inquiries = Array.isArray(collection) ? collection : collection.data;
      recent.push(...inquiries.map(toClassifiedInquiryActivityCard));
    } else {
      warnings.push('classified inquiries');
    }

    recent.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
    setUpcomingActivities(upcoming);
    setRecentActivities(recent);

    if (warnings.length > 0) {
      setActivityWarning(`Some ${warnings.join(' and ')} could not be loaded. Pull down to try again.`);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) loadActivity();
    }, [isAuthenticated, loadActivity]),
  );

  const stats = dashboard?.stats;
  const statisticCards = stats ? [
    { label: 'Favorites', value: stats.favoritesCount },
    { label: 'Bookings', value: stats.bookingsCount },
    { label: 'Messages', value: stats.messagesCount },
    { label: 'Applications', value: stats.appsCount },
    { label: 'Appointments', value: stats.appointmentsCount },
    { label: 'Inquiries', value: stats.inquiriesCount },
    { label: 'Reviews', value: stats.reviewsCount },
    { label: 'Total Activity', value: stats.totalItemsCount },
  ] : [];
  const hasActivity = upcomingActivities.length > 0 || recentActivities.length > 0;
  const openActivity = useCallback((item: BuyerActivityCard) => {
    router.push({
      pathname: '/activity/[source]/[id]',
      params: {
        source: item.source,
        id: String(item.id),
        kind: item.kind,
        reference: item.reference,
      },
    });
  }, [router]);

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadActivity(true)}
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
            <ErrorState error={error} onRetry={() => loadActivity()} />
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
                {statisticCards.map((card) => (
                  <View key={card.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{card.value}</Text>
                    <Text style={styles.statLabel}>{card.label}</Text>
                  </View>
                ))}
              </View>

              {error && (
                <Text style={styles.refreshWarning}>The latest dashboard refresh failed. Pull down to try again.</Text>
              )}

              <View style={styles.activitySection}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionTitle}>Upcoming</Text>
                  <Text style={styles.sectionCount}>{upcomingActivities.length}</Text>
                </View>
                {upcomingActivities.length > 0 ? (
                  <View style={styles.activityList}>
                    {upcomingActivities.map((item) => (
                      <ActivityRecordCard key={item.key} item={item} onPress={() => openActivity(item)} />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.sectionEmpty}>No upcoming bookings or appointments.</Text>
                )}
              </View>

              <View style={styles.activitySection}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                  <Text style={styles.sectionCount}>{recentActivities.length}</Text>
                </View>

                {activityWarning && <Text style={styles.activityWarning}>{activityWarning}</Text>}

                {recentActivities.length > 0 ? (
                  <View style={styles.activityList}>
                    {recentActivities.map((item) => (
                      <ActivityRecordCard
                        key={item.key}
                        item={item}
                        onPress={() => openActivity(item)}
                      />
                    ))}
                  </View>
                ) : !hasActivity && !activityWarning ? (
                  <EmptyState
                    icon="*"
                    title="NO ACTIVITY YET"
                    message="Your bookings, orders, applications, and inquiries will appear here."
                  />
                ) : null}
              </View>
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
  activitySection: { marginTop: 30 },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  sectionCount: { minWidth: 28, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, overflow: 'hidden', backgroundColor: 'rgba(99, 102, 241, 0.14)', color: '#a5b4fc', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  sectionEmpty: { padding: 18, borderRadius: 18, overflow: 'hidden', backgroundColor: '#121214', color: '#64748b', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  activityWarning: { marginBottom: 14, padding: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#fbbf24', fontSize: 10, lineHeight: 15, textAlign: 'center' },
  activityList: { gap: 14 },
  activityCard: { flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 22, backgroundColor: '#121214' },
  activityImageFrame: { width: 94, minHeight: 172, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b0c' },
  activityImageFallback: { fontSize: 28, opacity: 0.45 },
  activityImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  imageRetryButton: { position: 'absolute', bottom: 12, alignSelf: 'center', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.16)', backgroundColor: 'rgba(7, 7, 8, 0.82)', paddingHorizontal: 10, paddingVertical: 7 },
  imageRetryText: { color: '#c7d2fe', fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  activityBody: { flex: 1, padding: 14 },
  activityTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  activityType: { flex: 1, color: '#818cf8', fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusPositive: { backgroundColor: 'rgba(34, 197, 94, 0.14)' },
  statusNegative: { backgroundColor: 'rgba(239, 68, 68, 0.14)' },
  statusPending: { backgroundColor: 'rgba(245, 158, 11, 0.14)' },
  statusText: { color: '#fff', fontSize: 7, fontWeight: '900', letterSpacing: 0.5 },
  activityTitle: { color: '#fff', fontSize: 13, fontWeight: '900', marginBottom: 5 },
  activityDetail: { color: '#94a3b8', fontSize: 10, lineHeight: 15, marginBottom: 12 },
  activityMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  activityMetaBlock: { flex: 1 },
  activityMetaEnd: { alignItems: 'flex-end' },
  activityMetaLabel: { color: '#475569', fontSize: 7, fontWeight: '900', letterSpacing: 0.7, marginBottom: 3 },
  activityMetaValue: { color: '#cbd5e1', fontSize: 9, fontWeight: '800' },
  activityAmount: { color: '#a5b4fc', fontSize: 10, fontWeight: '900' },
  referenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 9, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  referenceText: { flex: 1, color: '#64748b', fontSize: 8, fontWeight: '800' },
  paymentText: { color: '#94a3b8', fontSize: 7, fontWeight: '900', letterSpacing: 0.6 },
});
