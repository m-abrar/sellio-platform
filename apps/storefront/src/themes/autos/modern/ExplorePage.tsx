'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { ModernHeader, ModernCarCard, ModernFooter } from './components';

const FALLBACK_CARS = [
  { title: "2025 Tesla Model 3", desc: "Available Now | Premium", price: "$39,000", image: "/themes/autos/modern/11.webp", slug: "tesla-model-3" },
  { title: "2025 BMW i4", desc: "Premium Electric Sedan", price: "$55,000", image: "/themes/autos/modern/12.webp", slug: "bmw-i4" },
  { title: "2025 Toyota Corolla", desc: "Reliable Everyday Car", price: "$22,000", image: "/themes/autos/modern/13.webp", slug: "toyota-corolla" },
  { title: "2025 Audi e-tron GT", desc: "Luxury Performance EV", price: "$88,000", image: "/themes/autos/modern/14.webp", slug: "audi-e-tron-gt" },
  { title: "2025 Hyundai IONIQ 6", desc: "Eco-Friendly Sedan", price: "$46,000", image: "/themes/autos/modern/15.webp", slug: "hyundai-ioniq-6" }
];

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamic API States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter Form States (Sync with URL search parameters)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || searchParams.get('make') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year_min') || '');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/autos_modern${path}`;
      }
    }
    return path;
  };

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

    router.push(getThemeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const queryParams: Record<string, any> = {
          page: searchParams.get('page') || currentPage,
          search: searchParams.get('q') || undefined,
          make: searchParams.get('brand') || undefined,
          category: searchParams.get('category') || undefined,
          location: searchParams.get('location') || undefined,
          year_min: searchParams.get('year_min') || undefined,
          min_price: searchParams.get('min_price') || undefined,
          max_price: searchParams.get('max_price') || undefined,
          per_page: 9
        };

        const response = await api.getVehicles(queryParams);

        if (response && response.data) {
          if (currentPage === 1) {
            setVehicles(response.data);
          } else {
            setVehicles(prev => [...prev, ...response.data]);
          }

          if (response.meta) {
            setCurrentPage(response.meta.current_page);
            setLastPage(response.meta.last_page);
          }

          if (response.sidebar) {
            if (response.sidebar.categories) setCategories(response.sidebar.categories);
            if (response.sidebar.locations) setLocations(response.sidebar.locations);
            if (response.sidebar.brands) setBrands(response.sidebar.brands);
          }
        }
        setError(null);
      } catch (err: any) {
        console.error("API error loading catalog entries:", err);
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    loadCatalog();
  }, [searchParams, currentPage]);

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
    router.push(getThemeLink('/explore'));
  };

  return (
    <div className="autos-modern-wrapper">
      <ModernHeader />

      {/* Explore Banner */}
      <section className="md-hero" style={{ height: '40vh', background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/themes/autos/modern/18.webp") center/cover no-repeat' }}>
        <h1 className="md-hero-title" style={{ fontSize: '3rem' }}>The Modern Catalog</h1>
        <p className="md-hero-subtitle">Refine your look, filter by specifications, and claim your vehicle.</p>
      </section>

      {/* Advanced Filter drawer Row */}
      <section className="md-filter-section" style={{ marginTop: '-2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleSearchClick} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <input 
            type="text"
            className="md-search-input"
            placeholder="Search keywords (e.g. EV, AWD, Autopilot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />

          <select 
            className="md-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.title}>{b.title}</option>)}
          </select>

          <select 
            className="md-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
          </select>

          <select 
            className="md-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc.id} value={loc.title}>{loc.title}</option>)}
          </select>

          <select 
            className="md-select"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
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
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="md-btn md-btn-outline" style={{ color: '#007bff', borderColor: '#007bff' }} onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button type="submit" className="md-btn md-btn-cta">
              Filter Catalog
            </button>
          </div>
        </form>
      </section>

      {/* Catalog Network Resilience trace */}
      {error && (
        <div className="md-error-alert" style={{
            border: '2px solid var(--md-primary)',
            borderRadius: '10px',
            padding: '1.5rem',
            margin: '0 5% 3rem',
            backgroundColor: 'rgba(0, 31, 64, 0.95)',
            boxShadow: '0 4px 20px rgba(0, 123, 255, 0.2)',
            color: 'white'
        }}>
            <h4 className="md-text-primary md-fw-bold" style={{ fontSize: '1.3rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#66b2ff' }}>
                🛰️ DATABASE CONNECTION WARNING: Local catalog resilience fallback active
            </h4>
            <p style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: '#ccc', lineHeight: 1.6 }}>
                STATUS: [OFFLINE] | LATENCY: [TIMEOUT] <br/>
                REASON: Axios connection failed to 127.0.0.1:8000. Laravel backend database node unresponsive.<br/>
                ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
            </p>
            <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: '#020d1a',
                padding: '1rem',
                borderRadius: '6px',
                color: '#ff6b6b',
                overflowX: 'auto',
                border: '1px solid #002d5a'
            }}>
                {error}
            </div>
        </div>
      )}

      {/* Results Listings Grid */}
      <section className="md-section" style={{ paddingTop: 0 }}>
        {loading ? (
          <div className="md-grid">
            {[1, 2, 3, 4, 5, 6].map(idx => (
              <div key={idx} className="md-car-card" style={{ height: '370px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '200px', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '22px', width: '70%', backgroundColor: '#cbd5e1', marginBottom: '0.75rem', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    <div style={{ height: '16px', width: '50%', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  </div>
                  <div style={{ height: '28px', width: '40%', backgroundColor: '#cbd5e1', borderRadius: '4px', marginTop: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="md-grid">
              {vehicles.length > 0 ? (
                vehicles.map((car) => {
                  const specLabel = `${car.specs?.year || (car as any).year || '2025'} | ${car.specs?.engine || (car as any).fuel_type || 'Electric'} | ${car.specs?.transmission || (car as any).transmission || 'Automatic'}`;
                  return (
                    <ModernCarCard 
                      key={car.id} 
                      title={car.title}
                      desc={specLabel}
                      price={car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()}`}
                      image={car.media?.main_photo || car.featured_image || "/themes/autos/modern/11.webp"}
                      slug={car.slug}
                    />
                  );
                })
              ) : (
                // Local static resilient mocks
                FALLBACK_CARS.map((car, i) => (
                  <ModernCarCard 
                    key={i} 
                    title={car.title}
                    desc={car.desc}
                    price={car.price}
                    image={car.image}
                    slug={car.slug}
                  />
                ))
              )}
            </div>

            {/* Pagination Load More trigger */}
            {currentPage < lastPage && (
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button 
                  className="md-btn md-btn-cta" 
                  style={{ padding: '1rem 3rem' }} 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'SYNCING MORE VEHICLES...' : 'LOAD MORE MODELS'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Pulse keyframe animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <ModernFooter />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h3>Configuring Catalogs...</h3>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
