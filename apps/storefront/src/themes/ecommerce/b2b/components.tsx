'use client';

import { useState } from 'react';
import type { Product } from '@sellio/types';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  isProductInStock,
} from '@/themes/unifieds/shared/product-utils';

type Mode = 'light' | 'dark';

export function B2BHeader() {
  const themeLink = useEcommerceThemeLink();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('dark');
  const brandLabel = useThemeContent('header.brand_label', 'SupplyDesk');

  const toggleMode = () => {
    const nextMode: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    document.documentElement.dataset.b2bCatalogMode = nextMode;
  };

  return (
    <header className="b2b-header">
      <a className="b2b-logo" href={themeLink('/')}>{brandLabel}</a>

      <button
        className={`b2b-menu-toggle ${isOpen ? 'b2b-menu-toggle-open' : ''}`}
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`b2b-nav-panel ${isOpen ? 'b2b-nav-panel-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="b2b-nav"
          linkClassName="b2b-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuUtilityNav className="b2b-utility b2b-mobile-utility" onNavigate={() => setIsOpen(false)} />
      </div>

      <div className="b2b-header-actions">
        <MenuUtilityNav className="b2b-utility b2b-desktop-utility" />
        <button type="button" className="b2b-mode-toggle" onClick={toggleMode} aria-label="Toggle dark and light mode">
          {mode === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}

export function B2BProductCard({ product, href, featured = false }: { product: Product; href: string; featured?: boolean }) {
  const category = getProductCategoryLabel(product, [], 'Catalog');
  const inStock = isProductInStock(product);

  return (
    <a href={href} className="b2b-product-card">
      <div className="b2b-product-media">
        <img src={getProductImage(product)} alt={product.title} />
        {featured ? <span className="b2b-card-badge">Preferred</span> : null}
      </div>
      <div className="b2b-product-body">
        <div className="b2b-product-meta">
          <span>{category}</span>
          <span>SKU-{String(product.id).padStart(4, '0')}</span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.description || 'Catalog-ready product with specification review and RFQ workflow.'}</p>
        <div className="b2b-product-footer">
          <strong>{formatProductPrice(product)}</strong>
          <span>{inStock ? 'RFQ ready' : 'Check availability'}</span>
        </div>
      </div>
    </a>
  );
}

export function B2BFooter() {
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('footer.brand_label', 'SupplyDesk');
  const description = useThemeContent(
    'footer.description',
    'A B2B catalog storefront for wholesale buyers, procurement teams, quote requests, and specification-led product discovery.',
  );
  const copyright = useThemeContent('footer.copyright', '(c) 2026 SupplyDesk. All rights reserved.');

  return (
    <footer className="b2b-footer">
      <div className="b2b-footer-grid">
        <div>
          <a className="b2b-logo b2b-footer-logo" href={themeLink('/')}>{brandLabel}</a>
          <p>{copyright.replace(/\u00C2?\u00A9/g, '(c)')}</p>
          <p>{description}</p>
        </div>
        <div>
          <h3>Buyers</h3>
          <a href={themeLink('/explore')}>Browse catalog</a>
          <a href={themeLink('/explore')}>Request pricing</a>
          <a href={themeLink('/cart')}>RFQ list</a>
        </div>
        <div>
          <h3>Procurement</h3>
          <a href={themeLink('/explore')}>Specifications</a>
          <a href={themeLink('/explore')}>Bulk ordering</a>
          <a href={themeLink('/checkout')}>Submit request</a>
        </div>
        <div>
          <h3>Network</h3>
          <MenuNav
            location="social_footer"
            flat
            className="b2b-footer-links"
            linkClassName="b2b-footer-menu-link"
            renderItem={(item, { href, className, onNavigate }) => (
              <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
            )}
          />
        </div>
      </div>
    </footer>
  );
}
