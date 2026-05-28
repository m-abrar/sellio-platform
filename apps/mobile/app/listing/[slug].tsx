import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';

const LOCAL_API_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const API_URL = `http://${LOCAL_API_HOST}:8000/api`;

const MOCK_REGISTRY: Record<string, any> = {
  'pemberley-manor': { title: 'Penthouse Apartment', category: 'Properties', price: '$2,450,000', location: 'New York, NY', spec: '3 Beds • 4 Baths • 3,200 sqft', desc: 'An exquisite high-rise penthouse overlooking Central Park. Engineered with full smart-home operations, floor-to-ceiling double-insulated glass panes, custom travertine counter structures, and a spacious wrap-around private terrace deck.' },
  'florentine-palazzo': { title: 'Tesla Model S Plaid', category: 'Autos', price: '$89,990', location: 'California, US', spec: 'Electric • Auto • 10,200 miles', desc: 'High-performance tri-motor electric vehicle delivering 1,020 horsepower. Features carbon-fiber spoilers, 21-inch spider-spoke wheels, yolk steering integrations, and full autopilot driving assist modules.' },
  'colonial-river-estate': { title: 'Creative Design Studio', category: 'Services', price: '$150/hr', location: 'Remote', spec: 'Branding • UI/UX Design', desc: 'Premium, end-to-end user experience audit and layout standardization. Maps harmonious color tokens, Outfit typography scaling, high-intent call-to-actions, and interactive glassmorphic micro-animations.' },
  'scottish-highland-castle': { title: 'Senior React Developer', category: 'Jobs', price: '$140k/yr', location: 'San Francisco, CA', spec: 'Full-time • Hybrid', desc: 'Lead engineering role inside our SaaS E-commerce engine. Drives custom React component reuse, Next.js page routing optimizations, Typescript safety protocols, and monorepo pipeline builds.' },
};

export default function ListingDetailsView() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [item, setItem] = useState<any>(MOCK_REGISTRY['pemberley-manor']);
  const [loading, setLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!slug) return;
    
    if (MOCK_REGISTRY[slug]) {
      setItem(MOCK_REGISTRY[slug]);
      return;
    }

    setLoading(true);
    try {
      const endpoints = [
        { category: 'Properties', url: `${API_URL}/v1/properties/${slug}` },
        { category: 'Autos', url: `${API_URL}/v1/vehicles/${slug}` },
        { category: 'Events', url: `${API_URL}/v1/events/${slug}` },
        { category: 'Services', url: `${API_URL}/v1/services/${slug}` },
        { category: 'Jobs', url: `${API_URL}/v1/jobs/${slug}` },
        { category: 'Classifieds', url: `${API_URL}/v1/classifieds/${slug}` },
      ];

      const promises = endpoints.map(async (ep) => {
        try {
          const res = await fetch(ep.url, { headers: { Accept: 'application/json' } });
          if (res.ok) {
            const data = await res.json();
            const record = data.data || data;
            if (record && (record.title || record.name)) {
              return {
                title: record.title || record.name,
                category: ep.category,
                price: record.pricing?.price_formatted || record.price_formatted || (record.base_price ? `$${Number(record.base_price).toLocaleString()}` : '$0'),
                location: record.location?.title || record.city || 'Remote',
                spec: record.specs?.area_formatted || record.short_description || 'Aesthetic asset registry.',
                desc: record.description || record.short_description || 'Exclusive luxury item on Sellio.',
              };
            }
          }
        } catch (e) {
          // Silent fail
        }
        return null;
      });

      const results = await Promise.all(promises);
      const found = results.find(r => r !== null);

      if (found) {
        setItem(found);
      } else {
        setItem(MOCK_REGISTRY['pemberley-manor']);
      }
    } catch (err) {
      console.warn('Listing details fetch error, using fallback mock', err);
      setItem(MOCK_REGISTRY['pemberley-manor']);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header navigation bar */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>&larr; BACK</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{item.category}</Text>
        </View>

        {/* Gallery Image placeholder */}
        <View style={styles.galleryPlaceholder}>
          <Text style={styles.galleryIcon}>📦</Text>
        </View>

        {/* Core details */}
        <View style={styles.detailsGroup}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSpec}>{item.spec}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>{item.price}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          <Text style={styles.sectionHeader}>AESTHETIC SPECIFICATION</Text>
          <Text style={styles.itemDesc}>{item.desc}</Text>

          {/* Action trigger button */}
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.actionBtnText}>PROCEED TO TRANSACTION</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070708',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e20',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  backText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  navTitle: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  galleryPlaceholder: {
    height: 240,
    backgroundColor: '#0b0b0c',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  galleryIcon: {
    fontSize: 64,
  },
  detailsGroup: {
    padding: 24,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  itemSpec: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 20,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  priceText: {
    color: '#6366f1',
    fontSize: 20,
    fontWeight: '900',
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  itemDesc: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 40,
  },
  actionBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  loadingWrapper: {
    flex: 1,
    backgroundColor: '#070708',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
