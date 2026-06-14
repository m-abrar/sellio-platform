'use client';

import React, { useState } from 'react';
import type { Category, Product } from '@sellio/types';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  isProductInStock,
} from '@/themes/unifieds/shared/product-utils';

export const ShopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'SELLIOShop');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Shop');
  const brandPrefix = brandLabel.endsWith(brandHighlight)
    ? brandLabel.slice(0, -brandHighlight.length)
    : brandLabel;

  return (
    <header className="ed-header">
      <a className="ed-logo" href={themeLink('/')}>
        {brandPrefix}
        <span style={{ color: 'var(--ed-blue)' }}>{brandHighlight}</span>
      </a>

      <button
        className={`ed-hamburger ${isOpen ? 'ed-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        id="ed-hamburger-toggle"
        type="button"
      >
        <span className="ed-hamburger-bar" />
        <span className="ed-hamburger-bar" />
        <span className="ed-hamburger-bar" />
      </button>

      <div className={`ed-nav-panel ${isOpen ? 'ed-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="ed-nav"
          linkClassName="ed-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuUtilityNav className="ed-mono ed-mobile-header-meta" onNavigate={() => setIsOpen(false)} />
      </div>

      <MenuUtilityNav className="ed-mono ed-desktop-header-meta" />
    </header>
  );
};

type EcommerceProductCardProps = {
  product: Product;
  href: string;
  categories?: Category[];
  featured?: boolean;
};

export const EcommerceProductCard = ({
  product,
  href,
  categories = [],
  featured = false,
}: EcommerceProductCardProps) => {
  const category = getProductCategoryLabel(product, categories, 'Shop');
  const inStock = isProductInStock(product);
  const sku = `SKU-${String(product.id).padStart(4, '0')}`;

  return (
    <a href={href} className="ed-product-card">
      <div className="ed-img-frame">
        <img src={getProductImage(product)} alt={product.title} className="ed-img" />
        <div className="ed-card-badges">
          {featured ? <span className="ed-badge ed-badge-featured">Featured</span> : null}
          {!inStock ? <span className="ed-badge ed-badge-muted">Sold out</span> : null}
        </div>
        <div className="ed-price-overlay">{formatProductPrice(product)}</div>
      </div>
      <div className="ed-card-body">
        <div className="ed-card-topline">
          <span>{category}</span>
          <span>{sku}</span>
        </div>
        <h3>{product.title}</h3>
        <p>
          {product.description ||
            'Live catalog product with pricing, inventory, and checkout support.'}
        </p>
        <div className="ed-card-footer">
          <span className={inStock ? 'ed-stock ed-stock-in' : 'ed-stock ed-stock-out'}>
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
          <span className="ed-card-action">{inStock ? 'View product' : 'Details'}</span>
        </div>
      </div>
    </a>
  );
};

export const PremiumProductCard = ({
  name,
  price,
  category,
  image,
}: {
  name: string;
  price: string;
  category: string;
  image: string;
}) => (
  <div className="ed-product-card">
    <div className="ed-img-frame">
      <img src={image} alt={name} className="ed-img" />
      <div className="ed-price-overlay">{price}</div>
    </div>
    <div className="ed-card-body">
      <div className="ed-card-topline">
        <span>{category}</span>
      </div>
      <h3>{name}</h3>
    </div>
  </div>
);

export const CategoryRibbon = ({
  label,
  count,
  href,
}: {
  label: string;
  count: string;
  href: string;
}) => (
  <a href={href} className="ed-category-ribbon category-item-hover">
    <div>{label}</div>
    <span className="ed-mono">{count} items</span>
  </a>
);

export const TransactionFooter = () => {
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'SELLIOShop');
  const footerBrand = useThemeContent('footer.brand_label', 'SELLIO');
  const description = useThemeContent(
    'footer.description',
    'A flexible ecommerce storefront for curated products, fast checkout, seller-managed inventory, and polished customer discovery.',
  );
  const copyright = useThemeContent(
    'footer.copyright',
    '© 2026 Sellio Shop. All rights reserved.',
  );

  return (
    <footer className="ed-footer">
      <div className="ed-footer-grid">
        <div>
          <a className="ed-logo ed-footer-logo" href={themeLink('/')}>{footerBrand || brandLabel}</a>
          <p className="ed-footer-description">{description}</p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          renderTitle={(title) => <div className="ed-mono ed-footer-title">{title}</div>}
          listClassName=""
          linkClassName=""
        />
        <FooterMenuColumn
          location="footer_column_2"
          renderTitle={(title) => <div className="ed-mono ed-footer-title">{title}</div>}
        />
        <FooterMenuColumn
          location="footer_column_3"
          renderTitle={(title) => <div className="ed-mono ed-footer-title">{title}</div>}
        />
      </div>
      <div className="ed-footer-bottom">
        <div className="ed-mono ed-footer-copyright">{copyright}</div>
        <MenuNav
          location="social_footer"
          flat
          className="ed-footer-social"
          linkClassName="ed-mono"
          renderItem={(item, { href, className, onNavigate }) => (
            <a href={href} className={className} onClick={onNavigate}>
              {item.title}
            </a>
          )}
        />
      </div>
    </footer>
  );
};
