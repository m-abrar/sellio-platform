'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle, Category } from '@sellio/types';
import { useRouter } from 'next/navigation';
import {
  ModernHeader,
  ModernCarCard,
  CompareItem,
  ModernFooter,
  ModernBrandGrid,
  CarCardSkeleton,
} from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehiclesHome } from '@/themes/autos/shared/catalog';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';

export default function Page() {
  const router = useRouter();
  const themeLink = useAutosThemeLink();
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

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ id: number; title: string }[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');

  useEffect(() => {
    async function loadHomepageData() {
      setLoading(true);
      const result = await fetchVehiclesHome(6);

      if (result.ok && Array.isArray(result.response.data)) {
        setVehicles(result.response.data);
        setInventoryTotal(result.response.meta?.total ?? result.response.data.length);

        if (result.response.sidebar) {
          setCategories(result.response.sidebar.categories ?? []);
          setBrands(result.response.sidebar.brands ?? []);
        }

        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No vehicles returned from API.' : result.error;
        setApiError(errorMsg);
        setVehicles([]);
        setInventoryTotal(null);
      }

      setLoading(false);
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

    router.push(themeLink(`/explore?${params.toString()}`));
  };

  const inventoryCount =
    inventoryTotal !== null ? String(inventoryTotal) : vehicles.length > 0 ? String(vehicles.length) : '—';

  return (
    <>
      <ModernHeader />

      <section className="md-hero" id="home">
        <div className="md-hero-inner">
          <span className="md-hero-eyebrow">Next-Gen Mobility</span>
          <h1 className="md-hero-title">{heroTitle}</h1>
          <p className="md-hero-subtitle">{heroDescription}</p>
          <div className="md-hero-actions">
            <a href={themeLink('/explore')} className="md-btn md-btn-cta">
              {heroPrimaryCta}
            </a>
            <a href="#compare" className="md-btn md-btn-ghost">
              {heroSecondaryCta}
            </a>
          </div>
          <div className="md-hero-stats">
            <div className="md-hero-stat">
              <span className="md-hero-stat-value">{inventoryCount}</span>
              <span className="md-hero-stat-label">Vehicles</span>
            </div>
            <div className="md-hero-stat">
              <span className="md-hero-stat-value">{brands.length || '—'}</span>
              <span className="md-hero-stat-label">Brands</span>
            </div>
            <div className="md-hero-stat">
              <span className="md-hero-stat-value">{categories.length || '—'}</span>
              <span className="md-hero-stat-label">Categories</span>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSearchSubmit} className="md-filter-section">
        <select
          className="md-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          aria-label="Brand"
          disabled={loading}
        >
          <option value="">Brand / Make</option>
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
          disabled={loading}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.title}
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
          <option value="">Year</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <div className="md-search-group">
          <input
            type="text"
            className="md-search-input"
            placeholder={searchPlaceholder}
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            aria-label="Search keywords"
          />
          <button type="submit" className="md-btn md-btn-cta md-search-btn" aria-label="Search">
            Search
          </button>
        </div>
      </form>

      {apiError && (
        <div className="md-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="md" />
        </div>
      )}

      <section className="md-section" id="listings">
        <div className="md-section-header">
          <span className="md-section-eyebrow">Showroom</span>
          <h2 className="md-section-title">{collectionTitle}</h2>
          <p className="md-section-subtitle">
            Hand-picked electric, hybrid, and performance models ready for test drive.
          </p>
        </div>

        {loading ? (
          <div className="md-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <CarCardSkeleton key={idx} />
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
                year={car.specs?.year}
                condition={car.specs?.condition || 'Available'}
                fuelType={car.specs?.engine}
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

      {vehicles.length >= 3 && (
        <section className="md-section md-compare-section md-section--white" id="compare">
          <div className="md-section-header">
            <span className="md-section-eyebrow">Side by Side</span>
            <h2 className="md-section-title">{compareTitle}</h2>
            <p className="md-section-subtitle">
              Compare specs, pricing, and drivetrain options across our top picks.
            </p>
          </div>

          <div className="md-compare-grid">
            {loading
              ? [1, 2, 3].map((idx) => (
                  <div key={idx} className="md-compare-item">
                    <div className="md-skeleton md-skeleton-block md-compare-media" />
                    <div className="md-skeleton md-skeleton-block" style={{ height: '18px', width: '60%', margin: '0 auto 0.75rem' }} />
                    <div className="md-skeleton md-skeleton-block" style={{ height: '14px', width: '80%', margin: '0 auto 1rem' }} />
                    <div className="md-skeleton md-skeleton-block" style={{ height: '36px', width: '55%', margin: '0 auto' }} />
                  </div>
                ))
              : vehicles.slice(0, 3).map((car, idx) => (
                  <CompareItem
                    key={car.id}
                    title={car.title}
                    stats={`${car.specs?.transmission || 'Auto'} · ${car.specs?.drivetrain || 'AWD'}`}
                    price={formatVehiclePrice(car)}
                    image={getVehicleImage(car)}
                    slug={car.slug}
                    highlight={idx === 1}
                  />
                ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href={themeLink('/explore')} className="md-btn md-btn-cta">
              {compareCta}
            </a>
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="md-section" id="brands">
          <div className="md-section-header">
            <span className="md-section-eyebrow">Partners</span>
            <h2 className="md-section-title">{brandsTitle}</h2>
            <p className="md-section-subtitle">Shop by manufacturer from our verified dealer network.</p>
          </div>
          <ModernBrandGrid brands={brands} />
        </section>
      )}

      <section className="md-section md-section--white">
        <div className="md-section-header">
          <span className="md-section-eyebrow">Innovation</span>
          <h2 className="md-section-title">{techTitle}</h2>
        </div>

        <div className="md-feature-row">
          <div className="md-feature-copy">
            <h3>{techOneTitle}</h3>
            <p>{techOneDescription}</p>
            <p>{techOneSecondary}</p>
          </div>
          <div>
            <img src={techOneImage} alt={techOneTitle} className="md-feature-image" loading="lazy" />
          </div>
        </div>

        <div className="md-feature-row">
          <div className="md-feature-copy" style={{ order: 2 }}>
            <h3>{techTwoTitle}</h3>
            <p>{techTwoDescription}</p>
            <p>{techTwoSecondary}</p>
          </div>
          <div style={{ order: 1 }}>
            <img src={techTwoImage} alt={techTwoTitle} className="md-feature-image" loading="lazy" />
          </div>
        </div>
      </section>

      <ModernFooter />
    </>
  );
}
