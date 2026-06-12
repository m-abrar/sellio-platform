'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { Vehicle, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { ModernHeader, ModernCarCard, ModernFooter, CarCardSkeleton } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehiclesExplore } from '@/themes/autos/shared/catalog';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useAutosThemeLink();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get('page') || 1));
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
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const queryParams: Record<string, unknown> = {
        page,
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

      if (result.ok && Array.isArray(result.response.data)) {
        setVehicles((prev) => {
          const merged = isFirstPage ? result.response.data : [...prev, ...result.response.data];
          const seen = new Set<number>();

          return merged.filter((vehicle) => {
            if (seen.has(vehicle.id)) {
              return false;
            }

            seen.add(vehicle.id);
            return true;
          });
        });

        if (result.response.meta) {
          setLastPage(result.response.meta.last_page);
        }

        if (result.response.sidebar) {
          setCategories(result.response.sidebar.categories ?? []);
          setLocations(result.response.sidebar.locations ?? []);
          setBrands(result.response.sidebar.brands ?? []);
        }

        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No vehicles returned from API.' : result.error;
        setApiError(errorMsg);
        if (isFirstPage) {
          setVehicles([]);
        }
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadCatalog();
  }, [searchParams, page]);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(1);
  };

  const handleLoadMore = () => {
    applyFilters(page + 1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setSelectedYear('');
    router.push(themeLink('/explore'));
  };

  const activeFilterCount = [
    searchQuery,
    selectedBrand,
    selectedCategory,
    selectedLocation,
    selectedPriceRange,
    selectedYear,
  ].filter(Boolean).length;

  return (
    <>
      <ModernHeader />

      <section className="md-hero md-hero--compact">
        <div className="md-hero-inner">
          <span className="md-hero-eyebrow">Full Catalog</span>
          <h1 className="md-hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            The Modern Catalog
          </h1>
          <p className="md-hero-subtitle">
            Refine your search, filter by specifications, and find your next vehicle.
          </p>
        </div>
      </section>

      <section className="md-filter-section" style={{ marginTop: '-2.5rem' }}>
        <form onSubmit={handleSearchClick} className="md-filter-form">
          <input
            type="text"
            className="md-search-input"
            placeholder="Search keywords (e.g. EV, AWD, Autopilot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: '1 1 220px' }}
            aria-label="Search keywords"
          />

          <select
            className="md-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            aria-label="Brand"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.title}>
                {b.title}
              </option>
            ))}
          </select>

          <select
            className="md-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            className="md-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            aria-label="Location"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.title}>
                {loc.title}
              </option>
            ))}
          </select>

          <select
            className="md-select"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            aria-label="Price range"
          >
            <option value="">Price Range</option>
            <option value="0-30000">Under $30,000</option>
            <option value="30000-60000">$30,000 - $60,000</option>
            <option value="60000-100000">$60,000 - $100,000</option>
            <option value="100000-99999999">$100,000 & Above</option>
          </select>

          <select
            className="md-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Year"
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>

          <div className="md-filter-actions">
            {activeFilterCount > 0 && (
              <span className="md-results-meta" style={{ margin: 0, marginRight: 'auto' }}>
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
            )}
            <button type="button" className="md-btn md-btn-outline-primary" onClick={handleResetFilters}>
              Reset
            </button>
            <button type="submit" className="md-btn md-btn-cta">
              Apply Filters
            </button>
          </div>
        </form>
      </section>

      {apiError && (
        <div className="md-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="md" />
        </div>
      )}

      <section className="md-section" style={{ paddingTop: 0 }}>
        {!loading && vehicles.length > 0 && (
          <div className="md-results-meta">
            <span>
              Showing <strong>{vehicles.length}</strong> vehicle{vehicles.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {loading ? (
          <div className="md-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <CarCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <>
            <div className="md-grid">
              {vehicles.length > 0 ? (
                vehicles.map((car) => (
                  <ModernCarCard
                    key={car.id}
                    title={car.title}
                    desc={getVehicleSpecLabel(car)}
                    price={formatVehiclePrice(car)}
                    image={getVehicleImage(car)}
                    slug={car.slug}
                    year={car.specs?.year}
                    condition={car.specs?.condition || 'Available'}
                    fuelType={car.specs?.engine}
                  />
                ))
              ) : (
                <div className="md-empty-state" role="status">
                  <h3>No vehicles match your filters.</h3>
                  <p>Try clearing filters or searching with fewer keywords.</p>
                  <button type="button" className="md-btn md-btn-cta" onClick={handleResetFilters}>
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {page < lastPage && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  type="button"
                  className="md-btn md-btn-cta"
                  style={{ padding: '0.85rem 2.5rem' }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More Models'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <ModernFooter />
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="md-loading-screen">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontWeight: 600, letterSpacing: '0.04em' }}>Loading catalog...</h2>
            <div className="md-loading-bar" />
          </div>
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}
