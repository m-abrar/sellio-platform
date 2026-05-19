'use client';
import React from 'react';

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
      <nav className="cm-nav d-none d-md-flex">
        <a href="#" className="cm-nav-link" onClick={(e) => { e.preventDefault(); alert("Browsing full network..."); }}>Browse</a>
        <a href="#" className="cm-nav-link" onClick={(e) => { e.preventDefault(); alert("Opening modern inbox chats..."); }}>Messages</a>
        <a href="#" className="cm-nav-link" onClick={(e) => { e.preventDefault(); alert("Loading user preferences..."); }}>Profile</a>
      </nav>
      <button className="cm-btn cm-btn-primary" onClick={onPostClick}>📸 Post Ad</button>
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
  onShare 
}: ModernCardProps) => {
  return (
    <div className="cm-card">
      <div className="cm-card-image-wrap">
        {/* Badge styling overlay */}
        {isFeatured && <span className="cm-card-badge">Featured</span>}
        {isRecent && <span className="cm-card-badge cyan">Recent</span>}
        {isSale && <span className="cm-card-badge" style={{ backgroundColor: '#22c55e' }}>Sale</span>}
        
        <img src={image} className="cm-card-image" alt={title} />
        
        {/* Blueprint Action Overlay hover buttons */}
        <div className="cm-card-overlay">
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
      
      <div className="cm-card-body">
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
      <div className="cm-footer-links">
        <a href="#" className="cm-footer-link" onClick={(e) => e.preventDefault()}>Terms & Rules</a>
        <a href="#" className="cm-footer-link" onClick={(e) => e.preventDefault()}>Privacy Center</a>
        <a href="#" className="cm-footer-link" onClick={(e) => e.preventDefault()}>Safety Advice</a>
        <a href="#" className="cm-footer-link" onClick={(e) => e.preventDefault()}>Contact Support</a>
      </div>
      <div style={{ color: 'var(--cm-text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
        &copy; 2026 Modern ClassiGroup. All rights reserved. Envato Elite Standard.
      </div>
    </div>
  </footer>
);
