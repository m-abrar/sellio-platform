'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Vehicle } from '@sellio/types';
import { ClassicCarCard, AuctionCard } from './components';

interface ClassicCarItem {
  id: number;
  title: string;
  desc: string;
  price: string;
  numericPrice: number;
  image: string;
  slug: string;
  make: string;
  model: string;
  year: number;
}

const FALLBACK_CARS: ClassicCarItem[] = [
  { id: 1, title: "1965 Ford Mustang Convertible", desc: "1965 Manual | V8 Engine", price: "$45,000", numericPrice: 45000, image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600", slug: "1965-ford-mustang", make: "Ford", model: "Mustang", year: 1965 },
  { id: 2, title: "1970 Porsche 911 T", desc: "1970 Manual | Rally-Ready Flat-6", price: "$120,000", numericPrice: 120000, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "1970-porsche-911", make: "Porsche", model: "911", year: 1970 },
  { id: 3, title: "1961 Jaguar E-Type Coupe", desc: "1961 Manual | Series 1 Restored", price: "$185,000", numericPrice: 185000, image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600", slug: "1961-jaguar-etype", make: "Jaguar", model: "E-Type", year: 1961 },
  { id: 4, title: "1955 Mercedes-Benz 300 SL", desc: "1955 Manual | Iconic Gullwing Coupe", price: "$1,500,000", numericPrice: 1500000, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "1955-mercedes-300sl", make: "Mercedes-Benz", model: "300 SL", year: 1955 },
];

const FALLBACK_AUCTIONS = [
  { title: "1957 Chevrolet Bel Air", desc: "Iconic American Classic - No Reserve", currentBid: "$78,000", timeRemaining: "01D : 14H : 30M : 00S", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600" },
  { title: "1962 Ferrari 250 GTO", desc: "Highly Sought-After Investment", currentBid: "$38,000,000", timeRemaining: "05D : 08H : 15M : 00S", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600" }
];

const translateVehicle = (rawItem: Vehicle): ClassicCarItem => {
  const item = rawItem as any;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const numericPrice = Number(item.pricing?.base_price) || 45000;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const year = Number(item.specs?.year) || 1965;
  const make = item.specs?.make || item.title.split(' ')[0] || 'Unknown';
  const model = item.specs?.model || item.title.split(' ').slice(1).join(' ') || 'Collector Series';
  
  const trans = item.specs?.transmission || "Manual";
  const eng = item.specs?.engine || "V8 Engine";
  const descStr = `${year} ${trans} | ${eng}`;

  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600"
  ];
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];

  return {
    id: item.id,
    title: item.title.startsWith('19') || item.title.startsWith('20') ? item.title : `${year} ${item.title}`,
    desc: descStr,
    price: priceStr,
    numericPrice,
    image: mainImage,
    slug: generatedSlug,
    make,
    model,
    year
  };
};

const ShimmerCard = () => (
  <div className="ac-car-card ac-shimmer-pulse" style={{ minHeight: '380px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
    <div style={{ height: '220px', backgroundColor: '#e2e8f0' }}></div>
    <div style={{ padding: '1.5rem' }}>
      <div style={{ height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%', marginBottom: '0.75rem' }}></div>
      <div style={{ height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '50%', marginBottom: '1rem' }}></div>
      <div style={{ height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '35%' }}></div>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();

  // Dynamic States
  const [cars, setCars] = useState<ClassicCarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Dropdown options
  const [makesList, setMakesList] = useState<string[]>([]);
  const [modelsList, setModelsList] = useState<string[]>([]);

  // Filters State
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/autos_classic${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await api.getVehicles({ per_page: 20 });
        if (response && response.data && response.data.length > 0) {
          const mapped = response.data.map(translateVehicle);
          setCars(mapped);
          
          // Deduplicate makes and models
          const makes = Array.from(new Set(mapped.map(c => c.make).filter(Boolean)));
          setMakesList(makes);
          setUseFallback(false);
        } else {
          console.warn("Autos Classic database empty. Engaging custom simulated showroom.");
          loadFallbacks();
        }
      } catch (err: any) {
        console.error("Autos Classic Database connection exception caught:", err);
        setErrorTrace(err.stack || err.message || String(err));
        loadFallbacks();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbacks = () => {
      setCars(FALLBACK_CARS);
      setMakesList(Array.from(new Set(FALLBACK_CARS.map(c => c.make))));
      setUseFallback(true);
    };

    fetchVehicles();
  }, []);

  // Update models list whenever selected make changes
  useEffect(() => {
    if (selectedMake) {
      const models = Array.from(
        new Set(
          cars
            .filter(c => c.make.toLowerCase() === selectedMake.toLowerCase())
            .map(c => c.model)
            .filter(Boolean)
        )
      );
      setModelsList(models);
      setSelectedModel('');
    } else {
      setModelsList([]);
      setSelectedModel('');
    }
  }, [selectedMake, cars]);

  // Stateful filtering matching HUD filters
  const filteredCars = cars.filter(car => {
    if (selectedMake && car.make.toLowerCase() !== selectedMake.toLowerCase()) return false;
    if (selectedModel && car.model.toLowerCase() !== selectedModel.toLowerCase()) return false;
    
    if (selectedYear) {
      if (selectedYear === 'pre-1950' && car.year >= 1950) return false;
      if (selectedYear === '1950-1959' && (car.year < 1950 || car.year > 1959)) return false;
      if (selectedYear === '1960-1969' && (car.year < 1960 || car.year > 1969)) return false;
      if (selectedYear === '1970-1979' && (car.year < 1970 || car.year > 1979)) return false;
      if (selectedYear === '1980-plus' && car.year < 1980) return false;
    }

    if (selectedPrice) {
      if (selectedPrice === 'under-50k' && car.numericPrice >= 50000) return false;
      if (selectedPrice === '50k-150k' && (car.numericPrice < 50000 || car.numericPrice > 150000)) return false;
      if (selectedPrice === '150k-500k' && (car.numericPrice < 150000 || car.numericPrice > 500000)) return false;
      if (selectedPrice === '500k-plus' && car.numericPrice < 500000) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedPrice('');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="ac-hero">
        <div className="ac-hero-overlay"></div>
        <div className="ac-hero-content">
            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '1rem', color: 'var(--ac-secondary)' }}>The Collector's Choice</p>
            <h1>Discover Timeless Classics</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: 1.6, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                Your journey into automotive history begins here. Find, bid, or sell the world's most desired vintage automobiles.
            </p>
            <div className="ac-hero-buttons">
                <a href="#listings" className="ac-btn ac-btn-cta" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Browse Showcase</a>
                <a href="#auctions" className="ac-btn ac-btn-gold" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Live Auctions</a>
            </div>
        </div>
      </section>

      {/* Stateful Refinement filters HUD */}
      <section className="ac-filter-section">
        <div style={{ flex: 1, minWidth: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="ac-heading" style={{ fontSize: '1.6rem', margin: 0 }}>Find Your Dream Classic</h2>
            {(selectedMake || selectedModel || selectedYear || selectedPrice) && (
              <button 
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: 'var(--ac-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Clear Filters ↺
              </button>
            )}
        </div>
        
        <div className="ac-filter-group">
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Make / Manufacturer</label>
            <select 
              className="ac-select"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            >
                <option value="">All Makes</option>
                {makesList.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
            </select>
        </div>
        
        <div className="ac-filter-group">
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Model Series</label>
            <select 
              className="ac-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            >
                <option value="">All Models</option>
                {modelsList.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
            </select>
        </div>
        
        <div className="ac-filter-group">
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Era / Year</label>
            <select 
              className="ac-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
                <option value="">All Eras</option>
                <option value="pre-1950">Pre-1950</option>
                <option value="1950-1959">1950 - 1959</option>
                <option value="1960-1969">1960 - 1969</option>
                <option value="1970-1979">1970 - 1979</option>
                <option value="1980-plus">1980+</option>
            </select>
        </div>
        
        <div className="ac-filter-group">
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Valuation Bracket</label>
            <select 
              className="ac-select"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
                <option value="">All Budgets</option>
                <option value="under-50k">Under $50,000</option>
                <option value="50k-150k">$50,000 - $150,000</option>
                <option value="150k-500k">$150,000 - $500,000</option>
                <option value="500k-plus">$500,000+</option>
            </select>
        </div>
      </section>

      {/* Connection Diagnostics overlay if database server is offline */}
      {useFallback && errorTrace && (
        <div style={{ margin: '0 5% 3rem 5%', padding: '1.5rem', backgroundColor: '#fffdf5', border: '2px dashed var(--ac-primary)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--ac-primary)', margin: '0 0 0.5rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--ac-font-heading)' }}>
            <span>⚠️</span> Database Offline - High-Fidelity Diagnostics Active
          </h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
            API exception caught on live database endpoint query. Engage local diagnostic trace block:
          </p>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.4 }}>
            {errorTrace}
          </pre>
        </div>
      )}

      {/* Featured Listings */}
      <section className="ac-section" id="listings">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="ac-section-title" style={{ margin: 0 }}>Featured Classics for Sale</h2>
          <span style={{ color: '#555', fontWeight: 600, fontSize: '1.05rem', fontFamily: 'var(--ac-font-heading)' }}>
            Showcasing {filteredCars.length} of {cars.length} Masterpieces
          </span>
        </div>

        {loading ? (
          <div className="ac-grid">
            {[...Array(4)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '3rem' }}>🏎️</span>
            <h3 style={{ color: 'var(--ac-dark)', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem', fontFamily: 'var(--ac-font-heading)' }}>No Classics Found</h3>
            <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>No vintage automobiles matched your current search filters.</p>
            <button onClick={clearFilters} className="ac-btn ac-btn-cta">Reset Refinements</button>
          </div>
        ) : (
          <div className="ac-grid">
              {filteredCars.map((car) => (
                  <ClassicCarCard 
                    key={car.id} 
                    {...car} 
                    onClick={() => router.push(getThemeLink(`/product/${car.slug}`))}
                  />
              ))}
          </div>
        )}
      </section>

      {/* Live Auctions Spotlight */}
      <section className="ac-auction-section" id="auctions">
        <h2 className="ac-section-title">Live Auction Spotlight <span style={{ background: 'var(--ac-primary)', color: 'white', fontSize: '1rem', padding: '0.2rem 0.6rem', borderRadius: '4px', verticalAlign: 'middle', animation: 'pulse 1.5s infinite' }}>LIVE</span></h2>
        <div className="ac-auction-grid">
            {FALLBACK_AUCTIONS.map((a, i) => (
                <AuctionCard key={i} {...a} />
            ))}
        </div>
      </section>

      {/* About */}
      <section className="ac-section" id="about" style={{ background: 'var(--ac-light)' }}>
        <div className="ac-about-grid">
            <div>
                <img 
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600" 
                  alt="Why Collect Classic Cars" 
                  style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 className="ac-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Collect Classic Cars?</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                    More than just vehicles, classic cars are <strong>rolling investments</strong>, passionate hobbies, and tangible links to history.
                </p>
                <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                    Each curve, engine note, and stitch of leather tells a story of innovation, design, and a bygone era. We connect discerning collectors with meticulously curated classics, ensuring authenticity, provenance, and investment quality.
                </p>
                <a href="#listings" className="ac-btn ac-btn-cta">Read Our Story</a>
            </div>
        </div>
      </section>
    </div>
  );
}
