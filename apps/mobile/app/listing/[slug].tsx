import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { toListingDetail } from '../../src/features/listings/adapters';
import { LISTING_CATEGORIES } from '../../src/features/listings/catalog';
import { ListingApiRecord, ListingDetailItem, ListingVertical } from '../../src/features/listings/types';

function isListingVertical(value: string | undefined): value is ListingVertical {
  return LISTING_CATEGORIES.some((category) => category.id === value);
}

export default function ListingDetailsView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string; vertical?: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const verticalParam = Array.isArray(params.vertical) ? params.vertical[0] : params.vertical;
  const vertical = isListingVertical(verticalParam) ? verticalParam : null;
  const [item, setItem] = useState<ListingDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    const category = LISTING_CATEGORIES.find((entry) => entry.id === vertical);

    if (!slug || !vertical || !category) {
      setItem(null);
      setError('This listing link is incomplete. Return to the marketplace and open it again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const record = await apiRequest<ListingApiRecord>(
        `${category.endpoint}/${encodeURIComponent(slug)}`,
      );
      setItem(toListingDetail(record, vertical));
    } catch (requestError) {
      setItem(null);
      setError(requestError instanceof Error ? requestError.message : 'Unable to load this listing.');
    } finally {
      setLoading(false);
    }
  }, [slug, vertical]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="small" color="#818cf8" />
          <Text style={styles.stateText}>Loading listing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredState}>
          <Text style={styles.errorTitle}>LISTING UNAVAILABLE</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={fetchDetails}>
            <Text style={styles.actionBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryBtnText}>BACK TO MARKETPLACE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{category?.title || item.vertical}</Text>
        </View>

        <View style={styles.galleryPlaceholder}>
          <Text style={styles.galleryIcon}>{category?.icon || '◇'}</Text>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} resizeMode="cover" accessibilityLabel={`${item.title} image`} />
          )}
        </View>

        <View style={styles.detailsGroup}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSpec}>{item.details}</Text>
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>{item.price}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <Text style={styles.sectionHeader}>DESCRIPTION</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/login')}>
            <Text style={styles.actionBtnText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  scrollContent: { paddingBottom: 40 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e1e20' },
  backBtn: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  backText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  navTitle: { color: '#64748b', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  galleryPlaceholder: { height: 240, backgroundColor: '#0b0b0c', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.04)' },
  galleryIcon: { color: '#818cf8', fontSize: 64 },
  galleryImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  detailsGroup: { padding: 24 },
  itemTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  itemSpec: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 20 },
  priceSection: { backgroundColor: '#121214', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', padding: 20, borderRadius: 24, marginBottom: 30, gap: 8 },
  priceText: { color: '#818cf8', fontSize: 20, fontWeight: '900' },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sectionHeader: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  itemDesc: { color: '#94a3b8', fontSize: 13, fontWeight: '500', lineHeight: 20, marginBottom: 40 },
  actionBtn: { backgroundColor: '#6366f1', paddingVertical: 18, paddingHorizontal: 24, borderRadius: 20, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  secondaryBtn: { paddingVertical: 16, paddingHorizontal: 20 },
  secondaryBtnText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  centeredState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  errorTitle: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  stateText: { color: '#94a3b8', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
