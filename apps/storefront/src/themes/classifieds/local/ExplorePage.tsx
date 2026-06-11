'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category, ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalCard, LocalFooter } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedsExplore,
  resolveClassifiedsFailure,
} from '@/themes/classifieds/shared/catalog';
import { LOCAL_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import {
  buildLocalCategoriesFromListings,
  buildLocalCategoriesFromSidebar,
  mapClassifiedToLocalCard,
  type CategoryPill,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [items, setItems] = useState<LocalCardItem[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: 'all', name: 'All Nearby', icon: '📍' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const searchQuery = searchParams.get('search') || searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || initialCategorySlug || 'all';
  const sortBy = searchParams.get('sort') || 'distance';

  const getQueryParams = (page: number) => {
    const params: Record<string, unknown> = { page, per_page: 12 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
    return params;
  };

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    router.push(themeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setCurrentPage(1);
      const result = await fetchClassifiedsExplore(getQueryParams(1));

      if (result.ok && result.response.data) {
        const listings = result.response.data as ClassifiedListing[];
        setItems(listings.map(mapClassifiedToLocalCard));
        setTotalPages(result.response.meta?.last_page || 1);

        if (result.response.sidebar?.categories) {
          setCategories(buildLocalCategoriesFromSidebar(result.response.sidebar.categories as Category[]));
        } else {
          setCategories(buildLocalCategoriesFromListings(listings));
        }

        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'local');

        if (resolution.mode === 'demo') {
          setItems(resolution.listings.map(mapClassifiedToLocalCard));
          setCategories(LOCAL_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setItems([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [searchQuery, selectedCategory, allowDemo]);

  const loadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const result = await fetchClassifiedsExplore(getQueryParams(nextPage));

    if (result.ok && result.response.data) {
      setItems((prev) => [...prev, ...result.response.data.map(mapClassifiedToLocalCard)]);
      setCurrentPage(nextPage);
    }

    setLoadingMore(false);
  };

  const filteredItems = items
    .filter((item) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'free') return item.numericPrice === 0;
      return item.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
      if (sortBy === 'new') return b.id - a.id;
      return a.numericDistance - b.numericDistance;
    });

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader
        locationName="Explore neighborhood listings"
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        onLocationClick={() => undefined}
        homeHref={themeLink('')}
      />

      <div className="cl-product-container" style={{ paddingTop: '2rem' }}>
        <header className="cl-panel-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="cl-panel-title" style={{ fontSize: '1.75rem' }}>Explore nearby listings</h1>
          <p style={{ color: 'var(--cl-text-muted)', marginTop: '0.5rem' }}>
            Browse classifieds by category and send inquiries directly to neighbors.
          </p>
        </header>

        <div className="cl-filter-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            type="search"
            className="cl-booking-input"
            placeholder="Search listings..."
            defaultValue={searchQuery}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateFilters({ search: (event.target as HTMLInputElement).value });
              }
            }}
            style={{ flex: '1 1 220px' }}
          />
          <select
            className="cl-select"
            value={sortBy}
            onChange={(event) => updateFilters({ sort: event.target.value })}
          >
            <option value="distance">Distance: Closest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="new">Newly Listed</option>
          </select>
        </div>

        <div className="cl-pills-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cl-cat-btn ${selectedCategory === cat.id ? 'cl-active' : ''}`}
              onClick={() => updateFilters({ category: cat.id === 'all' ? '' : cat.id })}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {apiError && useFallback && (
          <div className="cl-alert-slot">
            <CatalogSyncAlert classPrefix="cl" variant="demo" error={apiError} />
          </div>
        )}

        <div className="cl-listing-list" style={{ marginTop: '1.5rem' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="cl-shimmer-card">
                <div className="cl-shimmer-img" />
                <div className="cl-shimmer-body">
                  <div className="cl-shimmer-title" />
                  <div className="cl-shimmer-price" />
                </div>
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="cl-empty-state">
              <h3>No listings match your filters</h3>
              <p>Try another category or broaden your search.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <LocalCard
                key={item.id}
                title={item.title}
                price={item.price}
                distance={item.distance}
                neighborhood={item.neighborhood}
                image={item.image}
                sellerInitials={item.sellerInitials}
                conditionLabel={item.conditionLabel}
                isFocused={false}
                onClick={() => router.push(themeLink(`/product/${item.slug}`))}
                onMessageClick={() => router.push(themeLink(`/product/${item.slug}`))}
              />
            ))
          )}
        </div>

        {currentPage < totalPages && !useFallback && !loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button type="button" className="cl-btn-post" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : 'Load more listings'}
            </button>
          </div>
        )}
      </div>

      <LocalFooter />
    </div>
  );
}

export default function ExplorePage({ initialCategorySlug }: { initialCategorySlug?: string }) {
  return (
    <Suspense fallback={<div className="cl-product-container"><p>Loading explore...</p></div>}>
      <ExplorePageContent initialCategorySlug={initialCategorySlug} />
    </Suspense>
  );
}
