'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { isCartMenuItem } from '@/themes/unifieds/shared/menu-utils';
import { useUnifiedCartCount } from '@/themes/unifieds/shared/useUnifiedCartCount';

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const OriginHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useUnifiedCartCount();
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio');

  return (
    <header className="ud-header">
      <a href={themeLink('/')} className="ud-logo ud-logo-mark" style={{ textDecoration: 'none' }}>
        <span className="ud-logo-icon" aria-hidden="true">{siteName.charAt(0).toUpperCase()}</span>
        <span className="ud-logo-text">{siteName}</span>
      </a>

      <button
          className={`ud-hamburger ${isOpen ? 'ud-hamburger-open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ud-hamburger-toggle"
      >
          <span className="ud-hamburger-bar"></span>
          <span className="ud-hamburger-bar"></span>
          <span className="ud-hamburger-bar"></span>
      </button>

      {isOpen && <div className="ud-nav-backdrop" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <MenuNav
        location="main_header"
        flat
        className={`ud-nav ${isOpen ? 'ud-nav-open' : ''}`}
        linkClassName="ud-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { href, className, onNavigate }) => (
          <a href={href} className={className} onClick={onNavigate}>
            {isCartMenuItem(item) && <CartIcon />}
            {item.title}
            {isCartMenuItem(item) && cartCount > 0 && (
              <span className="ud-cart-badge">{cartCount}</span>
            )}
          </a>
        )}
      />

      <MenuActionButtons
        as="button"
        buttonClassName="core-btn-primary ud-btn-header ud-mobile-btn"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
        )}
      />

      <MenuActionButtons
        as="button"
        buttonClassName="core-btn-primary ud-btn-header ud-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={onNavigate} id="ud-btn-header-access">
            {item.title}
            <ArrowIcon />
          </button>
        )}
      />
    </header>
  );
};

export const CoreFeatures = () => {
  const features = [
    { icon: "🛍️", title: "Multi-Vertical Commerce", description: "Sell products, properties, services, jobs, autos, events, and classifieds — all from one unified platform." },
    { icon: "⚡", title: "Fast & Responsive", description: "Optimized for speed with smooth browsing, lazy-loaded images, and a mobile-first layout on every device." },
    { icon: "📊", title: "Seller Analytics", description: "Built-in insights to help sellers track performance, manage inventory, and grow their business over time." },
  ];

  return (
    <section className="ud-features" id="ud-features-section">
      <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="ud-features-header">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1.5rem' }}>Why choose us</div>
          <h2 style={{ fontFamily: 'var(--ud-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, color: '#1e293b' }}>Built for buyers and sellers.</h2>
      </div>
      <div className="ud-feature-grid">
        {features.map((f, i) => (
          <div key={i} className="ud-feature-card-premium">
            <span className="ud-feature-icon">{f.icon}</span>
            <h3 style={{ fontFamily: 'var(--ud-font-heading)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>{f.title}</h3>
            <p style={{ color: 'var(--ud-slate)', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const GlobalTrust = () => (
    <section className="ud-trust-bar" aria-label="Trust signals">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }} className="ud-trust-container">
            {['Secure Payments', 'Verified Sellers', 'Fast Delivery', 'Multi-Vertical Platform'].map(trust => (
                <div key={trust} className="ud-mono" style={{ fontSize: '0.7rem', color: 'var(--ud-slate)', opacity: 0.8 }}>{trust}</div>
            ))}
        </div>
    </section>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
};

export const InstitutionalFooter = () => {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ud-institutional-footer">
        <div className="ud-footer-grid">
            <div>
                <a href={themeLink('/')} className="ud-logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem', display: 'block', textDecoration: 'none' }}>
                  {siteName}
                </a>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A multi-vertical marketplace for products, properties, services, and more — all in one place.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="ud-mono" style={{ color: 'white', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="ud-mono" style={{ color: 'white', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="ud-mono" style={{ color: 'white', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
        </div>
        <div className="ud-footer-bottom">
            <MenuNav
                location="social_footer"
                flat
                className="ud-footer-socials"
                linkClassName="ud-footer-social-link"
                renderItem={(item, { href, className, onNavigate }) => (
                    <a href={href} onClick={onNavigate} className={className} aria-label={item.title} title={item.title}>
                        {SOCIAL_ICONS[item.title.toLowerCase()] ?? item.title}
                    </a>
                )}
            />
            <div className="ud-mono ud-footer-copyright">© {currentYear} {siteName}. All rights reserved.</div>
        </div>
    </footer>
  );
};
