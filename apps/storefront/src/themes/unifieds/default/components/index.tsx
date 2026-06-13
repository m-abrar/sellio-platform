'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { isCartMenuItem } from '@/themes/unifieds/shared/menu-utils';
import { useUnifiedCartCount } from '@/themes/unifieds/shared/useUnifiedCartCount';

export const OriginHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useUnifiedCartCount();
  const themeLink = useUnifiedThemeLink();

  return (
    <header className="ud-header">
      <a href={themeLink('/')} className="ud-logo" style={{ textDecoration: 'none' }}>
        CORE<span style={{ color: 'var(--ud-azure)' }}>ORIGIN</span>
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

      <MenuNav
        location="main_header"
        flat
        className={`ud-nav ${isOpen ? 'ud-nav-open' : ''}`}
        linkClassName="ud-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { href, className, onNavigate }) => (
          <a href={href} className={className} onClick={onNavigate} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {item.title}
            {isCartMenuItem(item) && cartCount > 0 && (
              <span className="ud-cart-badge">{cartCount}</span>
            )}
          </a>
        )}
      />

      <MenuActionButtons
        as="button"
        buttonClassName="ud-btn-primary ud-mobile-btn"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
        )}
      />

      <MenuActionButtons
        as="button"
        buttonClassName="ud-btn-primary ud-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '8px' }} onClick={onNavigate} id="ud-btn-header-access">{item.title}</button>
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
          <h2 style={{ fontFamily: 'var(--ud-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, color: '#1e293b' }}>Engineered for Scaling.</h2>
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

export const InstitutionalFooter = () => {
  const themeLink = useUnifiedThemeLink();

  return (
    <footer className="ud-institutional-footer">
        <div className="ud-footer-grid">
            <div>
                <a href={themeLink('/')} className="ud-logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem', display: 'block', textDecoration: 'none' }}>
                  CORE<span style={{ color: 'var(--ud-azure)' }}>ORIGIN</span>
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
            <div className="ud-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
            <MenuNav
                location="social_footer"
                flat
                className="ud-footer-socials"
                linkClassName="ud-mono"
                renderItem={(item, { href, className, onNavigate }) => (
                    <span className={className} style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>
                        <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                    </span>
                )}
            />
        </div>
    </footer>
  );
};
