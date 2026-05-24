'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const CommunityHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pn-header">
      <div className="pn-logo">
        <span style={{ fontSize: '1.75rem' }}>🏡</span>
        HOOD<span style={{ color: 'var(--pn-ochre)' }}>Node</span>
      </div>
      
      <button 
          className={`pn-hamburger ${isOpen ? 'pn-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
      >
          <span className="pn-hamburger-bar"></span>
          <span className="pn-hamburger-bar"></span>
          <span className="pn-hamburger-bar"></span>
      </button>

      <div className={`pn-nav-panel ${isOpen ? 'pn-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="pn-nav"
            linkClassName="pn-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="pn-btn-primary pn-mobile-auth-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.9rem', marginTop: '2rem' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="pn-btn-primary pn-desktop-auth-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.7rem 1.8rem', fontSize: '0.8rem' }} onClick={onNavigate}>{item.title}</button>
        )}
      />
    </header>
  );
};

export const NeighborPropertyCard = ({ title, price, location, status, image }: any) => (
  <div className="pn-home-card">
    <div className="pn-card-img-wrapper">
      <img src={image} alt={title} className="pn-card-img" />
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'white', padding: '0.5rem 1.25rem', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', color: 'var(--pn-sage)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
        {status.toUpperCase()}
      </div>
    </div>
    <div style={{ padding: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--pn-font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--pn-text-muted)', marginBottom: '2rem' }}>{location}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--pn-forest)', marginBottom: '2.5rem' }}>{price}</div>
        
        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--pn-border)', paddingTop: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pn-sage)' }}>
                <span>✓</span> VERIFIED_NODE
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pn-ochre)' }}>DETAILS →</div>
        </div>
    </div>
  </div>
);

export const LocalInsightHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ textAlign: 'center', borderRight: '1px solid var(--pn-border)', padding: '0 3rem' }}>
        <div className="pn-mono" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--pn-forest)' }}>{value}</div>
    </div>
);

export const HoodFooter = () => (
    <footer className="pn-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pn-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>HOODNODE</div>
                <p style={{ opacity: 0.6, lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    A high-fidelity neighborhood registry designed for families and high-trust communities. Synchronizing local insights with global residential nodes.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="pn-mono" style={{ color: 'var(--pn-ochre)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="pn-mono" style={{ color: 'var(--pn-ochre)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="pn-mono" style={{ color: 'var(--pn-ochre)', marginBottom: '3.5rem' }}>{title}</div>}
                linkClassName=""
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pn-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_NEIGHBORHOOD_OS // TRUST_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="pn-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.4, fontSize: '0.65rem' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
);
