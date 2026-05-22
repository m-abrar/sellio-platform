'use client';
import React, { useState, useEffect } from 'react';

// Custom reusable Countdown Timer component that ticks in real-time
export const CountdownTimer = ({ hours: initialHours = 4, seconds: initialSeconds = 0 }: { hours?: number; seconds?: number }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Generate a fixed countdown distance of e.g. 4 hours for demo purposes, or tick dynamically
    const totalSecs = initialHours * 3600 + initialSeconds;
    setTimeLeft(totalSecs);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return totalSecs; // Reset or stop
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialHours, initialSeconds]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const format = (num: number) => (num < 10 ? `0${num}` : num);

  return (
    <span>
      {format(h)}:{format(m)}:{format(s)}
    </span>
  );
};

interface HeaderProps {
  onSearch: (term: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const DealsHeader = ({ onSearch, onSelectCategory, selectedCategory }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: '🔥 Trending Now', id: 'trending' },
    { name: '💻 Electronics', id: 'electronics' },
    { name: '👕 Fashion', id: 'fashion' },
    { name: '🛋️ Home & Garden', id: 'home' },
    { name: '🚗 Vehicles', id: 'vehicles' },
    { name: '🛠️ Tools', id: 'tools' },
    { name: '🎮 Gaming', id: 'gaming' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <>
      {/* Top Banner Ribbon with Ticking Timer */}
      <div className="cd-header-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="cd-pulse-dot"></span>
          <span>🔥 FLASH SALE: UP TO 80% OFF CLEARANCE ITEMS</span>
        </div>
        <div>
          ENDS IN: <span className="cd-top-timer"><CountdownTimer hours={4} /></span>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="cd-header-main">
        <a href="#" className="cd-logo" onClick={() => { onSelectCategory('all'); setSearchTerm(''); onSearch(''); }}>
          <span className="cd-logo-highlight">Deal</span>
          <span className="cd-logo-text-yellow">Finder</span>
        </a>
        
        <form onSubmit={handleSearchSubmit} className="cd-search-bar">
          <span style={{ fontSize: '1.1rem', color: 'var(--cd-text-muted)', userSelect: 'none' }}>🔍</span>
          <input 
            type="text" 
            className="cd-search-input" 
            placeholder="Search deals, bargains, tech, fashion..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
          <button type="submit" className="cd-search-btn">Search</button>
        </form>
        
        <div className="cd-nav-actions">
          <a href="#" className="cd-nav-link">Login</a>
          <a href="#" className="cd-btn-post" onClick={(e) => { e.preventDefault(); alert("Feature coming soon! In compliance with monorepo rules, posting is routed to dynamic state."); }}>
            <span>➕</span> Post a Deal
          </a>
        </div>
      </header>

      {/* Category Ribbon */}
      <div className="cd-category-ribbon">
        <a 
          href="#" 
          className={`cd-cat-link ${selectedCategory === 'all' ? 'cd-active' : ''}`}
          onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
        >
          📂 All Deals
        </a>
        {categories.map((cat) => (
          <a 
            key={cat.id}
            href="#" 
            className={`cd-cat-link ${selectedCategory === cat.id ? 'cd-active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectCategory(cat.id); }}
          >
            {cat.name}
          </a>
        ))}
      </div>
    </>
  );
};

interface DealCardProps {
  title: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  image: string;
  seller: string;
  isTopSeller: boolean;
  category: string;
  isHotBargain?: boolean;
  onClick?: (slug: string) => void;
  slug?: string;
}

export const DealCard = ({ title, currentPrice, originalPrice, discount, image, seller, isTopSeller, isHotBargain, onClick, slug }: DealCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Generate distinct countdowns for different cards for visual realism
  const randomHours = Math.floor(Math.random() * 8) + 2;
  const randomMinutes = Math.floor(Math.random() * 59);

  return (
    <div 
      className={`cd-deal-card ${isHotBargain ? 'cd-hot-card' : ''}`}
      onClick={(e) => {
        if (onClick && slug) {
          onClick(slug);
        }
      }}
      style={onClick && slug ? { cursor: 'pointer' } : undefined}
    >
      <span className="cd-sale-badge">SALE!</span>
      <span className="cd-discount-tag-card">-{discount}% OFF</span>
      
      <div className="cd-card-img-wrap">
        <img src={image} className="cd-card-img" alt={title} />
      </div>
      
      <div className="cd-card-body">
        <h3 className="cd-card-title" title={title}>{title}</h3>
        
        <div className="cd-price-row">
          <span className="cd-current-price">{currentPrice}</span>
          <span className="cd-original-price">{originalPrice}</span>
        </div>
        
        <div className="cd-timer-badge">
          <span>⏳ Ends:</span>
          <CountdownTimer hours={randomHours} seconds={randomMinutes} />
        </div>
        
        <div className="cd-card-seller">
          <div>
            👤 <span className="cd-seller-name">{seller}</span>
            {isTopSeller && <span style={{ marginLeft: '4px', color: '#10b981', fontWeight: 800 }}>✓</span>}
          </div>
          <button 
            className={`cd-btn-follow ${isFollowing ? 'cd-following' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
            style={{ fontSize: '0.65rem', padding: '2px 8px' }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        <button 
          className="cd-btn-buy"
          onClick={(e) => {
            if (onClick && slug) {
              e.stopPropagation();
              onClick(slug);
            } else {
              setClaimed(true);
              alert(`🎉 Deal Snagged! Redirecting to checkout for ${title}...`);
            }
          }}
          disabled={claimed}
        >
          {claimed ? 'Claimed ✓' : 'Snag This Deal ⚡'}
        </button>
      </div>
    </div>
  );
};

export const DealsFooter = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="cd-footer">
      <div className="cd-footer-grid">
        <div className="cd-footer-logo-desc">
          <a href="#" className="cd-footer-logo">
            <span className="cd-logo-highlight" style={{ padding: '2px 8px' }}>Deal</span>Dash
          </a>
          <p className="cd-footer-desc">Your ultimate high-velocity destination for daily community bargains, premium flash sales, and hidden discount gems.</p>
        </div>
        <div>
          <h4 className="cd-footer-title">Buyer Protection</h4>
          <div className="cd-footer-links">
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Money Back Guarantee</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Safe Trading Guide</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Report a Seller / Listing</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Customer Support Hub</a>
          </div>
        </div>
        <div>
          <h4 className="cd-footer-title">Sell on DealDash</h4>
          <div className="cd-footer-links">
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Post a Bargain Item</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Merchant Dashboard</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Promote Listing Placement</a>
            <a href="#" className="cd-footer-link" onClick={(e) => e.preventDefault()}>Partner Fee Schedule</a>
          </div>
        </div>
        <div>
          <h4 className="cd-footer-title">Never Miss a Bargain</h4>
          <p className="cd-footer-desc" style={{ marginBottom: '1rem' }}>Subscribe to custom alerts and get the hottest price drops straight to your inbox.</p>
          {subscribed ? (
            <div style={{ color: 'var(--cd-secondary-yellow)', fontWeight: 700, fontSize: '0.9rem' }}>
              ✓ Subscribed successfully! Ready for epic deals.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="cd-newsletter-form">
              <input 
                type="email" 
                placeholder="Email address" 
                className="cd-newsletter-input" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="cd-newsletter-btn">Go</button>
            </form>
          )}
        </div>
      </div>
      <div className="cd-footer-bottom">
        <div>
          &copy; 2026 DealDash Marketplace. All rights reserved. Engineered for Envato Elite Performance.
        </div>
        <div className="cd-footer-socials">
          <a href="#" className="cd-social-link" onClick={(e) => e.preventDefault()}>f</a>
          <a href="#" className="cd-social-link" onClick={(e) => e.preventDefault()}>t</a>
          <a href="#" className="cd-social-link" onClick={(e) => e.preventDefault()}>in</a>
          <a href="#" className="cd-social-link" onClick={(e) => e.preventDefault()}>yt</a>
        </div>
      </div>
    </footer>
  );
};
