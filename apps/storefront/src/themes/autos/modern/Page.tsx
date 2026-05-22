'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle, Category } from '@sellio/types';
import { useRouter } from 'next/navigation';
import { ModernHeader, ModernCarCard, CompareItem, ModernFooter } from './components';

export default function Page() {
  const router = useRouter();

  // Dynamic States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter Selection States
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');

  // Fallback High-Fidelity Simulation Assets
  const FALLBACK_CARS = [
    { title: "2025 Tesla Model 3", desc: "Available Now | Premium", price: "$39,000", image: "/themes/autos/modern/11.webp", slug: "tesla-model-3", stats: "Range: 333 mi | 0-60: 4.2s", priceShort: "$39k" },
    { title: "2025 BMW i4", desc: "Premium Electric Sedan", price: "$55,000", image: "/themes/autos/modern/12.webp", slug: "bmw-i4", stats: "Range: 301 mi | 0-60: 5.5s", priceShort: "$55k" },
    { title: "2025 Toyota Corolla", desc: "Reliable Everyday Car", price: "$22,000", image: "/themes/autos/modern/13.webp", slug: "toyota-corolla", stats: "Range: 550 mi | 0-60: 7.2s", priceShort: "$22k" },
    { title: "2025 Audi e-tron GT", desc: "Luxury Performance EV", price: "$88,000", image: "/themes/autos/modern/14.webp", slug: "audi-e-tron-gt", stats: "Range: 249 mi | 0-60: 3.9s", priceShort: "$88k" }
  ];

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/autos_modern${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    async function loadHomepageData() {
      try {
        setLoading(true);
        // Query dynamic vehicles and get filters sidebar metadata
        const response = await api.getVehicles({ per_page: 6 });
        
        if (response && response.data) {
          setVehicles(response.data);
          
          if (response.sidebar) {
            if (response.sidebar.categories) setCategories(response.sidebar.categories);
            if (response.sidebar.brands) setBrands(response.sidebar.brands);
          }
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to load live catalog showroom data from API:", err);
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedYear) params.set('year_min', selectedYear);
    if (selectedKeyword) params.set('search', selectedKeyword);
    
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-');
      if (min) params.set('min_price', min);
      if (max) params.set('max_price', max);
    }

    router.push(getThemeLink(`/explore?${params.toString()}`));
  };

  return (
    <div className="autos-modern-wrapper">
      <ModernHeader />

      {/* Hero Section */}
      <section className="md-hero" id="home">
        <h1 className="md-hero-title">Drive the Future Today</h1>
        <p className="md-hero-subtitle">Explore revolutionary vehicles and redefine your journey.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#listings" className="md-btn md-btn-cta">Browse Cars</a>
            <a href="#compare" className="md-btn md-btn-outline">Compare Models</a>
        </div>
      </section>

      {/* Filter Section */}
      <form onSubmit={handleSearchSubmit} className="md-filter-section">
        <select 
          className="md-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Brand / Make</option>
          {brands.length > 0 ? (
            brands.map(b => <option key={b.id} value={b.title}>{b.title}</option>)
          ) : (
            <>
              <option value="Tesla">Tesla</option>
              <option value="BMW">BMW</option>
              <option value="Audi">Audi</option>
              <option value="Toyota">Toyota</option>
              <option value="Ford">Ford</option>
            </>
          )}
        </select>

        <select 
          className="md-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Category</option>
          {categories.length > 0 ? (
            categories.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)
          ) : (
            <>
              <option value="sedans">Sedans</option>
              <option value="suvs">SUVs</option>
              <option value="electric">Electric</option>
              <option value="performance">Performance</option>
            </>
          )}
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
          <option value="">Year</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <div style={{ display: 'flex', flex: 2, minWidth: '250px' }}>
            <input 
              type="text" 
              className="md-search-input" 
              placeholder="Search by Keyword..." 
              value={selectedKeyword}
              onChange={(e) => setSelectedKeyword(e.target.value)}
              style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} 
            />
            <button type="submit" className="md-btn md-btn-cta" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 1.5rem' }}>🔍</button>
        </div>
      </form>

      {/* Showroom Diagnostics Panel */}
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

      {/* Listings */}
      <section className="md-section" id="listings">
        <h2 className="md-section-title">Featured Electric & Modern Autos</h2>
        
        {loading ? (
          <div className="md-grid">
            {[1, 2, 3, 4].map(idx => (
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
          <div className="md-grid">
            {vehicles.length > 0 ? (
              vehicles.slice(0, 6).map((car) => {
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
              // Offline simulator catalog drops
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
        )}
      </section>

      {/* Compare Head-to-Head */}
      <section className="md-section" id="compare" style={{ backgroundColor: 'white' }}>
        <h2 className="md-section-title">Compare Top Models Head-to-Head</h2>
        <div className="md-compare-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {loading ? (
              [1, 2, 3].map(idx => (
                <div key={idx} className="md-compare-item" style={{ height: '300px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                  <div style={{ height: '100px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '6px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div style={{ height: '20px', width: '60%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div style={{ height: '15px', width: '80%', backgroundColor: '#e2e8f0', margin: '0 auto 1.5rem', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div style={{ height: '35px', width: '50%', backgroundColor: '#cbd5e1', margin: '0 auto', borderRadius: '20px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                </div>
              ))
            ) : (
              vehicles.length >= 3 ? (
                vehicles.slice(0, 3).map((car, idx) => {
                  const statsLabel = `Transmission: ${car.specs?.transmission || (car as any).transmission || 'Auto'} | Drivetrain: ${car.specs?.drivetrain || 'RWD'}`;
                  return (
                    <CompareItem 
                      key={car.id}
                      title={car.title} 
                      stats={statsLabel} 
                      price={car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()}`} 
                      image={car.media?.main_photo || car.featured_image || "/themes/autos/modern/11.webp"} 
                      slug={car.slug}
                      highlight={idx === 1}
                    />
                  );
                })
              ) : (
                FALLBACK_CARS.slice(0, 3).map((car, idx) => (
                  <CompareItem 
                    key={idx}
                    title={car.title} 
                    stats={car.stats} 
                    price={car.priceShort} 
                    image={car.image} 
                    slug={car.slug}
                    highlight={idx === 1}
                  />
                ))
              )
            )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href={getThemeLink('/explore')} className="md-btn md-btn-cta">Start Your Custom Comparison</a>
        </div>
      </section>

      {/* Brands */}
      <section className="md-section" id="brands">
        <h2 className="md-section-title">Driving Innovation with Top Brands</h2>
        <div className="md-brand-grid">
            <a href={getThemeLink('/explore?brand=Tesla')} className="md-brand-img" style={{ textDecoration: 'none' }}>Tesla</a>
            <a href={getThemeLink('/explore?brand=BMW')} className="md-brand-img" style={{ textDecoration: 'none' }}>BMW</a>
            <a href={getThemeLink('/explore?brand=Audi')} className="md-brand-img" style={{ textDecoration: 'none' }}>Audi</a>
            <a href={getThemeLink('/explore?brand=Toyota')} className="md-brand-img" style={{ textDecoration: 'none' }}>Toyota</a>
            <a href={getThemeLink('/explore?brand=Ford')} className="md-brand-img" style={{ textDecoration: 'none' }}>Ford</a>
        </div>
      </section>

      {/* Tech Features */}
      <section className="md-section">
        <h2 className="md-section-title">Experience Next-Generation Technology</h2>
        
        <div className="md-feature-row">
            <div>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Autonomous AI Driving</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>Our vehicles are equipped with cutting-edge <strong>Level 3+ Autonomy</strong>, allowing for supervised self-driving on major highways. Experience a safer, more relaxed commute.</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>Advanced sensor fusion, real-time mapping, and predictive algorithms ensure unparalleled safety and performance in various conditions.</p>
            </div>
            <div>
                <img src="/themes/autos/modern/16.webp" alt="AI Driving" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
        </div>

        <div className="md-feature-row">
            <div style={{ order: 2 }}>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Hybrid & Electric Powertrains</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>Choose from a selection of the most efficient <strong>Electric and Hybrid engines</strong>. Maximum performance meets minimal environmental impact.</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>Innovative battery technology provides faster charging, longer range, and a dynamic driving feel, all backed by comprehensive warranties.</p>
            </div>
            <div style={{ order: 1 }}>
                <img src="/themes/autos/modern/17.webp" alt="EV Tech" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
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
