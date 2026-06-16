'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useMenu } from '@/components/menu/MenuProvider';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import {
  getProductCategoryLabel,
  getProductImage,
  isProductInStock,
} from '@/themes/unifieds/shared/product-utils';

type Mode = 'light' | 'dark';

const B2B_NAV_LINKS = [
  { href: '/explore', label: 'Catalog' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export function B2BHeader() {
  const themeLink = useEcommerceThemeLink();
  const cmsNavItems = useMenu('main_header');
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('b2b_display_mode') as Mode | null;
      return saved === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });
  const brandLabel = useThemeContent('header.brand_label', 'SupplyDesk');

  useEffect(() => {
    if (mode === 'light') {
      document.documentElement.dataset.b2bCatalogMode = 'light';
    } else {
      delete document.documentElement.dataset.b2bCatalogMode;
    }
  }, [mode]);

  const toggleMode = () => {
    const nextMode: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('b2b_display_mode', nextMode);
  };

  return (
    <header className="b2b-header">
      <a className="b2b-logo" href={themeLink('/')}>{brandLabel}</a>

      <button
        className="b2b-menu-toggle"
        type="button"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <div className={`b2b-nav-panel ${isOpen ? 'b2b-nav-panel-open' : ''}`}>
        <nav className="b2b-nav" aria-label="Main navigation">
          {cmsNavItems.length > 0
            ? cmsNavItems.map((item) => (
                <a key={item.id} href={themeLink(item.url ?? '/')} className="b2b-nav-link" onClick={() => setIsOpen(false)}>
                  {item.title}
                </a>
              ))
            : B2B_NAV_LINKS.map((item) => (
                <a key={item.href} href={themeLink(item.href)} className="b2b-nav-link" onClick={() => setIsOpen(false)}>
                  {item.label}
                </a>
              ))}
        </nav>
        <div className="b2b-mobile-utility">
          <MenuUtilityNav className="b2b-utility" onNavigate={() => setIsOpen(false)} />
        </div>
      </div>

      <div className="b2b-header-actions">
        <a href={themeLink('/explore')} className="b2b-icon-btn" aria-label="Search catalog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
        <MenuUtilityNav className="b2b-utility b2b-desktop-utility" />
        <button
          type="button"
          className="b2b-mode-toggle"
          onClick={toggleMode}
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary b2b-header-cta">
          Get a Quote
        </a>
      </div>
    </header>
  );
}

export function B2BProductCard({ product, href, featured = false }: { product: Product; href: string; featured?: boolean }) {
  const category = getProductCategoryLabel(product, [], 'General');
  const inStock = isProductInStock(product);

  return (
    <a href={href} className="b2b-product-card">
      <div className="b2b-product-media">
        <img src={getProductImage(product)} alt={product.title} loading="lazy" />
        {featured && <span className="b2b-card-badge">Featured</span>}
        <span className={`b2b-stock-badge ${inStock ? 'b2b-stock-in' : 'b2b-stock-out'}`}>
          {inStock ? '✓ In stock' : 'Quote only'}
        </span>
      </div>
      <div className="b2b-product-body">
        <div className="b2b-product-meta">
          <span>{category}</span>
          <span>SKU-{String(product.id).padStart(4, '0')}</span>
        </div>
        <h3>{product.title}</h3>
        <div className="b2b-product-footer">
          <span className="b2b-product-rfq-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Request quote
          </span>
          <span className="b2b-product-arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </a>
  );
}

export function B2BTopbar() {
  const themeLink = useEcommerceThemeLink();
  return (
    <div className="b2b-topbar" role="banner">
      <div className="b2b-topbar-inner">
        <div className="b2b-topbar-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>+1 (800) 555-0192</span>
          <span className="b2b-topbar-sep" aria-hidden="true">|</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>procurement@supplydesk.com</span>
        </div>
        <div className="b2b-topbar-right">
          <span className="b2b-topbar-badge">ISO 9001 Certified</span>
          <span className="b2b-topbar-sep" aria-hidden="true">|</span>
          <a href={themeLink('/explore')} className="b2b-topbar-link">Browse catalog</a>
          <span className="b2b-topbar-sep" aria-hidden="true">|</span>
          <MenuUtilityNav className="b2b-topbar-utility" />
        </div>
      </div>
    </div>
  );
}

