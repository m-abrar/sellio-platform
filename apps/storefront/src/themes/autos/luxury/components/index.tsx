'use client';

import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useAutosThemeLink } from '../../shared/useAutosThemeLink';

export const LuxuryHeader = () => {
  const themeLink = useAutosThemeLink();
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'Velvet Wheels');

  return (
    <header className="lx-header">
      <a href={themeLink('/')} className="lx-logo">
        {brandLabel}
      </a>

      <button
        className={`lx-hamburger ${isOpen ? 'lx-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        id="lx-hamburger-toggle"
      >
        <span className="lx-hamburger-bar" />
        <span className="lx-hamburger-bar" />
        <span className="lx-hamburger-bar" />
      </button>

      <div className={`lx-nav-panel ${isOpen ? 'lx-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="lx-nav"
          linkClassName="lx-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <MenuActionButtons
          linkClassName="lx-btn lx-btn-gold"
          onNavigate={() => setIsOpen(false)}
        />
      </div>
    </header>
  );
};

interface LuxuryCarCardProps {
  title: string;
  specs: string;
  price: string;
  image: string;
  slug?: string;
}

export const LuxuryCarCard = ({ title, specs, price, image, slug }: LuxuryCarCardProps) => {
  const themeLink = useAutosThemeLink();
  const detailUrl = slug ? themeLink(`/product/${slug}`) : '#';

  return (
    <div className="lx-car-card">
      <div className="lx-car-img-wrap">
        <img src={image} className="lx-car-img" alt={title} />
      </div>
      <div className="lx-car-body">
        <h5 className="lx-car-title">{title}</h5>
        <p className="lx-car-specs">{specs}</p>
        <div className="lx-car-meta">
          <span className="lx-car-price">{price}</span>
          <a href={detailUrl} className="lx-btn lx-btn-outline lx-car-detail-btn">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export const LuxuryFooter = () => {
  const themeLink = useAutosThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'Velvet Wheels');
  const footerDescription = useThemeContent(
    'footer.description',
    "Curating the world's finest automobiles for the most discerning clientele.",
  );
  const footerCopyright = useThemeContent('footer.copyright', '');

  return (
    <footer className="lx-footer">
      <div className="lx-footer-grid">
        <div>
          <a href={themeLink('/')} className="lx-logo lx-footer-logo">
            {brandLabel}
          </a>
          <p className="lx-footer-desc">{footerDescription}</p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          renderTitle={(title) => <h5 className="lx-footer-col-title">{title}</h5>}
          linkClassName="lx-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          renderTitle={(title) => <h5 className="lx-footer-col-title">{title}</h5>}
          linkClassName="lx-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_3"
          renderTitle={(title) => <h5 className="lx-footer-col-title">{title}</h5>}
          linkClassName="lx-footer-link"
        />
      </div>
      <div className="lx-footer-bottom">
        {footerCopyright || `© ${new Date().getFullYear()}. All rights reserved.`}
      </div>
    </footer>
  );
};
