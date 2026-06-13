'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const ArtisanHeader = () => {
  const themeLink = usePropertyThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ps-header">
      <a href={themeLink('/')} className="ps-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        ATELIER<span style={{ color: 'var(--ps-gold)', fontSize: '1rem', verticalAlign: 'top', marginLeft: '4px' }}>®</span>
      </a>
      
      <button 
          className={`ps-hamburger ${isOpen ? 'ps-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ps-hamburger-toggle"
      >
          <span className="ps-hamburger-bar"></span>
          <span className="ps-hamburger-bar"></span>
          <span className="ps-hamburger-bar"></span>
      </button>

      <div className={`ps-nav-panel ${isOpen ? 'ps-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="ps-nav"
            linkClassName="ps-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <div className="ps-mono ps-mobile-status" style={{ fontSize: '0.6rem', border: '1px solid var(--ps-gold)', padding: '0.5rem 1.5rem', marginTop: '2rem', textAlign: 'center' }}>
            Sellio Platform
          </div>
      </div>

      <div className="ps-mono ps-desktop-status" style={{ fontSize: '0.6rem', border: '1px solid var(--ps-gold)', padding: '0.5rem 1.5rem' }}>
        Sellio Platform
      </div>
    </header>
  );
};

export const CinematicPropertyCard = ({ title, price, location, description, image }: any) => (
  <div className="ps-story-card">
    <div className="ps-img-frame">
      <img src={image} alt={title} className="ps-img" />
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        right: '2rem', 
        background: 'var(--ps-gold)', 
        color: 'var(--ps-charcoal)', 
        padding: '0.5rem 1.5rem', 
        fontWeight: 900, 
        fontSize: '0.7rem',
        letterSpacing: '2px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        Featured
      </div>
    </div>
    <div className="ps-story-content" style={{ padding: '2rem' }}>
        <div className="ps-mono" style={{ marginBottom: '2rem' }}>{location}</div>
        <h3 className="ps-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1, color: 'var(--ps-canvas)' }}>{title}</h3>
        <p style={{ fontSize: '1.25rem', color: 'var(--ps-text-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>{description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 700, color: 'var(--ps-gold)' }}>{price}</div>
            <div style={{ borderBottom: '2px solid var(--ps-gold)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '4px' }} className="ps-provenance-btn">
                View Details →
            </div>
        </div>
    </div>
  </div>
);

export const CuratorStats = ({ value, label }: { value: string, label: string }) => (
    <div className="ps-stat-node" style={{ borderLeft: '1px solid var(--ps-gold)', paddingLeft: '3rem' }}>
        <div style={{ fontSize: '4rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 900, color: 'var(--ps-gold)', marginBottom: '1rem', lineHeight: 1 }}>{value}</div>
        <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem' }}>{label}</div>
    </div>
);

export const EditorialFooter = () => {
  const themeLink = usePropertyThemeLink();
  return (
    <footer className="ps-footer">
        <div className="ps-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <a href={themeLink('/')} className="ps-logo" style={{ fontSize: '3rem', marginBottom: '3rem', textDecoration: 'none', color: 'inherit' }}>ATELIER</a>
                <p style={{ color: 'var(--ps-text-dim)', lineHeight: 2, fontSize: '1rem', maxWidth: '500px' }}>
                    A curated collection of the world's most significant architectural achievements, selected for provenance, heritage, and artistic significance.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="ps-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="ps-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="ps-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="ps-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="ps-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="ps-footer-link"
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ps-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="ps-footer-bottom">
            <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '5rem' }} className="ps-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="ps-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem', cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
  );
};
