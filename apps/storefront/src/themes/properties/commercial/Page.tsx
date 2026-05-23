'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { AssetRegistryCard, IntelligenceHUD } from './components';

// High-fidelity local commercial assets fallback seeds
const FALLBACK_ASSETS = [
  { id: "ASSET-9921", rawId: 1, title: "One Skyline Plaza", type: "PRIME_OFFICE", area: "142,000 SQFT", status: "AVAILABLE", slug: "one-skyline-plaza", location: "New York, NY", description: "Authoritative architectural node in the Downtown Core. Features premium steel framing, high-density server vaults, and private rooftop logistics helipads." },
  { id: "ASSET-4412", rawId: 2, title: "TechPark Hub", type: "MIXED_USE", area: "85,000 SQFT", status: "LEASING", slug: "techpark-hub", location: "San Francisco, CA", description: "Bespoke engineering incubator configured with modular open floors, advanced fiber optical routing hubs, and collaborative courtyard specifications." },
  { id: "ASSET-1022", rawId: 3, title: "Portside Logistics Center", type: "INDUSTRIAL", area: "250,000 SQFT", status: "AVAILABLE", slug: "portside-logistics-center", location: "Houston, TX", description: "Premium class-A global distribution hub boasting automated bay entries, 36-foot clearance ceilings, and robust intermodal transport routing protocols." },
  { id: "ASSET-3381", rawId: 4, title: "The Atrium HQ", type: "OFFICE_CAMPUS", area: "110,000 SQFT", status: "OCCUPIED", slug: "the-atrium-hq", location: "Seattle, WA", description: "High-yield suburban business headquarters enveloped by triple-pane energy glass facades, custom botanical atrium lungs, and subterranean EV storage clusters." },
  { id: "ASSET-7756", rawId: 5, title: "Westside Retail Mall", type: "RETAIL_CENTER", area: "200,000 SQFT", status: "AVAILABLE", slug: "westside-retail-mall", location: "Los Angeles, CA", description: "Premier lifestyle center with high foot-traffic indices, state-of-the-art visual staging arenas, and versatile commercial zoning permits." },
  { id: "ASSET-8821", rawId: 6, title: "DataVault Station", type: "DATA_CENTER", area: "45,000 SQFT", status: "PRIVATE_SALE", slug: "datavault-station", location: "Ashburn, VA", description: "Tier-IV mission-critical secure vault node configured with modular cooling towers, secondary generator backups, and biometric security boundaries." },
];

