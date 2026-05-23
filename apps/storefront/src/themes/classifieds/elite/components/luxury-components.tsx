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
      <a href="#" className="elite-nav-link active" onClick={(e) => { e.preventDefault(); alert("Browsing Curated Elite Collections..."); }}>Collections</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); alert("Accessing professional asset appraisal advisory services..."); }}>Appraisals</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); alert("Connecting with concierge advisory brokers..."); }}>Concierge Hub</a>
      <a href="#" className="elite-nav-link" onClick={(e) => { e.preventDefault(); alert("Entering private live asset auctions..."); }}>Auctions</a>
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
  onClick?: () => void;
}

export const PremiumCard = ({ 
  title, 
  price, 
  category, 
  image, 
  isFavorite, 
  onQuickView, 
  onToggleFavorite, 
  onShare,
  onClick
}: PremiumCardProps) => {
  return (
    <div className="elite-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="elite-card-img-wrapper">
        <img src={image} className="elite-card-img" alt={title} />
        
        {/* Luxury Action Overlay Hover Buttons */}
        <div className="elite-card-overlay" onClick={(e) => e.stopPropagation()}>
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
          <span onClick={() => alert("Fine Art collection vault")}>Fine Art Portfolio</span>
          <span onClick={() => alert("Luxury Chronometers chronographs")}>Luxury Horology</span>
          <span onClick={() => alert("Vintage and Rare Spirits")}>Rare Vintages</span>
          <span onClick={() => alert("Classic and Exotic Automotive")}>Exotic Motors</span>
        </div>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">Elite Services</h4>
        <div className="footer-nav-list">
          <span onClick={() => alert("Advisory private sales program")}>Private Brokerage</span>
          <span onClick={() => alert("Expert appraisal evaluation")}>Asset Appraisals</span>
          <span onClick={() => alert("Secured custodian vaulting logistics")}>Vault Storage</span>
          <span onClick={() => alert("Restructuring asset trusts")}>Estate Trusts</span>
        </div>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">Connect</h4>
        <div className="footer-nav-list">
          <span onClick={() => alert("Contacting luxury concierge support line")}>Concierge Line</span>
          <span onClick={() => alert("Opening exclusive investor catalog publications")}>Investor Reports</span>
          <span onClick={() => alert("Connecting on LinkedIn corporate network")}>LinkedIn Node</span>
          <span onClick={() => alert("Connecting on luxury media channels")}>Instagram feed</span>
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
