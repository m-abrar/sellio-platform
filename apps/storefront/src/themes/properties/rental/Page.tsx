'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LeaseUnitCard, TrustMetrics } from './components';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

// Fallback high-fidelity local rental units
const FALLBACK_RENTALS = [
  { id: 1, slug: "north-tower-studio", title: "The North Tower Studio", price: "$1,850", base_price: 1850, type: "Studio", location: "Downtown Core", beds: "1", baths: "1", sqft: "480", rating: 4.8, reviews: 142, image: "/themes/properties/rental/1.webp", description: "Sleek and compact premium studio node located in the heart of Downtown Core. High-speed connectivity, automated utilities, and panoramic skyline vistas." },
  { id: 2, slug: "riverside-2br-apartment", title: "Riverside 2BR Apartment", price: "$2,400", base_price: 2400, type: "Apartment", location: "West End District", beds: "2", baths: "2", sqft: "950", rating: 4.9, reviews: 89, image: "/themes/properties/rental/2.webp", description: "Breathtaking dual-bedroom node situated alongside the serene West End riverbanks. Features custom oak flooring, smart home grids, and direct transit access." },
  { id: 3, slug: "modern-industrial-loft", title: "Modern Industrial Loft", price: "$3,100", base_price: 3100, type: "Loft", location: "Arts & Culture Center", beds: "1", baths: "1.5", sqft: "820", rating: 4.7, reviews: 63, image: "/themes/properties/rental/3.webp", description: "Raw concrete accents meet high-fidelity designer spaces in this sprawling open-plan loft node, adjacent to premier galleries and local dining." },
  { id: 4, slug: "skyline-penthouse-unit", title: "Skyline Penthouse Unit", price: "$5,500", base_price: 5500, type: "Penthouse", location: "Financial Hub District", beds: "3", baths: "3", sqft: "1650", rating: 5.0, reviews: 27, image: "/themes/properties/rental/4.webp", description: "The pinnacle of urban residential nodes. Spanning the entire top floor, this elite penthouse features direct elevator entry and breathtaking 360 views." },
  { id: 5, slug: "sunlit-family-townhouse", title: "Sunlit Family Townhouse", price: "$3,800", base_price: 3800, type: "Townhouse", location: "Suburban Pines", beds: "4", baths: "3", sqft: "1900", rating: 4.9, reviews: 52, image: "/themes/properties/rental/5.webp", description: "A beautifully proportioned multi-story family node surrounded by lush woodlands. Spacious layout, double-car charging garage, and private landscaped garden." },
  { id: 6, slug: "compact-downtown-micro-studio", title: "Compact Downtown Micro-Studio", price: "$1,400", base_price: 1400, type: "Studio", location: "South Side Loop", beds: "1", baths: "1", sqft: "350", rating: 4.6, reviews: 104, image: "/themes/properties/rental/6.webp", description: "Intelligently optimized compact residential node. Space-saving convertible custom fittings, ultra-low carbon footprint, and centralized location metrics." },
];

