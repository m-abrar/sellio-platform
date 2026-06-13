'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

interface HeaderProps {
  onPostClick: () => void;
}

export const PremiumHeader = ({ onPostClick }: HeaderProps) => {
  const themeLink = useClassifiedsThemeLink();
  return (
  <header className="elite-header">
    <a href={themeLink('/')} className="elite-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
      SELLIO<span>_ELITE</span>
    </a>
    
    <div className="elite-nav-panel">
      <MenuNav
        location="main_header"
        flat
        className="elite-nav"
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
};

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

export const PremiumFooter = () => {
  const themeLink = useClassifiedsThemeLink();
  return (
  <footer className="diamond-footer">
    <div className="footer-row">
      <div className="footer-col">
        <a href={themeLink('/')} className="elite-logo" style={{ marginBottom: '1.5rem', textDecoration: 'none', color: 'inherit' }}>SELLIO<span>_ELITE</span></a>
        <p style={{ fontSize: '0.85rem', color: 'var(--prem-muted)', lineHeight: 1.8 }}>
          A boutique marketplace for high-value curated assets, verified by expert appraisers and trusted by collectors worldwide.
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
      <span>© 2026 Sellio. All rights reserved.</span>
      <span>🔒 Secure &amp; Verified Marketplace</span>
    </div>
  </footer>
  );
};

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export { DiamondFooter } from './DiamondFooter';
export { EliteHeader } from './EliteHeader';
