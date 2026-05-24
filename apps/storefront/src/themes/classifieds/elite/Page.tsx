'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing, Category } from '@sellio/types';
import { PremiumCard } from './components';

// Premium high-fidelity Classifieds Elite fallback listings matching ClassifiedListing schema
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "1963 Ferrari 250 GTO Berlinetta",
    slug: "1963-ferrari-250-gto-berlinetta",
    description: "One of only 36 models ever built by Scaglietti. Completely documented ownership lineage, Ferrari Classiche certified. Features matching numbers, pristine race record, and iconic Rosso Corsa paintwork.",
    pricing: {
      base_price: 72000000,
      sale_price: 72000000,
      is_on_sale: false,
      discount: null,
      formatted: "$72,000,000",
      formatted_short: "$72M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Classiche A+",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_MILAN_98"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400",
    },
    taxonomy: {
      category: "motors",
      brand: "Ferrari"
    },
    location: {
      city: "Maranello",
      state: "Italy"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 2,
    title: "Claude Monet 'Water Lilies' (1906 Oil)",
    slug: "claude-monet-water-lilies-1906-oil",
    description: "A signature oil on canvas masterpiece from Monet's highly coveted water garden series in Giverny. Flawless canvas preservation, documented in major museum exhibitions globally.",
    pricing: {
      base_price: 54000000,
      sale_price: 54000000,
      is_on_sale: false,
      discount: null,
      formatted: "$54,000,000",
      formatted_short: "$54M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Certified Museum Grade",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_GENEVA_12"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
    },
    taxonomy: {
      category: "art",
      brand: "Claude Monet"
    },
    location: {
      city: "Paris",
      state: "France"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "Macallan Fine & Rare 1926 Whisky (60 Year)",
    slug: "macallan-fine-rare-1926-whisky-60-year",
    description: "Voted the most collectible single-malt bottle in existence. Matured in seasoned sherry casks for 60 years. Hand-signed label from the master distiller with original presentation chest.",
    pricing: {
      base_price: 1900000,
      sale_price: 1900000,
      is_on_sale: false,
      discount: null,
      formatted: "$1,900,000",
      formatted_short: "$1.9M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Grade 10 Cask",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_EDINBURGH_44"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=400",
    },
    taxonomy: {
      category: "spirits",
      brand: "Macallan"
    },
    location: {
      city: "Speyside",
      state: "Scotland"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 4,
    title: "Patek Philippe Sky Moon Tourbillon",
    slug: "patek-philippe-sky-moon-tourbillon",
    description: "One of the most complicated wristwatches in horological history. Dual-faced dial showing cathedral gongs minute repeater, perpetual calendar, solar time, and sky chart configurations.",
    pricing: {
      base_price: 3200000,
      sale_price: 3200000,
      is_on_sale: false,
      discount: null,
      formatted: "$3,200,000",
      formatted_short: "$3.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Patek Seal Perfect",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_ZURICH_87"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400",
    },
    taxonomy: {
      category: "horology",
      brand: "Patek Philippe"
    },
    location: {
      city: "Geneva",
      state: "Switzerland"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 5,
    title: "The Pink Star Oval Vivid Diamond Ring",
    slug: "the-pink-star-oval-vivid-diamond-ring",
    description: "A monumental 59.60 carat oval mixed-cut fancy vivid pink diamond. Flawless clarity grade, verified by GIA. Mounted on an elegant premium platinum band setting.",
    pricing: {
      base_price: 71200000,
      sale_price: 71200000,
      is_on_sale: false,
      discount: null,
      formatted: "$71,200,000",
      formatted_short: "$71.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Flawless Fancy Vivid",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_LONDON_02"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400",
    },
    taxonomy: {
      category: "art",
      brand: "Sotheby's Fine Jewelry"
    },
    location: {
      city: "London",
      state: "United Kingdom"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 6,
    title: "Koenigsegg Jesko Absolut Hypercar",
    slug: "koenigsegg-jesko-absolut-hypercar",
    description: "The fastest car Koenigsegg will ever build. Custom carbon weave active bodywork, 1600 HP twin-turbo V8, and custom titanium exhaust components. 1 of 1 signature specification.",
    pricing: {
      base_price: 3400000,
      sale_price: 3400000,
      is_on_sale: false,
      discount: null,
      formatted: "$3,400,000",
      formatted_short: "$3.4M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Factory Certified 1 of 1",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_GOTHENBURG_30"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400",
    },
    taxonomy: {
      category: "motors",
      brand: "Koenigsegg"
    },
    location: {
      city: "Ängelholm",
      state: "Sweden"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  }
];

export default function Page() {
  const router = useRouter();

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_elite${path}`;
      }
    }
    return path;
  };

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
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Local Favorites
  const [favorites, setFavorites] = useState<number[]>([]);

  // Quick View Overlay modal state
  const [quickViewAsset, setQuickViewAsset] = useState<ClassifiedListing | null>(null);

  // Spotlight index state
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    const fetchEliteClassifieds = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          setItems(response.data);
          setUseFallback(false);

          // Extract category ribbon from API categories sidebar if populated
          if (response.sidebar?.categories) {
            const mappedCats = response.sidebar.categories.map((cat: Category) => ({
              id: cat.slug || String(cat.id),
              name: cat.title
            }));
            const deduplicated = [{ id: "all", name: "All Vaults" }];
            mappedCats.forEach((c) => {
              if (!deduplicated.some(d => d.id === c.id)) {
                deduplicated.push(c);
              }
            });
            setCategories(deduplicated);
          } else {
            // Deduplicate from data taxonomy categories if sidebar categories aren't present
            const dynamicCategories = [{ id: "all", name: "All Vaults" }];
            response.data.forEach((item) => {
              const catSlug = item.taxonomy?.category;
              if (catSlug && !dynamicCategories.some(d => d.id === catSlug)) {
                dynamicCategories.push({
                  id: catSlug,
                  name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1)
                });
              }
            });
            setCategories(dynamicCategories);
          }
        } else {
          console.warn("Classifieds Elite database returned empty. Running backups.");
          setErrorTrace("Classifieds Elite database returned empty.");
          loadLocalFallback();
        }
      } catch (err: any) {
        console.error("AxiosError: Connection failure while fetching elite assets:", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallback = () => {
      setItems(FALLBACK_CLASSIFIEDS);
      setCategories([
        { id: "all", name: "All Vaults" },
        { id: "motors", name: "Exotic Motors" },
        { id: "art", name: "Fine Art" },
        { id: "spirits", name: "Rare Vintages" },
        { id: "horology", name: "Luxury Horology" }
      ]);
      setUseFallback(true);
    };

    fetchEliteClassifieds();
  }, []);

  // Filter listings based on category pills and search inputs
  const filteredAssets = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.taxonomy?.category === selectedCategory;
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

  const handleShareClick = (title: string, channel: string) => {
    alert(`🔒 Premium Share: Vetted investor invitation link for "${title}" copied to ${channel} successfully.`);
  };

  // Helper translators to fit Premium theme structures
  const getAssetPrice = (item: ClassifiedListing): string => {
    return item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`;
  };

  const getAssetCategoryLabel = (item: ClassifiedListing): string => {
    const category = item.taxonomy?.category;
    if (!category) return 'Elite Asset';
    if (category === 'motors') return 'Exotic Motors';
    if (category === 'art') return 'Fine Art Portfolio';
    if (category === 'spirits') return 'Rare Vintages';
    if (category === 'horology') return 'Luxury Horology';
    return category.charAt(0).toUpperCase() + category.slice(1);
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
          <span className="elite-hero-subtitle">Vetted Global Advisory Node</span>
          <h1 className="elite-hero-title">
            Curating high-value vaults for serious collectors.
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="elite-search-wrap">
            <input 
              type="text" 
              className="elite-search-input" 
              placeholder="Search by collection title, artist, country origin..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="elite-search-btn"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Gold connection resilient diagnostics warning panel themed matching elite styles */}
      {useFallback && (
        <div style={{
          backgroundColor: '#0c0c0d',
          border: '2.5px dashed var(--prem-accent)',
          borderRadius: '16px',
          padding: '1.75rem',
          margin: '2.5rem 5% 0',
          fontFamily: 'var(--prem-sans)',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.05)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--prem-accent)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.6rem', fontFamily: 'var(--prem-serif)', letterSpacing: '1px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--prem-accent)', animation: 'pulse 1.5s infinite' }}></span>
            VAULT RESILIENCE LAYER: Private Catalog Backups Engaged
          </div>
          <div style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <strong>DIAGNOSTICS TRACE:</strong> {errorTrace || 'Axios connection refused. Sandboxed database unreachable. Displaying curated assets.'}
          </div>
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
          <span className="spotlight-tag">CURATED SPOTLIGHT OF THE WEEK</span>
          <h2 className="spotlight-title">Featured High-Value Acquisitions</h2>
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
                Request Prospectus memorandum
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--prem-muted)' }}>No spotlights currently listed.</div>
        )}
      </section>

      {/* Main Collections Grid */}
      <section className="elite-section">
        <div className="section-head">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--prem-accent)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Browse Curated Catalog
            </span>
            <h2 className="section-title">Exclusive Acquisitions</h2>
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
            <h4 style={{ fontFamily: 'var(--prem-serif)', fontWeight: 800, marginBottom: '0.5rem' }}>No Curated Assets Match Search</h4>
            <p style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>Try clearing keywords or switching filter pills to display our private listings feed.</p>
            <button className="elite-modal-cta" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>Clear Refinements</button>
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
                onClick={() => router.push(getThemeLink(`/product/${asset.slug}`))}
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
              onClick={() => alert(`🔒 SECURE CONCIERGE LINK:\nDirect live terminal communication initiated with key vault custodian at ${getAssetVaultId(quickViewAsset)} regarding acquisition of "${quickViewAsset.title}".`)}
            >
              Inquire Concierge Vault
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
