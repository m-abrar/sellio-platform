'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle, Category } from '@sellio/types';
import { useRouter } from 'next/navigation';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';

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

  // Fallback Simulation Assets
  const FALLBACK_CARS = [
    { title: "2025 Mercedes S-Class", specs: "Sleek Sedan | 5,000 mi", price: "$110,000", image: "/themes/autos/luxury/mercedes.png", slug: "mercedes-s-class" },
    { title: "2024 Rolls Royce Phantom", specs: "Ultra Luxury | 2,100 mi", price: "$420,000", image: "/themes/autos/luxury/rolls.png", slug: "rolls-royce-phantom" },
    { title: "2025 Porsche Taycan Turbo", specs: "Electric Coupe | 800 mi", price: "$160,000", image: "/themes/autos/luxury/porsche.png", slug: "porsche-taycan" },
    { title: "2023 Bentley Continental GT", specs: "Grand Tourer | 6,500 mi", price: "$245,000", image: "/themes/autos/luxury/bentley.png", slug: "bentley-continental" }
  ];

  const testimonials = [
    { name: "Julian D.", role: "Collector", quote: "The service was impeccable and discreet. Found my dream classic car with ease. Truly a five-star experience from start to finish.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100" },
    { name: "Sarah K.", role: "Entrepreneur", quote: "Seamless, professional, and unparalleled inventory. They connected me with the perfect new SUV before it was even publicly listed.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100" },
    { name: "Marcus T.", role: "Investor", quote: "Beyond expectations. The attention to detail and personalized guidance made the acquisition of my Rolls Royce a pleasure.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100" }
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
      } catch (err: any) {
        console.error("Failed to load live showroom data from API:", err);
        // Capture connection error string for luxury diagnostics trace
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
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
            <h1 className="lx-hero-title">Experience the Luxury You Deserve</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6 }}>
                Your journey into unparalleled elegance and performance starts here. Discover hand-picked masterpieces.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#collections" className="lx-btn lx-btn-gold">Explore Collection</a>
                <a href="#contact" className="lx-btn lx-btn-outline">Book Now</a>
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
        <button className="lx-btn lx-btn-gold" style={{ flex: 1, padding: '0.8rem' }} onClick={handleSearchSubmit}>Search</button>
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
        <h2 className="lx-section-title">Featured Masterpieces</h2>
        
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
            <a href={getThemeLink('/explore')} className="lx-btn lx-btn-gold" style={{ padding: '1rem 3rem' }}>View All Inventory</a>
        </div>
      </section>

      {/* Exclusive Showcase */}
      <section className="lx-section" style={{ backgroundColor: '#111111' }}>
        <h2 className="lx-section-title" style={{ color: 'white' }}>Exclusive Showcase</h2>
        <div className="lx-showcase-item">
            <div>
                <img src="/themes/autos/luxury/ferrari.png" style={{ width: '100%', borderRadius: '8px' }} alt="Ferrari" />
            </div>
            <div>
                <h3 className="lx-heading lx-text-gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Crimson Legend</h3>
                <p style={{ fontSize: '1.2rem', color: 'var(--lx-text-muted)', marginBottom: '1.5rem' }}>1963 Ferrari 250 GTO</p>
                <p style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
                    A one-of-a-kind vintage masterpiece, meticulously restored. This vehicle represents automotive history and unparalleled exclusivity.
                </p>
                <a href={getThemeLink('/explore?search=Ferrari')} className="lx-btn lx-btn-gold">Inquire About Price</a>
            </div>
        </div>
      </section>

      {/* Brands */}
      <section className="lx-section" id="brands">
        <h2 className="lx-section-title">Our Curated Brands</h2>
        <div className="lx-brand-grid">
            <a href={getThemeLink('/explore?brand=Ferrari')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Ferrari</a>
            <a href={getThemeLink('/explore?brand=Lamborghini')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Lamborghini</a>
            <a href={getThemeLink('/explore?brand=Mercedes-Benz')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Mercedes</a>
            <a href={getThemeLink('/explore?brand=Rolls-Royce')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Rolls Royce</a>
            <a href={getThemeLink('/explore?brand=Porsche')} className="lx-brand-item" style={{ color: 'white', textDecoration: 'none' }}>Porsche</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lx-section" style={{ backgroundColor: '#111111' }}>
        <h2 className="lx-section-title" style={{ color: 'white' }}>Client Experiences</h2>
        <div className="lx-testimonial-grid">
            {testimonials.map((t, i) => (
                <div key={i} className="lx-testimonial-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <img src={t.avatar} alt={t.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--lx-gold)', marginRight: '1rem', objectFit: 'cover' }} />
                        <div>
                            <h5 style={{ fontWeight: 700, margin: 0 }}>{t.name}</h5>
                            <small style={{ color: 'var(--lx-text-muted)' }}>{t.role}</small>
                        </div>
                    </div>
                    <p style={{ fontStyle: 'italic', lineHeight: 1.6 }}>"{t.quote}"</p>
                </div>
            ))}
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
}
