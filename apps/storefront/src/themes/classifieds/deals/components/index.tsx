'use client';
import React, { useState, useEffect } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

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

import { getAdminBaseUrl } from '@/lib/admin-urls';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

interface HeaderProps {
  onSearch: (term: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const secondaryCategoryMap: Record<string, string> = {
  'All Deals': 'all',
  'Trending Now': 'trending',
  'Electronics': 'electronics',
  'Fashion': 'fashion',
  'Home & Garden': 'home',
  'Vehicles': 'vehicles',
  'Tools': 'tools',
  'Gaming': 'gaming',
};

export const DealsHeader = ({ onSearch, onSelectCategory, selectedCategory }: HeaderProps) => {
  const themeLink = useClassifiedsThemeLink();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <>
      <div className="cd-header-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="cd-pulse-dot"></span>
          <MenuNav
            location="utility_topbar"
            flat
            renderItem={(item, { href, className, onNavigate }) => (
              <span className={className}>
                🔥 {item.title.toUpperCase()}: UP TO 80% OFF CLEARANCE ITEMS
              </span>
            )}
          />
        </div>
        <div>
          ENDS IN: <span className="cd-top-timer"><CountdownTimer hours={4} /></span>
        </div>
      </div>

      <header className="cd-header-main">
        <a href={themeLink('/')} className="cd-logo" onClick={() => { onSelectCategory('all'); setSearchTerm(''); onSearch(''); }}>
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
          <MenuUtilityNav linkClassName="cd-nav-link" />
          <MenuActionButtons
            linkClassName="cd-btn-post"
            renderItem={(item, { href, className, onNavigate }) => (
              <a
                href={adminCreateClassifiedUrl}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onNavigate?.()}
              >
                <span>➕</span> {item.title}
              </a>
            )}
          />
        </div>
      </header>

      <MenuNav
        location="secondary_nav"
        flat
        className="cd-category-ribbon"
        linkClassName="cd-cat-link"
        activeClassName="cd-active"
        renderItem={(item, { href, className, onNavigate, isActive }) => {
          const categoryId = secondaryCategoryMap[item.title] ?? 'all';
          const resolvedClassName = [className, selectedCategory === categoryId ? 'cd-active' : ''].filter(Boolean).join(' ');
          return (
            <a
              href={href}
              className={resolvedClassName}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(categoryId);
                onNavigate?.();
              }}
            >
              {item.title === 'All Deals' ? '📂 All Deals' : item.title === 'Trending Now' ? '🔥 Trending Now' : item.title === 'Electronics' ? '💻 Electronics' : item.title === 'Fashion' ? '👕 Fashion' : item.title === 'Home & Garden' ? '🛋️ Home & Garden' : item.title === 'Vehicles' ? '🚗 Vehicles' : item.title === 'Tools' ? '🛠️ Tools' : item.title === 'Gaming' ? '🎮 Gaming' : item.title}
            </a>
          );
        }}
      />
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
  const themeLink = useClassifiedsThemeLink();
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
          <a href={themeLink('/')} className="cd-footer-logo">
            <span className="cd-logo-highlight" style={{ padding: '2px 8px' }}>Deal</span>Dash
          </a>
          <p className="cd-footer-desc">Your destination for daily community bargains, flash sales, and hidden discount gems.</p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h4"
          titleClassName="cd-footer-title"
          listClassName="cd-footer-links"
          linkClassName="cd-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h4"
          titleClassName="cd-footer-title"
          listClassName="cd-footer-links"
          linkClassName="cd-footer-link"
        />
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
          &copy; 2026 DealDash Marketplace. All rights reserved.
        </div>
        <MenuNav
          location="social_footer"
          flat
          className="cd-footer-socials"
          linkClassName="cd-social-link"
          renderItem={defaultNavItemRenderer}
        />
      </div>
    </footer>
  );
};
