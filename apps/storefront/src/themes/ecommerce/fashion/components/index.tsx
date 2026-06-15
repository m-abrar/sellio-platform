'use client';

import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const footerGroups = [
  {
    title: 'Collections',
    links: [
      { label: 'New arrivals', href: '/explore?sort=latest' },
      { label: 'Ready to wear', href: '/explore' },
      { label: 'Accessories', href: '/explore?category=accessories' },
    ],
  },
  {
    title: 'Atelier',
    links: [
      { label: 'Fitting guide', href: '/explore' },
      { label: 'Cart', href: '/cart' },
      { label: 'Checkout', href: '/checkout' },
    ],
  },
  {
    title: 'Client care',
    links: [
      { label: 'Shipping', href: '/checkout' },
      { label: 'Returns', href: '/cart' },
      { label: 'Order review', href: '/checkout/confirm' },
    ],
  },
];

export const RunwayHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'ATELIERRunway');
  const seasonLabel = useThemeContent('header.season_label', 'AUTUMN / WINTER 26');
  const runwayIndex = brandLabel.toLowerCase().indexOf('runway');
  const brandPrimary = runwayIndex >= 0 ? brandLabel.slice(0, runwayIndex) : brandLabel;
  const brandSecondary = runwayIndex >= 0 ? brandLabel.slice(runwayIndex) : '';

  return (
    <header className="ef-header">
      <a className="ef-logo" href={themeLink('/')}>
        {brandPrimary}
        <span>{brandSecondary}</span>
      </a>

      <button
        className={`ef-hamburger ${isOpen ? 'ef-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        type="button"
      >
        <span className="ef-hamburger-bar" />
        <span className="ef-hamburger-bar" />
        <span className="ef-hamburger-bar" />
      </button>

      <div className={`ef-nav-panel ${isOpen ? 'ef-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="ef-nav"
          linkClassName="ef-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <div className="ef-mono ef-mobile-header-meta">
          {seasonLabel}
        </div>
      </div>

      <div className="ef-mono ef-desktop-header-meta">
        {seasonLabel}
      </div>
    </header>
  );
};

interface EditorialLookCardProps {
  name: string;
  price: string | number;
  image: string;
  lookNumber?: string;
  onClick?: () => void;
}

export const EditorialLookCard = ({ name, price, image, lookNumber = 'LOOK 07', onClick }: EditorialLookCardProps) => (
  <div className="ef-look-card" onClick={onClick}>
    <div className="ef-img-frame">
      <img src={image} alt={name} className="ef-img" />
      <div className="ef-look-badge">{lookNumber}</div>
    </div>
    <div className="ef-look-card-body">
      <div className="ef-mono">Ready to wear</div>
      <h3>{name}</h3>
      <div>{price}</div>
    </div>
  </div>
);

export const TrendHUD = ({ label, value }: { label: string; value: string }) => (
  <div className="ef-trend-hud">
    <div>{value}</div>
    <div className="ef-mono">{label}</div>
  </div>
);

export const AtelierFooter = () => {
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('footer.brand_label', 'ATELIER');
  const footerDescription = useThemeContent(
    'footer.description',
    'A refined fashion storefront for curated seasonal pieces, confident checkout, and considered client care.',
  );

  return (
    <footer className="ef-footer">
      <div className="ef-footer-inner">
        <div className="ef-footer-brand-row">
          <a className="ef-logo ef-footer-logo" href={themeLink('/')}>{brandLabel}</a>
          <a className="ef-footer-cta" href={themeLink('/explore')}>Shop the edit</a>
        </div>

        <div className="ef-footer-grid">
          <div className="ef-footer-about">
            <div className="ef-mono">Philosophy</div>
            <p>{footerDescription}</p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title} className="ef-footer-links">
              <div className="ef-mono">{group.title}</div>
              {group.links.map((link) => (
                <a key={link.label} href={themeLink(link.href)}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="ef-footer-bottom">
          <div className="ef-mono">2026 Sellio Atelier. All rights reserved.</div>
          <MenuNav
            location="social_footer"
            flat
            className="ef-footer-social"
            linkClassName="ef-mono"
            renderItem={(item, { href, className, onNavigate }) => (
              <a href={href} className={className} onClick={onNavigate}>
                {item.title}
              </a>
            )}
          />
        </div>
      </div>
    </footer>
  );
};
