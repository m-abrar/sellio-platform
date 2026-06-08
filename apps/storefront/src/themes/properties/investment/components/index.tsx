'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const InvestmentHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pi-header">
      <div className="pi-logo">
        YIELD<span style={{ color: 'var(--pi-emerald)' }}>Node</span>
      </div>
      
      <button 
          className={`pi-hamburger ${isOpen ? 'pi-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
      >
          <span className="pi-hamburger-bar"></span>
          <span className="pi-hamburger-bar"></span>
          <span className="pi-hamburger-bar"></span>
      </button>

      <div role="navigation" className={`pi-nav-panel ${isOpen ? 'pi-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="pi-nav"
            linkClassName="pi-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          
          <div className="pi-mono pi-mobile-auth-btn" style={{ fontSize: '0.6rem', color: 'var(--pi-emerald)', marginTop: '2rem' }}>
            NETWORK_STABLE_V8
          </div>
      </div>

      <div className="pi-mono pi-desktop-auth-btn" style={{ fontSize: '0.6rem', color: 'var(--pi-emerald)' }}>
        NETWORK_STABLE_V8
      </div>
    </header>
  );
};

export const PortfolioAssetCard = ({ title, yield: yieldVal, price, type, status }: any) => (
  <div className="pi-asset-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className="pi-mono" style={{ fontSize: '0.6rem' }}>{type}</div>
        <div style={{ padding: '0.25rem 0.75rem', background: 'var(--pi-bg)', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--pi-slate)' }}>{status}</div>
    </div>
    <div className="pi-asset-yield">{yieldVal}</div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--pi-midnight)' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pi-border)', paddingTop: '2rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{price}</div>
        <div className="pi-mono" style={{ fontSize: '0.65rem', color: 'var(--pi-emerald)', cursor: 'pointer' }}>EXECUTE →</div>
    </div>
  </div>
);

export const YieldAnalyticsHUD = ({ label, value, color }: { label: string, value: string, color?: string }) => (
    <div>
        <div className="pi-mono" style={{ marginBottom: '0.75rem', fontSize: '0.6rem' }}>{label}</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: color || 'var(--pi-midnight)' }}>{value}</div>
    </div>
);

export const InstitutionalFooter = () => (
    <footer className="pi-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pi-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>YIELDNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The global high-fidelity terminal for institutional real estate investment. Synchronizing capital distribution with verified asset nodes.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3.5rem' }}>{title}</div>}
                listClassName=""
                linkClassName=""
                className=""
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3.5rem' }}>{title}</div>}
                listClassName=""
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3.5rem' }}>{title}</div>}
                listClassName=""
                linkClassName=""
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pi-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 SELLIO_CAPITAL_GRP // SYNC_STABLE</div>
            <MenuNav
                location="social_footer"
                flat
                className=""
                linkClassName="pi-mono"
                renderItem={(item, { href, className, onNavigate }) => (
                    <span className={className} style={{ opacity: 0.3, fontSize: '0.65rem', marginLeft: '4rem' }}>
                        <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                    </span>
                )}
            />
        </div>
    </footer>
);
