'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@sellio/types';
import { ElectricHeader, EVCard, IconBox, ElectricFooter } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehiclesHome, resolveVehiclesFailure } from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface EVItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  range: string;
  battery: string;
  charge: string;
  image: string;
  slug: string;
  brand: string;
  category: string;
}

// Fallback EV models matching original prototype
const FALLBACK_CLASSIFIEDS: EVItem[] = [
  { id: 1, title: "2025 Tesla Model Y", price: "$47,000 USD", numericPrice: 47000, range: "330 Miles", battery: "75 kWh", charge: "250 kW", image: "/themes/autos/electric/tesla_y.png", slug: "tesla-model-y", brand: "Tesla", category: "Electric" },
  { id: 2, title: "2025 Rivian R1T", price: "$70,000 USD", numericPrice: 70000, range: "314 Miles", battery: "135 kWh", charge: "200 kW", image: "/themes/autos/electric/rivian_r1t.png", slug: "rivian-r1t", brand: "Rivian", category: "Electric" },
  { id: 3, title: "2024 Kia EV6", price: "$42,000 USD", numericPrice: 42000, range: "310 Miles", battery: "77.4 kWh", charge: "350 kW", image: "/themes/autos/electric/kia_ev6.png", slug: "kia-ev6", brand: "Kia", category: "Electric" },
  { id: 4, title: "2024 Lucid Air", price: "$87,400 USD", numericPrice: 87400, range: "410 Miles", battery: "112 kWh", charge: "300 kW", image: "/themes/autos/electric/lucid_air.png", slug: "lucid-air", brand: "Lucid", category: "Electric" },
];

