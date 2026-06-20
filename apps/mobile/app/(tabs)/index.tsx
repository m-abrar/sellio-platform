import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest } from '../../src/api/client';

const CATEGORIES = [
  { id: 'properties', title: 'Properties', icon: '🏠' },
  { id: 'autos', title: 'Autos', icon: '🚗' },
  { id: 'events', title: 'Events', icon: '🎟️' },
  { id: 'services', title: 'Services', icon: '🛠️' },
  { id: 'jobs', title: 'Jobs', icon: '💼' },
  { id: 'classifieds', title: 'Classifieds', icon: '🏷️' },
];

const MOCK_ITEMS = [
  { id: '1', title: 'Penthouse Apartment', category: 'properties', price: '$2,450,000', location: 'New York, NY', details: '3 Beds • 4 Baths • 3,200 sqft', slug: 'pemberley-manor' },
  { id: '2', title: 'Tesla Model S Plaid', category: 'autos', price: '$89,990', location: 'California, US', details: 'Electric • Auto • 10,200 miles', slug: 'florentine-palazzo' },
  { id: '3', title: 'Creative Design Studio', category: 'services', price: '$150/hr', location: 'Remote', details: 'Branding • UI/UX Design', slug: 'colonial-river-estate' },
  { id: '4', title: 'Senior React Developer', category: 'jobs', price: '$140k/yr', location: 'San Francisco, CA', details: 'Full-time • Hybrid', slug: 'scottish-highland-castle' },
];

export default function HomeView() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [selectedCat, setSelectedCat] = useState('all');
  const [listings, setListings] = useState<any[]>(MOCK_ITEMS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getMockItems = useCallback((cat: string) => {
    if (cat === 'all') return MOCK_ITEMS;
    return MOCK_ITEMS.filter(item => item.category === cat);
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const endpoints: Record<string, string> = {
        properties: '/v1/properties',
        autos: '/v1/vehicles',
        events: '/v1/events',
        services: '/v1/services',
        jobs: '/v1/jobs',
        classifieds: '/v1/classifieds',
      };

      let fetchedItems: any[] = [];

      if (selectedCat === 'all') {
        const promises = Object.entries(endpoints).map(async ([key, url]) => {
          try {
            const data = await apiRequest<any>(url);
            const items = Array.isArray(data) ? data : data?.data;
            return (Array.isArray(items) ? items : []).map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || 'Untitled Listing',
                category: key,
                price: item.pricing?.price_formatted || item.price_formatted || (item.base_price ? `$${Number(item.base_price).toLocaleString()}` : '$0'),
                location: item.location?.title || item.city || 'Remote',
                details: item.short_description || item.specs?.area_formatted || item.description || 'Exclusive Sellio registry asset.',
                slug: item.slug || String(item.id),
            }));
          } catch (e) {
            // Silently fail to support active endpoints
          }
          return [];
        });

        const results = await Promise.all(promises);
        fetchedItems = results.flat();
      } else {
        const url = endpoints[selectedCat];
        if (url) {
          const data = await apiRequest<any>(url);
          const items = Array.isArray(data) ? data : data?.data;
            fetchedItems = (Array.isArray(items) ? items : []).map((item: any) => ({
              id: String(item.id),
              title: item.title || item.name || 'Untitled Listing',
              category: selectedCat,
              price: item.pricing?.price_formatted || item.price_formatted || (item.base_price ? `$${Number(item.base_price).toLocaleString()}` : '$0'),
              location: item.location?.title || item.city || 'Remote',
              details: item.short_description || item.specs?.area_formatted || item.description || 'Exclusive Sellio registry asset.',
              slug: item.slug || String(item.id),
            }));
        }
      }

      if (fetchedItems.length > 0) {
        setListings(fetchedItems);
      } else {
        setListings(getMockItems(selectedCat));
      }
    } catch (err) {
      console.warn('API fetch failed, fallback to mock registries', err);
      setListings(getMockItems(selectedCat));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCat, getMockItems]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchListings();
            }}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
      >
        {/* Header Block */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>WELCOME TO</Text>
            <Text style={styles.headerTitle}>SELLIO.</Text>
          </View>
          {isAuthenticated ? (
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={signOut}
            >
              <Text style={styles.cartBtnText}>LOG OUT ({user?.name ? user.name.split(' ')[0].toUpperCase() : 'USER'})</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.cartBtnText}>LOG IN</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Showcase Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>PREMIUM SEEDS</Text>
          <Text style={styles.heroTitle}>Modern Luxury</Text>
          <Text style={styles.heroSubtitle}>Access elite multi-tenant listings in one unified native dashboard.</Text>
        </View>

        {/* Horizontal Category Badges */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity 
            style={[styles.categoryBadge, selectedCat === 'all' && styles.categoryActive]}
            onPress={() => setSelectedCat('all')}
          >
            <Text style={[styles.categoryIcon, selectedCat === 'all' && styles.textActive]}>🌎</Text>
            <Text style={[styles.categoryText, selectedCat === 'all' && styles.textActive]}>All</Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryBadge, selectedCat === cat.id && styles.categoryActive]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[styles.categoryIcon, selectedCat === cat.id && styles.textActive]}>{cat.icon}</Text>
              <Text style={[styles.categoryText, selectedCat === cat.id && styles.textActive]}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listing Grid */}
        <Text style={styles.sectionTitle}>Featured Registry</Text>
        
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        ) : (
          <View style={styles.productGrid}>
            {listings.map((item) => (
              <TouchableOpacity 
                key={`${item.category}-${item.id}`} 
                style={styles.productCard}
                onPress={() => router.push(`/listing/${item.slug}`)}
              >
                <View style={styles.productImagePlaceholder}>
                  <Text style={{ fontSize: 32 }}>{CATEGORIES.find(c => c.id === item.category)?.icon || '📦'}</Text>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productSpec} numberOfLines={2}>{item.details}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  welcomeText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  cartBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroCard: {
    backgroundColor: '#111018',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#6366f1',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  heroBadge: {
    color: '#6366f1',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 40,
    marginBottom: 30,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 99,
    gap: 8,
  },
  categoryActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  categoryIcon: {
    fontSize: 15,
  },
  categoryText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
  },
  textActive: {
    color: '#6366f1',
  },
  productGrid: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  productImagePlaceholder: {
    height: 140,
    backgroundColor: '#0b0b0c',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  cardDetails: {
    padding: 16,
  },
  productName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  productSpec: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '900',
  },
  locationText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  loaderContainer: {
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
