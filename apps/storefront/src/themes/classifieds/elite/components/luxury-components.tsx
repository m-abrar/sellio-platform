'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

interface HeaderProps {
  onPostClick: () => void;
}

export const PremiumHeader = ({ onPostClick }: HeaderProps) => (
  <header className="elite-header">
    <a href="#" className="elite-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
      SELLIO<span>_ELITE</span>
    </a>
    
    <div className="elite-nav">
      <MenuNav
        location="main_header"
        flat
        linkClassName="elite-nav-link"
        activeClassName="active"
        renderItem={defaultNavItemRenderer}
      />
      <MenuActionButtons
        buttonClassName="elite-btn-login"
        as="button"
        onAction={onPostClick}
      />
    </div>
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
      
      <FooterMenuColumn
        location="footer_column_1"
        className="footer-col"
        titleTag="h4"
        titleClassName="footer-col-title"
        listClassName="footer-nav-list"
        linkClassName="footer-nav-link"
      />
      <FooterMenuColumn
        location="footer_column_2"
        className="footer-col"
        titleTag="h4"
        titleClassName="footer-col-title"
        listClassName="footer-nav-list"
        linkClassName="footer-nav-link"
      />
      <FooterMenuColumn
        location="footer_column_3"
        className="footer-col"
        titleTag="h4"
        titleClassName="footer-col-title"
        listClassName="footer-nav-list"
        linkClassName="footer-nav-link"
      />
    </div>
    
    <div className="footer-bottom">
      <span>© 2026 SELLIO_ELITE_HOLDINGS LTD. ALL RIGHTS RESERVED. SECURED NODE.</span>
      <span>🔒 ENCRYPTED VAULT NETWORK &bull; PRIVACY VETTED PASS</span>
    </div>
  </footer>
);

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export { DiamondFooter } from './DiamondFooter';
export { EliteHeader } from './EliteHeader';
