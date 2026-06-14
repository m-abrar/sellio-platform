'use client';

import React, { useEffect, useState } from 'react';
import type { ClassifiedListing } from '@sellio/types';
import { GeneralHeader, ListingCard, GeneralFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome, resolveClassifiedsFailure } from '@/themes/classifieds/shared/catalog';
import { GENERAL_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import {
  buildGeneralCategoriesFromListings,
  buildGeneralCategoriesFromSidebar,
  mapClassifiedToGeneralCard,
  type CategoryPill,
  type GeneralCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

export default function Page() {
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const sidebarCategoriesTitle = useThemeContent('sidebar.categories_title', 'Explore Categories');
  const sidebarFiltersTitle = useThemeContent('sidebar.filters_title', 'Filters');
  const pickupOnlyLabel = useThemeContent('filters.pickup_label', 'Local pickup only');
  const deliveryLabel = useThemeContent('filters.delivery_label', 'Includes delivery');
  const priceLimitLabel = useThemeContent('filters.price_limit_label', 'Price Limit:');
  const clearFiltersLabel = useThemeContent('filters.clear_label', 'Clear all filters');
  const allListingsTitle = useThemeContent('collection.all_title', 'All Recommended Listings');
  const categoryShowcaseSuffix = useThemeContent('collection.category_suffix', 'Showcase');
  const sortLabel = useThemeContent('collection.sort_label', 'Sort:');
  const emptyTitle = useThemeContent('empty.title', 'No Listings Found');
  const emptyDescription = useThemeContent('empty.description', "We couldn't find items that match your current sidebar filters or search tags.");
  const emptyButtonLabel = useThemeContent('empty.button_label', 'Reset Settings');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'Load More Listings');
  const loadingMoreLabel = useThemeContent('collection.loading_more_label', 'Loading more...');
  const chatPlaceholder = useThemeContent('chat.placeholder', 'Type your offer or ask questions...');

  const getThemeLink = themeLink;

  const [listings, setListings] = useState<GeneralCardItem[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: 'all', name: 'All Listings', icon: '📂' },
  ]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localPickupOnly, setLocalPickupOnly] = useState(false);
  const [includesDelivery, setIncludesDelivery] = useState(false);
  const [maxPrice, setMaxPrice] = useState(25000); // Max filter value (starts high to show all)
  const [sortBy, setSortBy] = useState('new');
  
  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(12); // symmetry-locked initial visibleCount of 12!
  const [loadingListings, setLoadingListings] = useState(false);

  // Chat/Messaging States
  interface ChatMessage {
    sender: 'user' | 'seller';
    text: string;
    timestamp: string;
  }
  const [activeChatListing, setActiveChatListing] = useState<GeneralCardItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');

  // Auto Scroll Chat Body
  useEffect(() => {
    const chatBody = document.getElementById('cg-chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    let isMounted = true;

    async function loadClassifieds() {
      setLoading(true);
      const result = await fetchClassifiedsHome();

      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        const rawListings = result.response.data as ClassifiedListing[];
        setListings(rawListings.map(mapClassifiedToGeneralCard));
        setUseFallback(false);
        setApiError(null);

        if (result.response.sidebar?.categories) {
          setCategories(buildGeneralCategoriesFromSidebar(result.response.sidebar.categories));
        } else {
          setCategories(buildGeneralCategoriesFromListings(rawListings));
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'general');

        if (resolution.mode === 'demo') {
          setListings(resolution.listings.map(mapClassifiedToGeneralCard));
          setCategories(GENERAL_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setListings([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadClassifieds();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  // Handle message send & mock seller response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatListing) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setTypedMessage('');

    // Trigger mock seller response after 1.2 seconds
    setTimeout(() => {
      const sellerMsg: ChatMessage = {
        sender: 'seller',
        text: `Hi! Yes, my ${activeChatListing.title} is still available. Would you like to schedule a quick meeting or coordinate delivery options?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, sellerMsg]);
    }, 1200);
  };

  // Open Chat Widget Action
  const initiateChat = (item: GeneralCardItem) => {
    setActiveChatListing(item);
    setChatMessages([
      {
        sender: 'seller',
        text: `Hello! Thanks for your interest in my ${item.title}. Let me know if you have any questions or would like to make an offer!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Toggle Saved Item favorites
  const toggleSaveItem = (id: number) => {
    setListings(
      listings.map((item) => {
        if (item.id === id) {
          return { ...item, isSaved: !item.isSaved };
        }
        return item;
      })
    );
  };

  // Reset all filters console action
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocalPickupOnly(false);
    setIncludesDelivery(false);
    setMaxPrice(25000);
    setSortBy('new');
    setVisibleCount(12);
  };

  // Filter and sort general listings matching sidebar controls
  const filteredListings = listings
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPickup = !localPickupOnly || item.localPickup;
      const matchesDelivery = !includesDelivery || item.delivery;
      const matchesPrice = item.numericPrice <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPickup && matchesDelivery && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'new') {
        return b.dateAdded - a.dateAdded; // Freshly listed first
      } else if (sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice; // Low to High
      } else if (sortBy === 'price-desc') {
        return b.numericPrice - a.numericPrice; // High to Low
      }
      return 0;
    });

  // Handle general Load More action with visual spinner latency mock
  const handleLoadMore = () => {
    setLoadingListings(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12); // symmetry increments of 12!
      setLoadingListings(false);
    }, 650);
  };

  return (
    <div className="classifieds-general-wrapper">
      {/* High-Fidelity Header */}
      <GeneralHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onReset={resetFilters} 
      />

      {/* Main Two Column Grid */}
      <div className="cg-layout">
        
        {/* Left Side Category sidebar panel */}
        <aside>
          <div className="cg-sidebar">
            <div className="cg-sidebar-title">{sidebarCategoriesTitle}</div>
            <div className="cg-category-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cg-category-link ${selectedCategory === cat.id ? 'cg-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            {/* Structured Sidebar filters */}
            <div className="cg-sidebar-title">{sidebarFiltersTitle}</div>
            <div className="cg-filter-section">
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={localPickupOnly} 
                  onChange={(e) => setLocalPickupOnly(e.target.checked)} 
                />
                📍 {pickupOnlyLabel}
              </label>
              
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={includesDelivery} 
                  onChange={(e) => setIncludesDelivery(e.target.checked)} 
                />
                📦 {deliveryLabel}
              </label>

              {/* Price Range Slider */}
              <div className="cg-range-box">
                <div className="cg-range-labels">
                  <span>{priceLimitLabel}</span>
                  <span style={{ color: 'var(--cg-primary)', fontWeight: 700 }}>
                    {maxPrice >= 25000 ? 'Any Price' : `$${maxPrice.toLocaleString()}`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="25000" 
                  step="50" 
                  className="cg-slider" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
              </div>

              <button 
                onClick={resetFilters} 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: 'var(--cg-primary)', 
                  cursor: 'pointer', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  textAlign: 'left',
                  padding: '4px 0',
                  marginTop: '0.5rem',
                  textTransform: 'uppercase'
                }}
              >
                {clearFiltersLabel}
              </button>
            </div>
          </div>
        </aside>

        {/* Right General Listings Panel */}
        <main>

          {(useFallback || apiError) && apiError && (
            <div className="cg-alert-slot">
              <CatalogSyncAlert
                classPrefix="cg"
                variant={useFallback ? 'demo' : 'production'}
                error={apiError}
              />
            </div>
          )}
          
          {/* List Header controls */}
          <div className="cg-grid-header">
            <h1 className="cg-grid-title">
              {selectedCategory === 'all' 
                ? allListingsTitle 
                : `${categories.find(c => c.id === selectedCategory)?.name || ''} ${categoryShowcaseSuffix}`}
            </h1>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cg-text-muted)', textTransform: 'uppercase' }}>{sortLabel}</span>
              <select 
                className="cg-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '0.4rem 1rem', border: '1px solid var(--cg-border)', borderRadius: '6px' }}
              >
                <option value="new">🕒 Newly Listed</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💵 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* listings Grid */}
          {loading ? (
            <div className="cg-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="cg-shimmer-card">
                  <div className="cg-shimmer-img" />
                  <div className="cg-shimmer-body">
                    <div className="cg-shimmer-title" />
                    <div className="cg-shimmer-price" />
                    <div className="cg-shimmer-footer">
                      <div className="cg-shimmer-seller" />
                      <div className="cg-shimmer-btns" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="cg-empty-state">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1.25rem' }}>📦</span>
              <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{emptyTitle}</h2>
              <p style={{ color: 'var(--cg-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{emptyDescription}</p>
              <button className="cg-btn cg-btn-primary" onClick={resetFilters}>{emptyButtonLabel}</button>
            </div>
          ) : (
            <div className="cg-grid">
              {filteredListings.slice(0, visibleCount).map((item) => (
                <a key={item.id} href={getThemeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <ListingCard
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    seller={item.seller}
                    isSaved={item.isSaved}
                    category={item.category}
                    onMessageClick={() => initiateChat(item)}
                    onToggleSave={() => toggleSaveItem(item.id)}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          {!loading && filteredListings.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                className="cg-btn cg-btn-outline" 
                onClick={handleLoadMore}
                disabled={loadingListings}
                style={{ minWidth: '220px' }}
              >
                {loadingListings ? loadingMoreLabel : loadMoreLabel}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Messenger Widget (Renders dynamically when activeChatListing is selected) */}
      {activeChatListing && (
        <div className="cg-chat-widget">
          
          {/* Header */}
          <div className="cg-chat-header">
            <div className="cg-chat-title-wrap">
              <span className="cg-chat-title">Chat with {activeChatListing.seller}</span>
              <span className="cg-chat-subtitle">Regarding: {activeChatListing.title}</span>
            </div>
            <button className="cg-chat-close" onClick={() => setActiveChatListing(null)}>×</button>
          </div>
          
          {/* Chat Messages Log */}
          <div className="cg-chat-body" id="cg-chat-body">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`cg-chat-msg ${msg.sender === 'user' ? 'cg-chat-msg-user' : 'cg-chat-msg-seller'}`}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.75 }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Input field send area */}
          <form onSubmit={handleSendMessage} className="cg-chat-input-area">
            <input 
              type="text" 
              className="cg-chat-input" 
              placeholder={chatPlaceholder}
              required
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
            />
            <button type="submit" className="cg-chat-btn-send">
              🡢
            </button>
          </form>

        </div>
      )}

      {/* Footer component */}
      <GeneralFooter />
    </div>
  );
}
