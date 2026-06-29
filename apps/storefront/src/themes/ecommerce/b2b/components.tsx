'use client';

import { useState } from 'react';
import type { Product } from '@/types';
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
import aadabLogo from './assets/aadab-logo.webp';

const B2B_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/explore', label: 'Instruments' },
  { href: '/blog', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export function B2BHeader() {
  const themeLink = useEcommerceThemeLink();
  const cmsNavItems = useMenu('main_header');
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'Aadab International');

  return (
    <header className="b2b-header">
      <div className="b2b-header-brand">
        <a className="b2b-logo b2b-logo-image" href={themeLink('/')} aria-label={brandLabel}>
          <img src={aadabLogo.src} alt={brandLabel} />
        </a>
        <span className="b2b-header-meta">Orthopedic instruments Manufacturers <br/> & Exporters</span>
      </div>

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
          <a href={themeLink('/explore')} className="b2b-nav-link" onClick={() => setIsOpen(false)}>Catalog</a>
          <a href={themeLink('/quote')} className="b2b-nav-link" onClick={() => setIsOpen(false)}>Request Quote</a>
        </div>
      </div>

      <div className="b2b-header-actions">
        <a href={themeLink('/explore')} className="b2b-header-catalog">
          Catalog
        </a>
        <a href={themeLink('/quote')} className="b2b-btn b2b-btn-primary b2b-header-cta">
          Request Quote
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
          {inStock ? 'In stock' : 'Quote only'}
        </span>
      </div>
      <div className="b2b-product-body">
        <div className="b2b-product-meta">
          <span className="b2b-product-category">{category}</span>
          <code className="b2b-product-sku-code">SKU-{String(product.id).padStart(4, '0')}</code>
        </div>
        <h3>{product.title}</h3>
        <div className="b2b-product-footer">
          <span className="b2b-product-rfq-label">
            Request quote
          </span>
          <svg className="b2b-product-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="b2b-topbar-pin" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span>Sialkot, Pakistan</span>
          <span className="b2b-topbar-dot" aria-hidden="true">·</span>
          <span>Est. 1942</span>
          <span className="b2b-topbar-dot" aria-hidden="true">·</span>
          <span className="b2b-topbar-tagline">Orthopedic instruments manufacturer &amp; exporter</span>
        </div>
        <div className="b2b-topbar-right">
          <a href="https://wa.me/923304819191" target="_blank" rel="noopener noreferrer" className="b2b-topbar-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.118 1.529 5.845L0 24l6.335-1.509A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.932 0-3.742-.523-5.287-1.433l-.378-.225-3.762.896.952-3.666-.248-.388A9.94 9.94 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            +92 330 481 9191
          </a>
          <span className="b2b-topbar-sep" aria-hidden="true">|</span>
          <a href={themeLink('/explore')} className="b2b-topbar-link">Catalog</a>
          <span className="b2b-topbar-sep" aria-hidden="true">|</span>
          <a href={themeLink('/quote')} className="b2b-topbar-link b2b-topbar-rfq-pill">Send RFQ</a>
        </div>
      </div>
    </div>
  );
}

export function B2BFooter() {
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('footer.brand_label', 'Aadab International');
  const tagline = useThemeContent('footer.tagline', 'Manufacturers & Exporters of Orthopedic Instruments');
  const description = 'We focus on meticulous craftsmanship, delivering our products that expertly blend the intricate structures of bones, biomechanical properties, and precision engineering.';
  const copyrightRaw = useThemeContent('footer.copyright', '');

  return (
    <footer className="b2b-footer">
      <div className="b2b-footer-prefooter">
        <div className="b2b-footer-prefooter-inner">
          <div className="b2b-footer-prefooter-copy">
            <h2>Send your orthopedic instrument list.</h2>
            <p>We will review the pattern, quantity, finish, marking, packing, and export details before quoting.</p>
          </div>
          <div className="b2b-footer-prefooter-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse instruments</a>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">Request a quote</a>
          </div>
        </div>
      </div>
      <div className="b2b-footer-main">
      <div className="b2b-footer-inner">
        <div className="b2b-footer-brand">
          <a className="b2b-logo b2b-logo-image" href={themeLink('/')} aria-label={brandLabel}>
            <img src={aadabLogo.src} alt={brandLabel} />
          </a>
          <p className="b2b-footer-tagline">{tagline}</p>
          <p className="b2b-footer-desc">{description}</p>
          <div className="b2b-footer-badges">
            <span className="b2b-trust-badge">Orthopedic instruments</span>
            <span className="b2b-trust-badge">Private label enquiries</span>
            <span className="b2b-trust-badge">Reusable stainless steel</span>
          </div>
        </div>

        <div className="b2b-footer-col">
          <h3>Instruments</h3>
          <div className="b2b-footer-links">
            <a href={themeLink('/explore')}>Browse instruments</a>
            <a href={themeLink('/explore')}>Request a quote</a>
            <a href={themeLink('/cart')}>My quote list</a>
            <a href={themeLink('/explore')}>Instrument specifications</a>
            <a href={themeLink('/explore')}>Instrument sets</a>
          </div>
        </div>

        <div className="b2b-footer-col">
          <h3>Manufacturing</h3>
          <div className="b2b-footer-links">
            <a href={themeLink('/contact')}>OEM instruments</a>
            <a href={themeLink('/contact')}>Private label</a>
            <a href={themeLink('/contact')}>Custom trays</a>
            <a href={themeLink('/contact')}>Export enquiries</a>
            <a href={themeLink('/explore')}>Packing and documents</a>
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
        <p>{copyrightRaw ? copyrightRaw.replace(/Â©|Â\?©/g, '(c)') : `(c) ${new Date().getFullYear()} ${brandLabel}. All rights reserved.`}</p>
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
