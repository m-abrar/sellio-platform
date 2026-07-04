'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types';
import { isExploreSortOption, type ExploreSortOption } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchAllVerticals, VERTICALS, type ExploreListing, type Vertical } from '@/themes/unifieds/shared/multiVertical';
import './subpages.css';

export type UnifiedExplorePageProps = {
  initialCategorySlug?: string;
  initialSearch?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

const EXPLORE_PAGE_SIZE = 9;

function ExplorePageContent({
  initialCategorySlug,
  initialSearch = '',
  eyebrow = 'Explore the marketplace',
  title = 'Explore Listings',
  description = 'Search, filter, and browse live listings across every marketplace category.',
}: UnifiedExplorePageProps) {
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

      if (!isMounted) {
        return;
      }

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

    return () => {
      isMounted = false;
    };
  }, [page, searchKey, searchQuery, selectedCategorySlug]);

  const verticalCounts = useMemo(() => {
    return VERTICALS.reduce<Record<string, number>>((counts, vertical) => {
      counts[vertical.key] = verticalTotals[vertical.key] ?? listings.filter((item) => item.vertical === vertical.key).length;
      return counts;
    }, {});
  }, [listings, verticalTotals]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    return listings
      .filter((listing) => {
        const matchesVertical = !selectedVerticalKey || listing.vertical === selectedVerticalKey;
        const matchesCategory =
          !selectedCategory || listing.category.toLowerCase() === selectedCategory.title.toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          listing.title.toLowerCase().includes(normalizedSearch) ||
          listing.description.toLowerCase().includes(normalizedSearch);
        return matchesVertical && matchesCategory && matchesSearch;
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
  }, [listings, searchQuery, selectedCategory, selectedVerticalKey, sortBy]);

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
    <main className="uni-explore-page">
      <div className="uni-explore-header">
        <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1.5rem' }}>
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        {!loading && inventoryTotal != null ? (
          <p style={{ marginTop: '1rem', fontWeight: 700, color: '#1e293b' }}>
            {inventoryTotal.toLocaleString()} listings available
          </p>
        ) : null}
      </div>

      <div className="uni-vertical-chips" role="group" aria-label="Filter by category type">
        <button
          type="button"
          className={`uni-vertical-chip${!selectedVerticalKey ? ' uni-vertical-chip-active' : ''}`}
          onClick={() => updateFilters({ vertical: '', category: '' })}
        >
          All
        </button>
        {VERTICALS.map((vertical) => (
          <button
            type="button"
            key={vertical.key}
            className={`uni-vertical-chip${selectedVerticalKey === vertical.key ? ' uni-vertical-chip-active' : ''}`}
            onClick={() => updateFilters({ vertical: vertical.key, category: '' })}
          >
            {vertical.label} ({(verticalCounts[vertical.key] ?? 0).toLocaleString()})
          </button>
        ))}
      </div>

      <section className="uni-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="uni-explore-search">Search Keywords</label>
          <input
            id="uni-explore-search"
            type="text"
            placeholder="Search active listings..."
            defaultValue={searchQuery}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateFilters({ search: (event.target as HTMLInputElement).value });
              }
            }}
          />
        </div>
        <div>
          <label htmlFor="uni-explore-category">Category</label>
          <select
            id="uni-explore-category"
            value={selectedCategorySlug}
            onChange={(event) => updateFilters({ category: event.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="uni-explore-sort">Sort Order</label>
          <select
            id="uni-explore-sort"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                updateFilters({ sort: event.target.value });
              }
            }}
          >
            <option value="default">Featured first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="uni-listings-grid" aria-label="Loading explore listings">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="uni-listing-card uni-listing-skeleton" key={item}>
              <div className="uni-listing-image-wrap" />
              <div className="uni-listing-body">
                <span />
                <strong />
                <em />
              </div>
            </div>
          ))}
        </div>
      ) : listingError ? (
        <div className="uni-listing-state" role="status">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
            Connection issue
          </div>
          <h3>Explore listings could not be synchronized.</h3>
          <p>{listingError}</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <>
          <div className="uni-listings-grid">
            {filteredListings.map((listing) => (
              <a
                href={themeLink(listing.href)}
                className="uni-listing-card"
                key={listing.id}
              >
                <div className="uni-listing-image-wrap">
                  <img src={listing.image} alt={listing.title} loading="lazy" />
                  <span className="uni-card-vertical-badge">{listing.vertical}</span>
                </div>
                <div className="uni-listing-body">
                  <div className="uni-mono">{listing.category}</div>
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <div className="uni-listing-meta">
                    <span>{listing.price}</span>
                    <span>{listing.actionLabel}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {page < lastPage ? (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button type="button" className="uni-btn-primary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading listings...' : 'Load more listings'}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="uni-listing-state" role="status">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
            No results
          </div>
          <h3>No listings matched your filters.</h3>
          <p>Try adjusting your search keywords or choosing a different category.</p>
        </div>
      )}
    </main>
  );
}

export default function UnifiedExplorePage(props: UnifiedExplorePageProps) {
  return (
    <Suspense fallback={<main className="uni-explore-page" style={{ textAlign: 'center' }}>Loading explore...</main>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
