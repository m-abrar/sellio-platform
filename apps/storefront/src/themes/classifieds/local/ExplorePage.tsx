'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category, ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalCard, LocalFooter } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsExplore } from '@/themes/classifieds/shared/catalog';
import {
  buildLocalCategoriesFromListings,
  buildLocalCategoriesFromSidebar,
  mapClassifiedToLocalCard,
  type CategoryPill,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useClassifiedsThemeLink();

  const [items, setItems] = useState<LocalCardItem[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: 'all', name: 'All Nearby', icon: '📍' },
  ]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const [lastPage, setLastPage] = useState(1);

  const searchQuery = searchParams.get('search') || searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || initialCategorySlug || 'all';
  const sortBy = searchParams.get('sort') || 'distance';

  const getQueryParams = (pageNumber: number) => {
    const params: Record<string, unknown> = { page: pageNumber, per_page: 12 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
    return params;
  };

  const updateFilters = (updates: Record<string, string>, pageNumber = 1) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    } else {
      params.delete('page');
    }

    router.push(themeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function loadData() {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const result = await fetchClassifiedsExplore(getQueryParams(page));

      if (result.ok && result.response.data) {
        const listings = result.response.data as ClassifiedListing[];
        const newItems = listings.map(mapClassifiedToLocalCard);

        setItems((prev) => {
          const merged = isFirstPage ? newItems : [...prev, ...newItems];
          const seen = new Set<number>();

          return merged.filter((item) => {
            if (seen.has(item.id)) {
              return false;
            }
            seen.add(item.id);
            return true;
          });
        });

        setLastPage(result.response.meta?.last_page || 1);
        setInventoryTotal(result.response.meta?.total ?? listings.length);

        if (isFirstPage) {
          if (result.response.sidebar?.categories) {
            setCategories(
              buildLocalCategoriesFromSidebar(result.response.sidebar.categories as Category[]),
            );
          } else {
            setCategories(buildLocalCategoriesFromListings(listings));
          }
        }

        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        if (isFirstPage) {
          setItems([]);
          setInventoryTotal(null);
        }
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadData();
  }, [searchParams, page, searchQuery, selectedCategory]);

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

  const handleLoadMore = () => {
    updateFilters({}, page + 1);
  };

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader
        locationName="Explore neighborhood listings"
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        onLocationClick={() => undefined}
        homeHref={themeLink('/')}
      />

      <div className="cl-product-container cl-explore-container">
        <header className="cl-panel-header cl-explore-header">
          <div>
            <h1 className="cl-panel-title cl-explore-title">Explore nearby listings</h1>
            <p className="cl-explore-lead">
              Browse classifieds by category and send inquiries directly to neighbors.
            </p>
            {!loading && inventoryTotal != null && (
              <p className="cl-panel-meta">{inventoryTotal} listings in catalog</p>
            )}
          </div>
        </header>

        <div className="cl-filter-row">
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

        {apiError && (
          <div className="cl-alert-slot">
            <CatalogSyncAlert classPrefix="cl" variant="production" error={apiError} />
          </div>
        )}

        <div className="cl-listing-list cl-explore-list">
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
              <a href={themeLink('/')} className="cl-btn-post cl-empty-cta">
                Back to map view
              </a>
            </div>
          ) : (
            filteredItems.map((item) => (
              <a key={item.id} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <LocalCard
                  title={item.title}
                  price={item.price}
                  distance={item.distance}
                  neighborhood={item.neighborhood}
                  image={item.image}
                  sellerInitials={item.sellerInitials}
                  conditionLabel={item.conditionLabel}
                  isFocused={false}
                  onClick={() => {}}
                  onMessageClick={() => {}}
                />
              </a>
            ))
          )}
        </div>

        {page < lastPage && !loading && (
          <div className="cl-load-more-wrap">
            <button type="button" className="cl-btn-post" onClick={handleLoadMore} disabled={loadingMore}>
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
