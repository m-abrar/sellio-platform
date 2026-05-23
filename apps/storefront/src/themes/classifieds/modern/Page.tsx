'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing, Category } from '@sellio/types';
import { ModernHeader, ModernCard, ModernFooter } from './components';


// Premium high-fidelity Classifieds Modern fallback listings matching ClassifiedListing schema
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple iPad Pro 12.9 (M2 Chip - 256GB)",
    slug: "apple-ipad-pro-12-9-m2-chip-256gb",
    description: "Mint condition Apple iPad Pro 12.9-inch with the powerhouse M2 chip. 256GB storage, space gray color. Includes original box, charger, and an extra screen protector.",
    pricing: {
      base_price: 850,
      sale_price: 850,
      is_on_sale: false,
      discount: null,
      formatted: "$850.00",
      formatted_short: "$850",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "San Jose",
      state: "CA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  },
  {
    id: 2,
    title: "Chesterfield Vintage Leather Sofa",
    slug: "chesterfield-vintage-leather-sofa",
    description: "Stunning Chesterfield 3-seater sofa in aged oxblood vintage leather. Hand-tufted details, solid mahogany legs, and classic scroll arms. Incredibly comfortable.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200.00",
      formatted_short: "$1,200",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
    },
    taxonomy: {
      category: "furniture"
    },
    location: {
      city: "Austin",
      state: "TX"
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
    title: "DJI Mavic Air 2 Fly More Combo",
    slug: "dji-mavic-air-2-fly-more-combo",
    description: "Perfect working order DJI Mavic Air 2 drone. Fly More Combo includes 3 smart batteries, multi-charger hub, ND filter set, carrying bag, and replacement propellers.",
    pricing: {
      base_price: 850,
      sale_price: 650,
      is_on_sale: true,
      discount: "24",
      formatted: "$650.00",
      formatted_short: "$650",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Miami",
      state: "FL"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 4,
    title: "Adidas Yeezy Boost 350 V2",
    slug: "adidas-yeezy-boost-350-v2",
    description: "Adidas Yeezy Boost 350 V2 'Carbon'. Size US 10.5. Deadstock condition, never worn, tags still attached. Purchased directly from Adidas Confirmed app.",
    pricing: {
      base_price: 220,
      sale_price: 220,
      is_on_sale: false,
      discount: null,
      formatted: "$220.00",
      formatted_short: "$220",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
    },
    taxonomy: {
      category: "fashion"
    },
    location: {
      city: "Brooklyn",
      state: "NY"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  },
  {
    id: 5,
    title: "Sony PlayStation 5 Disc Edition",
    slug: "sony-playstation-5-disc-edition",
    description: "Gently used Sony PlayStation 5 Disc Console. Firmware updated. Package includes 1 white DualSense wireless controller, HDMI cable, power cord, and Astro's Playroom.",
    pricing: {
      base_price: 400,
      sale_price: 400,
      is_on_sale: false,
      discount: null,
      formatted: "$400.00",
      formatted_short: "$400",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.6,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Chicago",
      state: "IL"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 6,
    title: "Canon EOS R5 Mirrorless Camera Body",
    slug: "canon-eos-r5-mirrorless-camera-body",
    description: "Professional mirrorless setup: Canon EOS R5 body. 45MP full-frame sensor, 8K video, 5-axis in-body stabilization. Shutter count under 12k. Flawless cosmetics.",
    pricing: {
      base_price: 3200,
      sale_price: 2800,
      is_on_sale: true,
      discount: "12",
      formatted: "$2,800.00",
      formatted_short: "$2,800",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Seattle",
      state: "WA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 7,
    title: "Secretlab TITAN Evo Gaming Chair",
    slug: "secretlab-titan-evo-gaming-chair",
    description: "Secretlab TITAN Evo 2022 Series gaming chair. Size Regular, upholstered in softweave plush fabric (charcoal blue). 4D armrests, magnetic head pillow.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350.00",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.7,
      condition_label: "Very Good",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400",
    },
    taxonomy: {
      category: "furniture"
    },
    location: {
      city: "Denver",
      state: "CO"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: false
    }
  },
  {
    id: 8,
    title: "Oculus Quest 2 128GB VR Headset",
    slug: "oculus-quest-2-128gb-vr-headset",
    description: "Meta Oculus Quest 2 standalone VR headset. 128GB memory model. Includes two touch controllers, glasses spacer, silicon face cover, and charge adapter.",
    pricing: {
      base_price: 200,
      sale_price: 200,
      is_on_sale: false,
      discount: null,
      formatted: "$200.00",
      formatted_short: "$200",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Atlanta",
      state: "GA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  }
];

const ClassifiedShimmerGrid = () => (
  <div className="cm-grid">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="cm-card" style={{ border: '1.5px solid var(--cm-border)' }}>
        <div style={{
          height: '220px',
          backgroundColor: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 103, 0, 0.08), transparent)',
            animation: 'cmShimmerGrid 1.5s infinite'
          }} />
        </div>
        <div className="cm-card-body" style={{ padding: '1.2rem' }}>
          <div style={{ height: '1.5rem', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem', width: '40%' }} />
          <div style={{ height: '1.2rem', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem', width: '85%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid var(--cm-border)', paddingTop: '0.8rem', marginTop: '0.5rem' }}>
            <div style={{ height: '0.8rem', backgroundColor: '#e2e8f0', borderRadius: '3px', width: '35%' }} />
            <div style={{ height: '0.8rem', backgroundColor: '#e2e8f0', borderRadius: '3px', width: '20%' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function Page() {
  const router = useRouter();

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_modern${path}`;
      }
    }
    return path;
  };

  const handleCardClick = (targetSlug: string) => {
    router.push(getThemeLink(`/product/${targetSlug}`));
  };

  const [items, setItems] = useState<ClassifiedListing[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: "all", name: "Everything" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('new');
  
  // Resiliency and loading states
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Quick View Modal States
  const [quickViewItem, setQuickViewItem] = useState<ClassifiedListing | null>(null);

  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Local favorites state to enable bookmarks without writing to live database
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchClassifieds = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          setItems(response.data);
          setUseFallback(false);

          // Dynamically populate categories from API sidebar metadata if available
          if (response.sidebar?.categories) {
            const mappedCats = response.sidebar.categories.map((cat: Category) => ({
              id: cat.slug || String(cat.id),
              name: cat.title
            }));
            // Deduplicate categories and prepend "Everything"
            const finalCats = [{ id: "all", name: "Everything" }];
            mappedCats.forEach(c => {
              if (!finalCats.some(fc => fc.id === c.id)) {
                finalCats.push(c);
              }
            });
            setCategories(finalCats);
          }
        } else {
          console.warn("Classifieds API returned empty set. Engaging fallback catalog.");
          setErrorTrace("Classifieds API returned empty or invalid dataset.");
          loadFallback();
        }
      } catch (err: any) {
        console.error("Classifieds live-fetch failed, resolving to resilient mockups.", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      setItems(FALLBACK_CLASSIFIEDS);
      setCategories([
        { id: "all", name: "Everything" },
        { id: "electronics", name: "Electronics" },
        { id: "fashion", name: "Fashion" },
        { id: "furniture", name: "Furniture" }
      ]);
      setUseFallback(true);
    };

    fetchClassifieds();
  }, []);

  const toggleFavoriteItem = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
      console.log(`Favorite removed for item ID: ${id}`);
    } else {
      setFavorites([...favorites, id]);
      console.log(`Favorite added for item ID: ${id}`);
    }
  };

  const handleShareClick = (item: ClassifiedListing, platform: string) => {
    alert(`🔗 Shared: Successfully copied share link for "${item.title}" to ${platform}!`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('new');
    setVisibleCount(12);
  };

  // Helper selectors matching original mockup badges and attributes
  const getListingPrice = (item: ClassifiedListing): string => {
    return item.pricing?.formatted_short || item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price || 0}`;
  };

  const getListingPriceNumeric = (item: ClassifiedListing): number => {
    return item.pricing?.sale_price || item.pricing?.base_price || 0;
  };

  const getListingLocation = (item: ClassifiedListing): string => {
    const city = item.location?.city || '';
    const state = item.location?.state || '';
    return city && state ? `${city}, ${state}` : city || state || 'Classified Network';
  };

  const getListingTime = (item: ClassifiedListing): string => {
    return item.status?.is_new_listing ? 'Just now' : '1d ago';
  };

  const getListingImage = (item: ClassifiedListing): string => {
    return item.media?.thumbnail || item.media?.main_photo || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400';
  };

  // Filter listings based on categories pill and search keyword
  const filteredItems = items
    .filter((item) => {
      const itemCategory = item.taxonomy?.category || '';
      const matchesCategory = selectedCategory === 'all' || itemCategory.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            getListingLocation(item).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'new') {
        return b.id - a.id; // Newest listings first based on ID sequence
      } else if (sortBy === 'price-asc') {
        return getListingPriceNumeric(a) - getListingPriceNumeric(b); // Price Low to High
      } else if (sortBy === 'price-desc') {
        return getListingPriceNumeric(b) - getListingPriceNumeric(a); // Price High to Low
      }
      return 0;
    });

  // Handle load more dynamic animation
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 600);
  };

  return (
    <div className="classifieds-modern-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cmShimmerGrid {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />

      {/* Modern Header component */}
      <ModernHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onPostClick={() => alert("📸 Post Ad Wizard: Secure ad wizard opened to list item.")} 
      />

      {/* Connection warning diagnostics trace badge if API database is offline */}
      {useFallback && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2.5px dashed var(--cm-primary-orange)',
          borderRadius: '16px',
          padding: '1.5rem',
          margin: '2rem 6% 0',
          fontFamily: 'var(--cm-font)',
          boxShadow: 'var(--cm-shadow-md)',
          color: 'var(--cm-text-dark)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cm-primary-orange)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cm-primary-orange)', animation: 'pulse 1.5s infinite' }}></span>
            DATABASE OFFLINE: Resilient catalog backups activated
          </div>
          <div style={{ color: 'var(--cm-text-dark)', fontSize: '0.8rem', lineHeight: '1.6' }}>
            <strong>DIAGNOSTICS:</strong> {errorTrace || 'Axios connection timeout. Displaying live catalog backups.'}
          </div>
        </div>
      )}

      {/* Hero Banner Area */}
      <section className="cm-hero">
        <div className="cm-hero-content">
          <h1 className="cm-hero-title">
            Discover the best things to <span className="cm-text-orange">buy</span>, <span className="cm-text-cyan">sell</span>, and trade.
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="cm-search-container">
            <input 
              type="text" 
              className="cm-search-input" 
              placeholder="What are you looking for today? (e.g. camera, table, jacket)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="cm-btn cm-btn-primary" 
              style={{ margin: '0.25rem', padding: '0.65rem 2rem' }}
              onClick={() => console.log(`Searching for keyword: ${searchTerm}`)}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Pill Selection */}
      <div className="cm-categories">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className={`cm-cat-pill ${selectedCategory === cat.id ? 'active-orange' : ''}`}
            onClick={() => { setSelectedCategory(cat.id); setVisibleCount(12); }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid Feed */}
      <section className="cm-section">
        
        {/* Title and sorting controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="cm-section-title">Fresh Recommendations</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cm-text-muted)', textTransform: 'uppercase' }}>Sort by:</span>
            <select 
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', outline: 'none', fontWeight: 600, fontFamily: 'var(--cm-font)', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#ffffff' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="new">🕒 Newest Listed</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💵 Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Card Grid or Skeleton Loader */}
        {loading ? (
          <ClassifiedShimmerGrid />
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1.5px solid var(--cm-border)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Listings Matching Search</h3>
            <p style={{ color: 'var(--cm-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>We couldn't find items that match your tags or keyword search query.</p>
            <button className="cm-btn cm-btn-primary" onClick={resetFilters}>Reset Settings</button>
          </div>
        ) : (
          <div className="cm-grid">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <ModernCard 
                key={item.id}
                title={item.title}
                price={getListingPrice(item)}
                location={getListingLocation(item)}
                time={getListingTime(item)}
                image={getListingImage(item)}
                isFeatured={item.status?.is_featured}
                isRecent={item.status?.is_new_listing}
                isSale={item.pricing?.is_on_sale}
                isFavorite={favorites.includes(item.id)}
                onQuickView={() => setQuickViewItem(item)}
                onToggleFavorite={() => toggleFavoriteItem(item.id)}
                onShare={() => handleShareClick(item, 'clipboard')}
                onCardClick={() => handleCardClick(item.slug)}
              />
            ))}
          </div>
        )}

        {/* Load More trigger CTA */}
        {!loading && filteredItems.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button 
              className="cm-btn" 
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{ backgroundColor: 'white', border: '2px solid var(--cm-border)', color: 'var(--cm-text-dark)', minWidth: '200px', justifyContent: 'center' }}
            >
              {loadingMore ? 'Retrieving listings...' : 'Load More Items'}
            </button>
          </div>
        )}

      </section>

      {/* Floating Center Quick View Popup Modal Dialog */}
      {quickViewItem && (
        <div className="cm-modal-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cm-modal-close" onClick={() => setQuickViewItem(null)}>×</button>
            
            <img src={getListingImage(quickViewItem)} className="cm-modal-img" alt={quickViewItem.title} />
            
            <div className="cm-modal-price">{getListingPrice(quickViewItem)}</div>
            <h4 className="cm-modal-title">{quickViewItem.title}</h4>
            <div className="cm-modal-meta">📍 {getListingLocation(quickViewItem)} &bull; Posted {getListingTime(quickViewItem)}</div>
            
            <p className="cm-modal-desc">{quickViewItem.description}</p>
            
            {/* Social Share Buttons */}
            <div className="cm-modal-social-wrap">
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Facebook')} title="Share to Facebook">📘</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Twitter')} title="Share to Twitter">🐦</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Pinterest')} title="Share to Pinterest">📌</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Instagram')} title="Share to Instagram">📸</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button 
                className="cm-btn" 
                style={{ backgroundColor: '#f1f5f9', color: 'var(--cm-text-dark)', fontSize: '0.8rem' }}
                onClick={() => alert(`✉️ Messenger initiated: Secure chat launched with seller regarding "${quickViewItem.title}"`)}
              >
                Message Seller
              </button>
              <button 
                className="cm-btn cm-btn-primary" 
                style={{ fontSize: '0.8rem' }}
                onClick={() => router.push(getThemeLink(`/product/${quickViewItem.slug}`))}
              >
                View Full Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modern Footer Component */}
      <ModernFooter />
    </div>
  );
}
