'use client';
 
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { AssetRegistryCard, IntelligenceHUD } from './components';
import { scrollToSection } from '@/themes/properties/shared/property-utils';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
 
const HERO_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
 
const FALLBACK_ASSETS = [
  { id: 'ASSET-9921', rawId: 1, title: 'One Skyline Plaza', type: 'PRIME_OFFICE', area: '142,000 SQFT', status: 'AVAILABLE', slug: 'one-skyline-plaza', location: 'New York, NY', description: 'Class-A office tower in the Downtown Core. Features premium steel framing, high-density networking infrastructure, and private rooftop access.' },
  { id: 'ASSET-4412', rawId: 2, title: 'TechPark Hub', type: 'MIXED_USE', area: '85,000 SQFT', status: 'LEASING', slug: 'techpark-hub', location: 'San Francisco, CA', description: 'Modern engineering campus with modular open floors, advanced connectivity infrastructure, and collaborative courtyard spaces.' },
  { id: 'ASSET-1022', rawId: 3, title: 'Portside Logistics Center', type: 'INDUSTRIAL', area: '250,000 SQFT', status: 'AVAILABLE', slug: 'portside-logistics-center', location: 'Houston, TX', description: 'Premium class-A logistics facility with automated bay entries, 36-foot clearance ceilings, and robust transport access.' },
  { id: 'ASSET-3381', rawId: 4, title: 'The Atrium HQ', type: 'OFFICE_CAMPUS', area: '110,000 SQFT', status: 'OCCUPIED', slug: 'the-atrium-hq', location: 'Seattle, WA', description: 'Suburban business headquarters with triple-pane energy glass facades, a botanical atrium, and underground EV charging facilities.' },
  { id: 'ASSET-7756', rawId: 5, title: 'Westside Retail Mall', type: 'RETAIL_CENTER', area: '200,000 SQFT', status: 'AVAILABLE', slug: 'westside-retail-mall', location: 'Los Angeles, CA', description: 'Premier lifestyle center with high foot traffic, state-of-the-art visual merchandising areas, and versatile commercial zoning.' },
  { id: 'ASSET-8821', rawId: 6, title: 'DataVault Station', type: 'DATA_CENTER', area: '45,000 SQFT', status: 'PRIVATE_SALE', slug: 'datavault-station', location: 'Ashburn, VA', description: 'Tier-IV mission-critical data center with modular cooling towers, redundant generator systems, and biometric security.' },
];
 
