import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest, apiResourceRequest } from '../../src/api/client';
import { ListingCard } from '../../src/components/listings/ListingCard';
import { useAuth } from '../../src/context/AuthContext';
import { FavoriteBatchStatusResponse, FavoriteRecord } from '../../src/features/buyer/types';
import { toListingCard } from '../../src/features/listings/adapters';
import { LISTING_CATEGORIES } from '../../src/features/listings/catalog';
import {
  BrandSettingsResponse,
  ListingApiRecord,
  ListingCardItem,
  ListingCategory,
  ListingModuleMap,
  PaginationMeta,
  ListingVertical,
} from '../../src/features/listings/types';

function favoriteKey(vertical: ListingVertical, listingId: string) {
  return `${vertical}:${listingId}`;
}

type SortOption = 'latest' | 'price_low' | 'price_high';

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Latest', value: 'latest' },
  { label: 'Low Price', value: 'price_low' },
  { label: 'High Price', value: 'price_high' },
];

function buildListingPath(
  endpoint: string,
  search: string,
  sortBy: SortOption,
  page: number,
  perPage: number,
) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (sortBy !== 'latest') {
    params.set('sort_by', sortBy);
  }

  return `${endpoint}?${params.toString()}`;
}

function normalizePaginationMeta(meta: unknown): PaginationMeta | null {
  if (!meta || typeof meta !== 'object') return null;

  const value = meta as Record<string, unknown>;
  const currentPage = Number(value.current_page);
  const lastPage = Number(value.last_page);
  const perPage = Number(value.per_page);
  const total = Number(value.total);

  if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) {
    return null;
  }

  return {
    current_page: currentPage,
    last_page: lastPage,
    per_page: Number.isFinite(perPage) ? perPage : 0,
    total: Number.isFinite(total) ? total : 0,
  };
}

function priceValue(item: ListingCardItem) {
  const numeric = item.price.replace(/[^0-9.]/g, '');
  const value = Number(numeric);

  return Number.isFinite(value) ? value : null;
}

function sortListings(items: ListingCardItem[], sortBy: SortOption) {
  if (sortBy === 'latest') return items;

  return [...items].sort((left, right) => {
    const leftPrice = priceValue(left);
    const rightPrice = priceValue(right);

    if (leftPrice == null && rightPrice == null) return 0;
    if (leftPrice == null) return 1;
    if (rightPrice == null) return -1;

    return sortBy === 'price_low' ? leftPrice - rightPrice : rightPrice - leftPrice;
  });
}

function enabledCategories(moduleMap: ListingModuleMap | null) {
  if (!moduleMap) return LISTING_CATEGORIES;

  return LISTING_CATEGORIES.filter((category) => moduleMap[category.id] !== false);
}

