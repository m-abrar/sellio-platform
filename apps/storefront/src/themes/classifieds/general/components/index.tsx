'use client';
import React from 'react';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { MenuNav } from '@/components/menu/MenuNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onReset: () => void;
}

export const GeneralHeader = ({ searchTerm, onSearchChange, onReset }: HeaderProps) => {
  const brandLabel = useThemeContent('header.brand_label', 'CLASAFIND');
  const brandSplit = Math.ceil(brandLabel.length / 2);
  const searchPlaceholder = useThemeContent('search.placeholder', 'Search for anything...');

  return (
    <header className="cg-header">
      <a href="#" className="cg-logo" onClick={(e) => { e.preventDefault(); onReset(); }}>
        <div className="cg-logo-icon">📦</div>
        <span>{brandLabel.slice(0, brandSplit)}</span>{brandLabel.slice(brandSplit)}
      </a>
      
      <div className="cg-search-bar">
        <span style={{ fontSize: '1rem', color: 'var(--cg-text-muted)', userSelect: 'none' }}>🔍</span>
        <input 
          type="text" 
          className="cg-search-input" 
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="cg-nav">
        <MenuUtilityNav
          className="cg-nav"
          linkClassName="cg-nav-link"
        />
        <MenuActionButtons
          linkClassName="cg-btn cg-btn-primary"
        />
      </div>
    </header>
  );
};

interface ListingCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  onMessageClick: () => void;
  onToggleSave: () => void;
  onClick?: () => void;
}

export const ListingCard = ({ title, price, image, seller, isSaved, onMessageClick, onToggleSave, onClick }: ListingCardProps) => {
  return (
    <div className="cg-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="cg-card-img-wrap">
        <img src={image} className="cg-card-img" alt={title} />
      </div>
      
      <div className="cg-card-body">
        <h3 className="cg-card-title" title={title}>{title}</h3>
        <div className="cg-card-price">{price}</div>
        
        <div className="cg-card-footer">
          <div className="cg-seller-info">
            <div className="cg-seller-avatar">👤</div>
            <span>{seller}</span>
          </div>
          
          <div className="cg-action-buttons">
            <button 
              className="cg-action-btn" 
              title="Message Seller" 
              onClick={(e) => { e.stopPropagation(); onMessageClick(); }}
            >
              ✉️
            </button>
            <button 
              className={`cg-action-btn cg-action-btn-heart ${isSaved ? 'active' : ''}`}
              title="Save Listing" 
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GeneralFooter = () => {
  const footerDescription = useThemeContent(
    'footer.description',
    '2026 ClasaFind Classifieds Suite. All rights reserved. Engineered to Elite Standards.'
  );

  return (
    <footer className="cg-footer">
      <MenuNav
        location="footer_bottom_bar"
        flat
        className="cg-footer-links"
        linkClassName="cg-footer-link"
        renderItem={defaultNavItemRenderer}
      />
      <p style={{ color: 'var(--cg-text-muted)', fontSize: '0.8rem', marginTop: '1.25rem', fontWeight: 500 }}>
        &copy; {footerDescription}
      </p>
    </footer>
  );
};