const translateVehicleToEV = (car: Vehicle): EVItem => {
  const generatedSlug = car.slug || car.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // High-fidelity static EV values for Round 2 dynamic database mapping as requested
  let range = "310 Miles";
  let battery = "77.4 kWh";
  let charge = "250 kW";
  const modelYear = car.specs?.year || 2025;
  
  if (car.title.toLowerCase().includes('tesla')) {
    range = "330 Miles";
    battery = "75 kWh";
    charge = "250 kW";
  } else if (car.title.toLowerCase().includes('rivian')) {
    range = "314 Miles";
    battery = "135 kWh";
    charge = "200 kW";
  } else if (car.title.toLowerCase().includes('lucid')) {
    range = "410 Miles";
    battery = "112 kWh";
    charge = "300 kW";
  } else {
    // Deterministic variations by ID
    range = `${300 + (car.id * 15) % 120} Miles`;
    battery = `${65 + (car.id * 8) % 70} kWh`;
    charge = `${150 + (car.id * 50) % 210} kW`;
  }

  const cat = car.taxonomy?.category;
  const categoryStr = typeof cat === 'string' ? cat : (cat && typeof cat === 'object' ? (cat.title || 'Electric') : 'Electric');
  
  return {
    id: car.id,
    title: car.title.startsWith('20') ? car.title : `${modelYear} ${car.title}`,
    price: car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()} USD`,
    numericPrice: car.pricing?.base_price || 0,
    range,
    battery,
    charge,
    image: car.media?.main_photo || car.featured_image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400",
    slug: generatedSlug,
    brand: car.specs?.make || car.title.split(' ')[0] || "EV",
    category: categoryStr
  };
};

export default function Page() {
  const router = useRouter();
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroTitle = useThemeContent('hero.title', 'The Future is Electric');
  const heroHighlight = useThemeContent('hero.highlight', 'Electric');
  const heroDescription = useThemeContent('hero.description', 'Explore revolutionary vehicles and sustainable living. Experience peak performance with zero emissions.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse EVs');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Locate Charging');
  const filtersTitle = useThemeContent('filters.title', 'Quick Search');
  const collectionTitle = useThemeContent('collection.title', 'Featured EV Models');
  const collectionHighlight = useThemeContent('collection.highlight', 'EV Models');
  const emptyTitle = useThemeContent('empty.title', 'No EV Models Match Search');
  const emptyDescription = useThemeContent('empty.description', 'Adjust price filters or clear the brand search to return to our electric grid.');
  const emptyButton = useThemeContent('empty.button_label', 'Reset Refinements');
  const compareTitle = useThemeContent('compare.title', 'Compare The Top EVs');
  const compareHighlight = useThemeContent('compare.highlight', 'Top EVs');
  const chargingTitle = useThemeContent('charging.title', 'An Expansive Charging Network');
  const chargingHighlight = useThemeContent('charging.highlight', 'Charging Network');
  const chargingDescription = useThemeContent('charging.description', 'Never worry about range anxiety. Our marketplace integrates with thousands of Level 2 and DC Fast Charging stations globally. Find, reserve, and pay--all in one app.');
  const chargingCta = useThemeContent('charging.cta_label', 'View Live Map');
  const sustainabilityTitle = useThemeContent('sustainability.title', 'Sustainability Highlights');
  const sustainabilityHighlight = useThemeContent('sustainability.highlight', 'Highlights');

  // Dynamic States
  const [vehicles, setVehicles] = useState<EVItem[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dropdown filter selections
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCharge, setSelectedCharge] = useState('');

  useEffect(() => {
    async function loadHomepageData() {
      setLoading(true);
      const result = await fetchVehiclesHome(6);

      if (result.ok && result.response.data?.length) {
        const evsMapped = result.response.data.map(translateVehicleToEV);
        setVehicles(evsMapped);
        setBrandsList(Array.from(new Set(evsMapped.map((v) => v.brand))));
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No vehicles returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveVehiclesFailure(allowDemo, 'electric');

        if (resolution.mode === 'demo') {
          const evsMapped = resolution.vehicles.map(translateVehicleToEV);
          setVehicles(evsMapped);
          setBrandsList(Array.from(new Set(evsMapped.map((v) => v.brand))));
          setUseFallback(true);
        } else {
          setVehicles([]);
          setBrandsList([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadHomepageData();
  }, [allowDemo]);

  // Filter dynamic vehicles list
  const filteredEvs = vehicles.filter((ev) => {
    const matchesBrand = selectedBrand === '' || ev.brand.toLowerCase() === selectedBrand.toLowerCase();
    
    // Range filter (extracted numeric ranges)
    const numericRange = parseInt(ev.range);
    let matchesRange = true;
    if (selectedRange === 'under-320') matchesRange = numericRange < 320;
    else if (selectedRange === 'over-320') matchesRange = numericRange >= 320;

    // Price Filter
    let matchesPrice = true;
    if (selectedPrice === 'under-50k') matchesPrice = ev.numericPrice < 50000;
    else if (selectedPrice === '50k-80k') matchesPrice = ev.numericPrice >= 50000 && ev.numericPrice <= 80000;
    else if (selectedPrice === 'over-80k') matchesPrice = ev.numericPrice > 80000;

    // Charging DC Speed Filter
    const numericCharge = parseInt(ev.charge);
    let matchesCharge = true;
    if (selectedCharge === '200-250') matchesCharge = numericCharge >= 200 && numericCharge <= 250;
    else if (selectedCharge === 'over-300') matchesCharge = numericCharge >= 300;

    return matchesBrand && matchesRange && matchesPrice && matchesCharge;
  });

  // Dynamic EV columns to compare
  const compareList = filteredEvs.slice(0, 3).length > 0 
    ? filteredEvs.slice(0, 3) 
    : vehicles.slice(0, 3);

  const handleCardClick = (slug: string) => {
    router.push(themeLink(`/product/${slug}`));
  };

  return (
    <div className="autos-electric-wrapper">
      <ElectricHeader />

      {/* Hero Section */}
      <section className="ev-hero">
        <div className="ev-hero-content">
          <h1 className="ev-hero-title">
            {heroTitle.split(heroHighlight).map((part, index, parts) => (
              <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="ev-text-green">{heroHighlight}</span>}</React.Fragment>
            ))}
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.8, lineHeight: 1.6 }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={themeLink('/explore')} className="ev-btn ev-btn-green" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>{heroPrimaryCta}</a>
            <a href="#charging" className="ev-btn ev-btn-blue" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>{heroSecondaryCta}</a>
          </div>
        </div>
      </section>

      {useFallback && apiError && (
        <div className="ev-alert-slot" style={{ margin: '2rem 5% 0' }}>
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ev" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="ev-alert-slot" style={{ margin: '2rem 5% 0' }}>
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ev" />
        </div>
      )}

      {/* Interactive Filters Bar */}
      <section className="ev-filter-section">
        <div style={{ width: '100%', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }} className="ev-text-green">{filtersTitle}</h2>
        </div>
        
        <select 
          className="ev-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Brand (All)</option>
          {brandsList.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select 
          className="ev-select"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="">Range (All)</option>
          <option value="under-320">Under 320 Miles</option>
          <option value="over-320">320+ Miles</option>
        </select>

        <select 
          className="ev-select"
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
        >
          <option value="">Price (All)</option>
          <option value="under-50k">Under $50,000</option>
          <option value="50k-80k">$50,000 - $80,000</option>
          <option value="over-80k">Above $80,000</option>
        </select>

        <select 
          className="ev-select"
          value={selectedCharge}
          onChange={(e) => setSelectedCharge(e.target.value)}
        >
          <option value="">Charging DC Rate (All)</option>
          <option value="200-250">200 kW - 250 kW</option>
          <option value="over-300">300+ kW</option>
        </select>
      </section>

      {/* Featured Models */}
      <section className="ev-section" id="featured-evs">
        <h2 className="ev-section-title">
          {collectionTitle.split(collectionHighlight).map((part, index, parts) => (
            <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="ev-text-blue">{collectionHighlight}</span>}</React.Fragment>
          ))}
        </h2>
        
        {loading ? (
          // Electric Pulsing Shimmer Grids Skeletons
          <div className="ev-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ev-card" style={{ height: '420px', animation: 'ev-shimmer-pulse 1.5s infinite' }}>
                <div style={{ height: '250px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ height: '22px', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.85rem' }} />
                  <div style={{ height: '28px', width: '35%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1.5rem' }} />
                  <div style={{ height: '14px', width: '80%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                  <div style={{ height: '14px', width: '70%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '15px', backgroundColor: 'var(--ev-card-bg)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚡</span>
            <h4 style={{ color: 'var(--ev-accent-green)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{emptyTitle}</h4>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>{emptyDescription}</p>
            <button className="ev-btn ev-btn-green" onClick={() => { setSelectedBrand(''); setSelectedRange(''); setSelectedPrice(''); setSelectedCharge(''); }}>{emptyButton}</button>
          </div>
        ) : (
          <div className="ev-grid">
            {filteredEvs.map((ev) => (
              <EVCard 
                key={ev.id} 
                {...ev} 
                onClick={() => handleCardClick(ev.slug)}
              />
            ))}
          </div>
        )}
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-blue)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Compare EVs */}
      <section className="ev-section" id="compare-evs">
        <h2 className="ev-section-title">
          {compareTitle.split(compareHighlight).map((part, index, parts) => (
            <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="ev-text-green">{compareHighlight}</span>}</React.Fragment>
          ))}
        </h2>
        <div className="ev-compare-container">
          <div className="ev-compare-table" style={{ gridTemplateColumns: `repeat(${compareList.length + 1}, minmax(180px, 1fr))` }}>
            {/* Feature Column */}
            <div className="ev-compare-col" style={{ borderRight: '1px solid var(--ev-accent-green)' }}>
              <div className="ev-compare-header primary">Feature</div>
              <div className="ev-compare-cell feature">Starting Price</div>
              <div className="ev-compare-cell feature">Max Range (EPA)</div>
              <div className="ev-compare-cell feature">Battery Capacity</div>
              <div className="ev-compare-cell feature">Max DC Charging</div>
            </div>
            
            {/* EV Columns mapped dynamically */}
            {compareList.map((ev, index) => (
              <div 
                key={ev.id} 
                className="ev-compare-col" 
                style={{ borderRight: index === compareList.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="ev-compare-header" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(ev.slug)}>
                  {ev.title.replace(/^\d{4}\s/, '')}
                </div>
                <div className="ev-compare-cell">{ev.price.split(' ')[0]}</div>
                <div className="ev-compare-cell">{ev.range.toLowerCase()}</div>
                <div className="ev-compare-cell">{ev.battery}</div>
                <div className="ev-compare-cell">{ev.charge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-green)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Charging Network */}
      <section className="ev-section" id="charging">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="ev-section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              {chargingTitle.split(chargingHighlight).map((part, index, parts) => (
                <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="ev-text-blue">{chargingHighlight}</span>}</React.Fragment>
              ))}
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6, opacity: 0.8 }}>
              {chargingDescription}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Real-time availability updates</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Integrated payment solutions</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Filter by plug type (CCS, NACS, CHAdeMO)</div>
            </div>
            <a href="#charging" className="ev-btn ev-btn-green">{chargingCta}</a>
          </div>
          <div>
            <div style={{ aspectRatio: '16/9', background: 'var(--ev-card-bg)', border: '1px solid var(--ev-accent-blue)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,255,255,0.2)' }}>
              <span style={{ fontSize: '3rem' }}>🗺️ Map Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-blue)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Sustainability */}
      <section className="ev-section" id="sustainability">
        <h2 className="ev-section-title">
          {sustainabilityTitle.split(sustainabilityHighlight).map((part, index, parts) => (
            <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="ev-text-green">{sustainabilityHighlight}</span>}</React.Fragment>
          ))}
        </h2>
        <div className="ev-icon-grid">
          <IconBox icon="🌱" title="Zero Emissions" desc="Contribute to a cleaner planet with every mile driven." />
          <IconBox icon="💻" title="Smart Tech Integration" desc="Over-the-air updates and advanced driver-assistance systems." />
          <IconBox icon="💰" title="Lower Costs" desc="Significantly reduced fuel and maintenance expenses over time." />
          <IconBox icon="☀️" title="Renewable Charging" desc="Options to filter and select charging stations powered by renewable energy." />
        </div>
      </section>

      {/* Styled JSX for shimmer animation */}
      <style jsx global>{`
        @keyframes ev-shimmer-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
      `}</style>

      <ElectricFooter />
    </div>
  );
}