export default function Page() {
  const themeLink = usePropertyThemeLink();
  const adminCreatePropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;
  const [assets, setAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
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
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464938050520-502b4763c533?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80',
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
      area,
      status,
      image: img,
      description: p.description || p.short_description || 'Commercial property with state-of-the-art systems and full zoning compliance.',
    };
  };
 
  const fetchLiveAssets = async () => {
    setLoading(true);
    try {
      const response = await api.getProperties({ per_page: 20 });
 
      if (response && response.data && response.data.length > 0) {
        const translated = response.data.map((p: any) => translateProperty(p));
        setAssets(translated);
        setFilteredAssets(translated);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError('Database returned no listings. Seeders might be empty.');
        triggerLocalFallbacks();
      }
    } catch (error) {
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
 
  const applyFilters = (query: string, type: string, status: string) => {
    let result = [...assets];
 
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((a) =>
        a.title.toLowerCase().includes(q)
        || a.location?.toLowerCase().includes(q)
        || a.type.toLowerCase().replace('_', ' ').includes(q),
      );
    }
 
    if (type !== 'ALL') {
      result = result.filter((a) => a.type === type);
    }
 
    if (status !== 'ALL') {
      result = result.filter((a) => a.status === status);
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
 
  const heroImage = useThemeMedia('hero.image', HERO_IMAGE);
 
  return (
    <div className="pc-page">
      <section className="pc-hero" id="pc-hero-section">
        <div className="pc-hero-copy">
          <div className="pc-mono pc-hero-kicker">{useThemeContent('hero.kicker', 'Commercial Real Estate')}</div>
          <h1 className="pc-heading-xl">
            {useThemeContent('hero.title', 'Market \nTransparency \nEngineered.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('hero.highlight', 'Engineered.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span className="pc-hero-accent">{highlight}</span>}
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
          <p className="pc-hero-description">
            {useThemeContent('hero.description', 'Browse verified commercial real estate assets including office, retail, industrial, and mixed-use properties available globally.')}
          </p>
 
          <div className="pc-hero-stats">
            <div className="pc-hero-stat-value">{useThemeContent('hero.stat_value', '$1.4B')}</div>
            <div className="pc-mono pc-hero-stat-label">{useThemeContent('hero.stat_label', 'Quarterly Turnover')}</div>
          </div>
 
          <div className="pc-hero-actions">
            <button type="button" className="pc-btn-primary" onClick={() => scrollToSection('pc-inventory-section')}>
              {useThemeContent('hero.primary_cta_label', 'Explore Listings')}
            </button>
            <button type="button" className="pc-btn-secondary" onClick={() => scrollToSection('pc-cta-section')}>
              {useThemeContent('hero.secondary_cta_label', 'Request Appraisal')}
            </button>
          </div>
        </div>
 
        <div className="pc-hero-visual">
          <div className="pc-hero-image-frame">
            <img src={heroImage} alt="Corporate architecture skyline" className="pc-hero-image" />
          </div>
        </div>
      </section>
 
      <div className="pc-section">
        <section className="pc-intelligence-section" id="pc-intelligence-section">
          <div className="pc-intelligence-copy">
            <h2>
              {useThemeContent('intelligence.title', 'The Intelligence \nBehind the Asset.').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p>
              {useThemeContent('intelligence.description', 'Every asset undergoes multi-point verification including structural audits, zoning compliance checks, and market yield analysis.')}
            </p>
          </div>
          <div className="pc-intelligence-stats">
            <IntelligenceHUD label={useThemeContent('hud.due_diligence_label', 'Due Diligence')} value={useThemeContent('hud.due_diligence_value', '48h')} />
            <IntelligenceHUD label={useThemeContent('hud.avg_yield_label', 'Average Yield')} value={useThemeContent('hud.avg_yield_value', '12%')} />
            <IntelligenceHUD label={useThemeContent('hud.global_nodes_label', 'Active Listings')} value={loading ? '...' : String(assets.length || 142)} />
          </div>
        </section>
 
        {useFallback && apiError && (
          <div className="pc-offline-panel">
            <div className="pc-offline-header">
              <span className="pc-offline-dot" />
              <span className="pc-mono">Demo Preview</span>
            </div>
            <p>Showing sample properties — live API unavailable. Add properties in the admin panel to display live listings.</p>
          </div>
        )}
 
        <section className="pc-inventory-section" id="pc-inventory-section">
          <div className="pc-inventory-header">
            <div>
              <div className="pc-mono pc-inventory-kicker">{useThemeContent('inventory.kicker', 'Commercial Inventory')}</div>
              <h2>
                {useThemeContent('inventory.title', 'Asset \nDirectory.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <p className="pc-inventory-intro">
              {useThemeContent('inventory.description', 'Browse prime office, industrial, retail, and mixed-use assets available for acquisition or lease.')}
            </p>
          </div>
 
          <div className="pc-filter-panel">
            <div>
              <label className="pc-mono pc-filter-label" htmlFor="pc-search">{useThemeContent('filters.search_label', 'Search')}</label>
              <input
                id="pc-search"
                type="text"
                placeholder={useThemeContent('filters.search_placeholder', 'Scan by keyword or location...')}
                className="pc-search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <label className="pc-mono pc-filter-label" htmlFor="pc-type">{useThemeContent('filters.type_label', 'Asset Type')}</label>
              <select id="pc-type" className="pc-search-input pc-select" value={activeType} onChange={handleTypeChange}>
                <option value="ALL">All Types</option>
                <option value="PRIME_OFFICE">Prime Office</option>
                <option value="MIXED_USE">Mixed Use</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="OFFICE_CAMPUS">Office Campus</option>
                <option value="RETAIL_CENTER">Retail Center</option>
                <option value="DATA_CENTER">Data Center</option>
              </select>
            </div>
            <div>
              <label className="pc-mono pc-filter-label" htmlFor="pc-status">{useThemeContent('filters.status_label', 'Status')}</label>
              <select id="pc-status" className="pc-search-input pc-select" value={activeStatus} onChange={handleStatusChange}>
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="LEASING">Leasing</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="PRIVATE_SALE">Private Sale</option>
              </select>
            </div>
          </div>
 
          {loading ? (
            <div className="pc-asset-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="pc-asset-card pc-asset-skeleton" />
              ))}
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="pc-asset-grid">
              {filteredAssets.map((asset) => (
                <a key={asset.id} href={themeLink(`/product/${asset.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <AssetRegistryCard {...asset} />
                </a>
              ))}
            </div>
          ) : (
            <div className="pc-empty-state">
              <div className="pc-mono pc-empty-kicker">{useThemeContent('empty.kicker', 'No Results')}</div>
              <h4>{useThemeContent('empty.title', 'No Properties Found')}</h4>
              <p>{useThemeContent('empty.description', 'Try different filters to find matching properties.')}</p>
            </div>
          )}
        </section>
 
        <div className="pc-trust-bar">
          <span className="pc-mono pc-trust-label">{useThemeContent('trust.label', 'As Featured In')}</span>
          {['Financial Times', 'Bloomberg', 'RE Journal', 'Wall Street Post'].map((brand) => (
            <span key={brand} className="pc-mono pc-trust-brand">{brand}</span>
          ))}
        </div>
 
        <section className="pc-cta-section" id="pc-cta-section">
          <div className="pc-mono pc-cta-kicker">{useThemeContent('cta.kicker', 'Get Started')}</div>
          <h2>
            {useThemeContent('cta.title', 'Scale Your \nPortfolio.').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p>
            {useThemeContent('cta.description', 'Join over 12,000 institutional investors and family offices currently acquiring on the Sellio Commercial Network.')}
          </p>
          <button type="button" className="pc-btn-primary pc-cta-btn" onClick={() => scrollToSection('pc-inventory-section')}>
            {useThemeContent('cta.button_label', 'Request Access')}
          </button>
        </section>
      </div>
    </div>
  );
}
