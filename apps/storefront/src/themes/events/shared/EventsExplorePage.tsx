'use client';

import React, { useEffect, useState, Suspense } from 'react';
import type { EventListing } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import {
  extractEventFilters,
  fetchEventsExplore,
  filterFallbackEvents,
  resolveEventsFailure,
  type EventsThemeVariant,
} from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export type EventsExploreClassPrefix = 'evm' | 'evc' | 'eff';

export interface EventsExplorePageProps {
  variant: EventsThemeVariant;
  classPrefix: EventsExploreClassPrefix;
  pageEyebrow: string;
  pageTitle: string;
  pageSubtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  loadMoreLabel: string;
  resetLabel: string;
  filterSectionClass: string;
  searchInputClass: string;
  selectClass: string;
  gridClass: string;
  primaryBtnClass: string;
  outlineBtnClass: string;
  renderEventCard: (event: EventListing) => React.ReactNode;
  renderShimmerCard?: (index: number) => React.ReactNode;
}

function ExplorePageContent({
  variant,
  classPrefix,
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  emptyTitle,
  emptyDescription,
  loadMoreLabel,
  resetLabel,
  filterSectionClass,
  searchInputClass,
  selectClass,
  gridClass,
  primaryBtnClass,
  outlineBtnClass,
  renderEventCard,
  renderShimmerCard,
}: EventsExplorePageProps) {
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
        const resolution = resolveEventsFailure(allowDemo, variant);

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
  }, [search, category, location, genre, allowDemo, variant]);

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
    <div className={`${classPrefix}-explore-page`}>
      <section className={`${classPrefix}-explore-hero`} aria-labelledby={`${classPrefix}-explore-title`}>
        <a href={themeLink('/')} className={`${classPrefix}-explore-back`}>
          ← Back to home
        </a>
        <div className={`${classPrefix}-explore-eyebrow`}>{pageEyebrow}</div>
        <h1 id={`${classPrefix}-explore-title`}>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
      </section>

      <section className={`${classPrefix}-explore-body`}>
        {apiError && useFallback && (
          <div className={`${classPrefix}-alert-slot`}>
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix={classPrefix} />
          </div>
        )}
        {apiError && !useFallback && (
          <div className={`${classPrefix}-alert-slot`}>
            <CatalogSyncAlert variant="production" error={apiError} classPrefix={classPrefix} />
          </div>
        )}

        <div className={filterSectionClass}>
          <input
            type="text"
            placeholder="Search events..."
            className={searchInputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Keyword search"
          />
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
            <option value="">All Locations</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className={selectClass} value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre">
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {loading ? (
          <div className={gridClass}>
            {[1, 2, 3, 4, 5, 6].map((n) =>
              renderShimmerCard ? renderShimmerCard(n) : <div key={n} className={`${classPrefix}-explore-shimmer`} />,
            )}
          </div>
        ) : events.length > 0 ? (
          <div>
            <div className={gridClass}>
              {events.map((event) => (
                <React.Fragment key={event.id}>{renderEventCard(event)}</React.Fragment>
              ))}
            </div>

            {hasMore && (
              <div className={`${classPrefix}-explore-load-more`}>
                <button type="button" className={primaryBtnClass} onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? 'Loading...' : loadMoreLabel}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`${classPrefix}-empty-state`} role="status">
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
            <button type="button" className={outlineBtnClass} onClick={resetFilters}>
              {resetLabel}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function EventsExplorePage(props: EventsExplorePageProps) {
  return (
    <Suspense fallback={<div style={{ padding: '6rem 5%', textAlign: 'center' }}>Loading events...</div>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
