import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../../src/api/client';
import { AuthenticatedScreen } from '../../../src/auth/AuthenticatedScreen';
import { ErrorState, LoadingState } from '../../../src/components/states/AsyncStates';
import { toBookingActivityCard, toOrderActivityCard } from '../../../src/features/buyer/adapters';
import {
  BuyerActivityCard,
  BuyerBookingKind,
  BuyerBookingsData,
  BuyerOrderRecord,
} from '../../../src/features/buyer/types';
import { LISTING_CATEGORIES } from '../../../src/features/listings/catalog';

function isBookingKind(value: string | undefined): value is BuyerBookingKind {
  return [
    'property_booking',
    'property_visit',
    'event_booking',
    'service_appointment',
  ].includes(value || '');
}

function detailLabel(item: BuyerActivityCard) {
  switch (item.kind) {
    case 'property_booking': return 'PROPERTY STAY';
    case 'property_visit': return 'PROPERTY VISIT';
    case 'event_booking': return 'EVENT BOOKING';
    case 'service_appointment': return 'SERVICE APPOINTMENT';
    case 'product_order': return 'PRODUCT ORDER';
  }
}

export default function ActivityDetailView() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    source?: string;
    id?: string;
    kind?: string;
    reference?: string;
  }>();
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const kindParam = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const reference = Array.isArray(params.reference) ? params.reference[0] : params.reference;
  const [item, setItem] = useState<BuyerActivityCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const loadRecord = useCallback(async () => {
    const id = Number(idParam);

    if (!Number.isInteger(id) || id < 1 || (source !== 'booking' && source !== 'order')) {
      setItem(null);
      setError(new Error('This activity link is incomplete. Return to Activity and open it again.'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (source === 'order') {
        if (!reference) throw new Error('The order reference is missing.');

        const order = await apiRequest<BuyerOrderRecord>(
          `/v1/orders/${encodeURIComponent(reference)}`,
          { authenticated: true },
        );
        setItem(toOrderActivityCard(order));
      } else {
        if (!isBookingKind(kindParam)) throw new Error('The booking type is missing.');

        const bookings = await apiRequest<BuyerBookingsData>('/dashboard/user/bookings', {
          authenticated: true,
        });
        const records = [
          ...bookings.upcomingBookings.map((record) => toBookingActivityCard(record, true)),
          ...bookings.pastBookings.map((record) => toBookingActivityCard(record, false)),
        ];
        const booking = records.find((record) => record.id === id && record.kind === kindParam);

        if (!booking) throw new Error('This booking could not be found.');
        setItem(booking);
      }
    } catch (requestError) {
      setItem(null);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [idParam, kindParam, reference, source]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  if (loading) {
    return (
      <AuthenticatedScreen returnTo="/activity">
        <SafeAreaView style={styles.container}>
          <LoadingState message="Loading activity details..." fullScreen />
        </SafeAreaView>
      </AuthenticatedScreen>
    );
  }

  if (!item) {
    return (
      <AuthenticatedScreen returnTo="/activity">
        <SafeAreaView style={styles.container}>
          <ErrorState
            error={error}
            title="ACTIVITY UNAVAILABLE"
            fallbackMessage="Unable to load this activity record."
            onRetry={loadRecord}
            secondaryAction={{ label: 'BACK TO ACTIVITY', onPress: () => router.back() }}
            fullScreen
          />
        </SafeAreaView>
      </AuthenticatedScreen>
    );
  }

  const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>{detailLabel(item)}</Text>
          </View>

          <View style={styles.imageFrame}>
            <Text style={styles.imageFallback}>{category?.icon || '◇'}</Text>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={`${item.title} image`}
              />
            )}
          </View>

          <View style={styles.detailCard}>
            <View style={styles.headingRow}>
              <Text style={styles.eyebrow}>{item.reference}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.detail}>{item.detail}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>DATE</Text>
                <Text style={styles.infoValue}>{item.dateLabel}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>TOTAL</Text>
                <Text style={styles.amountValue}>{item.amount || 'Not applicable'}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>TYPE</Text>
                <Text style={styles.infoValue}>{detailLabel(item)}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>PAYMENT</Text>
                <Text style={styles.infoValue}>{item.secondaryStatus?.toUpperCase() || '—'}</Text>
              </View>
            </View>

            {item.slug && (
              <TouchableOpacity
                style={styles.listingButton}
                onPress={() => router.push({
                  pathname: '/listing/[slug]',
                  params: { slug: item.slug!, vertical: item.vertical },
                })}
              >
                <Text style={styles.listingButtonText}>VIEW LISTING</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { padding: 20, paddingBottom: 40 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 8, marginBottom: 18 },
  backButton: { paddingVertical: 8, paddingRight: 10 },
  backButtonText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  navTitle: { flex: 1, color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, textAlign: 'right' },
  imageFrame: { height: 220, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 26, backgroundColor: '#0b0b0c' },
  imageFallback: { fontSize: 42, opacity: 0.45 },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  detailCard: { marginTop: 16, padding: 22, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 26, backgroundColor: '#121214' },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  eyebrow: { flex: 1, color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(99, 102, 241, 0.14)' },
  statusText: { color: '#c7d2fe', fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  title: { color: '#fff', fontSize: 23, fontWeight: '900', lineHeight: 29, marginBottom: 8 },
  detail: { color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 22 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: { width: '48%', minHeight: 86, justifyContent: 'center', padding: 14, borderRadius: 18, backgroundColor: '#0b0b0c' },
  infoLabel: { color: '#475569', fontSize: 7, fontWeight: '900', letterSpacing: 0.8, marginBottom: 6 },
  infoValue: { color: '#cbd5e1', fontSize: 10, fontWeight: '800', lineHeight: 15 },
  amountValue: { color: '#a5b4fc', fontSize: 12, fontWeight: '900' },
  listingButton: { marginTop: 20, alignItems: 'center', paddingVertical: 15, borderRadius: 18, backgroundColor: '#6366f1' },
  listingButtonText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
});
