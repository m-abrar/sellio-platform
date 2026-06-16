'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

const PRICE_FILTERS = [
  { label: 'All prices', value: 'all' },
  { label: 'Under $1M', value: 'under1m' },
  { label: '$1M – $3M', value: '1to3m' },
  { label: '$3M+', value: 'over3m' },
] as const;

const TYPE_FILTERS = [
  { label: 'All types', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
] as const;

type PriceFilter = typeof PRICE_FILTERS[number]['value'];
type TypeFilter = typeof TYPE_FILTERS[number]['value'];

const FALLBACK_IMAGES = [
  '/themes/properties/map/1.webp',
  '/themes/properties/map/2.webp',
  '/themes/properties/map/3.webp',
  '/themes/properties/map/4.webp',
  '/themes/properties/map/5.webp',
  '/themes/properties/map/6.webp',
];

function getPrice(property: Property) {
  return property.pricing?.price_formatted
    || (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request');
}

function getAddress(property: Property) {
  return property.location?.title
    || property.address
    || [property.city, property.state, property.country].filter(Boolean).join(', ')
    || 'Location not specified';
}

function getImage(property: Property, index: number) {
  return property.featured_image
    || property.thumbnail_image
    || (property as any).primary_image_url
    || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function getNumericPrice(property: Property) {
  return Number(property.base_price) || 0;
}

function getListingType(property: Property) {
  return (property as any).listing_type || '';
}

// ─── Property card ────────────────────────────────────────────────────────────

function ExploreCard({ property, index, themeLink }: { property: Property; index: number; themeLink: (path: string) => string }) {
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms;
  const sqft = property.specs?.area_formatted?.replace(/[^\d,]/g, '')
    || String(property.area_sq_ft || '');
  const category = property.specs?.category || (property as any).category?.title || 'Property';

  return (
    <a href={themeLink(`/product/${property.slug}`)} className="pm-xcard-link">
      <div className="pm-xcard">
        <div className="pm-xcard-img-wrap">
          <img src={getImage(property, index)} alt={property.title} className="pm-xcard-img" loading="lazy" />
          <span className="pm-xcard-badge">{category}</span>
        </div>
        <div className="pm-xcard-body">
          <div className="pm-price">{getPrice(property)}</div>
          <div className="pm-card-address">{getAddress(property)}</div>
          {(beds != null || baths != null || sqft) && (
            <div className="pm-card-specs">
              {beds != null && <span>{beds} bd</span>}
              {baths != null && <span>{baths} ba</span>}
              {sqft && <span>{sqft} sqft</span>}
            </div>
          )}
          <div className="pm-xcard-cta">View property →</div>
        </div>
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ExplorePageProps {
  initialCategorySlug?: string;
}

export default function ExplorePage({ initialCategorySlug: _ignored }: ExplorePageProps) {
  const themeLink = usePropertyThemeLink();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  async function fetchPage(page: number, append: boolean) {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await api.getProperties({ per_page: 12, page } as any);
      const data: Property[] = Array.isArray(response.data) ? response.data : [];
      if (append) {
        setProperties((prev) => [...prev, ...data]);
      } else {
        setProperties(data);
      }
      setCurrentPage((response as any).meta?.current_page ?? page);
      setLastPage((response as any).meta?.last_page ?? 1);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Properties could not be loaded.');
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }

  useEffect(() => { fetchPage(1, false); }, []);

  const filtered = useMemo(() => {
    let list = properties;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q)
        || p.address?.toLowerCase().includes(q)
        || p.city?.toLowerCase().includes(q)
        || p.location?.title?.toLowerCase().includes(q),
      );
    }

    return list.filter((p) => {
      const price = getNumericPrice(p);
      if (priceFilter === 'under1m' && price >= 1_000_000) return false;
      if (priceFilter === '1to3m' && (price < 1_000_000 || price > 3_000_000)) return false;
      if (priceFilter === 'over3m' && price <= 3_000_000) return false;

      const lt = getListingType(p);
      if (typeFilter === 'buy' && !['buy', 'sale', 'for_sale'].includes(lt)) return false;
      if (typeFilter === 'rent' && !['rent', 'for_rent', 'rental'].includes(lt)) return false;

      return true;
    });
  }, [properties, searchQuery, priceFilter, typeFilter]);

  const hasActiveFilter = priceFilter !== 'all' || typeFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <main className="pm-xplore-page">

      {/* Hero search bar */}
      <section className="pm-xplore-hero">
        <div className="pm-xplore-hero-inner">
          <span className="pm-xplore-kicker">Property Search</span>
          <h1 className="pm-xplore-title">Browse all listings.</h1>
          <p className="pm-xplore-desc">Search homes, apartments, and commercial properties. Filter by price, type, and location.</p>

          <form
            className="pm-xplore-search"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="pm-xplore-search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="pm-xplore-search-icon">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="pm-xplore-search-input"
                placeholder="Search by city, address, or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search properties"
              />
              {searchQuery && (
                <button type="button" className="pm-xplore-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
              )}
            </div>
            <a href={themeLink('/')} className="pm-cta-btn">Map View</a>
          </form>
        </div>
      </section>

      {/* Filter chips */}
      <div className="pm-xplore-filterbar">
        <div className="pm-xplore-filterbar-inner">
          <div className="pm-filter-row">
            {PRICE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`pm-filter-chip${priceFilter === f.value ? ' pm-filter-chip-active' : ''}`}
                onClick={() => setPriceFilter(f.value)}
              >{f.label}</button>
            ))}
          </div>
          <div className="pm-filter-row">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`pm-filter-chip${typeFilter === f.value ? ' pm-filter-chip-active' : ''}`}
                onClick={() => setTypeFilter(f.value)}
              >{f.label}</button>
            ))}
          </div>
          {hasActiveFilter && (
            <button
              type="button"
              className="pm-filter-chip pm-filter-clear"
              onClick={() => { setPriceFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
            >Clear all</button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pm-xplore-body">

        {/* Count row */}
        {!loading && !error && (
          <div className="pm-xplore-count">
            {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
            {hasActiveFilter ? ' matching your filters' : ' available'}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="pm-xplore-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="pm-xcard pm-xcard-skeleton">
                <div className="pm-xcard-img-wrap pm-xcard-skeleton-img pm-detail-skeleton" />
                <div className="pm-xcard-body">
                  <div className="pm-detail-skeleton pm-detail-line pm-detail-line-title" style={{ width: '55%' }} />
                  <div className="pm-detail-skeleton pm-detail-line" style={{ width: '80%' }} />
                  <div className="pm-detail-skeleton pm-detail-line pm-detail-line-short" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="pm-empty-state">
            <div className="pm-empty-icon">◎</div>
            <div className="pm-empty-kicker">Connection error</div>
            <p className="pm-empty-message">Properties could not be loaded.</p>
            <button type="button" className="pm-empty-action" onClick={() => fetchPage(1, false)}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pm-empty-state">
            <div className="pm-empty-icon">◎</div>
            <div className="pm-empty-kicker">{hasActiveFilter ? 'No matches' : 'No listings yet'}</div>
            <p className="pm-empty-message">
              {hasActiveFilter
                ? 'No properties match your current filters.'
                : 'No property listings are published yet.'}
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                className="pm-empty-action"
                onClick={() => { setPriceFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
              >Clear filters</button>
            )}
          </div>
        ) : (
          <div className="pm-xplore-grid">
            {filtered.map((property, i) => (
              <ExploreCard key={property.id} property={property} index={i} themeLink={themeLink} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && !error && currentPage < lastPage && (
          <div className="pm-xplore-load-more">
            <button
              type="button"
              className="pm-xplore-load-btn"
              onClick={() => fetchPage(currentPage + 1, true)}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more properties'}
            </button>
          </div>
        )}
      </div>

    </main>
  );
}
