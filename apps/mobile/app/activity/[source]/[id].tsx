import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Linking,
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
import {
  toAutoInquiryActivityCard,
  toBookingActivityCard,
  toClassifiedInquiryActivityCard,
  toJobApplicationActivityCard,
  toOrderActivityCard,
  toServiceQuoteActivityCard,
} from '../../../src/features/buyer/adapters';
import {
  BuyerActivityCard,
  BuyerAutoInquiryRecord,
  BuyerBookingKind,
  BuyerBookingsData,
  BuyerClassifiedInquiriesData,
  BuyerClassifiedInquiryRecord,
  BuyerJobApplicationRecord,
  BuyerOrderRecord,
  BuyerServiceQuoteRecord,
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
    case 'job_application': return 'JOB APPLICATION';
    case 'vehicle_inquiry': return 'VEHICLE INQUIRY';
    case 'service_quote': return 'SERVICE QUOTE';
    case 'classified_inquiry': return 'CLASSIFIED INQUIRY';
  }
}

function workplaceLabel(value: number | string | null | undefined) {
  switch (Number(value)) {
    case 1: return 'Remote';
    case 2: return 'On-site';
    case 3: return 'Hybrid';
    default: return 'Not specified';
  }
}

function resumeLabel(path: string) {
  return path.split(/[\\/]/).pop() || path;
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
  const [application, setApplication] = useState<BuyerJobApplicationRecord | null>(null);
  const [autoInquiry, setAutoInquiry] = useState<BuyerAutoInquiryRecord | null>(null);
  const [serviceQuote, setServiceQuote] = useState<BuyerServiceQuoteRecord | null>(null);
  const [classifiedInquiry, setClassifiedInquiry] = useState<BuyerClassifiedInquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const loadRecord = useCallback(async () => {
    const id = Number(idParam);

    if (
      !Number.isInteger(id)
      || id < 1
      || (
        source !== 'booking'
        && source !== 'order'
        && source !== 'application'
        && source !== 'auto_inquiry'
        && source !== 'service_quote'
        && source !== 'classified_inquiry'
      )
    ) {
      setItem(null);
      setApplication(null);
      setAutoInquiry(null);
      setServiceQuote(null);
      setClassifiedInquiry(null);
      setError(new Error('This activity link is incomplete. Return to Activity and open it again.'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setApplication(null);
    setAutoInquiry(null);
    setServiceQuote(null);
    setClassifiedInquiry(null);

    try {
      if (source === 'order') {
        if (!reference) throw new Error('The order reference is missing.');

        const order = await apiRequest<BuyerOrderRecord>(
          `/v1/orders/${encodeURIComponent(reference)}`,
          { authenticated: true },
        );
        setItem(toOrderActivityCard(order));
      } else if (source === 'booking') {
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
      } else if (source === 'application') {
        const applications = await apiRequest<BuyerJobApplicationRecord[]>(
          '/dashboard/user/inquiries/applications',
          { authenticated: true },
        );
        const selectedApplication = applications.find((record) => record.id === id);

        if (!selectedApplication) throw new Error('This job application could not be found.');
        setApplication(selectedApplication);
        setItem(toJobApplicationActivityCard(selectedApplication));
      } else if (source === 'auto_inquiry') {
        const inquiries = await apiRequest<BuyerAutoInquiryRecord[]>(
          '/dashboard/user/inquiries/auto-inquiries',
          { authenticated: true },
        );
        const selectedInquiry = inquiries.find((record) => record.id === id);

        if (!selectedInquiry) throw new Error('This vehicle inquiry could not be found.');
        setAutoInquiry(selectedInquiry);
        setItem(toAutoInquiryActivityCard(selectedInquiry));
      } else if (source === 'service_quote') {
        const quotes = await apiRequest<BuyerServiceQuoteRecord[]>(
          '/dashboard/user/inquiries/service-quotes',
          { authenticated: true },
        );
        const selectedQuote = quotes.find((record) => record.id === id);

        if (!selectedQuote) throw new Error('This service quote could not be found.');
        setServiceQuote(selectedQuote);
        setItem(toServiceQuoteActivityCard(selectedQuote));
      } else {
        const payload = await apiRequest<BuyerClassifiedInquiriesData>(
          '/dashboard/user/inquiries/classified-inquiries',
          { authenticated: true },
        );
        const collection = payload.inquiries;
        const inquiries = Array.isArray(collection) ? collection : collection.data;
        const selectedInquiry = inquiries.find((record) => record.id === id);

        if (!selectedInquiry) throw new Error('This classified inquiry could not be found.');
        setClassifiedInquiry(selectedInquiry);
        setItem(toClassifiedInquiryActivityCard(selectedInquiry));
      }
    } catch (requestError) {
      setItem(null);
      setApplication(null);
      setAutoInquiry(null);
      setServiceQuote(null);
      setClassifiedInquiry(null);
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
  const classified = classifiedInquiry?.classified
    || classifiedInquiry?.classifiedAd
    || classifiedInquiry?.classifiedad
    || classifiedInquiry?.classified_ad
    || null;

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>{'< BACK'}</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>{detailLabel(item)}</Text>
          </View>

          <View style={styles.imageFrame}>
            <Text style={styles.imageFallback}>{category?.icon || '*'}</Text>
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
                <Text style={styles.infoLabel}>
                  {autoInquiry
                    ? 'PREFERRED DATE'
                    : classifiedInquiry
                      ? 'PRICE'
                    : serviceQuote
                      ? 'QUOTED PRICE'
                      : application
                        ? 'SALARY'
                        : 'TOTAL'}
                </Text>
                <Text style={styles.amountValue}>
                  {autoInquiry?.preferred_date || item.amount || 'Not applicable'}
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>TYPE</Text>
                <Text style={styles.infoValue}>{detailLabel(item)}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>
                  {autoInquiry
                    ? 'PREFERRED TIME'
                    : classifiedInquiry
                      ? 'CONDITION'
                    : serviceQuote
                      ? 'SCOPE'
                      : application
                        ? 'WORKPLACE'
                        : 'PAYMENT'}
                </Text>
                <Text style={styles.infoValue}>
                  {autoInquiry
                    ? autoInquiry.preferred_time || 'Not specified'
                    : classifiedInquiry
                      ? classified?.condition_label || 'Not specified'
                    : serviceQuote
                      ? serviceQuote.scope_size || 'Not specified'
                      : application
                        ? workplaceLabel(application.job?.workplace_type)
                        : item.secondaryStatus?.toUpperCase() || '-'}
                </Text>
              </View>
            </View>

            {application && (
              <View style={styles.applicationSection}>
                <Text style={styles.applicationLabel}>COVER LETTER</Text>
                <Text style={styles.applicationText}>
                  {application.cover_letter || 'No cover letter was included.'}
                </Text>

                <View style={styles.documentRow}>
                  <Text style={styles.applicationLabel}>RESUME</Text>
                  <Text style={styles.documentValue} numberOfLines={1}>
                    {application.resume_path
                      ? resumeLabel(application.resume_path)
                      : 'No resume attached'}
                  </Text>
                </View>

                {application.portfolio_url && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => Linking.openURL(application.portfolio_url!)}
                    accessibilityRole="link"
                    accessibilityLabel="Open portfolio"
                  >
                    <Text style={styles.secondaryButtonText}>OPEN PORTFOLIO</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {autoInquiry && (
              <View style={styles.applicationSection}>
                <Text style={styles.applicationLabel}>MESSAGE</Text>
                <Text style={styles.applicationText}>
                  {autoInquiry.message || 'No message was included.'}
                </Text>

                <View style={styles.contactGrid}>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>NAME</Text>
                    <Text style={styles.contactValue}>{autoInquiry.full_name || 'Not provided'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{autoInquiry.email || 'Not provided'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>PHONE</Text>
                    <Text style={styles.contactValue}>{autoInquiry.phone || 'Not provided'}</Text>
                  </View>
                </View>
              </View>
            )}

            {serviceQuote && (
              <View style={styles.applicationSection}>
                <Text style={styles.applicationLabel}>REQUEST DETAILS</Text>
                <Text style={styles.applicationText}>
                  {serviceQuote.details || 'No additional details were included.'}
                </Text>

                <View style={styles.contactGrid}>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>REQUESTED DATE</Text>
                    <Text style={styles.contactValue}>
                      {serviceQuote.requested_date || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>NAME</Text>
                    <Text style={styles.contactValue}>{serviceQuote.full_name || 'Not provided'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{serviceQuote.email || 'Not provided'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>PHONE</Text>
                    <Text style={styles.contactValue}>{serviceQuote.phone || 'Not provided'}</Text>
                  </View>
                </View>
              </View>
            )}

            {classifiedInquiry && (
              <View style={styles.applicationSection}>
                <Text style={styles.applicationLabel}>MESSAGE</Text>
                <Text style={styles.applicationText}>
                  {classifiedInquiry.message || 'No message was included.'}
                </Text>

                <View style={styles.contactGrid}>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>BRAND</Text>
                    <Text style={styles.contactValue}>{classified?.brand?.name || 'Not specified'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>YEAR / AGE</Text>
                    <Text style={styles.contactValue}>{classified?.item_year_age || 'Not specified'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>NAME</Text>
                    <Text style={styles.contactValue}>
                      {classifiedInquiry.full_name || 'Not provided'}
                    </Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{classifiedInquiry.email || 'Not provided'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>PHONE</Text>
                    <Text style={styles.contactValue}>{classifiedInquiry.phone || 'Not provided'}</Text>
                  </View>
                </View>
              </View>
            )}

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
  applicationSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)' },
  applicationLabel: { color: '#64748b', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  applicationText: { color: '#cbd5e1', fontSize: 12, lineHeight: 20 },
  documentRow: { marginTop: 20, padding: 14, borderRadius: 16, backgroundColor: '#0b0b0c' },
  documentValue: { color: '#e2e8f0', fontSize: 11, fontWeight: '800' },
  secondaryButton: { marginTop: 14, alignItems: 'center', paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.35)', borderRadius: 16 },
  secondaryButtonText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  contactGrid: { gap: 10, marginTop: 20 },
  contactRow: { padding: 14, borderRadius: 16, backgroundColor: '#0b0b0c' },
  contactLabel: { color: '#475569', fontSize: 7, fontWeight: '900', letterSpacing: 0.8, marginBottom: 5 },
  contactValue: { color: '#e2e8f0', fontSize: 11, fontWeight: '800' },
  listingButton: { marginTop: 20, alignItems: 'center', paddingVertical: 15, borderRadius: 18, backgroundColor: '#6366f1' },
  listingButtonText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
});
