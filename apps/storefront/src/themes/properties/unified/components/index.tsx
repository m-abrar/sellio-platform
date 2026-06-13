'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const UniversalHeader = () => {
  const themeLink = usePropertyThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="uh-header">
      <a href={themeLink('/')} className="uh-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        UNIFIED<span style={{ color: 'var(--uh-blue)' }}>Hub</span>
      </a>
      
      <button 
          className={`uh-hamburger ${isOpen ? 'uh-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="uh-hamburger-toggle"
      >
          <span className="uh-hamburger-bar"></span>
          <span className="uh-hamburger-bar"></span>
          <span className="uh-hamburger-bar"></span>
      </button>

      <div className={`uh-nav-panel ${isOpen ? 'uh-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="uh-nav"
            linkClassName="uh-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <div className="uh-mono uh-mobile-status" style={{ fontSize: '0.65rem', border: '1px solid var(--uh-border)', padding: '0.5rem 1.5rem', marginTop: '2rem', textAlign: 'center', borderRadius: '4px' }}>
            Sellio Platform
          </div>
      </div>

      <div className="uh-mono uh-desktop-status" style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--uh-border)', borderRadius: '4px', fontSize: '0.65rem' }}>
        Sellio Platform
      </div>
    </header>
  );
};

export const UnifiedPropCard = ({ title, price, location, type, image }: any) => (
  <div className="uh-prop-card" >
    <div className="uh-card-img-wrapper">
      <img src={image} alt={title} className="uh-card-img" />
      <span style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        background: 'var(--uh-indigo)',
        color: 'white',
        padding: '0.4rem 1rem',
        borderRadius: '3px',
        fontWeight: 900,
        fontSize: '0.6rem',
        letterSpacing: '1px'
      }}>
        {type.toUpperCase()}
      </span>
    </div>
    <div className="uh-card-info">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--uh-indigo)' }}>{title}</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--uh-slate)', marginBottom: '1.5rem' }}>{location}</div>
        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--uh-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {price}
            <span style={{ fontSize: '0.75rem', color: 'var(--uh-slate)', fontWeight: 800 }} className="uh-card-link">DETAILS →</span>
        </div>
    </div>
  </div>
);

export const MarketMetricsHUD = () => (
    <div className="uh-metrics-bar">
        {[
            { label: 'Assets Managed', value: '$12.5B' },
            { label: 'Platform Status', value: 'Active' },
            { label: 'Listing Accuracy', value: '99.8%' },
            { label: 'Compliance', value: 'Verified' }
        ].map(metric => (
            <div key={metric.label} className="uh-metric-item">
                <div className="uh-mono" style={{ fontSize: '0.65rem', color: 'var(--uh-slate)', marginBottom: '0.5rem' }}>{metric.label}</div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--uh-indigo)', letterSpacing: '-0.5px' }}>{metric.value}</div>
            </div>
        ))}
    </div>
);

export const GlobalFooter = () => {
  const themeLink = usePropertyThemeLink();
  return (
    <footer className="uh-footer">
        <div className="uh-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <a href={themeLink('/')} className="uh-logo" style={{ fontSize: '2.5rem', marginBottom: '3.5rem', textDecoration: 'none', color: 'inherit' }}>UNIFIED</a>
                <p style={{ color: 'var(--uh-slate)', lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A complete property platform for residential, commercial, and investment listings — all in one place.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="uh-mono" style={{ color: 'var(--uh-indigo)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="uh-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="uh-mono" style={{ color: 'var(--uh-indigo)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="uh-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="uh-mono" style={{ color: 'var(--uh-indigo)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName="uh-footer-link"
            />
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--uh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="uh-footer-bottom">
            <div className="uh-mono" style={{ color: 'var(--uh-slate)', fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '4rem' }} className="uh-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="uh-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ color: 'var(--uh-slate)', fontSize: '0.65rem', cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
  );
};
