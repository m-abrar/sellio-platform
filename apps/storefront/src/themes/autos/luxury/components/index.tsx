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
      <div style={{ overflow: 'hidden', height: '200px' }}>
        <img src={image} className="lx-car-img" alt={title} />
      </div>
      <div className="lx-car-body">
        <h5 className="lx-car-title">{title}</h5>
        <p style={{ color: 'var(--lx-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {specs}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="lx-car-price">{price}</span>
          <a
            href={detailUrl}
            className="lx-btn lx-btn-outline"
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
          >
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

  return (
    <footer className="lx-footer">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}
      >
        <div>
          <a href={themeLink('/')} className="lx-logo" style={{ marginBottom: '1rem', display: 'block', textDecoration: 'none', color: 'inherit' }}>
            {brandLabel}
          </a>
          <p style={{ color: 'var(--lx-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {footerDescription}
          </p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h5"
          titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
          linkClassName="lx-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h5"
          titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
          linkClassName="lx-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_3"
          titleTag="h5"
          titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
          linkClassName="lx-footer-link"
        />
      </div>
      <div
        style={{
          borderTop: '1px solid #333',
          paddingTop: '1.5rem',
          textAlign: 'center',
          color: 'var(--lx-text-muted)',
          fontSize: '0.85rem',
        }}
      >
        © 2026 Sellio. All rights reserved.
      </div>
    </footer>
  );
};
