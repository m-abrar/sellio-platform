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
  <header className="cp-header">
    <a href="#" className="cp-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
      Sellio<span>Premium</span>
    </a>
    
    <div className="cp-nav">
      <MenuNav
        location="main_header"
        flat
        linkClassName="cp-nav-link"
        activeClassName="active"
        renderItem={defaultNavItemRenderer}
      />
      <MenuActionButtons
        buttonClassName="cp-btn-post"
        as="button"
        onAction={onPostClick}
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={() => { onPostClick(); onNavigate?.(); }}>
            💼 {item.title}
          </button>
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
          View Memorandum & Details
        </button>
      </div>
    </div>
  );
};

export const PremiumFooter = () => (
  <footer className="cp-footer">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
      <div>
        <a href="#" className="cp-logo" style={{ color: 'var(--cp-navy)', marginBottom: '1.25rem' }} onClick={(e) => e.preventDefault()}>
          Sellio<span>Premium</span>
        </a>
        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
          The premier boutique marketplace connecting serious, high-net-worth investors with established business acquisitions, franchises, and digital SaaS properties.
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
    
    <div style={{ borderTop: '1.5px solid var(--cp-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
      <span>&copy; 2026 Sellio Premium Holdings Ltd. Vetted Network. All rights reserved.</span>
      <span>🔒 Escrow Secured Node &bull; Elite Sovereign Standards</span>
    </div>
  </footer>
);

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export const DiamondFooter = () => null;
export const EliteHeader = () => null;
