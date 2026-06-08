'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { EventListing } from '@sellio/types';
import { EventCard, ShimmerCard } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import {
  extractEventFilters,
  fetchEventsExplore,
  filterFallbackEvents,
  resolveEventsFailure,
} from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

function ExploreDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [search, setSearch] = useState<string>(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [genre, setGenre] = useState<string>(searchParams.get('genre') || '');

  const [events, setEvents] = useState<EventListing[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (genre) params.set('genre', genre);

    router.replace(themeLink(`/explore?${params.toString()}`));
    setPage(1);
  }, [search, category, location, genre, router, themeLink]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const filters = { search, category, location, genre };
      const result = await fetchEventsExplore({
        q: search || undefined,
        category: category || undefined,
        location: location || undefined,
        genre: genre || undefined,
        page: 1,
        per_page: 6,
      });

      if (result.ok && result.response.data) {
        setEvents(result.response.data);
        setHasMore(result.response.meta ? result.response.meta.current_page < result.response.meta.last_page : false);
        const sidebarFilters = extractEventFilters(result.response.data);
        setCategories(sidebarFilters.categories);
        setLocations(sidebarFilters.locations);
        setGenres(sidebarFilters.genres);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventsFailure(allowDemo, 'corporate');

        if (resolution.mode === 'demo') {
          const filtered = filterFallbackEvents(resolution.events, filters);
          setEvents(filtered);
          setHasMore(false);
          const fallbackFilters = extractEventFilters(resolution.events);
          setCategories(fallbackFilters.categories);
          setLocations(fallbackFilters.locations);
          setGenres(fallbackFilters.genres);
          setUseFallback(true);
        } else {
          setEvents([]);
          setHasMore(false);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [search, category, location, genre, allowDemo]);

  async function loadMore() {
    if (loadingMore || !hasMore || useFallback) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await fetchEventsExplore({
        q: search || undefined,
        category: category || undefined,
        location: location || undefined,
        genre: genre || undefined,
        page: nextPage,
        per_page: 6,
      });

      if (result.ok && result.response.data) {
        setEvents((prev) => [...prev, ...result.response.data]);
        setPage(nextPage);
        setHasMore(result.response.meta ? result.response.meta.current_page < result.response.meta.last_page : false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Pagination load failed.', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setGenre('');
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-explore-header-title">
        <div className="ecc-mono" style={{ marginBottom: '1.5rem' }}>GLOBAL_SUMMITS // CONFERENCES</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-2px', lineHeight: 1.1 }} id="ecc-explore-header-title">
          Explore Technical Conventions
        </h1>
      </section>

      <section className="ecc-detail-container" style={{ paddingTop: '5rem' }}>
        {apiError && useFallback && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecc" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecc" />
          </div>
        )}

        <div className="ecc-explore-filters">
          <div>
            <input
              type="text"
              placeholder="Search conventions..."
              className="ecc-filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Keyword input search"
            />
          </div>
          <div>
            <select
              className="ecc-filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by Category"
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <select
              className="ecc-filter-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by Location"
            >
              <option value="">All Locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <select
              className="ecc-filter-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              aria-label="Filter by Genre"
            >
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="ecc-explore-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => <ShimmerCard key={n} />)}
          </div>
        ) : events.length > 0 ? (
          <div>
            <div className="ecc-explore-grid">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                <button
                  type="button"
                  className="ec-btn-primary"
                  style={{ padding: '1.25rem 5rem' }}
                  onClick={loadMore}
                  disabled={loadingMore}
                  id="ecc-btn-load-more"
                >
                  {loadingMore ? 'SYNCING_NODES...' : 'LOAD MORE CONVENTIONS'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ecc-empty-state" role="status">
            <h3>No Conventions Listed</h3>
            <p>No dynamic events matched the selected facet settings.</p>
            <button type="button" className="ec-btn-outline" style={{ marginTop: '3rem', padding: '1.1rem 3.5rem' }} onClick={resetFilters}>
              RESET ALL FACETS
            </button>
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
          {[1, 2, 3].map((n) => <ShimmerCard key={n} />)}
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