export default function Page() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const translateProperty = (p: any) => {
    const rawPrice = p.price || 14000000;
    const formattedPrice = p.price_formatted || `$${(rawPrice / 1000000).toFixed(1)}M`;
    
    let loc = 'Downtown Core';
    if (p.location) {
      if (typeof p.location === 'object') {
        loc = p.location.title || (p.location.city ? `${p.location.city}, ${p.location.state || p.location.country || ''}` : 'Downtown Core');
      } else {
        loc = String(p.location);
      }
    } else if (p.city || p.address) {
      loc = p.city || p.address;
    }

    const area = p.specs?.area_formatted || (p.area_sq_ft ? `${p.area_sq_ft.toLocaleString()} SQFT` : `${142000 + (p.id % 5) * 20000} SQFT`);
    
    let status = 'AVAILABLE';
    if (p.status) {
      let rawStatus = '';
      if (typeof p.status === 'object') {
        rawStatus = (p.status.label || p.status.name || '').toUpperCase();
      } else {
        rawStatus = String(p.status).toUpperCase();
      }

      if (rawStatus.includes('RENT') || rawStatus.includes('LEAS') || rawStatus === 'RENTAL') {
        status = 'LEASING';
      } else if (rawStatus.includes('SALE') || rawStatus.includes('BUY') || rawStatus === 'AVAILABLE') {
        status = 'AVAILABLE';
      } else if (rawStatus.includes('OCCUP') || rawStatus === 'OCCUPIED') {
        status = 'OCCUPIED';
      } else {
        status = 'PRIVATE_SALE';
      }
    } else {
      status = p.id % 3 === 0 ? 'LEASING' : p.id % 3 === 1 ? 'OCCUPIED' : 'AVAILABLE';
    }

    const assetId = `ASSET-${p.id + 9900}`;
    
    let categoryTitle = 'Prime Office';
    if (p.category) {
      if (typeof p.category === 'object') {
        categoryTitle = p.category.title || p.category.name || 'Prime Office';
      } else {
        categoryTitle = String(p.category);
      }
    }
    
    let typeToken = categoryTitle.toUpperCase().replace(/\s+/g, '_');
    const allowedTypes = ['PRIME_OFFICE', 'MIXED_USE', 'INDUSTRIAL', 'OFFICE_CAMPUS', 'RETAIL_CENTER', 'DATA_CENTER'];
    if (!allowedTypes.includes(typeToken)) {
      typeToken = allowedTypes[p.id % allowedTypes.length];
    }
    
    const rawId = typeof p.id === 'number' ? p.id : (p.rawId || parseInt(String(p.id).replace(/[^\d]/g, '')) || 1);
    let img = p.featured_image || (p.media?.main_photo || p.image);
    if (!img) {
      const unsplashImages = [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464938050520-502b4763c533?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80"
      ];
      img = unsplashImages[rawId % unsplashImages.length];
    }

    return {
      id: assetId,
      rawId: p.id,
      title: p.title,
      slug: p.slug || `property-${p.id}`,
      price: formattedPrice,
      base_price: rawPrice,
      type: typeToken,
      location: loc,
      area: area,
      status: status,
      image: img,
      description: p.description || p.short_description || `High-fidelity institutional-grade commercial asset with state-of-the-art HVAC systems and zoning compliance.`
    };
  };

  const fetchLiveAssets = async () => {
    setLoading(true);
    try {
      const response = await api.getProperties({ per_page: 20 });
      console.log("Properties Commercial: Live registry node response:", response);
      
      if (response && response.data && response.data.length > 0) {
        const translated = response.data.map((p: any) => translateProperty(p));
        setAssets(translated);
        setFilteredAssets(translated);
        setUseFallback(false);
        setApiError(null);
      } else {
        console.warn("Properties Commercial: Live registry returned empty nodes. Using backups.");
        setApiError("Database returned no listings. Seeders might be empty.");
        triggerLocalFallbacks();
      }
    } catch (error) {
      console.error("Properties Commercial: Connection failure to API server. Engaging backups.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerLocalFallbacks();
    } finally {
      setLoading(false);
    }
  };

  const triggerLocalFallbacks = () => {
    setUseFallback(true);
    setAssets(FALLBACK_ASSETS);
    setFilteredAssets(FALLBACK_ASSETS);
  };

  useEffect(() => {
    fetchLiveAssets();
  }, []);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/properties_commercial${path}`;
      }
    }
    return path;
  };

  // Stateful filtering modifications
  const applyFilters = (query: string, type: string, status: string) => {
    let result = [...assets];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.location?.toLowerCase().includes(q) ||
        a.type.toLowerCase().replace('_', ' ').includes(q)
      );
    }

    if (type !== 'ALL') {
      result = result.filter(a => a.type === type);
    }

    if (status !== 'ALL') {
      result = result.filter(a => a.status === status);
    }

    setFilteredAssets(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, activeType, activeStatus);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveType(e.target.value);
    applyFilters(searchQuery, e.target.value, activeStatus);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveStatus(e.target.value);
    applyFilters(searchQuery, activeType, e.target.value);
  };

  return (
    <div className="pc-section">
      {/* Institutional Hero */}
      <section className="pc-hero">
        <div>
          <div className="pc-mono" style={{ marginBottom: '2.5rem' }}>COMMERCIAL_REGISTRY_V8_DISTRIBUTION</div>
          <h1 className="pc-heading-xl">
            Market <br/>
            Transparency <br/>
            <span style={{ color: 'var(--pc-blue)' }}>Engineered.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--pc-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            The authoritative commercial registry providing verified yield data and direct access to institutional-grade real estate assets globally.
          </p>
          
          <div className="pc-hero-stats">
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>$1.4B</div>
              <div className="pc-mono" style={{ fontSize: '0.6rem', color: 'white', opacity: 0.6 }}>QUARTERLY_TURNOVER</div>
          </div>

          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <a href="#inventory" className="pc-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>Explore_Inventory</a>
            <button style={{ background: 'transparent', border: '2px solid var(--pc-carbon)', color: 'var(--pc-carbon)', padding: '1.5rem 4rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>Request_Appraisal</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--pc-bg)', padding: '2rem', border: '1px solid var(--pc-border)' }}>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" alt="Corporate Architecture" style={{ width: '100%', height: '700px', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.9)' }} />
          </div>
        </div>
      </section>

      {/* Intelligence HUD Section */}
      <section style={{ padding: '12rem 0', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem' }}>
                  The Intelligence <br/>Behind the Asset.
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pc-slate)', lineHeight: 2 }}>
                  Every asset in our registry undergoes a multi-point verification protocol, including structural audits, zoning compliance checks, and high-fidelity market yield analysis.
              </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <IntelligenceHUD label="DUE_DILIGENCE_SPEED" value="48h" />
              <IntelligenceHUD label="AVG_YIELD_v2026" value="12%" />
              <IntelligenceHUD label="GLOBAL_NODES" value="142" />
          </div>
      </section>

      {/* Connection Resiliency Warning Panel */}
      {useFallback && apiError && (
        <div style={{
          background: '#f8fafc',
          border: '1px dashed var(--pc-blue)',
          borderLeft: '4px solid var(--pc-blue)',
          padding: '2.5rem 3rem',
          borderRadius: '4px',
          marginBottom: '6rem',
          color: 'var(--pc-carbon)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }} className="pc-mono">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pcPulse 1.5s infinite' }}></span>
            <span style={{ color: 'var(--pc-blue)' }}>CONNECTION_OFFLINE_DIAGNOSTICS</span>
          </div>
          <p style={{ margin: 0, color: 'var(--pc-slate)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            The live Commercial registry API node threw a <code style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{apiError}</code>. Successfully initialized high-fidelity mock blueprints.
          </p>
        </div>
      )}

      {/* Asset Registry Header */}
      <section id="inventory" style={{ scrollMarginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
              <div>
                  <div className="pc-mono" style={{ marginBottom: '1.5rem' }}>INSTITUTIONAL_INVENTORY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>Asset <br/>Registry.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pc-slate)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance data from prime office, industrial, and retail assets into a single authoritative node.
              </div>
          </div>

          {/* Interactive HUD Filter Panel */}
          <div style={{
            background: 'var(--pc-bg)',
            border: '1px solid var(--pc-border)',
            padding: '2rem',
            marginBottom: '4rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '2rem',
            borderRadius: '4px'
          }}>
            <div>
              <label className="pc-mono" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.6rem', color: 'var(--pc-slate)' }}>SEARCH_QUERY</label>
              <input 
                type="text" 
                placeholder="Scan by keyword or location..." 
                className="pc-search-input"
                style={{
                  width: '100%',
                  background: 'var(--pc-white)',
                  border: '1px solid var(--pc-border)',
                  color: 'var(--pc-carbon)',
                  padding: '1rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  borderRadius: '4px',
                  fontFamily: 'inherit'
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <label className="pc-mono" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.6rem', color: 'var(--pc-slate)' }}>ASSET_CLASSIFICATION</label>
              <select 
                className="pc-search-input"
                style={{
                  width: '100%',
                  background: 'var(--pc-white)',
                  border: '1px solid var(--pc-border)',
                  color: 'var(--pc-carbon)',
                  padding: '1rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                value={activeType}
                onChange={handleTypeChange}
              >
                <option value="ALL">ALL_CLASSIFICATIONS</option>
                <option value="PRIME_OFFICE">PRIME_OFFICE</option>
                <option value="MIXED_USE">MIXED_USE</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="OFFICE_CAMPUS">OFFICE_CAMPUS</option>
                <option value="RETAIL_CENTER">RETAIL_CENTER</option>
                <option value="DATA_CENTER">DATA_CENTER</option>
              </select>
            </div>
            <div>
              <label className="pc-mono" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.6rem', color: 'var(--pc-slate)' }}>ACQUISITION_STATUS</label>
              <select 
                className="pc-search-input"
                style={{
                  width: '100%',
                  background: 'var(--pc-white)',
                  border: '1px solid var(--pc-border)',
                  color: 'var(--pc-carbon)',
                  padding: '1rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                value={activeStatus}
                onChange={handleStatusChange}
              >
                <option value="ALL">ALL_STATUSES</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="LEASING">LEASING</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="PRIVATE_SALE">PRIVATE_SALE</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            /* Pulsing Gray-Blue Skeleton Loader Grid */
            <div className="pc-asset-grid">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="pc-asset-card" 
                  style={{ 
                    height: '350px', 
                    background: 'var(--pc-bg)', 
                    borderRight: '1px solid var(--pc-border)',
                    borderBottom: '1px solid var(--pc-border)',
                    animation: 'pcShimmer 1.5s infinite ease-in-out' 
                  }} 
                />
              ))}
            </div>
          ) : filteredAssets.length > 0 ? (
            /* Converted Stateful Asset Grid */
            <div className="pc-asset-grid">
              {filteredAssets.map((asset, i) => (
                <AssetRegistryCard 
                  key={i} 
                  {...asset} 
                  onClick={() => router.push(getThemeLink(`/product/${asset.slug}`))}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '8rem 2rem', border: '1px dashed var(--pc-border)', borderRadius: '4px', background: 'var(--pc-bg)' }}>
              <div className="pc-mono" style={{ fontSize: '0.65rem', marginBottom: '1rem', color: 'var(--pc-slate)' }}>REGISTRY_RESOLVE_NULL</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--pc-carbon)' }}>No Assets Resolved</h4>
              <p style={{ color: 'var(--pc-slate)', fontSize: '0.9rem' }}>Adjust your classification or acquisition status to recheck active ledger items.</p>
            </div>
          )}
      </section>

      {/* Trust bar / Featured In */}
      <div style={{ padding: '8rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pc-border)', marginTop: '10rem' }}>
          <span className="pc-mono" style={{ color: 'var(--pc-slate)', opacity: 0.5 }}>AS_FEATURED_IN:</span>
          {['FINANCIAL_TIMES', 'BLOOMBERG', 'RE_JOURNAL', 'WALL_STREET_POST'].map(brand => (
              <span key={brand} className="pc-mono" style={{ opacity: 0.3 }}>{brand}</span>
          ))}
      </div>

      {/* Final CTA */}
      <section style={{ marginTop: '10rem', padding: '15rem 0', background: 'var(--pc-carbon)', color: 'white', textAlign: 'center' }}>
          <div className="pc-mono" style={{ color: 'var(--pc-blue)', marginBottom: '3rem' }}>INSTITUTIONAL_ACQUISITION</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', marginBottom: '4rem' }}>
              Scale Your <br/>
              Portfolio.
          </h2>
          <p style={{ maxWidth: '750px', margin: '0 auto 6rem', opacity: 0.5, fontSize: '1.25rem', lineHeight: 1.8 }}>
              Join over 12,000 institutional investors and family offices currently acquiring on the Sellio Commercial Network.
          </p>
          <button 
            className="pc-btn-primary" 
            style={{ background: 'var(--pc-blue)', padding: '2.5rem 8rem', fontSize: '1.25rem' }}
            onClick={() => {
              const el = document.getElementById('inventory');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
              Request_Institutional_Access
          </button>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pcShimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes pcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
      `}} />
    </div>
  );
}
