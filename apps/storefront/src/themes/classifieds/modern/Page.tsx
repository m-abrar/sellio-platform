'use client';
import React, { useState, useEffect } from 'react';
import type { ClassifiedListing } from '@/types';
import { ModernHeader, ModernCard, ModernFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome, resolveClassifiedsFailure } from '@/themes/classifieds/shared/catalog';
import { MODERN_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';


// Premium high-fidelity Classifieds Modern fallback listings matching ClassifiedListing schema
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
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroTitle = useThemeContent('hero.title', 'Discover the best things to buy, sell, and trade.');
  const heroSearchPlaceholder = useThemeContent('hero.search_placeholder', 'What are you looking for today? (e.g. camera, table, jacket)');
  const heroSearchButton = useThemeContent('hero.search_button', 'Search');
  const feedTitle = useThemeContent('feed.title', 'Fresh Recommendations');
  const emptyTitle = useThemeContent('empty.title', 'No Listings Matching Search');
  const emptyDescription = useThemeContent('empty.description', "We couldn't find items that match your tags or keyword search query.");
  const emptyButton = useThemeContent('empty.button_label', 'Reset Settings');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'Load More Items');
  const loadingMoreLabel = useThemeContent('collection.loading_more_label', 'Retrieving listings...');
  const messageSellerLabel = useThemeContent('quickview.message_seller_label', 'Message Seller');
  const viewDetailsLabel = useThemeContent('quickview.view_details_label', 'View Full Details');

  // Split title to preserve spans
  const renderHeroTitle = () => {
    const parts = heroTitle.split(/(buy|sell)/i);
    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase();
      if (lowerPart === 'buy') {
        return <span key={index} className="cm-text-orange">{part}</span>;
      }
      if (lowerPart === 'sell') {
        return <span key={index} className="cm-text-cyan">{part}</span>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
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
  const [apiError, setApiError] = useState<string | null>(null);

  // Quick View Modal States
  const [quickViewItem, setQuickViewItem] = useState<ClassifiedListing | null>(null);

  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Local favorites state to enable bookmarks without writing to live database
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchClassifieds = async () => {
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
          const finalCats = [{ id: 'all', name: 'Everything' }];
          mappedCats.forEach((c) => {
            if (!finalCats.some((fc) => fc.id === c.id)) {
              finalCats.push(c);
            }
          });
          setCategories(finalCats);
        } else {
          const derived = [{ id: 'all', name: 'Everything' }];
          result.response.data.forEach((item) => {
            const key = getListingCategoryKey(item.taxonomy?.category);
            if (key && !derived.some((cat) => cat.id === key)) {
              derived.push({
                id: key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
              });
            }
          });
          setCategories(derived);
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'modern');

        if (resolution.mode === 'demo') {
          setItems(resolution.listings);
          setCategories(MODERN_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setItems([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    };

    fetchClassifieds();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  const toggleFavoriteItem = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleShareClick = async (item: ClassifiedListing, platform: string) => {
    try {
      await navigator.clipboard.writeText(`${item.title} (${platform})`);
    } catch {
      // Clipboard might be blocked in some environments.
    }
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
    return city && state ? `${city}, ${state}` : city || state || 'Location not specified';
  };

  const getListingTime = (item: ClassifiedListing): string => {
    return item.status?.is_new_listing ? 'Just now' : '1d ago';
  };

  const getListingImage = (item: ClassifiedListing): string => {
    return item.media?.thumbnail || item.media?.main_photo || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400';
  };

  const getListingCategoryKey = (
    category: ClassifiedListing['taxonomy']['category'],
  ): string => {
    if (!category) {
      return '';
    }

    if (typeof category === 'string') {
      return category.toLowerCase();
    }

    if (typeof category === 'object') {
      const { id, title, slug } = category as { id?: number; title?: string; slug?: string };

      if (slug) {
        return slug.toLowerCase();
      }

      if (title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (id != null) {
        return String(id);
      }
    }

    return '';
  };

  const listingMatchesCategory = (item: ClassifiedListing, categoryId: string): boolean => {
    if (categoryId === 'all') {
      return true;
    }

    const selected = categoryId.toLowerCase();
    const itemKey = getListingCategoryKey(item.taxonomy?.category);

    return itemKey === selected;
  };

  // Filter listings based on categories pill and search keyword
  const filteredItems = items
    .filter((item) => {
      const matchesCategory = listingMatchesCategory(item, selectedCategory);
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
        onPostClick={() => {
          const target = document.getElementById('cm-feed');
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {(useFallback || apiError) && apiError && (
        <div style={{ margin: '2rem 6% 0' }}>
          <CatalogSyncAlert
            classPrefix="cm"
            variant={useFallback ? 'demo' : 'production'}
            error={apiError}
          />
        </div>
      )}

      {/* Hero Banner Area */}
      <section className="cm-hero">
        <div className="cm-hero-content">
          <h1 className="cm-hero-title">
            {renderHeroTitle()}
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="cm-search-container">
            <input 
              type="text" 
              className="cm-search-input" 
              placeholder={heroSearchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="cm-btn cm-btn-primary" 
              style={{ margin: '0.25rem', padding: '0.65rem 2rem' }}
            >
              {heroSearchButton}
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
      <section id="cm-feed" className="cm-section">
        
        {/* Title and sorting controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="cm-section-title">{feedTitle}</h2>
          
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
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{emptyTitle}</h3>
            <p style={{ color: 'var(--cm-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>{emptyDescription}</p>
            <button className="cm-btn cm-btn-primary" onClick={resetFilters}>{emptyButton}</button>
          </div>
        ) : (
          <div className="cm-grid">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <a key={item.id} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <ModernCard
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
                />
              </a>
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
              {loadingMore ? loadingMoreLabel : loadMoreLabel}
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
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`Inquiry about ${quickViewItem.title}`);
                  } catch {
                    // Clipboard might be blocked in some environments.
                  }
                }}
              >
                {messageSellerLabel}
              </button>
              <a
                className="cm-btn cm-btn-primary"
                href={themeLink(`/product/${quickViewItem.slug}`)}
                style={{ fontSize: '0.8rem', textDecoration: 'none' }}
              >
                {viewDetailsLabel}
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Modern Footer Component */}
      <ModernFooter />
    </div>
  );
}
