import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '../../src/context/AuthContext';
import { toListingCard } from '../../src/features/listings/adapters';
import { LISTING_CATEGORIES } from '../../src/features/listings/catalog';
import {
  ListingApiRecord,
  ListingCardItem,
  ListingCategory,
  ListingVertical,
} from '../../src/features/listings/types';

export default function HomeView() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory>('all');
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategory = useCallback(async (vertical: ListingVertical) => {
    const category = LISTING_CATEGORIES.find((item) => item.id === vertical);

    if (!category) return [];

    const data = await apiRequest<ListingApiRecord[] | { data?: ListingApiRecord[] }>(
      category.endpoint,
    );
    const records = Array.isArray(data) ? data : data?.data;

    return (records || []).map((record) => toListingCard(record, vertical));
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (selectedCategory === 'all') {
        const results = await Promise.allSettled(
          LISTING_CATEGORIES.map((category) => loadCategory(category.id)),
        );
        const availableListings = results.flatMap((result) =>
          result.status === 'fulfilled' ? result.value.slice(0, 4) : [],
        );
        const failures = results.filter(
          (result): result is PromiseRejectedResult => result.status === 'rejected',
        );

        if (failures.length === LISTING_CATEGORIES.length) {
          throw failures[0].reason;
        }

        setListings(availableListings);

        if (failures.length > 0) {
          setError(
            `Showing available listings. ${failures.length} categor${failures.length === 1 ? 'y is' : 'ies are'} currently unavailable.`,
          );
        }
      } else {
        setListings(await loadCategory(selectedCategory));
      }
    } catch (requestError) {
      setListings([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load marketplace listings.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadCategory, selectedCategory]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const selectedTitle = selectedCategory === 'all'
    ? 'Featured Marketplace'
    : LISTING_CATEGORIES.find((category) => category.id === selectedCategory)?.title || 'Listings';

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
            tintColor="#818cf8"
            colors={['#6366f1']}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>WELCOME TO</Text>
            <Text style={styles.headerTitle}>SELLIO.</Text>
          </View>
          {isAuthenticated ? (
            <TouchableOpacity style={styles.accountButton} onPress={signOut}>
              <Text style={styles.accountButtonText}>
                LOG OUT ({user?.name ? user.name.split(' ')[0].toUpperCase() : 'USER'})
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.accountButton} onPress={() => router.push('/login')}>
              <Text style={styles.accountButtonText}>LOG IN</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>SEVEN MARKETPLACES · ONE APP</Text>
          <Text style={styles.heroTitle}>Find what moves you.</Text>
          <Text style={styles.heroSubtitle}>
            Explore products, homes, vehicles, events, services, careers, and local finds.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Explore Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[styles.categoryBadge, selectedCategory === 'all' && styles.categoryActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={styles.categoryIcon}>🌐</Text>
            <Text style={[styles.categoryText, selectedCategory === 'all' && styles.textActive]}>
              All
            </Text>
          </TouchableOpacity>
          {LISTING_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryBadge,
                selectedCategory === category.id && styles.categoryActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.textActive,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, styles.sectionTitleFlush]}>{selectedTitle}</Text>
          {!loading && listings.length > 0 && (
            <Text style={styles.resultCount}>{listings.length} RESULTS</Text>
          )}
        </View>

        {error && (
          <View style={[styles.feedbackCard, listings.length > 0 && styles.warningCard]}>
            <Text style={styles.feedbackTitle}>
              {listings.length > 0 ? 'PARTIAL RESULTS' : 'WE COULDN’T LOAD THIS FEED'}
            </Text>
            <Text style={styles.feedbackText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchListings}>
              <Text style={styles.retryButtonText}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#818cf8" />
            <Text style={styles.loaderText}>Curating live listings…</Text>
          </View>
        ) : listings.length === 0 && !error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>◇</Text>
            <Text style={styles.emptyTitle}>Nothing listed here yet</Text>
            <Text style={styles.emptyText}>
              This category is available, but it does not have any published listings right now.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchListings}>
              <Text style={styles.retryButtonText}>REFRESH</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {listings.map((item) => {
              const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);

              return (
                <TouchableOpacity
                  key={`${item.vertical}-${item.id}`}
                  style={styles.productCard}
                  activeOpacity={0.82}
                  onPress={() => router.push({
                    pathname: '/listing/[slug]',
                    params: { slug: item.slug, vertical: item.vertical },
                  })}
                >
                  <View style={styles.productImageContainer}>
                    <Text style={styles.imageFallbackIcon}>{category?.icon || '◇'}</Text>
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                        accessibilityLabel={`${item.title} image`}
                      />
                    )}
                    <View style={styles.verticalPill}>
                      <Text style={styles.verticalPillText}>{category?.title || item.vertical}</Text>
                    </View>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.productSpec} numberOfLines={2}>{item.details}</Text>
                    <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                    <Text style={styles.productPrice} numberOfLines={1}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  accountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    maxWidth: '58%',
  },
  accountButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: '#111018',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.18)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  heroBadge: {
    color: '#818cf8',
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
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 16,
  },
  sectionTitleFlush: {
    flex: 1,
    marginBottom: 0,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  resultCount: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 99,
    gap: 7,
  },
  categoryActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
  categoryIcon: {
    fontSize: 15,
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
  },
  textActive: {
    color: '#a5b4fc',
  },
  feedbackCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  warningCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  feedbackTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  feedbackText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loaderContainer: {
    paddingVertical: 65,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 30,
  },
  emptyIcon: {
    color: '#818cf8',
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 18,
  },
  productGrid: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 178,
    backgroundColor: '#0b0b0c',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  imageFallbackIcon: {
    fontSize: 36,
    opacity: 0.45,
  },
  productImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  verticalPill: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(7, 7, 8, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  verticalPillText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardDetails: {
    padding: 16,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },
  productSpec: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 10,
  },
  locationText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
  },
  productPrice: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '900',
  },
});
