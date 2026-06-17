'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@sellio/types';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { isExploreSortOption, type ExploreSortOption } from '@/themes/unifieds/shared/product-utils';
import { fetchAllVerticals, VERTICALS, type ExploreListing, type Vertical } from '@/themes/unifieds/shared/multiVertical';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

const EXPLORE_PAGE_SIZE = 6;

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 1.2rem',
  border: '1px solid var(--usm-border)',
  borderRadius: '8px',
  fontFamily: 'var(--usm-font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  backgroundColor: 'var(--usm-ghost)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'block',
  marginBottom: '0.75rem',
  color: '#111',
};

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
    <div style={{ padding: '8rem 6% 6rem' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="usm-mono" style={{ color: 'var(--usm-primary)', marginBottom: '1.5rem', display: 'inline-block', fontWeight: 600 }}>MARKETPLACE DIRECTORY</span>
        <h1 className="usm-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '1rem 0', fontWeight: 600 }}>
          Explore the catalog
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666', fontWeight: 300, lineHeight: 1.8 }}>
          Search and filter live listings across every marketplace category.
        </p>
        {!loading && inventoryTotal != null && (
          <p style={{ color: '#888', fontWeight: 300, marginTop: '1rem' }}>{inventoryTotal.toLocaleString()} listings available</p>
        )}
      </div>

      {/* Vertical chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button
          type="button"
          onClick={() => updateFilters({ vertical: '', category: '' })}
          className="usm-btn-primary"
          style={{
            background: !selectedVerticalKey ? undefined : 'transparent',
            color: !selectedVerticalKey ? undefined : 'var(--usm-ink)',
            border: !selectedVerticalKey ? 'none' : '1px solid var(--usm-border)',
          }}
        >
          All
        </button>
        {VERTICALS.map((vertical) => (
          <button
            type="button"
            key={vertical.key}
            onClick={() => updateFilters({ vertical: vertical.key, category: '' })}
            className="usm-btn-primary"
            style={{
              background: selectedVerticalKey === vertical.key ? undefined : 'transparent',
              color: selectedVerticalKey === vertical.key ? undefined : 'var(--usm-ink)',
              border: selectedVerticalKey === vertical.key ? 'none' : '1px solid var(--usm-border)',
              gap: '0.5rem',
            }}
          >
            {vertical.label} ({(verticalCounts[vertical.key] ?? 0).toLocaleString()})
          </button>
        ))}
      </div>

      {/* Control Panel (Search, Categories, Sorting) */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--usm-border)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '4rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center' }}>

          {/* Search Box */}
          <div>
            <label style={labelStyle}>Search Keywords</label>
            <input
              type="search"
              placeholder="Search active listings..."
              defaultValue={searchQuery}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  updateFilters({ search: (event.target as HTMLInputElement).value });
                }
              }}
              style={fieldStyle}
            />
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={selectedCategorySlug}
              onChange={(e) => updateFilters({ category: e.target.value })}
              style={{ ...fieldStyle, cursor: 'pointer' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <label style={labelStyle}>Sort Order</label>
            <select
              value={sortBy}
              onChange={(event) => {
                if (isExploreSortOption(event.target.value)) {
                  updateFilters({ sort: event.target.value });
                }
              }}
              style={{ ...fieldStyle, cursor: 'pointer' }}
            >
              <option value="default">Featured first</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ border: '1px solid var(--usm-border)', borderRadius: '12px', padding: '1.5rem', opacity: 0.6 }}>
              <div style={{ aspectRatio: '4/3', borderRadius: '8px', background: '#f3f4f6', animation: 'pulse 1.5s infinite', marginBottom: '1.5rem' }}></div>
              <div style={{ height: '12px', background: '#ddd', width: '30%', borderRadius: '4px' }}></div>
              <div style={{ height: '20px', background: '#ddd', width: '80%', borderRadius: '4px', marginTop: '10px' }}></div>
              <div style={{ height: '16px', background: '#ddd', width: '40%', borderRadius: '4px', marginTop: '10px' }}></div>
            </div>
          ))}
        </div>
      ) : listingError ? (
        <div className="usm-listing-state" role="status">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>Explore listings could not be synchronized.</h3>
          <p style={{ color: '#888', fontWeight: 300 }}>{listingError}</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {filteredListings.map((listing) => (
              <a
                href={themeLink(listing.href)}
                key={listing.id}
                className="usm-listing-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="usm-card-img-wrap">
                  <img src={listing.image} className="usm-card-img" alt={listing.title} />
                  <span className="usm-card-vertical-badge">{listing.vertical}</span>
                </div>
                <div className="usm-card-body">
                  <span className="usm-card-category">{listing.category}</span>
                  <h3 className="usm-card-title">{listing.title}</h3>
                  <div className="usm-card-price">
                    {listing.price}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {page < lastPage && (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button type="button" className="silent-btn-primary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading listings...' : 'Load more listings'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 0', border: '1px dashed var(--usm-border)', borderRadius: '12px' }}>
          <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" width="48" height="48" style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>No Listings Found</h3>
          <p style={{ color: '#888', fontWeight: 300 }}>Try adjusting your search keywords or choosing a different category.</p>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage(props: ExplorePageProps) {
  return (
    <Suspense fallback={<div style={{ padding: '8rem 6% 6rem', textAlign: 'center', color: '#666' }}>Loading explore...</div>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
