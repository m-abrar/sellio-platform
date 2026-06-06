'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';

const FALLBACK_CARS = [
  { title: "2025 Mercedes S-Class", specs: "Sleek Sedan | 5,000 mi", price: "$110,000", image: "/themes/autos/luxury/mercedes.png", slug: "mercedes-s-class" },
  { title: "2024 Rolls Royce Phantom", specs: "Ultra Luxury | 2,100 mi", price: "$420,000", image: "/themes/autos/luxury/rolls.png", slug: "rolls-royce-phantom" },
  { title: "2025 Porsche Taycan Turbo", specs: "Electric Coupe | 800 mi", price: "$160,000", image: "/themes/autos/luxury/porsche.png", slug: "porsche-taycan" },
  { title: "2023 Bentley Continental GT", specs: "Grand Tourer | 6,500 mi", price: "$245,000", image: "/themes/autos/luxury/bentley.png", slug: "bentley-continental" }
];

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamic States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [transmissionOptions, setTransmissionOptions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Active Filter Sync States (initialized from URL parameters)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
        const isPreview = window.location.pathname.startsWith('/preview/');
        if (isPreview) {
            return `/preview/autos_luxury${path}`;
        }
    }
    return path;
  };

  // Synchronize dynamic parameters with the browser URL
  const applyFilters = (pageNumber = 1, append = false) => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedTransmission) params.set('transmission', selectedTransmission);
    if (pageNumber > 1) params.set('page', pageNumber.toString());

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-');
      if (min) params.set('min_price', min);
      if (max) params.set('max_price', max);
    }

    router.push(getThemeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function fetchShowroomVehicles() {
      try {
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        // Construct API query payload from active URL parameters
        const queryParams: Record<string, any> = {
          page: searchParams.get('page') || 1,
          search: searchParams.get('q') || undefined,
          make: searchParams.get('brand') || undefined,
          category: searchParams.get('category') || undefined,
          location: searchParams.get('location') || undefined,
          transmission: searchParams.get('transmission') || undefined,
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
            if (response.sidebar.transmission_options) setTransmissionOptions(response.sidebar.transmission_options);
          }
        }
        setError(null);
      } catch (err: any) {
        console.error("API error loading supercars in catalog:", err);
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchShowroomVehicles();
  }, [searchParams, currentPage]);

  const handleFilterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    applyFilters(1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    applyFilters(nextPage, true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedTransmission('');
    setSelectedPriceRange('');
    setCurrentPage(1);
    router.push(getThemeLink('/explore'));
  };

  return (
    <div className="autos-luxury-wrapper">
      <LuxuryHeader />

      {/* Cinematic Banner Header */}
      <section className="lx-section" style={{ backgroundColor: '#111', padding: '6rem 5% 4rem', textAlign: 'center', borderBottom: '1px solid #222' }}>
        <h1 className="lx-heading lx-text-gold" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '1rem', textTransform: 'uppercase' }}>
          The Showroom Registry
        </h1>
        <p style={{ fontFamily: 'var(--lx-font-body)', fontWeight: 300, fontSize: '1.2rem', color: 'var(--lx-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Discover and filter the most exclusive, high-performance supercars and grand tourers currently available in our global network.
        </p>
      </section>

      {/* Faceted Luxury Filters Flexbar */}
      <section className="lx-filter-bar" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleFilterSearch} style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          <input 
            type="text"
            placeholder="Search keywords (e.g. Turbo, AMG)..."
            className="lx-select"
            style={{ flex: '1 1 250px', background: '#242424', border: '1px solid #333' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select 
            className="lx-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.title}>{b.title}</option>)}
          </select>

          <select 
            className="lx-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
          </select>

          <select 
            className="lx-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc.id} value={loc.id.toString()}>{loc.title}</option>)}
          </select>

          <select 
            className="lx-select"
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value)}
          >
            <option value="">All Transmissions</option>
            {transmissionOptions.length > 0 ? (
              transmissionOptions.map(t => <option key={t} value={t}>{t}</option>)
            ) : (
              <>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </>
            )}
          </select>

          <select 
            className="lx-select"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-60000">Under $60,000</option>
            <option value="60000-120000">$60,000 - $120,000</option>
            <option value="120000-250000">$120,000 - $250,000</option>
            <option value="250000-99999999">$250,000 & Above</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 200px' }}>
            <button type="submit" className="lx-btn lx-btn-gold" style={{ flex: 1, borderRadius: '8px', padding: '0.8rem' }}>
              Search Showcase
            </button>
            <button type="button" className="lx-btn lx-btn-outline" style={{ borderRadius: '8px', padding: '0.8rem' }} onClick={handleResetFilters}>
              Reset
            </button>
          </div>

        </form>
      </section>

      {/* Dynamic Showroom Network Connection Diagnostics Alert */}
      {error && (
        <div className="lx-error-alert" style={{
            border: '2px solid var(--lx-gold)',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '0 5% 3rem',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            boxShadow: '0 0 15px rgba(195, 161, 109, 0.2)'
        }}>
            <h4 className="lx-text-gold" style={{ fontFamily: 'var(--lx-font-heading)', fontSize: '1.4rem', margin: '0 0 0.5rem' }}>
                🛰️ Showroom Diagnostics Connection Trace
            </h4>
            <p style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: 'var(--lx-text-muted)', lineHeight: 1.6 }}>
                The vehicle discovery engine detected an offline API connection. Rendering luxury backup showroom database.
            </p>
            <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: '#000',
                padding: '1rem',
                borderRadius: '4px',
                color: '#ff4d4d',
                overflowX: 'auto',
                border: '1px solid #333'
            }}>
                {error}
            </div>
        </div>
      )}

      {/* Showcase Grid Results */}
      <section className="lx-section" style={{ paddingTop: '0' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(idx => (
              <div key={idx} className="lx-car-card" style={{ height: '380px', position: 'relative', overflow: 'hidden', border: '1px dashed #444', backgroundColor: 'var(--lx-bg-card)' }}>
                <div style={{ height: '200px', backgroundColor: '#333' }} className="lx-skeleton"></div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ height: '20px', width: '65%', backgroundColor: '#444', marginBottom: '1rem', borderRadius: '4px' }} className="lx-skeleton"></div>
                  <div style={{ height: '15px', width: '85%', backgroundColor: '#444', marginBottom: '2rem', borderRadius: '4px' }} className="lx-skeleton"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ height: '25px', width: '30%', backgroundColor: '#444', borderRadius: '4px' }} className="lx-skeleton"></div>
                    <div style={{ height: '30px', width: '35%', backgroundColor: '#444', borderRadius: '50px' }} className="lx-skeleton"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="lx-grid">
              {vehicles.length > 0 ? (
                vehicles.map((car) => {
                  const vehicleSpecs = `${car.specs?.year || ''} ${car.specs?.engine || ''} | ${car.specs?.transmission || ''} | ${car.specs?.mileage || ''}`;
                  return (
                    <LuxuryCarCard 
                      key={car.id} 
                      title={car.title}
                      specs={vehicleSpecs}
                      price={car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()}`}
                      image={car.media?.main_photo || car.featured_image || "/themes/autos/luxury/mercedes.png"}
                      slug={car.slug}
                    />
                  );
                })
              ) : (
                // Safe Fallbacks
                FALLBACK_CARS.map((car, i) => (
                  <LuxuryCarCard 
                    key={i} 
                    title={car.title}
                    specs={car.specs}
                    price={car.price}
                    image={car.image}
                    slug={car.slug}
                  />
                ))
              )}
            </div>

            {/* Pagination Actions */}
            {currentPage < lastPage && !error && (
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button 
                  className="lx-btn lx-btn-gold" 
                  style={{ padding: '1rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <span className="lx-skeleton" style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid #1a1a1a', borderTopColor: 'transparent', display: 'inline-block' }}></span>
                      Opening Showroom Registry...
                    </>
                  ) : "Load More Premium Assets"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <LuxuryFooter />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#c3a16d', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ letterSpacing: '2px' }}>LOADING SHOWROOM LEDGER...</h2>
        </div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
