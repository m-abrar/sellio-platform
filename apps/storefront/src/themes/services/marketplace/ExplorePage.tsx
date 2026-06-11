'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category, Location, ServiceListing } from '@sellio/types';
import { SmProviderCard, SmProviderSkeleton } from './components';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import {
  fetchServicesExplore,
  resolveServicesFailure,
} from '@/themes/services/shared/catalog';
import { MARKETPLACE_FALLBACK_CATEGORIES } from '@/themes/services/shared/fallback-data';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [services, setServices] = useState<ServiceListing[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const searchQuery = searchParams.get('search') || searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || initialCategorySlug || '';
  const selectedLocation = searchParams.get('location') || '';
  const priceRange = searchParams.get('price_range') || '';

  const getQueryParams = (page: number) => {
    const params: Record<string, unknown> = { page, per_page: 12 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLocation) params.location = selectedLocation;
    if (priceRange) params.price_range = priceRange;
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
      const result = await fetchServicesExplore(getQueryParams(1));

      if (result.ok && result.response.data) {
        setServices(result.response.data);
        setTotalPages(result.response.meta?.last_page || 1);
        if (result.response.sidebar?.categories?.length) {
          setCategoriesList(result.response.sidebar.categories);
        }
        if (result.response.sidebar?.locations?.length) {
          setLocationsList(result.response.sidebar.locations);
        }
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No services returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServicesFailure(allowDemo, 'marketplace');

        if (resolution.mode === 'demo') {
          setServices(resolution.services);
          setUseFallback(true);
        } else {
          setServices([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, allowDemo]);

  const loadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const result = await fetchServicesExplore(getQueryParams(nextPage));

    if (result.ok && result.response.data) {
      setServices((prev) => [...prev, ...result.response.data]);
      setCurrentPage(nextPage);
    }

    setLoadingMore(false);
  };

  return (
    <main className="sm-explore-page">
      <header className="sm-explore-header">
        <div className="sm-detail-kicker">ServiceConnect</div>
        <h1>Browse verified professionals</h1>
        <p>Search by category, location, and price to find the right provider for your project.</p>
      </header>

      <section className="sm-filter-bar" aria-label="Explore filters">
        <input
          type="search"
          className="sm-filter-input"
          placeholder="Search services..."
          defaultValue={searchQuery}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateFilters({ search: (event.target as HTMLInputElement).value });
            }
          }}
        />
        <select
          className="sm-filter-select"
          value={selectedCategory}
          onChange={(event) => updateFilters({ category: event.target.value })}
        >
          <option value="">All Categories</option>
          {(categoriesList.length > 0
            ? categoriesList
            : useFallback
              ? MARKETPLACE_FALLBACK_CATEGORIES.map((cat) => ({
                  id: cat.id,
                  title: cat.title,
                  slug: cat.slug,
                }))
              : []
          ).map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.title}</option>
          ))}
        </select>
        <select
          className="sm-filter-select"
          value={selectedLocation}
          onChange={(event) => updateFilters({ location: event.target.value })}
        >
          <option value="">All Locations</option>
          {locationsList.map((loc) => (
            <option key={loc.id} value={loc.slug}>
              {loc.title} {loc.state ? `, ${loc.state}` : ''}
            </option>
          ))}
        </select>
        <select
          className="sm-filter-select"
          value={priceRange}
          onChange={(event) => updateFilters({ price_range: event.target.value })}
        >
          <option value="">Any Price</option>
          <option value="0-50">Under $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-250">$100 - $250</option>
          <option value="250-10000">Above $250</option>
        </select>
      </section>

      {apiError && useFallback && (
        <div className="sm-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sm" />
        </div>
      )}

      <section className="sm-section" aria-labelledby="sm-explore-results-title">
        <h2 className="sm-section-title" id="sm-explore-results-title">Available providers</h2>

        {loading ? (
          <div className="sm-provider-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <SmProviderSkeleton key={index} />
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="sm-provider-grid">
              {services.map((service) => (
                <SmProviderCard key={service.id} service={service} />
              ))}
            </div>
            {currentPage < totalPages && !useFallback && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load more providers'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="sm-empty-state" role="status">
            <h3>No providers match your filters.</h3>
            <p>Try adjusting category, location, or price range.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ExplorePage({ initialCategorySlug }: { initialCategorySlug?: string }) {
  return (
    <Suspense fallback={<div className="sm-explore-page"><p>Loading services...</p></div>}>
      <ExplorePageContent initialCategorySlug={initialCategorySlug} />
    </Suspense>
  );
}