export default function Page() {
  const router = useRouter();
  const [rentals, setRentals] = useState<any[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<any[]>([]);
  
  // Refinements States
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [leaseType, setLeaseType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Translate database property schema to RentNode client expectations
  const translateProperty = (p: any) => {
    // Format price elegantly for a monthly lease
    let rawPrice = Number(p.pricing?.base_price || p.base_price || 0);
    if (rawPrice > 100000) {
      // Sale property fallback to beautiful rent rates deterministically
      rawPrice = 1200 + (p.id % 8) * 450;
    }
    const formattedPrice = `$` + rawPrice.toLocaleString();
    
    // Category mapping (Studio, Apartment, Loft, Penthouse, etc.)
    const cat = p.specs?.category || p.category;
    let categoryTitle = 'Apartment';
    if (cat) {
      categoryTitle = typeof cat === 'string' ? cat : cat.title || 'Apartment';
    } else if (p.category_id === 1) {
      categoryTitle = 'Studio';
    } else if (p.category_id === 2) {
      categoryTitle = 'Apartment';
    } else if (p.category_id === 3) {
      categoryTitle = 'Loft';
    } else if (p.category_id === 4) {
      categoryTitle = 'Penthouse';
    }

    const beds = p.specs?.bedrooms ?? p.number_of_bedrooms ?? (1 + (p.id % 3));
    const baths = p.specs?.bathrooms ?? p.number_of_bathrooms ?? (1 + (p.id % 2));
    const sqft = p.specs?.area_formatted ? p.specs.area_formatted.replace(/[^\d]/g, '') : (p.area_sq_ft || (400 + (p.id % 5) * 350));
    const loc = p.city || p.location?.title || p.address || 'Downtown Core';
    const rating = p.rating || (4.5 + (p.id % 6) * 0.1);
    const reviews = p.reviews || (15 + (p.id % 12) * 11);
    
    let img = p.featured_image || (p.media?.main_photo || p.image);
    if (!img) {
      img = `/themes/properties/rental/${(p.id % 6) + 1}.webp`;
    }

    return {
      id: p.id,
      title: p.title,
      slug: p.slug || `property-${p.id}`,
      price: formattedPrice,
      base_price: rawPrice,
      type: categoryTitle,
      location: loc,
      beds: String(beds),
      baths: String(baths),
      sqft: String(sqft),
      rating: rating,
      reviews: reviews,
      image: img,
      description: p.description || p.short_description || `High-fidelity dynamic residential node located in ${loc}. Ready for instant lease signing protocols.`
    };
  };

  const fetchLiveRentals = async () => {
    setLoading(true);
    try {
      // Query properties from Sellio API
      const response = await api.getProperties({ per_page: 20 });
      if (response && response.data && response.data.length > 0) {
        const translated = response.data.map((p: any) => translateProperty(p));
        setRentals(translated);
        setFilteredRentals(translated);
        setUseFallback(false);
        setApiError(null);
      } else {
        console.warn("Properties Rental Theme: Empty database collection. Initializing high-fidelity fallbacks.");
        setApiError("Database returned no listings. Seeders might be empty.");
        triggerLocalFallbacks();
      }
    } catch (error) {
      console.error("Properties Rental Theme: Connection failure loading properties. Engaging offline backup.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerLocalFallbacks();
    } finally {
      setLoading(false);
    }
  };

  const triggerLocalFallbacks = () => {
    setUseFallback(true);
    setRentals(FALLBACK_RENTALS);
    setFilteredRentals(FALLBACK_RENTALS);
  };

  useEffect(() => {
    fetchLiveRentals();
  }, []);

  // Sync route link previews safely
  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/properties_rental${path}`;
      }
    }
    return path;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(searchLocation, activeCategory, leaseType);
  };

  const applyFilters = (loc: string, cat: string, lease: string) => {
    let result = [...rentals];

    // Filter by destination search text
    if (loc) {
      const query = loc.toLowerCase();
      result = result.filter(r => 
        r.location.toLowerCase().includes(query) || 
        r.title.toLowerCase().includes(query)
      );
    }

    // Filter by category ribbon
    if (cat && cat !== 'All') {
      result = result.filter(r => r.type.toLowerCase() === cat.toLowerCase());
    }

    // Filter by terms parameter
    if (lease && lease !== 'All') {
      if (lease === 'Single') {
        result = result.filter(r => Number(r.beds) <= 1);
      } else if (lease === 'Shared') {
        result = result.filter(r => Number(r.beds) === 2);
      } else if (lease === 'Family') {
        result = result.filter(r => Number(r.beds) >= 3);
      }
    }

    setFilteredRentals(result);
  };

  const handleCategoryClick = (category: string) => {
    const nextCat = activeCategory === category ? 'All' : category;
    setActiveCategory(nextCat);
    applyFilters(searchLocation, nextCat, leaseType);
  };

  return (
    <div className="pr-section">
      {/* Lease Hero */}
      <section className="pr-hero">
        <div>
          <div className="pr-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('hero.kicker', 'EASY_LEASING_PROTOCOL_V8')}</div>
          <h1 className="pr-heading-xl">
            {useThemeContent('hero.title', 'Rent Your \nNext Home \nwith Ease.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('hero.highlight', 'with Ease.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span style={{ color: 'var(--pr-mint)' }}>{highlight}</span>}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    line
                  )}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: 'var(--pr-text-muted)', lineHeight: 1.8, maxWidth: '540px' }}>
            {useThemeContent('hero.description', 'A high-fidelity rental protocol designed for modern residential nodes. Certified properties, digital instant leases, and automated utility routing nodes.')}
          </p>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }} className="pr-hero-buttons">
            <button 
              className="pr-btn-primary" 
              id="pr-btn-discover" 
              onClick={() => document.getElementById('pr-discovery-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {useThemeContent('hero.primary_cta_label', 'Find a Rental')}
            </button>
            <button style={{ 
                background: 'transparent', 
                border: '2px solid var(--pr-slate)', 
                color: 'var(--pr-slate)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '100px', 
                fontWeight: 800, 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="pr-btn-list" onClick={() => alert('List your residential node pipeline. Developer console active.')}>
                {useThemeContent('hero.secondary_cta_label', 'List Unit')}
            </button>
          </div>
        </div>
        
        <div className="pr-hero-image-wrapper">
          <img src={useThemeMedia('hero.image', '/themes/properties/rental/7.webp')} alt="High Fidelity Modern Living Concept" className="pr-hero-image" />
          
          <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--pr-border)' }} className="pr-badge-floater">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00d1ff', animation: 'pulse 2s infinite' }}></div>
                  <div className="pr-mono" style={{ fontSize: '0.65rem', color: 'var(--pr-slate)' }}>
                    {loading ? "SEARCHING NODE REGISTRY..." : `${filteredRentals.length} ${useThemeContent('hero.active_units_suffix', 'RENTALS ACTIVE')}`}
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* Stateful Calendar & Guest Selector Booking Search Panel */}
      <section style={{ marginTop: '4rem', marginBottom: '8rem' }}>
        <form onSubmit={handleSearchSubmit} className="pr-booking-widget" aria-label="Properties Search Panel">
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-search-loc">Destination Location</label>
            <input 
              id="pr-search-loc"
              type="text" 
              placeholder="e.g. Downtown Core, West End" 
              className="pr-booking-input"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkin">Check In Date</label>
            <input 
              id="pr-checkin"
              type="date" 
              className="pr-booking-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkout">Check Out Date</label>
            <input 
              id="pr-checkout"
              type="date" 
              className="pr-booking-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-guests-selector">Lease Terms</label>
            <select 
              id="pr-guests-selector"
              className="pr-booking-input"
              value={leaseType}
              onChange={(e) => {
                setLeaseType(e.target.value);
                applyFilters(searchLocation, activeCategory, e.target.value);
              }}
            >
              <option value="All">All Lease Profiles</option>
              <option value="Single">Single Tenant (1 BD)</option>
              <option value="Shared">Shared Lease (2 BD)</option>
              <option value="Family">Family Lease (3+ BD)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="pr-btn-primary" 
            style={{ 
              gridColumn: 'span 4', 
              marginTop: '1rem', 
              padding: '1.5rem', 
              borderRadius: '16px',
              fontSize: '1rem' 
            }}
            id="pr-booking-submit"
          >
            ⚡ Synchronize Rental Search
          </button>
        </form>
      </section>

      {/* Offline Resilience Diagnostics Panel */}
      {useFallback && apiError && (
        <div style={{
          background: '#0f172a',
          border: '1px dashed #00d1ff',
          borderLeft: '4px solid #00d1ff',
          padding: '2.5rem',
          borderRadius: '24px',
          marginBottom: '6rem',
          boxShadow: 'var(--pr-shadow-lg)',
          color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ff5a5f',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }}></span>
            <span className="pr-mono" style={{ color: '#00d1ff', fontSize: '0.75rem' }}>
              DATABASE_OFFLINE_DIAGNOSTICS_TRACE
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.5px' }}>
              Rental Registry Offline // Engaging Local Backup
            </h3>
            <p style={{ color: 'var(--pr-text-muted)', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.8' }}>
              A connection exception was encountered while querying the live Sellio database server node. We have loaded high-fidelity local catalog backups to guarantee uninterrupted residential discovery.
            </p>
          </div>
          <div style={{
            background: 'rgba(0, 209, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#00d1ff',
            borderLeft: '2px solid #00d1ff',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            Traceback Exception details: {apiError}
          </div>
        </div>
      )}

      {/* Trust Metrics Section */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }} className="pr-hero">
          <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '2.5rem', lineHeight: 1.1, color: 'var(--pr-slate)' }}>
                {useThemeContent('protocol.title', 'Digital First \nLease Protocols.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--pr-text-muted)', lineHeight: 1.8 }}>
                  {useThemeContent('protocol.description', 'Our property leasing vertical is engineered from scratch for high-fidelity compliance. From immersive virtual galleries to automated cryptographic lease signing nodes, we have removed the friction from securing residential nodes.')}
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="pr-stats-grid">
              <TrustMetrics value={useThemeContent('protocol.stat_1_value', '100%')} label={useThemeContent('protocol.stat_1_label', 'DIGITAL_LEASES')} />
              <TrustMetrics value={useThemeContent('protocol.stat_2_value', '24h')} label={useThemeContent('protocol.stat_2_label', 'MAINTENANCE_SLA')} />
              <TrustMetrics value={useThemeContent('protocol.stat_3_value', 'Instant')} label={useThemeContent('protocol.stat_3_label', 'APPROVAL_SYNC')} />
              <TrustMetrics value={useThemeContent('protocol.stat_4_value', 'Verified')} label={useThemeContent('protocol.stat_4_label', 'NODE_STATUS')} />
          </div>
      </section>

      {/* Navigation Filter Selector */}
      <div style={{ background: 'var(--pr-white)', padding: '2rem', borderRadius: '100px', border: '1px solid var(--pr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }} className="pr-filter-bar">
          <div style={{ display: 'flex', gap: '3rem', paddingLeft: '1.5rem', overflowX: 'auto' }} className="pr-filter-links">
              {['Studio', 'Apartment', 'Loft', 'Penthouse', 'Townhouse'].map(type => (
                  <span 
                    key={type} 
                    className="pr-mono" 
                    style={{ 
                      color: activeCategory === type ? 'var(--pr-mint)' : 'var(--pr-text-muted)', 
                      cursor: 'pointer', 
                      fontWeight: 800,
                      borderBottom: activeCategory === type ? '2px solid var(--pr-mint)' : 'none',
                      paddingBottom: '4px'
                    }} 
                    onClick={() => handleCategoryClick(type)}
                  >
                    {type}
                  </span>
              ))}
          </div>
          <div style={{ color: 'var(--pr-mint)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', paddingRight: '1.5rem' }} className="pr-mono" onClick={() => {
            setActiveCategory('All');
            setLeaseType('All');
            setSearchLocation('');
            setFilteredRentals(rentals);
          }}>
            RESET_FILTERS ⌄
          </div>
      </div>

      {/* Rent Grid */}
      <section id="pr-discovery-grid">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>{useThemeContent('grid.title', 'Featured Certified Properties')}</h2>
        <p style={{ color: 'var(--pr-text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>{useThemeContent('grid.description', 'Siloed verified residential units matching active Elite standards.')}</p>
        
        {loading ? (
          <div className="pr-rent-grid">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="pr-rent-card" 
                style={{ 
                  height: '520px', 
                  opacity: 0.6, 
                  background: 'var(--pr-white)',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }} 
              />
            ))}
          </div>
        ) : filteredRentals.length > 0 ? (
          <div className="pr-rent-grid">
            {filteredRentals.map((r, i) => (
              <LeaseUnitCard 
                key={i} 
                {...r} 
                onClick={() => router.push(getThemeLink(`/product/${r.slug}`))}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px dashed var(--pr-border)', borderRadius: '24px', background: 'var(--pr-white)' }}>
            <h4 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--pr-slate)' }}>No Rental Nodes Found</h4>
            <p style={{ color: 'var(--pr-text-muted)', fontSize: '0.95rem' }}>Adjust your parameters or reset filters to sync fresh residential nodes.</p>
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '12rem', padding: '8rem 4rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #fff 100%)', borderRadius: '48px', border: '1px solid var(--pr-border)', textAlign: 'center', boxShadow: 'var(--pr-shadow-lg)' }} className="pr-cta-box">
          <div className="pr-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('cta.kicker', 'AUTHORIZE_NEW_RESIDENCE')}</div>
          <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', color: 'var(--pr-slate)', lineHeight: 1.1 }}>
            {useThemeContent('cta.title', 'Ready to \nMove In?').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 5rem', color: 'var(--pr-text-muted)', fontSize: '1.2rem', lineHeight: 1.8 }}>
              {useThemeContent('cta.description', 'Join thousands of verified tenants utilizing the Sellio platform for securing residential properties with absolute transparency.')}
          </p>
          <button 
            className="pr-btn-primary" 
            style={{ padding: '2rem 7rem', fontSize: '1.15rem' }} 
            id="pr-btn-cta-auth" 
            onClick={() => document.getElementById('pr-discovery-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
              {useThemeContent('cta.button_label', 'EXPLORE AVAILABLE UNITS')}
          </button>
      </section>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
      `}} />
    </div>
  );
}
