'use client';

import React, { useEffect, useState, Suspense } from 'react';
import type { Vehicle, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import {
  fetchVehiclesExplore,
  resolveVehiclesFailure,
  type AutosThemeVariant,
} from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';

export type AutosExploreClassPrefix = 'ac' | 'us' | 'ev';

export interface AutosExplorePageProps {
  variant: AutosThemeVariant;
  classPrefix: AutosExploreClassPrefix;
  pageTitle: string;
  pageSubtitle: string;
  filterSectionClass: string;
  searchInputClass: string;
  selectClass: string;
  gridClass: string;
  primaryBtnClass: string;
  outlineBtnClass: string;
  shell?: (content: React.ReactNode) => React.ReactNode;
  renderVehicleCard: (vehicle: Vehicle) => React.ReactNode;
}

function ExplorePageContent({
  variant,
  classPrefix,
  pageTitle,
  pageSubtitle,
  filterSectionClass,
  searchInputClass,
  selectClass,
  gridClass,
  primaryBtnClass,
  outlineBtnClass,
  shell,
  renderVehicleCard,
}: AutosExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || searchParams.get('make') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year_min') || '');

  const applyFilters = (pageNumber = 1) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedYear) params.set('year_min', selectedYear);
    if (pageNumber > 1) params.set('page', pageNumber.toString());
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-');
      if (min) params.set('min_price', min);
      if (max) params.set('max_price', max);
    }
    router.push(themeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function loadCatalog() {
      if (currentPage === 1) setLoading(true);
      else setLoadingMore(true);

      const queryParams: Record<string, unknown> = {
        page: searchParams.get('page') || currentPage,
        search: searchParams.get('q') || undefined,
        make: searchParams.get('brand') || undefined,
        category: searchParams.get('category') || undefined,
        location: searchParams.get('location') || undefined,
        year_min: searchParams.get('year_min') || undefined,
        min_price: searchParams.get('min_price') || undefined,
        max_price: searchParams.get('max_price') || undefined,
        per_page: 9,
      };

      const result = await fetchVehiclesExplore(queryParams);

      if (result.ok && result.response.data) {
        setVehicles(currentPage === 1 ? result.response.data : (prev) => [...prev, ...result.response.data]);
        if (result.response.meta) {
          setCurrentPage(result.response.meta.current_page);
          setLastPage(result.response.meta.last_page);
        }
        if (result.response.sidebar) {
          if (result.response.sidebar.categories) setCategories(result.response.sidebar.categories);
          if (result.response.sidebar.locations) setLocations(result.response.sidebar.locations);
          if (result.response.sidebar.brands) setBrands(result.response.sidebar.brands);
        }
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No vehicles returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveVehiclesFailure(allowDemo, variant);
        if (resolution.mode === 'demo') {
          if (currentPage === 1) setVehicles(resolution.vehicles);
          setUseFallback(true);
        } else if (currentPage === 1) {
          setVehicles([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadCatalog();
  }, [searchParams, currentPage, allowDemo, variant]);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    applyFilters(1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    applyFilters(nextPage);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setSelectedYear('');
    setCurrentPage(1);
    router.push(themeLink('/explore'));
  };

  const content = (
    <>
      <section className={`${classPrefix}-explore-hero`}>
        <a href={themeLink('/')} style={{ display: 'inline-block', marginBottom: '1.5rem', opacity: 0.7, textDecoration: 'none' }}>
          ← Back to showroom
        </a>
        <h1>{pageTitle}</h1>
        <p style={{ opacity: 0.75, maxWidth: '640px', margin: '0 auto' }}>{pageSubtitle}</p>
      </section>

      <section className={filterSectionClass} style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearchClick} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <input
            type="text"
            className={searchInputClass}
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />
          <select className={selectClass} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.title}>{b.title}</option>
            ))}
          </select>
          <select className={selectClass} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.title}</option>
            ))}
          </select>
          <select className={selectClass} value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.title}>{loc.title}</option>
            ))}
          </select>
          <select className={selectClass} value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
            <option value="">Price Range</option>
            <option value="0-30000">Under $30,000</option>
            <option value="30000-60000">$30,000 - $60,000</option>
            <option value="60000-100000">$60,000 - $100,000</option>
            <option value="100000-99999999">$100,000+</option>
          </select>
          <select className={selectClass} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
            <button type="button" className={outlineBtnClass} onClick={handleResetFilters}>Reset Filters</button>
            <button type="submit" className={primaryBtnClass}>Filter Catalog</button>
          </div>
        </form>
      </section>

      {apiError && useFallback && (
        <CatalogSyncAlert variant="demo" error={apiError} classPrefix={classPrefix} />
      )}
      {apiError && !useFallback && (
        <CatalogSyncAlert variant="production" error={apiError} classPrefix={classPrefix} />
      )}

      <section style={{ padding: '0 5% 4rem' }}>
        {loading ? (
          <div className={gridClass}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} style={{ height: '360px', opacity: 0.35, background: 'rgba(0,0,0,0.06)', borderRadius: '8px' }} />
            ))}
          </div>
        ) : (
          <>
            <div className={gridClass}>
              {vehicles.length > 0 ? (
                vehicles.map((car) => <React.Fragment key={car.id}>{renderVehicleCard(car)}</React.Fragment>)
              ) : (
                <div className={`${classPrefix}-empty-state`} role="status">
                  <h3>No vehicles match your filters.</h3>
                  <p>Try clearing filters or searching with fewer keywords.</p>
                  <button type="button" className={primaryBtnClass} onClick={handleResetFilters} style={{ marginTop: '1.5rem' }}>
                    Reset filters
                  </button>
                </div>
              )}
            </div>
            {currentPage < lastPage && !useFallback && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className={primaryBtnClass} onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Loading more...' : 'Load more models'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );

  return shell ? shell(content) : content;
}

export default function AutosExplorePage(props: AutosExplorePageProps) {
  return (
    <Suspense fallback={<div style={{ padding: '6rem 5%', textAlign: 'center' }}>Loading catalog...</div>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
