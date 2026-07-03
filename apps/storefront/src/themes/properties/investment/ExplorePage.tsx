'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Property } from '@/types';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { getInvestmentMetric, INVESTMENT_METHODOLOGY_NOTE } from './investment-metrics';
import { PortfolioAssetCard } from './components';

const ASSET_TYPES = ['Residential', 'Commercial', 'Industrial', 'Retail', 'Specialty', 'Development', 'Infrastructure'];
const STATUS_LABELS = ['VERIFIED', 'ACTIVE', 'PREMIUM', 'INSTITUTIONAL'];

const SORT_OPTIONS = [
  { label: 'Highest yield/revenue', value: 'metric_desc' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
] as const;

type SortValue = typeof SORT_OPTIONS[number]['value'];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getAssetType(property: Property, index: number): string {
  const type = property.specs?.property_type || property.specs?.category;
  if (typeof type === 'string' && type.trim()) return type;
  return ASSET_TYPES[index % ASSET_TYPES.length];
}

function mapToCard(property: Property, index: number) {
  const metric = getInvestmentMetric(property);
  return {
    slug: property.slug,
    title: property.title,
    price: getPropertyPrice(property),
    type: getAssetType(property, index),
    status: property.is_featured ? 'PREMIUM' : STATUS_LABELS[index % STATUS_LABELS.length],
    metricLabel: metric?.label ?? null,
    metricValue: metric?.value ?? null,
    metricSort: metric?.sortValue ?? -Infinity,
    priceValue: Number(property.base_price) || 0,
    createdAt: property.created_at ? new Date(property.created_at as unknown as string).getTime() : 0,
  };
}

export default function ExplorePage() {
  const themeLink = usePropertyThemeLink();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortValue, setSortValue] = useState<SortValue>('metric_desc');

  async function fetchPage(page: number, append: boolean) {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await api.getProperties({ per_page: 12, page } as any);
      const data: Property[] = Array.isArray(response.data) ? response.data : [];
      setProperties((prev) => (append ? [...prev, ...data] : data));
      setCurrentPage((response as any).meta?.current_page ?? page);
      setLastPage((response as any).meta?.last_page ?? 1);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Portfolio assets could not be loaded.');
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }

  useEffect(() => { fetchPage(1, false); }, []);

  const cards = useMemo(() => properties.map(mapToCard), [properties]);

  const availableTypes = useMemo(
    () => Array.from(new Set(cards.map((c) => c.type))).sort(),
    [cards],
  );

  const filtered = useMemo(() => {
    let list = cards;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q));
    }

    if (typeFilter !== 'all') {
      list = list.filter((c) => c.type === typeFilter);
    }

    const sorted = [...list];
    switch (sortValue) {
      case 'price_asc':
        sorted.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'metric_desc':
      default:
        sorted.sort((a, b) => b.metricSort - a.metricSort);
        break;
    }

    return sorted;
  }, [cards, searchQuery, typeFilter, sortValue]);

  const hasActiveFilter = typeFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <main className="pi-xplore-page">
      <section className="pi-xplore-hero">
        <div className="pi-mono" style={{ marginBottom: '1.5rem' }}>Portfolio Search</div>
        <h1 className="pi-heading-xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>Browse all assets.</h1>
        <p style={{ marginTop: '1.5rem', maxWidth: '640px', color: 'var(--pi-slate)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Sort by projected yield, filter by asset class, and compare pricing across the full portfolio.
        </p>

        <div className="pi-xplore-controls">
          <input
            type="search"
            className="pi-xplore-search"
            placeholder="Search by asset name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search portfolio assets"
          />
          <select
            className="pi-xplore-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by asset type"
          >
            <option value="all">All asset types</option>
            {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="pi-xplore-select"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value as SortValue)}
            aria-label="Sort assets"
          >
            {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {hasActiveFilter && (
            <button
              type="button"
              className="pi-xplore-clear"
              onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
            >
              Clear
            </button>
          )}
        </div>
        <p className="pi-mono pi-methodology-note" style={{ marginTop: '1.5rem' }}>*{INVESTMENT_METHODOLOGY_NOTE}</p>
      </section>

      <section className="pi-xplore-body">
        {!loading && !error && (
          <div className="pi-mono pi-xplore-count">
            {filtered.length} {filtered.length === 1 ? 'asset' : 'assets'}{hasActiveFilter ? ' matching your filters' : ' in the portfolio'}
          </div>
        )}

        {loading ? (
          <div className="pi-asset-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="pi-asset-card prop-listing-skeleton" key={i}>
                <div className="prop-skeleton-line prop-skeleton-line-title" />
                <div className="prop-skeleton-line" />
                <div className="prop-skeleton-line prop-skeleton-line-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="prop-listing-state">
            <div className="prop-listing-kicker">Connection Error</div>
            <h3>Portfolio assets could not be loaded.</h3>
            <button type="button" className="pi-btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => fetchPage(1, false)}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="prop-listing-state">
            <div className="prop-listing-kicker">{hasActiveFilter ? 'No matches' : 'No assets yet'}</div>
            <h3>{hasActiveFilter ? 'No assets match your current filters.' : 'No properties are published yet.'}</h3>
            {hasActiveFilter && (
              <button
                type="button"
                className="pi-btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="pi-asset-grid">
            {filtered.map((card) => (
              <a className="pi-asset-link" href={themeLink(`/product/${card.slug}`)} key={card.slug}>
                <PortfolioAssetCard {...card} />
              </a>
            ))}
          </div>
        )}

        {!loading && !error && currentPage < lastPage && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button
              type="button"
              className="pi-btn-primary"
              onClick={() => fetchPage(currentPage + 1, true)}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more assets'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