export function B2BFooter() {
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('footer.brand_label', 'SupplyDesk');
  const tagline = useThemeContent('footer.tagline', 'Precision manufacturing for global markets.');
  const description = useThemeContent(
    'footer.description',
    'We engineer and supply industrial components to businesses across 47 countries. Browse our product catalog, request pricing, and place orders directly — no intermediaries.',
  );
  const copyright = useThemeContent('footer.copyright', '© 2026 SupplyDesk. All rights reserved.');

  return (
    <footer className="b2b-footer">
      <div className="b2b-footer-prefooter">
        <div className="b2b-footer-prefooter-inner">
          <div className="b2b-footer-prefooter-copy">
            <h2>Source directly from the manufacturer.</h2>
            <p>No intermediaries. No mark-ups. Consistent quality backed by 40 years of precision engineering and ISO-certified production.</p>
          </div>
          <div className="b2b-footer-prefooter-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse catalog</a>
            <a href="#b2b-rfq" className="b2b-btn b2b-btn-secondary">Request a quote</a>
          </div>
        </div>
      </div>
      <div className="b2b-footer-main">
      <div className="b2b-footer-inner">
        <div className="b2b-footer-brand">
          <a className="b2b-logo" href={themeLink('/')}>{brandLabel}</a>
          <p className="b2b-footer-tagline">{tagline}</p>
          <p className="b2b-footer-desc">{description}</p>
          <div className="b2b-footer-badges">
            <span className="b2b-trust-badge">✓ ISO 9001 Certified</span>
            <span className="b2b-trust-badge">✓ IATF 16949</span>
            <span className="b2b-trust-badge">✓ AS9100D</span>
          </div>
        </div>

        <div className="b2b-footer-col">
          <h3>Products</h3>
          <div className="b2b-footer-links">
            <a href={themeLink('/explore')}>Browse catalog</a>
            <a href={themeLink('/explore')}>Request a quote</a>
            <a href={themeLink('/cart')}>My quote list</a>
            <a href={themeLink('/explore')}>Product specifications</a>
            <a href={themeLink('/explore')}>Download datasheets</a>
          </div>
        </div>

        <div className="b2b-footer-col">
          <h3>Manufacturing</h3>
          <div className="b2b-footer-links">
            <a href={themeLink('/contact')}>Custom manufacturing</a>
            <a href={themeLink('/contact')}>OEM supply</a>
            <a href={themeLink('/contact')}>Prototype orders</a>
            <a href={themeLink('/contact')}>Bulk & long-term contracts</a>
            <a href={themeLink('/explore')}>Quality documentation</a>
          </div>
        </div>

        <div className="b2b-footer-col">
          <h3>Company</h3>
          <div className="b2b-footer-links">
            <a href={themeLink('/about')}>About us</a>
            <a href={themeLink('/blog')}>Insights</a>
            <a href={themeLink('/contact')}>Contact</a>
            <MenuNav
              location="social_footer"
              flat
              className="b2b-footer-links"
              linkClassName="b2b-footer-link"
              renderItem={(item, { href, className, onNavigate }) => (
                <a key={item.id} href={href} className={className} onClick={onNavigate}>{item.title}</a>
              )}
            />
          </div>
        </div>
      </div>

      <div className="b2b-footer-bottom">
        <p>{copyright.replace(/Â?©/g, '©')}</p>
        <div className="b2b-footer-legal">
          <a href={themeLink('/')}>Privacy Policy</a>
          <a href={themeLink('/')}>Terms of Service</a>
          <a href={themeLink('/')}>Cookie Settings</a>
        </div>
      </div>
      </div>
    </footer>
  );
}
