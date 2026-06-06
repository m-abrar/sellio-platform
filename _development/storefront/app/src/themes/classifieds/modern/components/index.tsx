'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

interface HeaderProps {
  onPostClick: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const ModernHeader = ({ onPostClick, searchTerm, onSearchChange }: HeaderProps) => (
  <header className="cm-header">
    <a href="#" className="cm-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
      Classifieds<span>.</span>
    </a>
    
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <MenuNav
        location="main_header"
        flat
        className="cm-nav d-none d-md-flex"
        linkClassName="cm-nav-link"
        renderItem={defaultNavItemRenderer}
      />
      <MenuActionButtons
        buttonClassName="cm-btn cm-btn-primary"
        as="button"
        onAction={onPostClick}
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={() => { onPostClick(); onNavigate?.(); }}>
            📸 {item.title}
          </button>
        )}
      />
    </div>
  </header>
);

interface ModernCardProps {
  title: string;
  price: string;
  location: string;
  time: string;
  image: string;
  isFeatured?: boolean;
  isRecent?: boolean;
  isSale?: boolean;
  isFavorite: boolean;
  onQuickView: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  onCardClick?: () => void;
}

export const ModernCard = ({ 
  title, 
  price, 
  location, 
  time, 
  image, 
  isFeatured, 
  isRecent, 
  isSale, 
  isFavorite, 
  onQuickView, 
  onToggleFavorite, 
  onShare,
  onCardClick
}: ModernCardProps) => {
  return (
    <div className="cm-card">
      <div className="cm-card-image-wrap" onClick={onCardClick} style={{ cursor: onCardClick ? 'pointer' : 'default' }}>
        {/* Badge styling overlay */}
        {isFeatured && <span className="cm-card-badge">Featured</span>}
        {isRecent && <span className="cm-card-badge cyan">Recent</span>}
        {isSale && <span className="cm-card-badge" style={{ backgroundColor: '#22c55e' }}>Sale</span>}
        
        <img src={image} className="cm-card-image" alt={title} />
        
        {/* Blueprint Action Overlay hover buttons */}
        <div className="cm-card-overlay" onClick={(e) => e.stopPropagation()}>
          <button className="cm-action-btn" title="Quick View" onClick={onQuickView}>👁️</button>
          <button 
            className={`cm-action-btn ${isFavorite ? 'active-favorite' : ''}`} 
            title="Like Favorite" 
            onClick={onToggleFavorite}
          >
            {isFavorite ? '❤️' : '♡'}
          </button>
          <button className="cm-action-btn" title="Share Social" onClick={onShare}>🔗</button>
        </div>
      </div>
      
      <div className="cm-card-body" onClick={onCardClick} style={{ cursor: onCardClick ? 'pointer' : 'default' }}>
        <div className="cm-card-price">{price}</div>
        <h3 className="cm-card-title" title={title}>{title}</h3>
        
        <div className="cm-card-footer">
          <span className="cm-card-location">📍 {location}</span>
          <span className="cm-card-time">{time}</span>
        </div>
      </div>
    </div>
  );
};

export const ModernFooter = () => (
  <footer className="cm-footer">
    <div className="cm-footer-row">
      <a href="#" className="cm-logo" onClick={(e) => e.preventDefault()}>
        Classifieds<span>.</span>
      </a>
      <MenuNav
        location="footer_bottom_bar"
        flat
        className="cm-footer-links"
        linkClassName="cm-footer-link"
        renderItem={defaultNavItemRenderer}
      />
      <div style={{ color: 'var(--cm-text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
        &copy; 2026 Modern ClassiGroup. All rights reserved. Envato Elite Standard.
      </div>
    </div>
  </footer>
);
