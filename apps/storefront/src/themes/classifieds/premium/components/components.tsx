'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

interface HeaderProps {
  homeHref?: string;
}

const adminCreateClassifiedUrl = getAdminBaseUrl() + '/admin/classifieds/create';

export const PremiumHeader = ({ homeHref = '#' }: HeaderProps) => (
  <header className="cp-header">
    <a href={homeHref} className="cp-logo">
      Sellio<span>Premium</span>
    </a>
    
    <div className="cp-nav-panel">
      <MenuNav
        location="main_header"
        flat
        className="cp-nav"
        linkClassName="cp-nav-link"
        activeClassName="active"
        renderItem={defaultNavItemRenderer}
      />
      <MenuActionButtons
        linkClassName="cp-btn-post"
        renderItem={(item, { className, onNavigate }) => (
          <a
            href={adminCreateClassifiedUrl}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onNavigate?.()}
          >
            💼 {item.title}
          </a>
        )}
      />
    </div>
  </header>
);

interface PremiumCardProps {
  title: string;
  price: string;
  description: string;
  location: string;
  image: string;
  isVerified?: boolean;
  onViewDetails: () => void;
}

export const PremiumCard = ({ title, price, description, location, image, isVerified, onViewDetails }: PremiumCardProps) => {
  return (
    <div className="cp-card">
      <div className="cp-card-img-wrap">
        <img src={image} className="cp-card-img" alt={title} />
      </div>
      
      <div className="cp-card-body">
        {isVerified && (
          <span className="cp-badge-verified">
            🛡️ Verified Opportunity
          </span>
        )}
        
        <h5 className="cp-card-title">{title}</h5>
        <p className="cp-card-text">{description}</p>
        
        <div className="cp-card-footer">
          <span className="cp-card-location">📍 {location}</span>
          <span className="cp-card-price">{price}</span>
        </div>
        
        <button className="cp-btn-details" onClick={onViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export const PremiumFooter = () => {
  const themeLink = useClassifiedsThemeLink();
  return (
  <footer className="cp-footer">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
      <div>
        <a href={themeLink('/')} className="cp-logo" style={{ color: 'var(--cp-navy)', marginBottom: '1.25rem' }}>
          Sellio<span>Premium</span>
        </a>
        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
          A premium classified marketplace for high-value listings including established businesses, commercial properties, and curated items.
        </p>
      </div>

      <FooterMenuColumn
        location="footer_column_1"
        titleTag="h4"
        titleStyle={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}
        listClassName="cp-footer-links"
        linkClassName="cp-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_2"
        titleTag="h4"
        titleStyle={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}
        listClassName="cp-footer-links"
        linkClassName="cp-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_3"
        titleTag="h4"
        titleStyle={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}
        listClassName="cp-footer-links"
        linkClassName="cp-footer-link"
      />
    </div>

    <div style={{ borderTop: '1.5px solid var(--cp-border)', paddingTop: '1.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
      <span>&copy; 2026 Sellio. All rights reserved.</span>
    </div>
  </footer>
  );
};

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export const DiamondFooter = () => null;
export const EliteHeader = () => null;
