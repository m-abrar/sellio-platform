'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle, Category } from '@sellio/types';
import { useRouter } from 'next/navigation';
import { ModernHeader, ModernCarCard, CompareItem, ModernFooter } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehiclesHome, resolveVehiclesFailure } from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';

export default function Page() {
  const router = useRouter();
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroTitle = useThemeContent('hero.title', 'Drive the Future Today');
  const heroDescription = useThemeContent('hero.description', 'Explore revolutionary vehicles and redefine your journey.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse Cars');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Compare Models');
  const searchPlaceholder = useThemeContent('search.placeholder', 'Search by Keyword...');
  const collectionTitle = useThemeContent('collection.title', 'Featured Electric & Modern Autos');
  const compareTitle = useThemeContent('compare.title', 'Compare Top Models Head-to-Head');
  const compareCta = useThemeContent('compare.cta_label', 'Start Your Custom Comparison');
  const brandsTitle = useThemeContent('brands.title', 'Driving Innovation with Top Brands');
  const techTitle = useThemeContent('tech.title', 'Experience Next-Generation Technology');
  const techOneTitle = useThemeContent('tech.feature_1_title', 'Autonomous AI Driving');
  const techOneDescription = useThemeContent('tech.feature_1_description', 'Our vehicles are equipped with cutting-edge Level 3+ Autonomy, allowing for supervised self-driving on major highways. Experience a safer, more relaxed commute.');
  const techOneSecondary = useThemeContent('tech.feature_1_secondary', 'Advanced sensor fusion, real-time mapping, and predictive algorithms ensure unparalleled safety and performance in various conditions.');
  const techOneImage = useThemeMedia('tech.feature_1_image', '/themes/autos/modern/16.webp');
  const techTwoTitle = useThemeContent('tech.feature_2_title', 'Hybrid & Electric Powertrains');
  const techTwoDescription = useThemeContent('tech.feature_2_description', 'Choose from a selection of the most efficient Electric and Hybrid engines. Maximum performance meets minimal environmental impact.');
  const techTwoSecondary = useThemeContent('tech.feature_2_secondary', 'Innovative battery technology provides faster charging, longer range, and a dynamic driving feel, all backed by comprehensive warranties.');
  const techTwoImage = useThemeMedia('tech.feature_2_image', '/themes/autos/modern/17.webp');

  // Dynamic States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filter Selection States
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');

  useEffect(() => {
    async function loadHomepageData() {
      setLoading(true);
      const result = await fetchVehiclesHome(6);

      if (result.ok && result.response.data) {
        setVehicles(result.response.data);

        if (result.response.sidebar) {
          if (result.response.sidebar.categories) {
            setCategories(result.response.sidebar.categories);
          }
          if (result.response.sidebar.brands) {
            setBrands(result.response.sidebar.brands);
          }
        }

        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No vehicles returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveVehiclesFailure(allowDemo, 'modern');

        if (resolution.mode === 'demo') {
          setVehicles(resolution.vehicles);
          setUseFallback(true);
        } else {
          setVehicles([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadHomepageData();
  }, [allowDemo]);

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

    router.push(themeLink(`/explore?${params.toString()}`));
  };

  return (
    <div className="autos-modern-wrapper">
      <ModernHeader />

      {/* Hero Section */}
      <section className="md-hero" id="home">
        <h1 className="md-hero-title">{heroTitle}</h1>
        <p className="md-hero-subtitle">{heroDescription}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={themeLink('/explore')} className="md-btn md-btn-cta">
              {heroPrimaryCta}
            </a>
            <a href="#compare" className="md-btn md-btn-outline">{heroSecondaryCta}</a>
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
              placeholder={searchPlaceholder}
              value={selectedKeyword}
              onChange={(e) => setSelectedKeyword(e.target.value)}
              style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} 
            />
            <button type="submit" className="md-btn md-btn-cta" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 1.5rem' }}>🔍</button>
        </div>
      </form>

      {apiError && useFallback && (
        <div className="md-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="md" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="md-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="md" />
        </div>
      )}

      {/* Listings */}
      <section className="md-section" id="listings">
        <h2 className="md-section-title">{collectionTitle}</h2>
        
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
        ) : vehicles.length > 0 ? (
          <div className="md-grid">
            {vehicles.slice(0, 6).map((car) => (
              <ModernCarCard
                key={car.id}
                title={car.title}
                desc={getVehicleSpecLabel(car)}
                price={formatVehiclePrice(car)}
                image={getVehicleImage(car)}
                slug={car.slug}
              />
            ))}
          </div>
        ) : (
          <div className="md-empty-state" role="status">
            <h3>No vehicles are published yet.</h3>
            <p>Add and publish vehicles in the admin panel to populate this showroom.</p>
            <a href={themeLink('/explore')} className="md-btn md-btn-cta">
              Browse inventory
            </a>
          </div>
        )}
      </section>

      {/* Compare Head-to-Head */}
      <section className="md-section" id="compare" style={{ backgroundColor: 'white' }}>
        <h2 className="md-section-title">{compareTitle}</h2>
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
            ) : vehicles.length >= 3 ? (
                vehicles.slice(0, 3).map((car, idx) => (
                  <CompareItem
                    key={car.id}
                    title={car.title}
                    stats={`Transmission: ${car.specs?.transmission || 'Auto'} | Drivetrain: ${car.specs?.drivetrain || 'RWD'}`}
                    price={formatVehiclePrice(car)}
                    image={getVehicleImage(car)}
                    slug={car.slug}
                    highlight={idx === 1}
                  />
                ))
              ) : useFallback ? (
                vehicles.slice(0, 3).map((car, idx) => (
                  <CompareItem
                    key={car.id}
                    title={car.title}
                    stats={getVehicleSpecLabel(car)}
                    price={formatVehiclePrice(car)}
                    image={getVehicleImage(car)}
                    slug={car.slug}
                    highlight={idx === 1}
                  />
                ))
              ) : null}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href={themeLink('/explore')} className="md-btn md-btn-cta">{compareCta}</a>
        </div>
      </section>

      {/* Brands */}
      <section className="md-section" id="brands">
        <h2 className="md-section-title">{brandsTitle}</h2>
        <div className="md-brand-grid">
            <a href={themeLink('/explore?brand=Tesla')} className="md-brand-img" style={{ textDecoration: 'none' }}>Tesla</a>
            <a href={themeLink('/explore?brand=BMW')} className="md-brand-img" style={{ textDecoration: 'none' }}>BMW</a>
            <a href={themeLink('/explore?brand=Audi')} className="md-brand-img" style={{ textDecoration: 'none' }}>Audi</a>
            <a href={themeLink('/explore?brand=Toyota')} className="md-brand-img" style={{ textDecoration: 'none' }}>Toyota</a>
            <a href={themeLink('/explore?brand=Ford')} className="md-brand-img" style={{ textDecoration: 'none' }}>Ford</a>
        </div>
      </section>

      {/* Tech Features */}
      <section className="md-section">
        <h2 className="md-section-title">{techTitle}</h2>
        
        <div className="md-feature-row">
            <div>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{techOneTitle}</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{techOneDescription}</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{techOneSecondary}</p>
            </div>
            <div>
                <img src={techOneImage} alt="AI Driving" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
        </div>

        <div className="md-feature-row">
            <div style={{ order: 2 }}>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{techTwoTitle}</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{techTwoDescription}</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{techTwoSecondary}</p>
            </div>
            <div style={{ order: 1 }}>
                <img src={techTwoImage} alt="EV Tech" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
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
