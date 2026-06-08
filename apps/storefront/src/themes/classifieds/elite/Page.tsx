'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import {
  getClassifiedCategoryKey,
  getClassifiedCategoryTitle,
} from '@/lib/classified-category';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { PremiumCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome, resolveClassifiedsFailure } from '@/themes/classifieds/shared/catalog';
import { ELITE_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

// Premium high-fidelity Classifieds Elite fallback listings matching ClassifiedListing schema
const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function Page() {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroSubtitle = useThemeContent('hero.subtitle', 'Vetted Global Advisory Node');
  const heroTitle = useThemeContent('hero.title', 'Curating high-value vaults for serious collectors.');
  const heroSearchPlaceholder = useThemeContent('hero.search_placeholder', 'Search by collection title, artist, country origin...');
  const heroSearchButton = useThemeContent('hero.search_button', 'Search');
  const spotlightTag = useThemeContent('spotlight.tag', 'CURATED SPOTLIGHT OF THE WEEK');
  const spotlightTitle = useThemeContent('spotlight.title', 'Featured High-Value Acquisitions');
  const catalogEyebrow = useThemeContent('catalog.eyebrow', 'Browse Curated Catalog');
  const catalogTitle = useThemeContent('catalog.title', 'Exclusive Acquisitions');
  const emptyTitle = useThemeContent('empty.title', 'No Curated Assets Match Search');
  const emptyDescription = useThemeContent('empty.description', 'Try clearing keywords or switching filter pills to display our private listings feed.');
  const emptyButton = useThemeContent('empty.clear_button', 'Clear Refinements');
  const prospectusButton = useThemeContent('quickview.prospectus_button', 'Request Prospectus memorandum');
  const inquiryButton = useThemeContent('quickview.inquiry_button', 'Inquire Concierge Vault');

  // Stateful client bindings
  const [items, setItems] = useState<ClassifiedListing[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: "all", name: "All Vaults" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Resiliency status markers
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Local Favorites
  const [favorites, setFavorites] = useState<number[]>([]);

  // Quick View Overlay modal state
  const [quickViewAsset, setQuickViewAsset] = useState<ClassifiedListing | null>(null);

  // Spotlight index state
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchEliteClassifieds = async () => {
      setLoading(true);
      const result = await fetchClassifiedsHome();

      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        setItems(result.response.data);
        setUseFallback(false);
        setApiError(null);

        if (result.response.sidebar?.categories) {
          const mappedCats = result.response.sidebar.categories.map((cat) => ({
            id: cat.slug || String(cat.id),
            name: cat.title,
          }));
          const deduplicated = [{ id: 'all', name: 'All Vaults' }];
          mappedCats.forEach((c) => {
            if (!deduplicated.some((d) => d.id === c.id)) {
              deduplicated.push(c);
            }
          });
          setCategories(deduplicated);
        } else {
          const dynamicCategories = [{ id: 'all', name: 'All Vaults' }];
          result.response.data.forEach((item) => {
            const catSlug = getClassifiedCategoryKey(item.taxonomy?.category);
            if (catSlug && !dynamicCategories.some((d) => d.id === catSlug)) {
              dynamicCategories.push({
                id: catSlug,
                name: getClassifiedCategoryTitle(item.taxonomy?.category, catSlug),
              });
            }
          });
          setCategories(dynamicCategories);
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'elite');

        if (resolution.mode === 'demo') {
          setItems(resolution.listings);
          setCategories(ELITE_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setItems([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    };

    fetchEliteClassifieds();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  // Filter listings based on category pills and search inputs
  const filteredAssets = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      getClassifiedCategoryKey(item.taxonomy?.category) === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.location?.city && item.location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.location?.state && item.location.state.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate Featured Spotlight list items from loaded assets (top 3 featured, or fallback)
  const spotlightItems = items.filter(item => item.status?.is_featured).slice(0, 3);
  const activeSpotlight = spotlightItems.length > 0 
    ? spotlightItems[spotlightIndex % spotlightItems.length] 
    : items.slice(0, 3)[spotlightIndex % Math.max(1, items.slice(0, 3).length)];

  const handleNextSpotlight = () => {
    if (!items.length) return;
    const totalSpotlights = spotlightItems.length || Math.min(3, items.length);
    setSpotlightIndex((prev) => (prev + 1) % totalSpotlights);
  };

  const handlePrevSpotlight = () => {
    if (!items.length) return;
    const totalSpotlights = spotlightItems.length || Math.min(3, items.length);
    setSpotlightIndex((prev) => (prev - 1 + totalSpotlights) % totalSpotlights);
  };

  const toggleFavoriteAsset = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fid => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleShareClick = async (title: string, channel: string) => {
    try {
      await navigator.clipboard.writeText(`${title} (${channel})`);
    } catch {
      // Clipboard API may be unavailable in some contexts; ignore quietly.
    }
  };

  // Helper translators to fit Premium theme structures
  const getAssetPrice = (item: ClassifiedListing): string => {
    return item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`;
  };

  const getAssetCategoryLabel = (item: ClassifiedListing): string => {
    const categoryKey = getClassifiedCategoryKey(item.taxonomy?.category);
    if (!categoryKey) return 'Elite Asset';
    if (categoryKey === 'motors') return 'Exotic Motors';
    if (categoryKey === 'art') return 'Fine Art Portfolio';
    if (categoryKey === 'spirits') return 'Rare Vintages';
    if (categoryKey === 'horology') return 'Luxury Horology';
    return getClassifiedCategoryTitle(item.taxonomy?.category, categoryKey);
  };

  const getAssetLocation = (item: ClassifiedListing): string => {
    if (!item.location) return 'Vetted Origin';
    return `${item.location.city || 'Geneva'}, ${item.location.state || 'Switzerland'}`;
  };

  const getAssetVaultId = (item: ClassifiedListing): string => {
    return item.item_specs?.dimensions || `VAULT_${(item.location?.city || 'GENEVA').toUpperCase()}_${item.id}`;
  };

  const getAssetGrade = (item: ClassifiedListing): string => {
    return item.item_specs?.condition_label || 'Certified Museum Grade';
  };

  return (
    <>
      {/* Corporate/Brokerage Hero Showcase (Static marketing template) */}
      <section className="elite-hero">
        <div className="elite-hero-content">
          <span className="elite-hero-subtitle">{heroSubtitle}</span>
          <h1 className="elite-hero-title">
            {heroTitle}
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="elite-search-wrap">
            <input 
              type="text" 
              className="elite-search-input" 
              placeholder={heroSearchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="elite-search-btn"
            >
              {heroSearchButton}
            </button>
          </div>
        </div>
      </section>

      {(useFallback || apiError) && apiError && (
        <div style={{ margin: '2.5rem 5% 0' }}>
          <CatalogSyncAlert
            classPrefix="ce"
            variant={useFallback ? 'demo' : 'production'}
            error={apiError}
          />
        </div>
      )}

      {/* Category Pills Slider Ribbon */}
      <div className="elite-categories-wrap">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className={`elite-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Spotlight Carousel Section (Asset of the Week) */}
      <section className="spotlight-section">
        <div className="spotlight-header">
          <span className="spotlight-tag">{spotlightTag}</span>
          <h2 className="spotlight-title">{spotlightTitle}</h2>
        </div>

        {loading ? (
          // Gold Shimmer Spotlight Carousel Skeleton
          <div className="spotlight-carousel" style={{ animation: 'pulse 1.5s infinite' }}>
            <div className="spotlight-media-wrap" style={{ backgroundColor: '#18181b' }}></div>
            <div className="spotlight-content">
              <div style={{ height: '15px', width: '30%', backgroundColor: '#18181b', borderRadius: '4px', marginBottom: '1rem' }}></div>
              <div style={{ height: '40px', width: '80%', backgroundColor: '#18181b', borderRadius: '8px', marginBottom: '1.5rem' }}></div>
              <div style={{ height: '80px', backgroundColor: '#18181b', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
              <div style={{ height: '35px', width: '40%', backgroundColor: '#18181b', borderRadius: '8px' }}></div>
            </div>
          </div>
        ) : activeSpotlight ? (
          <div className="spotlight-carousel">
            <div className="spotlight-media-wrap">
              <img src={activeSpotlight.media?.main_photo || activeSpotlight.media?.thumbnail || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400"} className="spotlight-img" alt={activeSpotlight.title} />
              
              <div className="spotlight-meta-overlay">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  📍 {getAssetLocation(activeSpotlight)}
                </span>
              </div>

              {/* Carousel Navigation buttons */}
              <div className="spotlight-controls">
                <button className="spotlight-arrow" onClick={handlePrevSpotlight} title="Previous Spotlight">&lt;</button>
                <button className="spotlight-arrow" onClick={handleNextSpotlight} title="Next Spotlight">&gt;</button>
              </div>
            </div>

            <div className="spotlight-content">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                🛡️ {getAssetCategoryLabel(activeSpotlight)}
              </span>
              
              <h3 className="spotlight-name">{activeSpotlight.title}</h3>
              
              <p className="spotlight-desc">{activeSpotlight.description}</p>
              
              <div className="spotlight-price">{getAssetPrice(activeSpotlight)}</div>
              
              <button 
                className="elite-modal-cta" 
                style={{ width: 'fit-content', marginTop: '1rem' }}
                onClick={() => setQuickViewAsset(activeSpotlight)}
              >
                {prospectusButton}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--prem-muted)' }}>No spotlights currently listed.</div>
        )}
      </section>

      {/* Main Collections Grid */}
      <section id="ce-catalog" className="elite-section">
        <div className="section-head">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--prem-accent)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              {catalogEyebrow}
            </span>
            <h2 className="section-title">{catalogTitle}</h2>
          </div>
          
          <div style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            {loading ? 'Evaluating ledger...' : `Showing ${filteredAssets.length} ultra-curated assets`}
          </div>
        </div>

        {/* Dynamic Grid Cards */}
        {loading ? (
          // Gold Shimmer Grid Skeletons
          <div className="elite-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="elite-card" style={{ animation: 'pulse 1.5s infinite' }}>
                <div className="elite-card-img-wrapper" style={{ backgroundColor: '#18181b' }}></div>
                <div className="elite-card-content">
                  <div style={{ height: '12px', width: '30%', backgroundColor: '#18181b', borderRadius: '4px', marginBottom: '0.85rem' }}></div>
                  <div style={{ height: '24px', width: '70%', backgroundColor: '#18181b', borderRadius: '6px', marginBottom: '0.85rem' }}></div>
                  <div style={{ height: '18px', width: '40%', backgroundColor: '#18181b', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '1px dashed var(--prem-border)', borderRadius: '12px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>💎</span>
            <h4 style={{ fontFamily: 'var(--prem-serif)', fontWeight: 800, marginBottom: '0.5rem' }}>{emptyTitle}</h4>
            <p style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>{emptyDescription}</p>
            <button className="elite-modal-cta" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>{emptyButton}</button>
          </div>
        ) : (
          <div className="elite-grid">
            {filteredAssets.map((asset) => (
              <PremiumCard 
                key={asset.id}
                title={asset.title}
                price={getAssetPrice(asset)}
                category={getAssetCategoryLabel(asset)}
                image={asset.media?.thumbnail || asset.media?.main_photo || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400"}
                isFavorite={favorites.includes(asset.id)}
                onQuickView={() => setQuickViewAsset(asset)}
                onToggleFavorite={() => toggleFavoriteAsset(asset.id)}
                onShare={() => handleShareClick(asset.title, 'clipboard')}
                onClick={() => router.push(themeLink(`/product/${asset.slug}`))}
              />
            ))}
          </div>
        )}
      </section>

      {/* Breathtaking Center Glassmorphism Quick View Modal Box */}
      {quickViewAsset && (
        <div className="elite-modal-overlay" onClick={() => setQuickViewAsset(null)}>
          <div className="elite-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="elite-modal-close" onClick={() => setQuickViewAsset(null)}>×</button>
            
            <img src={quickViewAsset.media?.main_photo || quickViewAsset.media?.thumbnail || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400"} className="elite-modal-img" alt={quickViewAsset.title} />
            
            <div className="elite-modal-price">{getAssetPrice(quickViewAsset)}</div>
            <h4 className="elite-modal-title">{quickViewAsset.title}</h4>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {getAssetCategoryLabel(quickViewAsset)}
            </p>
            
            <p className="elite-modal-desc">{quickViewAsset.description}</p>
            
            {/* Vetted Custodian stats */}
            <div className="elite-modal-stats">
              <div className="elite-stat-item">
                Origin
                <span>{getAssetLocation(quickViewAsset).split(',')[0]}</span>
              </div>
              <div className="elite-stat-item">
                Vault ID
                <span style={{ fontSize: '0.85rem' }}>{getAssetVaultId(quickViewAsset)}</span>
              </div>
              <div className="elite-stat-item">
                Certification
                <span>{getAssetGrade(quickViewAsset)}</span>
              </div>
            </div>

            {/* Luxury Sharing Icons */}
            <div className="elite-modal-socials">
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset.title, 'Encrypted Mail')} title="Send Encrypted Prospectus">✉️</button>
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset.title, 'Wholesale Brokerage')} title="Broker Invitation">💼</button>
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset.title, 'Private Terminal')} title="Interactive Terminal node">🖥️</button>
            </div>

            <button 
              className="elite-modal-cta"
              onClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
            >
              {inquiryButton}
            </button>
          </div>
        </div>
      )}

      {/* Styled JSX for elegant shimmer and scroll pulse animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>

    </>
  );
}
