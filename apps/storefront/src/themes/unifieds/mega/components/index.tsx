'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const MegaHeader = () => {
  const themeLink = useUnifiedThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ugm-header">
      <a href={themeLink('/')} className="ugm-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        MEGA<span>GRID</span>
      </a>
      
      <button 
          className={`ugm-hamburger ${isOpen ? 'ugm-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ugm-hamburger-toggle"
      >
          <span className="ugm-hamburger-bar"></span>
          <span className="ugm-hamburger-bar"></span>
          <span className="ugm-hamburger-bar"></span>
      </button>

      <div className={`ugm-nav-panel ${isOpen ? 'ugm-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="ugm-nav"
            linkClassName="ugm-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="ugm-btn-primary ugm-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="ugm-btn-primary ugm-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '4px' }} onClick={onNavigate} id="ugm-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

interface MegaItemProps {
    title: string;
    value: string;
    label: string;
}

const MegaItem = ({ title, value, label }: MegaItemProps) => (
    <div className="ugm-grid-item" >
        <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1.5rem' }}>{title}</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', lineHeight: 1, marginBottom: '0.5rem', color: '#171717' }} className="ugm-value-text">{value}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, color: '#171717' }}>{label}</div>
    </div>
);

interface HeavyweightGridProps {
    listingsTotal?: number | null;
    categoriesCount?: number;
    verticalsCount?: number;
}

export const HeavyweightGrid = ({ listingsTotal, categoriesCount, verticalsCount }: HeavyweightGridProps = {}) => {
    const items = [
        { title: "Live Inventory", value: listingsTotal != null ? listingsTotal.toLocaleString() : '—', label: "Active Listings" },
        { title: "Marketplace Reach", value: verticalsCount != null ? String(verticalsCount) : '—', label: "Categories Served" },
        { title: "Catalog Depth", value: categoriesCount != null ? categoriesCount.toLocaleString() : '—', label: "Listing Categories" },
        { title: "System Uptime", value: "99.9%", label: "Core Reliability" },
    ];

    return (
        <section className="ugm-heavyweight-grid" id="ugm-exchange-section">
            <div style={{ marginBottom: '8rem' }} className="ugm-grid-header">
                <span className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>Platform Capacity</span>
                <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, marginTop: '2rem', letterSpacing: '-3px', color: '#171717', lineHeight: 1.1 }}>Unrivaled <br/>Capacity.</h2>
            </div>
            <div className="ugm-grid">
                {items.map((item, i) => <MegaItem key={i} {...item} />)}
            </div>
        </section>
    );
};

export const MassiveSyncBar = () => (
    <div className="ugm-massive-sync-bar">
        <span>★ PLATFORM STATUS: ONLINE // 99.99% UPTIME</span>
        <span className="ugm-bar-separator">//</span>
        <span>FAST LOAD TIMES &lt;8ms RESPONSE</span>
        <span className="ugm-bar-separator">//</span>
        <span>SECURE HIGH-VOLUME MARKETPLACE</span>
    </div>
);

export const AuthorityFooter = () => {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio');
  const currentYear = new Date().getFullYear();
  return (
    <footer className="ugm-authority-footer">
        <div className="ugm-footer-grid">
            <div>
                <a href={themeLink('/')} className="ugm-logo" style={{ color: 'white', fontSize: '2.2rem', marginBottom: '3rem', textDecoration: 'none' }}>MEGAGRID</a>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A large-scale multi-category marketplace built for high-volume listings and seamless seller and buyer experiences.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ugm-footer-link-group"
                linkClassName="ugm-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ugm-footer-link-group"
                linkClassName="ugm-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ugm-footer-link-group"
                linkClassName="ugm-footer-link"
            />
        </div>
        <div className="ugm-footer-bottom">
            <div className="ugm-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© {currentYear} {siteName}. All rights reserved.</div>
            <div className="ugm-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="ugm-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
  );
};
