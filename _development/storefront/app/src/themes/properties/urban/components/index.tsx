'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const SkylineHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pu-header">
      <div style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-1px' }}>
        SKYLINE<span style={{ color: 'var(--pu-cobalt)' }}>Registry</span>
      </div>
      
      <button 
          className={`pu-hamburger ${isOpen ? 'pu-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="pu-hamburger-toggle"
      >
          <span className="pu-hamburger-bar"></span>
          <span className="pu-hamburger-bar"></span>
          <span className="pu-hamburger-bar"></span>
      </button>

      <div className={`pu-nav-panel ${isOpen ? 'pu-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="pu-nav"
            linkClassName="pu-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <div className="pu-mono pu-mobile-status" style={{ padding: '0.5rem 1.5rem', background: 'var(--pu-steel)', color: 'white', marginTop: '2rem', textAlign: 'center' }}>
            SYNC_ACTIVE
          </div>
      </div>

      <div className="pu-mono pu-desktop-status" style={{ padding: '0.5rem 1.5rem', background: 'var(--pu-steel)', color: 'white' }}>
        SYNC_ACTIVE
      </div>
    </header>
  );
};

export const BrutalistUnitCard = ({ title, price, location, beds, sqft, image }: any) => (
  <div className="pu-unit-card" onClick={() => alert(`Connecting unit master: ${title}`)}>
    <div className="pu-unit-img-wrapper">
      <img src={image} alt={title} className="pu-unit-img" />
    </div>
    <div className="pu-unit-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1.5rem' }}>
        <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{title}</h3>
            <div className="pu-mono" style={{ marginTop: '0.75rem', opacity: 0.6 }}>{location}</div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--pu-cobalt)' }} className="pu-unit-price">{price}</div>
    </div>
    <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid currentColor', paddingTop: '1.5rem' }} className="pu-unit-meta">
        <div className="pu-mono">{beds} BD</div>
        <div className="pu-mono">{sqft} SQFT</div>
        <div className="pu-mono">V8_NODE</div>
    </div>
  </div>
);

export const StructuralStat = ({ value, label }: { value: string, label: string }) => (
  <div className="pu-stat-node">
    <div className="pu-stat-value">{value}</div>
    <div className="pu-mono" style={{ opacity: 0.5 }}>{label}</div>
  </div>
);

export const CityPulseFooter = () => (
    <footer className="pu-footer" style={{ background: 'var(--pu-steel)', color: 'white', padding: '10rem 6% 4rem' }}>
        <div className="pu-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '3rem' }}>SKYLINE</div>
                <p style={{ opacity: 0.5, lineHeight: 1.8, maxWidth: '400px', fontSize: '0.95rem' }}>
                    The world's most advanced high-fidelity urban distribution network. Engineering the future of vertical living.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pu-footer-link-group"
                linkClassName="pu-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pu-footer-link-group"
                linkClassName="pu-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pu-footer-link-group"
                linkClassName="pu-footer-link"
            />
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="pu-footer-bottom">
            <div className="pu-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 SELLIO_SKYLINE_OS // VERTICAL_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '3rem' }} className="pu-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="pu-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.3, cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
);
