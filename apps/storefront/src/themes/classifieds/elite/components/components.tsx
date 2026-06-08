'use client';
import React from 'react';

interface HeaderProps {
  onPostClick: () => void;
}

export const PremiumHeader = ({ onPostClick }: HeaderProps) => (
  <header className="elite-header">
    <a href="#" className="elite-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
      SELLIO<span>_ELITE</span>
    </a>
    
    <nav className="elite-nav">
      <a href="#" className="elite-nav-link active" onClick={(e) => { e.preventDefault(); }}>Collections</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); }}>Appraisals</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); }}>Concierge Hub</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); }}>Auctions</a>
      <button className="elite-btn-login" onClick={onPostClick}>MEMBER LOGIN</button>
    </nav>
  </header>
);

interface PremiumCardProps {
  title: string;
  price: string;
  category: string;
  image: string;
  isFavorite: boolean;
  onQuickView: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export const PremiumCard = ({ 
  title, 
  price, 
  category, 
  image, 
  isFavorite, 
  onQuickView, 
  onToggleFavorite, 
  onShare 
}: PremiumCardProps) => {
  return (
    <div className="elite-card">
      <div className="elite-card-img-wrapper">
        <img src={image} className="elite-card-img" alt={title} />
        
        {/* Luxury Action Overlay Hover Buttons */}
        <div className="elite-card-overlay">
          <button className="elite-action-btn" title="Quick View" onClick={onQuickView}>👁️</button>
          <button className="elite-action-btn" title="Toggle Favorite" onClick={onToggleFavorite} style={{ color: isFavorite ? '#ef4444' : 'var(--prem-accent)' }}>
            {isFavorite ? '❤️' : '♡'}
          </button>
          <button className="elite-action-btn" title="Share Asset" onClick={onShare}>🔗</button>
        </div>
      </div>
      
      <div className="elite-card-content">
        <span className="elite-card-tag">{category}</span>
        <h3 className="elite-card-title">{title}</h3>
        <p className="elite-card-price">{price}</p>
      </div>
    </div>
  );
};

export const PremiumFooter = () => (
  <footer className="diamond-footer">
    <div className="footer-row">
      <div className="footer-col">
        <div className="elite-logo" style={{ marginBottom: '1.5rem' }}>SELLIO<span>_ELITE</span></div>
        <p style={{ fontSize: '0.85rem', color: 'var(--prem-muted)', lineHeight: 1.8 }}>
          The world's most exclusive boutique marketplace for high-value curated assets. Appraised by global experts, authenticated by certified vaults.
        </p>
      </div>
      
      <div className="footer-col">
        <h4 className="footer-col-title">Collections</h4>
        <div className="footer-nav-list">
          <span>Fine Art Portfolio</span>
          <span>Luxury Horology</span>
          <span>Rare Vintages</span>
          <span>Exotic Motors</span>
        </div>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">Elite Services</h4>
        <div className="footer-nav-list">
          <span>Private Brokerage</span>
          <span>Asset Appraisals</span>
          <span>Vault Storage</span>
          <span>Estate Trusts</span>
        </div>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">Connect</h4>
        <div className="footer-nav-list">
          <span>Concierge Line</span>
          <span>Investor Reports</span>
          <span>LinkedIn Node</span>
          <span>Instagram feed</span>
        </div>
      </div>
    </div>
    
    <div className="footer-bottom">
      <span>© 2026 SELLIO_ELITE_HOLDINGS LTD. ALL RIGHTS RESERVED. SECURED NODE.</span>
      <span>🔒 ENCRYPTED VAULT NETWORK &bull; PRIVACY VETTED PASS</span>
    </div>
  </footer>
);

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export const DiamondFooter = () => null;
export const EliteHeader = () => null;
