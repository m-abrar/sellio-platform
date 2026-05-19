'use client';
import React, { useState, useEffect } from 'react';
import { GeneralHeader, ListingCard, GeneralFooter } from './components';

interface ListingItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  localPickup: boolean;
  delivery: boolean;
  dateAdded: number; // Timestamp order
}

export default function Page() {
  // Mock listing catalog
  const [listings, setListings] = useState<ListingItem[]>([
    // Electronics
    { id: 1, title: "iPhone 13 Pro - 256GB Gold Unlocked", price: "$799", numericPrice: 799, image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400", seller: "User113", isSaved: false, category: "electronics", localPickup: true, delivery: true, dateAdded: 4 },
    { id: 2, title: "Sony A7III Mirrorless Camera Body", price: "$1,200", numericPrice: 1200, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400", seller: "PhotoPro", isSaved: true, category: "electronics", localPickup: true, delivery: false, dateAdded: 9 },
    { id: 3, title: "Sony Noise Canceling Headphones WH-CH720N", price: "$120", numericPrice: 120, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400", seller: "AudioFan", isSaved: false, category: "electronics", localPickup: false, delivery: true, dateAdded: 1 },

    // Vehicles
    { id: 4, title: "2018 Honda Civic EX - Low Mileage", price: "$16,500", numericPrice: 16500, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400", seller: "AutoSeller99", isSaved: false, category: "vehicles", localPickup: true, delivery: false, dateAdded: 10 },
    { id: 5, title: "Classic Road Bike - Excellent Frame", price: "$450", numericPrice: 450, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400", seller: "CyclistJoe", isSaved: true, category: "vehicles", localPickup: true, delivery: true, dateAdded: 5 },

    // Real Estate
    { id: 6, title: "Cozy 1-Bedroom Condo near Downtown", price: "$145,000", numericPrice: 145000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400", seller: "AgentSarah", isSaved: false, category: "real-estate", localPickup: true, delivery: false, dateAdded: 12 },
    { id: 7, title: "Spacious Suburb Family Home (4B/3B)", price: "$320,000", numericPrice: 320000, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400", seller: "AgentDave", isSaved: false, category: "real-estate", localPickup: true, delivery: false, dateAdded: 11 },

    // Home Goods
    { id: 8, title: "Mid-Century Modern Sofa (Teal Velvet)", price: "$600", numericPrice: 600, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400", seller: "UsesM83", isSaved: false, category: "home", localPickup: true, delivery: false, dateAdded: 3 },
    { id: 9, title: "Modern Elegant Brass Desk Lamp", price: "$85", numericPrice: 85, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?q=80&w=400", seller: "ShopLux", isSaved: false, category: "home", localPickup: false, delivery: true, dateAdded: 2 },
    
    // Fashion
    { id: 10, title: "Retro Leather Bomber Jacket (Large)", price: "$180", numericPrice: 180, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400", seller: "VintageHQ", isSaved: false, category: "fashion", localPickup: false, delivery: true, dateAdded: 6 },
    { id: 11, title: "Designer Chronograph Gold Watch", price: "$350", numericPrice: 350, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400", seller: "StyleVault", isSaved: false, category: "fashion", localPickup: true, delivery: true, dateAdded: 7 },

    // Services
    { id: 12, title: "Professional Guitar & Bass Lessons", price: "$45", numericPrice: 45, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400", seller: "GuitarGuru", isSaved: false, category: "services", localPickup: true, delivery: true, dateAdded: 8 },
  ]);

  // Categories list corresponding to reference instructions
  const categoriesList = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "vehicles", name: "Vehicles", icon: "🚗" },
    { id: "real-estate", name: "Real Estate", icon: "🏠" },
    { id: "home", name: "Home Goods", icon: "🛋️" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "services", name: "Services", icon: "🔧" },
  ];

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localPickupOnly, setLocalPickupOnly] = useState(false);
  const [includesDelivery, setIncludesDelivery] = useState(false);
  const [maxPrice, setMaxPrice] = useState(25000); // Max filter value (starts high to show all)
  const [sortBy, setSortBy] = useState('new');
  
  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingListings, setLoadingListings] = useState(false);

  // Chat/Messaging States
  interface ChatMessage {
    sender: 'user' | 'seller';
    text: string;
    timestamp: string;
  }
  const [activeChatListing, setActiveChatListing] = useState<ListingItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');

  // Auto Scroll Chat Body
  useEffect(() => {
    const chatBody = document.getElementById('cg-chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatMessages]);

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

    // Trigger mock seller smart response after 1.2 seconds
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
  const initiateChat = (item: ListingItem) => {
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
          const nextSaved = !item.isSaved;
          // Simple visual feedback alerts
          if (nextSaved) {
            console.log(`Saved: ${item.title}`);
          }
          return { ...item, isSaved: nextSaved };
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
    setVisibleCount(6);
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
      setVisibleCount((prev) => prev + 6);
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

      {/* Main Two Column Column Grid */}
      <div className="cg-layout">
        
        {/* Left Side Category sidebar panel */}
        <aside>
          <div className="cg-sidebar">
            <div className="cg-sidebar-title">Explore Categories</div>
            <div className="cg-category-list">
              <a 
                href="#" 
                className={`cg-category-link ${selectedCategory === 'all' ? 'cg-active' : ''}`}
                onClick={(e) => { e.preventDefault(); setSelectedCategory('all'); }}
              >
                <span>📂</span> All Listings
              </a>
              {categoriesList.map((cat) => (
                <a 
                  key={cat.id} 
                  href="#" 
                  className={`cg-category-link ${selectedCategory === cat.id ? 'cg-active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.id); }}
                >
                  <span>{cat.icon}</span> {cat.name}
                </a>
              ))}
            </div>

            {/* Structured Sidebar filters */}
            <div className="cg-sidebar-title">Filters</div>
            <div className="cg-filter-section">
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={localPickupOnly} 
                  onChange={(e) => setLocalPickupOnly(e.target.checked)} 
                />
                📍 Local pickup only
              </label>
              
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={includesDelivery} 
                  onChange={(e) => setIncludesDelivery(e.target.checked)} 
                />
                📦 Includes delivery
              </label>

              {/* Price Range Slider */}
              <div className="cg-range-box">
                <div className="cg-range-labels">
                  <span>Price Limit:</span>
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
                Clear all filters
              </button>
            </div>
          </div>
        </aside>

        {/* Right General Listings Panel */}
        <main>
          
          {/* List Header controls */}
          <div className="cg-grid-header">
            <h1 className="cg-grid-title">
              {selectedCategory === 'all' 
                ? 'All Recommended Listings' 
                : `${categoriesList.find(c => c.id === selectedCategory)?.name || ''} Showcase`}
            </h1>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cg-text-muted)', textTransform: 'uppercase' }}>Sort:</span>
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
          {filteredListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--cg-border)' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.25rem' }}>📦</span>
              <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Listings Found</h2>
              <p style={{ color: 'var(--cg-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>We couldn't find items that match your current sidebar filters or search tags.</p>
              <button className="cg-btn cg-btn-primary" onClick={resetFilters}>Reset Settings</button>
            </div>
          ) : (
            <div className="cg-grid">
              {filteredListings.slice(0, visibleCount).map((item) => (
                <ListingCard 
                  key={item.id} 
                  title={item.title}
                  price={item.price}
                  image={item.image}
                  seller={item.seller}
                  isSaved={item.isSaved}
                  category={item.category}
                  onMessageClick={() => initiateChat(item)}
                  onToggleSave={() => toggleSaveItem(item.id)}
                />
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          {filteredListings.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                className="cg-btn cg-btn-outline" 
                onClick={handleLoadMore}
                disabled={loadingListings}
                style={{ minWidth: '220px' }}
              >
                {loadingListings ? 'Syncing Classifieds...' : 'Load More Listings'}
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
              placeholder="Type your offer or ask questions..." 
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
