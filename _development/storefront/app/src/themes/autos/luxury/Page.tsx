'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle, Category } from '@sellio/types';
import { useRouter } from 'next/navigation';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  const router = useRouter();
  const heroTitle = useThemeContent('hero.title', 'Experience the Luxury You Deserve');
  const heroDescription = useThemeContent(
    'hero.description',
    'Your journey into unparalleled elegance and performance starts here. Discover hand-picked masterpieces.',
  );
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Explore Collection');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Book Now');
  const searchButtonLabel = useThemeContent('search.button_label', 'Search');
  const collectionTitle = useThemeContent('collection.title', 'Featured Masterpieces');
  const viewAllLabel = useThemeContent('collection.view_all_label', 'View All Inventory');
  const showcaseTitle = useThemeContent('showcase.title', 'Exclusive Showcase');
  const showcaseImage = useThemeMedia('showcase.image', '/themes/autos/luxury/ferrari.png');
  const showcaseHeading = useThemeContent('showcase.heading', 'The Crimson Legend');
  const showcaseSubtitle = useThemeContent('showcase.subtitle', '1963 Ferrari 250 GTO');
  const showcaseDescription = useThemeContent(
    'showcase.description',
    'A one-of-a-kind vintage masterpiece, meticulously restored. This vehicle represents automotive history and unparalleled exclusivity.',
  );
  const showcaseCta = useThemeContent('showcase.cta_label', 'Inquire About Price');
  const brandsTitle = useThemeContent('brands.title', 'Our Curated Brands');
  const testimonialsTitle = useThemeContent('testimonials.title', 'Client Experiences');
  
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

  // Fallback Simulation Assets
  const FALLBACK_CARS = [
    { title: "2025 Mercedes S-Class", specs: "Sleek Sedan | 5,000 mi", price: "$110,000", image: "/themes/autos/luxury/mercedes.png", slug: "mercedes-s-class" },
    { title: "2024 Rolls Royce Phantom", specs: "Ultra Luxury | 2,100 mi", price: "$420,000", image: "/themes/autos/luxury/rolls.png", slug: "rolls-royce-phantom" },
    { title: "2025 Porsche Taycan Turbo", specs: "Electric Coupe | 800 mi", price: "$160,000", image: "/themes/autos/luxury/porsche.png", slug: "porsche-taycan" },
    { title: "2023 Bentley Continental GT", specs: "Grand Tourer | 6,500 mi", price: "$245,000", image: "/themes/autos/luxury/bentley.png", slug: "bentley-continental" }
  ];

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
        const isPreview = window.location.pathname.startsWith('/preview/');
        if (isPreview) {
            return `/preview/autos_luxury${path}`;
        }
    }
    return path;
  };

  useEffect(() => {
    async function loadHomepageData() {
      try {
        setLoading(true);
        // Query paginated vehicles and get sidebar filter metadata
        const response = await api.getVehicles({ per_page: 6 });
        
        if (response && response.data) {
          setVehicles(response.data);
          
          if (response.sidebar) {
            if (response.sidebar.categories) setCategories(response.sidebar.categories);
            if (response.sidebar.brands) setBrands(response.sidebar.brands);
          }
        }
        setError(null);
      } catch (err: unknown) {
        const apiError = err as {
          message?: string;
          response?: {
            data?: {
              message?: string;
            };
          };
        };
        console.error("Failed to load live showroom data from API:", err);
        // Capture connection error string for luxury diagnostics trace
        const errorMsg = apiError.response?.data?.message || apiError.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, []);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedYear) params.set('year_min', selectedYear);
    
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-');
      if (min) params.set('min_price', min);
      if (max) params.set('max_price', max);
    }

    router.push(getThemeLink(`/explore?${params.toString()}`));
  };

  return (
    <div className="autos-luxury-wrapper">
      <LuxuryHeader />

      {/* Hero Section */}
      <section className="lx-hero">
        <div className="lx-hero-overlay"></div>
        <div className="lx-hero-content">
            <h1 className="lx-hero-title">{heroTitle}</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6 }}>
                {heroDescription}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#collections" className="lx-btn lx-btn-gold">{heroPrimaryCta}</a>
                <a href="#contact" className="lx-btn lx-btn-outline">{heroSecondaryCta}</a>
            </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="lx-filter-bar">
        <select 
          className="lx-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Brand / Make</option>
          {brands.length > 0 ? (
            brands.map(b => <option key={b.id} value={b.title}>{b.title}</option>)
          ) : (
            <>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Rolls-Royce">Rolls Royce</option>
              <option value="Porsche">Porsche</option>
              <option value="Bentley">Bentley</option>
              <option value="Tesla">Tesla</option>
            </>
          )}
        </select>
        
        <select 
          className="lx-select"
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
        >
          <option value="">Price Range</option>
          <option value="0-50000">Under $50,000</option>
          <option value="50000-100000">$50,000 - $100,000</option>
          <option value="100000-200000">$100,000 - $200,000</option>
          <option value="200000-99999999">$200,000 & Above</option>
        </select>
        
        <select 
          className="lx-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Year</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        
        <select 
          className="lx-select"
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
              <option value="coupes">Coupes</option>
              <option value="electric">Electric</option>
            </>
          )}
        </select>
        <button className="lx-btn lx-btn-gold" style={{ flex: 1, padding: '0.8rem' }} onClick={handleSearchSubmit}>{searchButtonLabel}</button>
      </section>

      {/* Showroom Diagnostics Panel */}
      {error && (
        <div className="lx-error-alert" style={{
            border: '2px solid var(--lx-gold)',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '2rem 5%',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            boxShadow: '0 0 15px rgba(195, 161, 109, 0.2)'
        }}>
            <h4 className="lx-text-gold" style={{ fontFamily: 'var(--lx-font-heading)', fontSize: '1.4rem', margin: '0 0 0.5rem' }}>
                🛰️ Showroom Diagnostics Connection Trace
            </h4>
            <p style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: 'var(--lx-text-muted)', lineHeight: 1.6 }}>
                The retail discovery engine detected an offline API connection. Displaying premium showroom simulation assets.
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

      {/* Featured Masterpieces */}
      <section className="lx-section" id="collections">
        <h2 className="lx-section-title">{collectionTitle}</h2>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="lx-car-card" style={{ height: '380px', position: 'relative', overflow: 'hidden', border: '1px dashed #444', backgroundColor: 'var(--lx-bg-card)' }}>
                <div style={{ height: '200px', backgroundColor: '#333' }} className="lx-skeleton"></div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ height: '20px', width: '60%', backgroundColor: '#444', marginBottom: '1rem', borderRadius: '4px' }} className="lx-skeleton"></div>
                  <div style={{ height: '15px', width: '80%', backgroundColor: '#444', marginBottom: '2rem', borderRadius: '4px' }} className="lx-skeleton"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ height: '25px', width: '30%', backgroundColor: '#444', borderRadius: '4px' }} className="lx-skeleton"></div>
                    <div style={{ height: '30px', width: '35%', backgroundColor: '#444', borderRadius: '50px' }} className="lx-skeleton"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
              // Fallback cards displayed when error occurred or empty results
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
        )}

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <a href={getThemeLink('/explore')} className="lx-btn lx-btn-gold" style={{ padding: '1rem 3rem' }}>{viewAllLabel}</a>
        </div>
      </section>

      {/* Exclusive Showcase */}
      <section className="lx-section" style={{ backgroundColor: '#111111' }}>
        <h2 className="lx-section-title" style={{ color: 'white' }}>{showcaseTitle}</h2>
        <div className="lx-showcase-item">
            <div>
                <img src={showcaseImage} style={{ width: '100%', borderRadius: '8px' }} alt="" />
            </div>
            <div>
                <h3 className="lx-heading lx-text-gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{showcaseHeading}</h3>
                <p style={{ fontSize: '1.2rem', color: 'var(--lx-text-muted)', marginBottom: '1.5rem' }}>{showcaseSubtitle}</p>
                <p style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
                    {showcaseDescription}
                </p>
                <a href={getThemeLink('/explore?search=Ferrari')} className="lx-btn lx-btn-gold">{showcaseCta}</a>
            </div>
        </div>
      </section>

      {/* Brands */}
      <section className="lx-section" id="brands">
        <h2 className="lx-section-title">{brandsTitle}</h2>
        <div className="lx-brand-grid">
            <a href={getThemeLink('/explore?brand=Ferrari')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Ferrari</a>
            <a href={getThemeLink('/explore?brand=Lamborghini')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Lamborghini</a>
            <a href={getThemeLink('/explore?brand=Mercedes-Benz')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Mercedes</a>
            <a href={getThemeLink('/explore?brand=Rolls-Royce')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Rolls Royce</a>
            <a href={getThemeLink('/explore?brand=Porsche')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Porsche</a>
        </div>
      </section>

      <DynamicTestimonials
        title={testimonialsTitle}
        limit={3}
        variant="luxury"
        sectionClassName="lx-section"
        sectionStyle={{ backgroundColor: '#111111' }}
        titleClassName="lx-section-title"
        titleStyle={{ color: 'white' }}
        layoutClassName="lx-testimonial-grid"
        cardClassName="lx-testimonial-card"
        headingId="lx-testimonials-title"
      />

      <LuxuryFooter />
    </div>
  );
}
