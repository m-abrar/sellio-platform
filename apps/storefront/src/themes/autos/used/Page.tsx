'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Vehicle } from '@sellio/types';
import { UsedCarCard, DealerLogo, StepCard } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

interface CarItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  mileage: string;
  numericMileage: number;
  location: string;
  dealer: string;
  image: string;
  slug: string;
  brand: string;
}

const FALLBACK_CARS: CarItem[] = [
  { id: 1, title: "2018 Honda Civic Sedan", price: "$15,500", numericPrice: 15500, mileage: "40,000 miles", numericMileage: 40000, location: "New York", dealer: "AutoWorld Dealership", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "2018-honda-civic", brand: "Honda" },
  { id: 2, title: "2020 Toyota Camry XLE", price: "$19,800", numericPrice: 19800, mileage: "25,000 miles", numericMileage: 25000, location: "Los Angeles", dealer: "City Motors", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "2020-toyota-camry", brand: "Toyota" },
  { id: 3, title: "2016 Ford Focus SE", price: "$9,200", numericPrice: 9200, mileage: "60,000 miles", numericMileage: 60000, location: "Chicago", dealer: "Honest Used Cars", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600", slug: "2016-ford-focus", brand: "Ford" },
  { id: 4, title: "2019 Mazda 3 Touring", price: "$17,000", numericPrice: 17000, mileage: "30,000 miles", numericMileage: 30000, location: "Dallas", dealer: "Zoom Motors", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600", slug: "2019-mazda-3", brand: "Mazda" },
  { id: 5, title: "2017 Hyundai Elantra SE", price: "$11,500", numericPrice: 11500, mileage: "55,000 miles", numericMileage: 55000, location: "Miami", dealer: "Prime Autos", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600", slug: "2017-hyundai-elantra", brand: "Hyundai" },
  { id: 6, title: "2019 Jeep Grand Cherokee", price: "$24,500", numericPrice: 24500, mileage: "42,000 miles", numericMileage: 42000, location: "Houston", dealer: "Elite Drives", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600", slug: "2019-jeep-grand-cherokee", brand: "Jeep" },
];

type VehicleRecord = Vehicle & {
  city?: string;
  mileage?: number | string;
  location?: Vehicle['location'] & { title?: string };
  dealer?: { name?: string };
  dealer_name?: string;
  company?: { title?: string };
  image?: string;
};

const translateVehicle = (rawItem: Vehicle): CarItem => {
  const item = rawItem as VehicleRecord;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  
  const numericPrice = Number(item.pricing?.base_price) || 15000;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const specsMileage = item.specs?.mileage;
  const numericMileage = specsMileage ? Number(specsMileage) : (item.mileage ? Number(item.mileage) : 35000);
  const mileageStr = `${numericMileage.toLocaleString()} miles`;
  
  const loc = item.city || item.location?.title || 'New York';
  const dealerName = item.dealer?.name || item.dealer_name || item.company?.title || 'DriveHub Dealership';
  
  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600"
  ];
  
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];
  
  return {
    id: item.id,
    title: item.title.startsWith('20') ? item.title : `${item.specs?.year || 2019} ${item.title}`,
    price: priceStr,
    numericPrice,
    mileage: mileageStr,
    numericMileage,
    location: loc,
    dealer: dealerName,
    image: mainImage,
    slug: generatedSlug,
    brand: item.specs?.make || item.title.split(' ')[0] || 'Unknown'
  };
};

const ShimmerCard = () => (
  <div className="us-car-card us-shimmer-pulse" style={{ minHeight: '380px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
    <div style={{ height: '220px', backgroundColor: '#e2e8f0' }}></div>
    <div style={{ padding: '1.5rem' }}>
      <div style={{ height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '75%', marginBottom: '0.75rem' }}></div>
      <div style={{ height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '45%', marginBottom: '1rem' }}></div>
      <div style={{ height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '90%' }}></div>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();
  const heroTitle = useThemeContent('hero.title', 'Find Your Perfect Used Car Today');
  const heroDescription = useThemeContent('hero.description', 'Trusted listings, verified sellers, and transparent pricing. Your next drive starts here.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse Catalog');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'How It Works');
  const filtersTitle = useThemeContent('filters.title', 'Search Filters');
  const clearFiltersLabel = useThemeContent('filters.clear_label', 'Clear All');
  const makeLabel = useThemeContent('filters.make_label', 'Make / Brand');
  const priceLabel = useThemeContent('filters.price_label', 'Price Budget');
  const mileageLabel = useThemeContent('filters.mileage_label', 'Odometer Mileage');
  const locationLabel = useThemeContent('filters.location_label', 'Location / City');
  const collectionTitle = useThemeContent('collection.title', 'Featured Listings');
  const collectionCountLabel = useThemeContent('collection.count_label', 'Vehicles');
  const emptyTitle = useThemeContent('empty.title', 'No Vehicles Found');
  const emptyDescription = useThemeContent('empty.description', "We couldn't find any used cars matching your current search parameters.");
  const emptyButtonLabel = useThemeContent('empty.button_label', 'Reset Filters');
  const dealTitle = useThemeContent('deal.title', 'Deal of the Week!');
  const dealBadge = useThemeContent('deal.badge', 'SAVE $3,000!');
  const dealVehicleTitle = useThemeContent('deal.vehicle_title', '2021 Hyundai Elantra Limited');
  const dealDescription = useThemeContent('deal.description', 'Low Mileage, Single Owner, Full Service History.');
  const dealPrice = useThemeContent('deal.price', '$21,995');
  const dealOriginalPrice = useThemeContent('deal.original_price', '$24,995');
  const dealCta = useThemeContent('deal.cta_label', 'Browse Available Showroom');
  const dealImage = useThemeMedia('deal.image', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600');
  const dealersTitle = useThemeContent('dealers.title', 'Trusted Dealers');
  const dealersDescription = useThemeContent('dealers.description', 'We partner with top-rated, verified dealerships to ensure a safe transaction.');
  const howTitle = useThemeContent('how_it_works.title', 'How It Works: 3 Simple Steps');
  const stepOneTitle = useThemeContent('how_it_works.step_1_title', '1. Search & Filter');
  const stepOneDescription = useThemeContent('how_it_works.step_1_description', 'Easily find your dream car with our powerful, intuitive search tools.');
  const stepTwoTitle = useThemeContent('how_it_works.step_2_title', '2. Contact & Schedule');
  const stepTwoDescription = useThemeContent('how_it_works.step_2_description', 'Pick your preferred dealer, schedule a dynamic test-drive with direct financing.');
  const stepThreeTitle = useThemeContent('how_it_works.step_3_title', '3. Drive Away Happy');
  const stepThreeDescription = useThemeContent('how_it_works.step_3_description', 'Take a test drive, finalize the digital deal, and hit the open road!');

  // Dynamic States
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Dropdown options
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>([]);

  // Selected Filters
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedMileage, setSelectedMileage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/autos_used${path}`;
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
          
          // Compute deduplicated dynamic options
          const brands = Array.from(new Set(mapped.map(c => c.brand).filter(Boolean)));
          const locations = Array.from(new Set(mapped.map(c => c.location).filter(Boolean)));
          
          setBrandsList(brands);
          setLocationsList(locations);
          setUseFallback(false);
        } else {
          console.warn("Autos Used database query returned empty. Engaging high-fidelity simulated database.");
          loadFallbacks();
        }
      } catch (err: unknown) {
        console.error("Autos Used Database Exception caught:", err);
        setErrorTrace(err instanceof Error ? (err.stack || err.message) : String(err));
        loadFallbacks();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbacks = () => {
      setCars(FALLBACK_CARS);
      setBrandsList(Array.from(new Set(FALLBACK_CARS.map(c => c.brand))));
      setLocationsList(Array.from(new Set(FALLBACK_CARS.map(c => c.location))));
      setUseFallback(true);
    };

    fetchVehicles();
  }, []);

  // Stateful filtering matching HUD filters
  const filteredCars = cars.filter(car => {
    if (selectedBrand && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    if (selectedLocation && car.location.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    
    if (selectedPrice) {
      if (selectedPrice === 'under-10k' && car.numericPrice >= 10000) return false;
      if (selectedPrice === '10k-20k' && (car.numericPrice < 10000 || car.numericPrice > 20000)) return false;
      if (selectedPrice === '20k-30k' && (car.numericPrice < 20000 || car.numericPrice > 30000)) return false;
      if (selectedPrice === '30k-plus' && car.numericPrice <= 30000) return false;
    }
    
    if (selectedMileage) {
      if (selectedMileage === 'under-30k' && car.numericMileage >= 30000) return false;
      if (selectedMileage === 'under-50k' && car.numericMileage >= 50000) return false;
      if (selectedMileage === 'under-80k' && car.numericMileage >= 80000) return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedPrice('');
    setSelectedMileage('');
    setSelectedLocation('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="us-hero" id="home">
        <h1 className="us-hero-title">{heroTitle}</h1>
        <p className="us-hero-subtitle">{heroDescription}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#featured-listings" className="us-btn us-btn-orange">{heroPrimaryCta}</a>
            <a href="#how-it-works" className="us-btn us-btn-outline" style={{ color: 'white', borderColor: 'white' }}>{heroSecondaryCta}</a>
        </div>
      </section>

      {/* Faceted Filter Card HUD */}
      <div className="us-filter-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h5 className="us-text-blue us-fw-bold" style={{ margin: 0, fontSize: '1.25rem' }}>{filtersTitle}</h5>
          {(selectedBrand || selectedPrice || selectedMileage || selectedLocation) && (
            <button 
              onClick={clearFilters}
              style={{ background: 'none', border: 'none', color: 'var(--us-orange)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
            >
              {clearFiltersLabel} ↺
            </button>
          )}
        </div>
        
        <div className="us-filter-grid">
            <div className="us-filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.4rem' }}>{makeLabel}</label>
              <select 
                className="us-select" 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brandsList.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="us-filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.4rem' }}>{priceLabel}</label>
              <select 
                className="us-select"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-20k">$10,000 - $20,000</option>
                <option value="20k-30k">$20,000 - $30,000</option>
                <option value="30k-plus">$30,000+</option>
              </select>
            </div>
            
            <div className="us-filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.4rem' }}>{mileageLabel}</label>
              <select 
                className="us-select"
                value={selectedMileage}
                onChange={(e) => setSelectedMileage(e.target.value)}
              >
                <option value="">Any Mileage</option>
                <option value="under-30k">Under 30,000 miles</option>
                <option value="under-50k">Under 50,000 miles</option>
                <option value="under-80k">Under 80,000 miles</option>
              </select>
            </div>
            
            <div className="us-filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '0.4rem' }}>{locationLabel}</label>
              <select 
                className="us-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locationsList.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
        </div>
      </div>

      {/* Diagnostics resilience overlay for offline / error modes */}
      {useFallback && errorTrace && (
        <div style={{ margin: '0 5% 3rem 5%', padding: '1.5rem', backgroundColor: '#fffaf0', border: '2px dashed var(--us-orange)', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--us-orange)', margin: '0 0 0.5rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> Database Offline - High-Fidelity Diagnostics Active
          </h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
            Unable to connect to live vehicle services database. Engage local diagnostic tracing console report:
          </p>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.4 }}>
            {errorTrace}
          </pre>
        </div>
      )}

      {/* Listings Catalog */}
      <section className="us-section" id="featured-listings">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="us-section-title" style={{ margin: 0, textAlign: 'left' }}>{collectionTitle}</h2>
          <span style={{ color: '#666', fontWeight: 600, fontSize: '1.05rem' }}>
            Showing {filteredCars.length} of {cars.length} {collectionCountLabel}
          </span>
        </div>

        {loading ? (
          <div className="us-grid">
            {[...Array(6)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '3.5rem' }}>🚗</span>
            <h3 style={{ color: 'var(--us-blue)', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>{emptyTitle}</h3>
            <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>{emptyDescription}</p>
            <button onClick={clearFilters} className="us-btn us-btn-orange">{emptyButtonLabel}</button>
          </div>
        ) : (
          <div className="us-grid">
              {filteredCars.map((car) => (
                  <UsedCarCard 
                    key={car.id} 
                    {...car} 
                    onClick={() => router.push(getThemeLink(`/product/${car.slug}`))}
                  />
              ))}
          </div>
        )}
      </section>

      {/* Deal of the Week */}
      <section className="us-section" style={{ backgroundColor: 'white' }}>
        <h2 className="us-section-title">{dealTitle}</h2>
        <div className="us-deal-card">
            <span className="us-badge-deal">{dealBadge}</span>
            <div style={{ position: 'relative', minHeight: '300px' }}>
                <img 
                  src={dealImage} 
                  alt="Deal of the Week Car" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                />
            </div>
            <div style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="us-text-blue us-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{dealVehicleTitle}</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{dealDescription}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span className="us-text-orange us-fw-bold" style={{ fontSize: '2.5rem' }}>{dealPrice}</span>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.25rem' }}>{dealOriginalPrice}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#555', lineHeight: 2 }}>
                    <li>⏱️ Only 15,000 Miles</li>
                    <li>📅 Model Year 2021</li>
                    <li>⛽ Great MPG & Resilient Specs</li>
                </ul>
                <a href="#featured-listings" className="us-btn us-btn-orange" style={{ width: '100%' }}>{dealCta}</a>
            </div>
        </div>
      </section>

      {/* Trusted Dealers */}
      <section className="us-section" id="trusted-dealers">
        <h2 className="us-section-title">{dealersTitle}</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>{dealersDescription}</p>
        <div className="us-dealer-grid">
            <DealerLogo name="AutoWorld" rating={4.8} />
            <DealerLogo name="City Motors" rating={4.1} />
            <DealerLogo name="Honest Used Cars" rating={5.0} />
            <DealerLogo name="Zoom Motors" rating={3.6} />
            <DealerLogo name="Prime Autos" rating={4.7} />
            <DealerLogo name="Elite Drives" rating={4.9} />
        </div>
      </section>

      {/* How It Works */}
      <section className="us-section" id="how-it-works" style={{ backgroundColor: 'white' }}>
        <h2 className="us-section-title">{howTitle}</h2>
        <div className="us-step-grid">
            <StepCard 
                icon="🔍" 
                title={stepOneTitle}
                desc={stepOneDescription}
            />
            <StepCard 
                icon="💬" 
                title={stepTwoTitle}
                desc={stepTwoDescription}
            />
            <StepCard 
                icon="🛣️" 
                title={stepThreeTitle}
                desc={stepThreeDescription}
            />
        </div>
      </section>
    </div>
  );
}
