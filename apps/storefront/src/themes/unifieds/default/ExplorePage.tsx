'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types';
import { ExploreLoadingShell } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { isExploreSortOption, type ExploreSortOption } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchAllVerticals, VERTICALS, type ExploreListing, type Vertical } from '@/themes/unifieds/shared/multiVertical';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

const EXPLORE_PAGE_SIZE = 4;

function ExplorePageContent({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useUnifiedThemeLink();

  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [verticalTotals, setVerticalTotals] = useState<Partial<Record<Vertical, number>>>({});
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');

  // ── Customisable strings ──────────────────────────────────────────────────
  const pageEyebrow = useThemeContent('explore.eyebrow', 'Marketplace directory');
  const pageTitle = useThemeContent('explore.title', 'Explore the catalog');
  const pageDescription = useThemeContent('explore.description', 'Search and filter live listings across every marketplace vertical.');
  const searchLabel = useThemeContent('explore.search_label', 'Search');
  const searchPlaceholder = useThemeContent('explore.search_placeholder', 'Search listings...');
  const categoryLabel = useThemeContent('explore.category_label', 'Category');
  const allCategoriesLabel = useThemeContent('explore.all_categories', 'All categories');
  const locationLabel = useThemeContent('explore.location_label', 'Location');
  const locationPlaceholder = useThemeContent('explore.location_placeholder', 'City or region…');
  const sortLabel = useThemeContent('explore.sort_label', 'Sort by');
  const sortDefault = useThemeContent('explore.sort_default', 'Featured first');
  const sortPriceAsc = useThemeContent('explore.sort_price_asc', 'Price: Low to High');
  const sortPriceDesc = useThemeContent('explore.sort_price_desc', 'Price: High to Low');
  const allVerticals = useThemeContent('explore.all_verticals', 'All');
  const loadMoreLabel = useThemeContent('explore.load_more', 'Load more listings');
  const loadingLabel = useThemeContent('explore.loading', 'Loading…');
  const emptyTitle = useThemeContent('explore.empty_title', 'No listings matched your filters.');
  const emptyDescription = useThemeContent('explore.empty_description', 'Try adjusting your search keywords or choosing a different category.');

  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const searchQuery = searchParams.get('search') || searchParams.get('q') || initialSearch;
  const selectedCategorySlug = searchParams.get('category') || initialCategorySlug || '';
  const selectedVerticalKey = (searchParams.get('vertical') as Vertical | null) || null;
  const sortBy = (searchParams.get('sort') as ExploreSortOption) || 'default';

  const selectedCategory =
    categories.find((category) => category.slug.toLowerCase() === selectedCategorySlug.toLowerCase()) ?? null;

  const searchKey = searchParams.toString();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const query: Record<string, unknown> = { page, per_page: EXPLORE_PAGE_SIZE };
      if (searchQuery) query.search = searchQuery;
      if (selectedCategorySlug) query.category = selectedCategorySlug;

      const result = await fetchAllVerticals(query);

      if (!isMounted) return;

      setListings((previous) => {
        const merged = isFirstPage ? result.listings : [...previous, ...result.listings];
        const seen = new Set<string>();
        return merged.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      });

      setCategories((previous) => {
        const bySlug = new Map<string, Category>();
        [...previous, ...result.categories].forEach((category) => bySlug.set(category.slug, category));
        return Array.from(bySlug.values());
      });

      setVerticalTotals((previous) => (isFirstPage ? result.totals : { ...previous, ...result.totals }));
      setInventoryTotal(result.total || result.listings.length);
      setLastPage(result.lastPage);
      setListingError(
        result.failedVerticals.length > 0 && result.listings.length === 0
          ? `Could not load listings (${result.failedVerticals.join(', ')}).`
          : null,
      );

      setLoading(false);
      setLoadingMore(false);
    }

    loadData();

    return () => { isMounted = false; };
  }, [page, searchKey, searchQuery, selectedCategorySlug]);

  const verticalCounts = useMemo(() => {
    return VERTICALS.reduce<Record<string, number>>((counts, vertical) => {
      counts[vertical.key] = verticalTotals[vertical.key] ?? listings.filter((item) => item.vertical === vertical.key).length;
      return counts;
    }, {});
  }, [listings, verticalTotals]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();
    const normalizedLocation = locationFilter.toLowerCase().trim();

    return listings
      .filter((listing) => {
        const matchesVertical = !selectedVerticalKey || listing.vertical === selectedVerticalKey;
        const matchesCategory =
          !selectedCategory || listing.category.toLowerCase() === selectedCategory.title.toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          listing.title.toLowerCase().includes(normalizedSearch) ||
          listing.description.toLowerCase().includes(normalizedSearch);
        const matchesLocation =
          !normalizedLocation ||
          (listing.specs?.location ?? '').toLowerCase().includes(normalizedLocation) ||
          listing.description.toLowerCase().includes(normalizedLocation);
        return matchesVertical && matchesCategory && matchesSearch && matchesLocation;
      })
      .sort((left, right) => {
        if (sortBy === 'price_asc') {
          return Number(left.price.replace(/[^0-9.]/g, '')) - Number(right.price.replace(/[^0-9.]/g, ''));
        }
        if (sortBy === 'price_desc') {
          return Number(right.price.replace(/[^0-9.]/g, '')) - Number(left.price.replace(/[^0-9.]/g, ''));
        }
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedVerticalKey, sortBy, locationFilter]);

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

  const handleLoadMore = () => {
    updateFilters({}, page + 1);
  };

  return (
    <main className="ud-explore-page">
      <div className="ud-explore-header">
        <div className="ud-mono ud-section-eyebrow">{pageEyebrow}</div>
        <h1 className="ud-explore-title">{pageTitle}</h1>
        <p className="ud-explore-description">{pageDescription}</p>
        {!loading && inventoryTotal != null && (
          <p className="ud-explore-meta">{inventoryTotal.toLocaleString()} listings available</p>
        )}
      </div>

      <section className="ud-explore-verticals" aria-label="Marketplace verticals">
        <button
          type="button"
          className={`ud-explore-vertical-chip ${!selectedVerticalKey ? 'is-active' : ''}`}
          onClick={() => updateFilters({ vertical: '', category: '' })}
        >
          {allVerticals}
        </button>
        {VERTICALS.map((vertical) => (
          <button
            type="button"
            key={vertical.key}
            className={`ud-explore-vertical-chip ${selectedVerticalKey === vertical.key ? 'is-active' : ''}`}
            onClick={() => updateFilters({ vertical: vertical.key, category: '' })}
          >
            {vertical.label}
            <span className="ud-vertical-chip-count">{(verticalCounts[vertical.key] ?? 0).toLocaleString()}</span>
          </button>
        ))}
      </section>

      <section className="ud-explore-controls" aria-label="Explore filters">
        <div className="ud-explore-control-group">
          <label className="ud-explore-label" htmlFor="ud-explore-search">{searchLabel}</label>
          <input
            id="ud-explore-search"
            className="ud-explore-input"
            type="search"
            placeholder={searchPlaceholder}
            defaultValue={searchQuery}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateFilters({ search: (event.target as HTMLInputElement).value });
              }
            }}
          />
        </div>
        <div className="ud-explore-control-group">
          <label className="ud-explore-label" htmlFor="ud-explore-location">{locationLabel}</label>
          <input
            id="ud-explore-location"
            className="ud-explore-input"
            type="text"
            placeholder={locationPlaceholder}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        <div className="ud-explore-control-group">
          <label className="ud-explore-label" htmlFor="ud-explore-category">{categoryLabel}</label>
          <select
            id="ud-explore-category"
            className="ud-explore-select"
            value={selectedCategorySlug}
            onChange={(event) => updateFilters({ category: event.target.value })}
          >
            <option value="">{allCategoriesLabel}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="ud-explore-control-group">
          <label className="ud-explore-label" htmlFor="ud-explore-sort">{sortLabel}</label>
          <select
            id="ud-explore-sort"
            className="ud-explore-select"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                updateFilters({ sort: event.target.value });
              }
            }}
          >
            <option value="default">{sortDefault}</option>
            <option value="price_asc">{sortPriceAsc}</option>
            <option value="price_desc">{sortPriceDesc}</option>
          </select>
        </div>
      </section>

      {listingError && (
        <div className="ud-alert-slot">
          <CatalogSyncAlert error={listingError} />
        </div>
      )}

      {loading ? (
        <div className="ud-listings-grid" aria-label="Loading explore listings" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="ud-listing-card ud-listing-skeleton" key={item}>
              <div className="ud-listing-image-wrap" />
              <div className="ud-listing-body">
                <span />
                <strong />
                <em />
              </div>
            </div>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <>
          <div className="ud-listings-grid">
            {filteredListings.map((listing) => (
              <a href={themeLink(listing.href)} className="ud-listing-card" key={listing.id}>
                <div className="ud-listing-image-wrap">
                  <img src={listing.image} alt={listing.title} loading="lazy" />
                </div>
                <div className="ud-listing-body">
                  <div className="ud-mono">{listing.category}</div>
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <div className="ud-listing-meta">
                    <span>{listing.price}</span>
                    <span>{listing.actionLabel}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {page < lastPage && (
            <div className="ud-load-more-wrap">
              <button type="button" className="core-btn-primary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? loadingLabel : loadMoreLabel}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="ud-listing-state" role="status">
          <div className="ud-listing-state-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <div className="ud-mono ud-section-eyebrow">No matches</div>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          <a href={themeLink('/')} className="core-btn-primary ud-empty-cta">
            Back to home
          </a>
        </div>
      )}
    </main>
  );
}

export default function ExplorePage(props: ExplorePageProps) {
  return (
    <Suspense fallback={<ExploreLoadingShell />}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
