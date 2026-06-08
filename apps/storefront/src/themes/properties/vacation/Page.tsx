'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { RetreatBentoCard, ExperienceStats } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

interface VacationItem {
  id: number;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  rating: string;
  image: string;
  slug: string;
  category: string;
}

const FALLBACK_RETREATS: VacationItem[] = [
  { id: 1, title: "Azure Bay Villa", location: "Amalfi Coast, Italy", price: "$1,200", numericPrice: 1200, rating: "4.95", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600", slug: "azure-bay-villa", category: "Villa" },
  { id: 2, title: "Nordic Glass Cabin", location: "Lofoten, Norway", price: "$850", numericPrice: 850, rating: "4.88", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "nordic-glass-cabin", category: "Cabin" },
  { id: 3, title: "Santorini Heights", location: "Oia, Greece", price: "$1,500", numericPrice: 1500, rating: "4.99", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600", slug: "santorini-heights", category: "Heights" },
  { id: 4, title: "Bamboo Zen Estate", location: "Bali, Indonesia", price: "$450", numericPrice: 450, rating: "4.92", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "bamboo-zen-estate", category: "Estate" },
  { id: 5, title: "Alpine Chalet v2", location: "Zermatt, Switzerland", price: "$980", numericPrice: 980, rating: "4.85", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600", slug: "alpine-chalet", category: "Chalet" },
  { id: 6, title: "Desert Mirror House", location: "Joshua Tree, USA", price: "$1,100", numericPrice: 1100, rating: "4.97", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600", slug: "desert-mirror-house", category: "Villa" },
];

const translateProperty = (rawItem: Property): VacationItem => {
  const item = rawItem as any;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const numericPrice = Number(item.pricing?.base_price) || 850;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const loc = item.city || item.location?.title || 'Amalfi Coast, Italy';
  const ratingStr = (4.80 + (item.id * 3) % 20 / 100).toFixed(2);
  
  // Categorization
  let category = "Retreat";
  if (item.title.toLowerCase().includes('villa')) category = "Villa";
  else if (item.title.toLowerCase().includes('cabin')) category = "Cabin";
  else if (item.title.toLowerCase().includes('estate') || item.title.toLowerCase().includes('zen')) category = "Estate";
  else if (item.title.toLowerCase().includes('chalet') || item.title.toLowerCase().includes('alpine')) category = "Chalet";
  else if (item.title.toLowerCase().includes('heights') || item.title.toLowerCase().includes('view')) category = "Heights";
  
  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600"
  ];
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];

  return {
    id: item.id,
    title: item.title,
    location: loc,
    price: priceStr,
    numericPrice,
    rating: ratingStr,
    image: mainImage,
    slug: generatedSlug,
    category
  };
};

const ShimmerCard = () => (
  <div className="pv-retreat-card pv-shimmer-pulse" style={{ border: '1px solid var(--pv-border)', borderRadius: 'var(--pv-radius)', overflow: 'hidden' }}>
    <div style={{ aspectRatio: '4/5', backgroundColor: '#e2e8f0' }}></div>
    <div style={{ padding: '3rem' }}>
      <div style={{ height: '14px', backgroundColor: '#e2e8f0', width: '40%', marginBottom: '1rem', borderRadius: '4px' }}></div>
      <div style={{ height: '30px', backgroundColor: '#e2e8f0', width: '80%', marginBottom: '0.75rem', borderRadius: '6px' }}></div>
      <div style={{ height: '18px', backgroundColor: '#e2e8f0', width: '50%', marginBottom: '2.5rem', borderRadius: '4px' }}></div>
      <div style={{ height: '24px', backgroundColor: '#e2e8f0', width: '35%', borderRadius: '4px' }}></div>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();
  const adminCreatePropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;

  const [retreats, setRetreats] = useState<VacationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Deduplicated ribbons
  const [categoryList, setCategoryList] = useState<string[]>([]);

  // Search HUD filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const fetchRetreats = async () => {
      setLoading(true);
      try {
        const response = await api.getProperties({ per_page: 20 });
        if (response && response.data && response.data.length > 0) {
          const mapped = response.data.map(translateProperty);
          setRetreats(mapped);
          
          // Deduplicate categories list
          const categories = Array.from(new Set(mapped.map(r => r.category).filter(Boolean)));
          setCategoryList(categories);
          setUseFallback(false);
        } else {
          console.warn("Properties Vacation database empty. Engaging local backups.");
          loadFallbacks();
        }
      } catch (err: any) {
        console.error("Properties Vacation database exception caught:", err);
        setErrorTrace(err.stack || err.message || String(err));
        loadFallbacks();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbacks = () => {
      setRetreats(FALLBACK_RETREATS);
      setCategoryList(Array.from(new Set(FALLBACK_RETREATS.map(r => r.category))));
      setUseFallback(true);
    };

    fetchRetreats();
  }, []);

  // Filter logic
  const filteredRetreats = retreats.filter(r => {
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && r.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    
    if (priceRange) {
      if (priceRange === 'under-500' && r.numericPrice >= 500) return false;
      if (priceRange === '500-1000' && (r.numericPrice < 500 || r.numericPrice > 1000)) return false;
      if (priceRange === '1000-plus' && r.numericPrice < 1000) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCheckInDate('');
    setCheckOutDate('');
    setPriceRange('');
  };

  return (
    <div className="pv-section">
      {/* Escape Hero */}
      <section className="pv-hero" aria-labelledby="pv-hero-title">
        <div className="pv-hero-tag">
          <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('hero.kicker', 'GLOBAL_ESCAPE_REGISTRY_V8')}</div>
          <h1 className="pv-heading-xl" id="pv-hero-title">
            {useThemeContent('hero.title', 'Find Your \nInfinite \nHorizon.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('hero.highlight', 'Horizon.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span className="pv-italic" style={{ color: 'var(--pv-azure)' }}>{highlight}</span>}
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
        </div>
        <p style={{ marginTop: '3rem', fontSize: '1.4rem', color: 'var(--pv-text-muted)', lineHeight: 1.8, maxWidth: '700px', margin: '3rem auto' }}>
            {useThemeContent('hero.description', "A curated collection of the world's most significant vacation retreats. Authenticated by our local nodes, enjoyed by global travelers.")}
        </p>
      </section>

      {/* Trust bar / Advanced Filter HUD console */}
      <section style={{ backgroundColor: 'white', border: '1px solid var(--pv-border)', padding: '2rem 3rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', marginTop: '-4rem', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1.5', minWidth: '220px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Where to?</label>
          <input 
            type="text" 
            placeholder="Search Amalfi, Lofoten, Zermatt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.25rem', border: '1px solid var(--pv-border)', borderRadius: '100px', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Check In</label>
          <input 
            type="date" 
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1.25rem', border: '1px solid var(--pv-border)', borderRadius: '100px', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Check Out</label>
          <input 
            type="date" 
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1.25rem', border: '1px solid var(--pv-border)', borderRadius: '100px', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Budget / Night</label>
          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.25rem', border: '1px solid var(--pv-border)', borderRadius: '100px', outline: 'none', backgroundColor: '#fff', fontSize: '0.9rem' }}
          >
            <option value="">All Budgets</option>
            <option value="under-500">Under $500/night</option>
            <option value="500-1000">$500 - $1,000/night</option>
            <option value="1000-plus">$1,000+/night</option>
          </select>
        </div>

        {(searchQuery || selectedCategory || checkInDate || checkOutDate || priceRange) && (
          <button 
            onClick={clearFilters}
            style={{ padding: '0.85rem 2rem', background: 'none', border: '2px solid var(--pv-coral)', color: 'var(--pv-coral)', fontWeight: 800, borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            Reset
          </button>
        )}
      </section>

      {/* Trust bar */}
      <section className="pv-trust-bar" aria-label="Trust and Protocol Indicators" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          {useThemeContent('trust.items', '100%_AUTHENTICATED|NO_PROTOCOL_FEES|LOCAL_NODE_SUPPORT|CRYPTO_SYNC_ENABLED').split('|').map(trust => (
              <div key={trust} className="pv-mono" style={{ fontSize: '0.65rem', color: 'var(--pv-ink)', opacity: 0.6 }}>{trust}</div>
          ))}
      </section>

      {/* Diagnostics resilience reporting console */}
      {useFallback && errorTrace && (
        <div style={{ margin: '0 0 5rem 0', padding: '2rem', backgroundColor: '#fff8f8', border: '2px dashed var(--pv-coral)', borderRadius: '24px' }}>
          <h4 style={{ color: 'var(--pv-coral)', margin: '0 0 0.5rem 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--pv-font-serif)', fontSize: '1.4rem' }}>
            <span>⚠️</span> Escapes Node Offline - Diagnostics Trace Active
          </h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--pv-text-muted)', lineHeight: 1.6 }}>
            API exception caught on getaway server node query. Access local diagnostics log traceback:
          </p>
          <pre style={{ margin: 0, padding: '1.5rem', backgroundColor: 'var(--pv-ink)', color: '#f8fafc', borderRadius: '12px', fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.5 }}>
            {errorTrace}
          </pre>
        </div>
      )}

      {/* Retreat Grid Catalog */}
      <section id="pv-registry-grid" aria-labelledby="pv-grid-title" style={{ marginTop: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '3rem' }}>
              <div>
                  <div className="pv-mono" style={{ marginBottom: '1.5rem' }}>{useThemeContent('grid.kicker', 'CURATED_COLLECTION')}</div>
                  <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pv-ink)', margin: 0 }} id="pv-grid-title">
                    {useThemeContent('grid.title', 'The \nRetreats.').split('\n').map((line, i, arr) => {
                      const highlight = useThemeContent('grid.highlight', 'Retreats.');
                      const hasHighlight = line.includes(highlight);
                      return (
                        <React.Fragment key={i}>
                          {hasHighlight ? (
                            <>
                              {line.split(highlight).map((part, pIdx, pArr) => (
                                <React.Fragment key={pIdx}>
                                  {part}
                                  {pIdx < pArr.length - 1 && <span className="pv-italic">{highlight}</span>}
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
                  </h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '1rem', color: 'var(--pv-text-muted)', lineHeight: 1.8 }}>
                  {useThemeContent('grid.description', 'Every property in our vacation vertical is manually verified by a local node expert to validate the vibe and view.')}
              </div>
          </div>

          {/* Category Pill Ribbon selection */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem', borderBottom: '1px solid var(--pv-border)', paddingBottom: '1.5rem' }} className="pv-category-ribbon">
            <button 
              onClick={() => setSelectedCategory('')}
              className="pv-mono"
              style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--pv-border)', borderRadius: '100px', background: !selectedCategory ? 'var(--pv-azure)' : 'transparent', color: !selectedCategory ? 'white' : 'var(--pv-text-muted)', cursor: 'pointer', fontWeight: 800, transition: 'all 0.3s ease' }}
            >
              All Nearby Retreats
            </button>
            {categoryList.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="pv-mono"
                style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--pv-border)', borderRadius: '100px', background: selectedCategory === cat ? 'var(--pv-azure)' : 'transparent', color: selectedCategory === cat ? 'white' : 'var(--pv-text-muted)', cursor: 'pointer', fontWeight: 800, transition: 'all 0.3s ease' }}
              >
                {cat}s
              </button>
            ))}
          </div>

          {loading ? (
            <div className="pv-retreat-grid">
              {[...Array(6)].map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : filteredRetreats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', backgroundColor: 'var(--pv-cloud)', borderRadius: 'var(--pv-radius)', border: '1px solid var(--pv-border)' }}>
              <span style={{ fontSize: '3.5rem' }}>🏝️</span>
              <h3 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '2rem', color: 'var(--pv-ink)', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 900 }}>No Retreats Found</h3>
              <p style={{ color: 'var(--pv-text-muted)', margin: '0 0 2rem 0' }}>We couldn't find any premium getaway retreats matching your filters.</p>
              <button onClick={clearFilters} className="pv-btn-primary">Clear Filter refinement</button>
            </div>
          ) : (
            <div className="pv-retreat-grid">
              {filteredRetreats.map((retreat) => (
                <RetreatBentoCard 
                  key={retreat.id} 
                  {...retreat} 
                  onClick={() => router.push(themeLink(`/product/${retreat.slug}`))}
                />
              ))}
            </div>
          )}
      </section>

      {/* Philosophy / Value Prop */}
      <section style={{ marginTop: '12rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8rem', alignItems: 'center' }} className="pv-philosophy-grid" aria-labelledby="pv-phil-title">
          <div>
              <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('philosophy.kicker', 'THE_GETAWAY_PROTOCOL')}</div>
              <h2 className="pv-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '4rem', color: 'var(--pv-ink)' }} id="pv-phil-title">
                {useThemeContent('philosophy.title', 'The Art of \nthe \nEscape.').split('\n').map((line, i, arr) => {
                  const highlight = useThemeContent('philosophy.highlight', 'Escape.');
                  const hasHighlight = line.includes(highlight);
                  return (
                    <React.Fragment key={i}>
                      {hasHighlight ? (
                        <>
                          {line.split(highlight).map((part, pIdx, pArr) => (
                            <React.Fragment key={pIdx}>
                              {part}
                              {pIdx < pArr.length - 1 && <span className="pv-italic" style={{ color: 'var(--pv-coral)' }}>{highlight}</span>}
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
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pv-text-muted)', lineHeight: 2, marginBottom: '6rem' }}>
                  {useThemeContent('philosophy.description', 'We do not just check the amenities; we validate the architectural integrity and local significance of every vacation node.')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="pv-stats-grid">
                  <ExperienceStats value={useThemeContent('philosophy.stat_1_value', '1,200+')} label={useThemeContent('philosophy.stat_1_label', 'VERIFIED_NODES')} />
                  <ExperienceStats value={useThemeContent('philosophy.stat_2_value', '48h')} label={useThemeContent('philosophy.stat_2_label', 'AVG_RESPONSE')} />
              </div>
          </div>
          <div style={{ position: 'relative' }} className="pv-phil-img-wrapper">
              <div style={{ height: '700px', background: 'var(--pv-cloud)', borderRadius: 'var(--pv-radius)', overflow: 'hidden', padding: '1.5rem', border: '1px solid var(--pv-border)' }} className="pv-phil-img-container">
                <img 
                  src={useThemeMedia('philosophy.image', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600')} 
                  alt="Coastal Getaway Horizon Framework" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} 
                />
              </div>
              <div style={{ 
                  position: 'absolute', 
                  top: '-3rem', 
                  right: '-3rem', 
                  background: 'var(--pv-azure)', 
                  color: 'white', 
                  width: '220px', 
                  height: '220px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center', 
                  padding: '2rem', 
                  fontWeight: 800, 
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  boxShadow: '0 15px 30px rgba(0, 119, 255, 0.2)'
              }} className="pv-floating-badge">
                  {useThemeContent('philosophy.badge_label', 'AUTHENTICATED LOCAL RETREAT')}
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '12rem', padding: '10rem 4rem', textAlign: 'center', background: 'linear-gradient(to top, #f0f7ff, #fff)', borderRadius: 'var(--pv-radius) var(--pv-radius) 0 0', border: '1px solid var(--pv-border)' }} className="pv-cta-box" aria-labelledby="pv-cta-title">
          <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, marginBottom: '5rem', letterSpacing: '-3px', lineHeight: 1.1, color: 'var(--pv-ink)' }} id="pv-cta-title">
            {useThemeContent('cta.title', 'Your Next Escape \nis \nOne Click Away.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('cta.highlight', 'One Click Away.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span className="pv-italic" style={{ color: 'var(--pv-coral)' }}>{highlight}</span>}
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
          </h2>
          <button className="pv-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.35rem' }} id="pv-btn-cta-auth" onClick={() => document.getElementById('pv-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              {useThemeContent('cta.button_label', 'SECURE YOUR RETREAT')}
          </button>
      </section>
    </div>
  );
}