export default function HomeView() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory>('all');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [moduleMap, setModuleMap] = useState<ListingModuleMap | null>(null);
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, number | null>>({});
  const [pendingFavoriteKeys, setPendingFavoriteKeys] = useState<string[]>([]);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const activeCategories = useMemo(() => enabledCategories(moduleMap), [moduleMap]);

  const loadCategory = useCallback(async (
    vertical: ListingVertical,
    page = 1,
    perPage = selectedCategory === 'all' ? 4 : 12,
  ) => {
    const category = activeCategories.find((item) => item.id === vertical);

    if (!category) {
      return { items: [], meta: null };
    }

    const response = await apiResourceRequest<ListingApiRecord[]>(
      buildListingPath(category.endpoint, appliedSearch, sortBy, page, perPage),
    );
    const records = Array.isArray(response.data) ? response.data : [];

    return {
      items: sortListings(records.map((record) => toListingCard(record, vertical)), sortBy),
      meta: normalizePaginationMeta(response.meta),
    };
  }, [activeCategories, appliedSearch, selectedCategory, sortBy]);

  const fetchListings = useCallback(async (nextPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      if (selectedCategory === 'all') {
        const results = await Promise.allSettled(
          activeCategories.map((category) => loadCategory(category.id, 1, 4)),
        );
        const availableListings = results.flatMap((result) =>
          result.status === 'fulfilled' ? result.value.items : [],
        );
        const failures = results.filter(
          (result): result is PromiseRejectedResult => result.status === 'rejected',
        );

        if (activeCategories.length === 0) {
          setListings([]);
          setPagination(null);
          return;
        }

        if (failures.length === activeCategories.length) {
          throw failures[0].reason;
        }

        setPagination(null);
        setListings(sortListings(availableListings, sortBy));

        if (failures.length > 0) {
          setError(
            `Showing available listings. ${failures.length} categor${failures.length === 1 ? 'y is' : 'ies are'} currently unavailable.`,
          );
        }
      } else {
        const result = await loadCategory(selectedCategory, nextPage, 12);

        setPagination(result.meta);
        setListings((current) => (append ? [...current, ...result.items] : result.items));
      }
    } catch (requestError) {
      if (!append) {
        setListings([]);
        setPagination(null);
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load marketplace listings.',
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [activeCategories, loadCategory, selectedCategory, sortBy]);

  useEffect(() => {
    setPagination(null);
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    let active = true;

    async function loadModuleSettings() {
      try {
        const settings = await apiRequest<BrandSettingsResponse>('/v1/brand-settings');

        if (!active) return;
        setModuleMap(settings.modules || null);
      } catch {
        if (!active) return;
        setModuleMap(null);
      }
    }

    loadModuleSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      selectedCategory !== 'all'
      && !activeCategories.some((category) => category.id === selectedCategory)
    ) {
      setSelectedCategory('all');
    }
  }, [activeCategories, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function syncFavoriteStates() {
        setFavoriteError(null);

        if (!isAuthenticated || listings.length === 0) {
          setFavoriteIds({});
          return;
        }

        const items = listings
          .map((item) => ({
            vertical: item.vertical,
            listing_id: Number(item.id),
          }))
          .filter((item) => Number.isInteger(item.listing_id) && item.listing_id > 0);

        if (items.length === 0) return;

        try {
          const status = await apiRequest<FavoriteBatchStatusResponse>(
            '/dashboard/user/favorites/statuses',
            {
              method: 'POST',
              authenticated: true,
              body: JSON.stringify({ items }),
            },
          );

          if (!active) return;

          setFavoriteIds(Object.fromEntries(
            status.items.map((item) => [
              favoriteKey(item.vertical, String(item.listing_id)),
              item.favorite_id,
            ]),
          ));
        } catch (requestError) {
          if (!active) return;

          setFavoriteError(
            requestError instanceof Error
              ? requestError.message
              : 'Could not load favorite status.',
          );
        }
      }

      syncFavoriteStates();

      return () => {
        active = false;
      };
    }, [isAuthenticated, listings]),
  );

  const toggleCardFavorite = useCallback(async (item: ListingCardItem) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const key = favoriteKey(item.vertical, item.id);
    const currentFavoriteId = favoriteIds[key];

    if (pendingFavoriteKeys.includes(key)) return;

    setPendingFavoriteKeys((current) => [...current, key]);
    setFavoriteError(null);

    try {
      if (currentFavoriteId) {
        await apiRequest(`/dashboard/user/favorites/${currentFavoriteId}`, {
          method: 'DELETE',
          authenticated: true,
        });
        setFavoriteIds((current) => ({ ...current, [key]: null }));
      } else {
        const favorite = await apiRequest<FavoriteRecord>('/dashboard/user/favorites', {
          method: 'POST',
          authenticated: true,
          body: JSON.stringify({
            vertical: item.vertical,
            listing_id: Number(item.id),
          }),
        });
        setFavoriteIds((current) => ({ ...current, [key]: favorite.id }));
      }
    } catch (requestError) {
      Alert.alert(
        'Could not update favorite',
        requestError instanceof Error ? requestError.message : 'Please try again.',
      );
    } finally {
      setPendingFavoriteKeys((current) => current.filter((pendingKey) => pendingKey !== key));
    }
  }, [favoriteIds, isAuthenticated, pendingFavoriteKeys, router]);

  const selectedTitle = selectedCategory === 'all'
    ? 'Featured Marketplace'
    : activeCategories.find((category) => category.id === selectedCategory)?.title || 'Listings';
  const hasMore = selectedCategory !== 'all'
    && pagination != null
    && pagination.current_page < pagination.last_page;
  const applySearch = useCallback(() => {
    setAppliedSearch(searchInput.trim());
  }, [searchInput]);
  const clearSearch = useCallback(() => {
    setSearchInput('');
    setAppliedSearch('');
  }, []);

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
              fetchListings(1);
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
          <Text style={styles.heroBadge}>SEVEN MARKETPLACES - ONE APP</Text>
          <Text style={styles.heroTitle}>Find what moves you.</Text>
          <Text style={styles.heroSubtitle}>
            Explore products, homes, vehicles, events, services, careers, and local finds.
          </Text>
        </View>

        <View style={styles.searchPanel}>
          <Text style={styles.searchLabel}>Search Marketplace</Text>
          <View style={styles.searchRow}>
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={applySearch}
              returnKeyType="search"
              placeholder="Search listings"
              placeholderTextColor="#475569"
              style={styles.searchInput}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.searchButton} onPress={applySearch}>
              <Text style={styles.searchButtonText}>GO</Text>
            </TouchableOpacity>
            {appliedSearch ? (
              <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>X</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.sortRow}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.sortButton, sortBy === option.value && styles.sortButtonActive]}
                onPress={() => setSortBy(option.value)}
              >
                <Text style={[styles.sortButtonText, sortBy === option.value && styles.sortButtonTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
            <Text style={styles.categoryIcon}>ALL</Text>
            <Text style={[styles.categoryText, selectedCategory === 'all' && styles.textActive]}>
              All
            </Text>
          </TouchableOpacity>
          {activeCategories.map((category) => (
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
            <Text style={styles.resultCount}>
              {pagination?.total ? `${pagination.total} RESULTS` : `${listings.length} RESULTS`}
            </Text>
          )}
        </View>

        {favoriteError && isAuthenticated && (
          <Text style={styles.favoriteWarning}>{favoriteError}</Text>
        )}

        {error && (
          <View style={[styles.feedbackCard, listings.length > 0 && styles.warningCard]}>
            <Text style={styles.feedbackTitle}>
              {listings.length > 0 ? 'PARTIAL RESULTS' : "WE COULDN'T LOAD THIS FEED"}
            </Text>
            <Text style={styles.feedbackText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchListings(1)}>
              <Text style={styles.retryButtonText}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#818cf8" />
            <Text style={styles.loaderText}>Curating live listings...</Text>
          </View>
        ) : listings.length === 0 && !error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>*</Text>
            <Text style={styles.emptyTitle}>Nothing listed here yet</Text>
            <Text style={styles.emptyText}>
              This category is available, but it does not have any published listings right now.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchListings(1)}>
              <Text style={styles.retryButtonText}>REFRESH</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {listings.map((item) => {
              const key = favoriteKey(item.vertical, item.id);
              const isFavorite = Boolean(favoriteIds[key]);
              const isFavoritePending = pendingFavoriteKeys.includes(key);

              return (
                <ListingCard
                  key={`${item.vertical}-${item.id}`}
                  item={item}
                  onPress={() => router.push({
                    pathname: '/listing/[slug]',
                    params: { slug: item.slug, vertical: item.vertical },
                  })}
                  favoriteToggle={{
                    isFavorite,
                    isPending: isFavoritePending,
                    onPress: () => toggleCardFavorite(item),
                    accessibilityLabel: isFavorite
                      ? `Remove ${item.title} from favorites`
                      : `Save ${item.title} to favorites`,
                  }}
                />
              );
            })}
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => fetchListings((pagination?.current_page || 1) + 1, true)}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loadMoreButtonText}>LOAD MORE</Text>
                )}
              </TouchableOpacity>
            )}
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
  searchPanel: {
    marginBottom: 28,
    gap: 12,
  },
  searchLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#121214',
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchButton: {
    minHeight: 46,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#6366f1',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  clearButton: {
    minHeight: 46,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#121214',
  },
  clearButtonText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '900',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#121214',
    paddingHorizontal: 8,
  },
  sortButtonActive: {
    borderColor: 'rgba(129, 140, 248, 0.42)',
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
  },
  sortButtonText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
  sortButtonTextActive: {
    color: '#a5b4fc',
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
  loadMoreButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#6366f1',
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  favoriteWarning: {
    marginTop: -6,
    marginBottom: 16,
    color: '#f59e0b',
    fontSize: 11,
    lineHeight: 16,
  },
});
