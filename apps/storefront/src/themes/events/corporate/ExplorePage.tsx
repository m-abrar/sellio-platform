'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { EventListing } from '@sellio/types';
import Link from 'next/link';
import { EventCard, ShimmerCard } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { extractEventFilters, fetchEventsExplore } from '@/themes/events/shared/catalog';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

function ExploreDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeLink = useEventsThemeLink();

  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const genre = searchParams.get('genre') || '';

  const [draftSearch, setDraftSearch] = useState(search);
  const [draftCategory, setDraftCategory] = useState(category);
  const [draftLocation, setDraftLocation] = useState(location);
  const [draftGenre, setDraftGenre] = useState(genre);

  const [events, setEvents] = useState<EventListing[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    setDraftSearch(search);
    setDraftCategory(category);
    setDraftLocation(location);
    setDraftGenre(genre);
  }, [search, category, location, genre]);

  useEffect(() => {
    async function loadData() {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const result = await fetchEventsExplore({
        q: search || undefined,
        category: category || undefined,
        location: location || undefined,
        genre: genre || undefined,
        page,
        per_page: 9,
      });

      if (result.ok && Array.isArray(result.response.data)) {
        setEvents((prev) => {
          const merged = isFirstPage ? result.response.data : [...prev, ...result.response.data];
          const seen = new Set<number>();

          return merged.filter((event) => {
            if (seen.has(event.id)) {
              return false;
            }

            seen.add(event.id);
            return true;
          });
        });

        if (result.response.meta) {
          setLastPage(result.response.meta.last_page);
          setInventoryTotal(result.response.meta.total ?? null);
        }

        const sidebarFilters = extractEventFilters(result.response.data);
        if (isFirstPage) {
          setCategories(sidebarFilters.categories);
          setLocations(sidebarFilters.locations);
          setGenres(sidebarFilters.genres);
        }

        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        if (isFirstPage) {
          setEvents([]);
          setInventoryTotal(null);
        }
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadData();
  }, [search, category, location, genre, page]);

  const applyFilters = (nextPage = 1) => {
    const params = new URLSearchParams();
    if (draftSearch) params.set('q', draftSearch);
    if (draftCategory) params.set('category', draftCategory);
    if (draftLocation) params.set('location', draftLocation);
    if (draftGenre) params.set('genre', draftGenre);
    if (nextPage > 1) params.set('page', String(nextPage));

    router.push(themeLink(`/explore?${params.toString()}`));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(1);
  };

  const handleLoadMore = () => {
    applyFilters(page + 1);
  };

  const resetFilters = () => {
    setDraftSearch('');
    setDraftCategory('');
    setDraftLocation('');
    setDraftGenre('');
    router.push(themeLink('/explore'));
  };

  const activeFilterCount = [search, category, location, genre].filter(Boolean).length;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-explore-header-title">
        <div className="ecc-mono" style={{ marginBottom: '1.5rem' }}>GLOBAL_SUMMITS // CONFERENCES</div>
        <h1
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-2px', lineHeight: 1.1 }}
          id="ecc-explore-header-title"
        >
          Explore Technical Conventions
        </h1>
        {inventoryTotal !== null && (
          <p className="ecc-results-meta" style={{ marginTop: '1.25rem', textAlign: 'left' }}>
            <strong>{inventoryTotal}</strong> published event{inventoryTotal !== 1 ? 's' : ''} in catalog
          </p>
        )}
      </section>

      <section className="ecc-detail-container" style={{ paddingTop: '3rem' }}>
        {apiError && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecc" />
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="ecc-explore-filters">
          <div>
            <input
              type="text"
              placeholder="Search conventions..."
              className="ecc-filter-input"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              aria-label="Keyword input search"
            />
          </div>
          <div>
            <select className="ecc-filter-select" value={draftCategory} onChange={(e) => setDraftCategory(e.target.value)} aria-label="Filter by Category">
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select className="ecc-filter-select" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)} aria-label="Filter by Location">
              <option value="">All Locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select className="ecc-filter-select" value={draftGenre} onChange={(e) => setDraftGenre(e.target.value)} aria-label="Filter by Genre">
              <option value="">All Genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="ecc-filter-actions">
            {activeFilterCount > 0 && (
              <span className="ecc-results-meta" style={{ margin: 0, marginRight: 'auto' }}>
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
            )}
            <button type="button" className="ec-btn-outline" onClick={resetFilters}>
              Reset
            </button>
            <button type="submit" className="ec-btn-primary">
              Apply Filters
            </button>
          </div>
        </form>

        {loading ? (
          <div className="ecc-explore-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ShimmerCard key={n} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div>
            <div className="ecc-results-meta" style={{ marginBottom: '2rem' }}>
              Showing <strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''}
            </div>
            <div className="ecc-explore-grid">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {page < lastPage && (
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button
                  type="button"
                  className="ec-btn-primary"
                  style={{ padding: '1.25rem 5rem' }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  id="ecc-btn-load-more"
                >
                  {loadingMore ? 'Loading...' : 'LOAD MORE CONVENTIONS'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ecc-empty-state" role="status">
            <h3>No Conventions Listed</h3>
            <p>No events matched the selected filters.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button type="button" className="ec-btn-outline" onClick={resetFilters}>
                RESET FILTERS
              </button>
              <Link href={themeLink('')} className="ec-btn-primary" style={{ textDecoration: 'none' }}>
                BACK TO HOME
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ShimmerDirectory() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header">
        <div className="ecc-mono ecc-shimmer" style={{ width: '120px', height: '16px' }}></div>
        <div className="ecc-shimmer" style={{ width: '400px', height: '48px', marginTop: '1.5rem' }}></div>
      </section>
      <section className="ecc-detail-container" style={{ paddingTop: '5rem' }}>
        <div className="ecc-explore-grid">
          {[1, 2, 3].map((n) => (
            <ShimmerCard key={n} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ShimmerDirectory />}>
      <ExploreDirectory />
    </Suspense>
  );
}
