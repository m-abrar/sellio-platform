'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useAutosThemeLink } from '../../shared/useAutosThemeLink';

const BrandLogo = ({ label }: { label: string }) => {
  const [firstWord, ...restWords] = label.split(' ');
  return (
    <>
      <span style={{ color: 'var(--md-primary)' }}>⚡</span> {firstWord}{' '}
      <span style={{ color: 'var(--md-primary)' }}>{restWords.join(' ')}</span>
    </>
  );
};

export const ModernHeader = () => {
  const themeLink = useAutosThemeLink();
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'MODERN AUTOS');

  return (
    <header className="md-header">
      <Link href={themeLink('/')} className="md-logo">
        <BrandLogo label={brandLabel} />
      </Link>

      <button
        className={`md-hamburger ${isOpen ? 'md-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="md-hamburger-toggle"
      >
        <span className="md-hamburger-bar" />
        <span className="md-hamburger-bar" />
        <span className="md-hamburger-bar" />
      </button>

      <div className={`md-nav-panel ${isOpen ? 'md-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="md-nav"
          linkClassName="md-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <MenuActionButtons
          linkClassName="md-btn md-btn-cta"
          onNavigate={() => setIsOpen(false)}
        />
      </div>
    </header>
  );
};

interface ModernCarCardProps {
  title: string;
  desc: string;
  price: string;
  image: string;
  slug?: string;
}

export const ModernCarCard = ({ title, desc, price, image, slug }: ModernCarCardProps) => {
  const themeLink = useAutosThemeLink();
  const detailUrl = slug ? themeLink(`/product/${slug}`) : '#';

  return (
    <div className="md-car-card">
      <div style={{ overflow: 'hidden', height: '200px', position: 'relative' }}>
        <img
          src={image}
          className="md-car-img"
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="md-car-body">
        <h5 className="md-car-title">{title}</h5>
        <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{desc}</p>
        <h4 className="md-car-price">{price}</h4>
        <Link href={detailUrl} className="md-btn md-btn-cta" style={{ width: '100%', boxSizing: 'border-box' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

interface CompareItemProps {
  title: string;
  stats: string;
  price: string;
  image: string;
  highlight?: boolean;
  slug?: string;
}

export const CompareItem = ({ title, stats, price, image, highlight, slug }: CompareItemProps) => {
  const themeLink = useAutosThemeLink();
  const detailUrl = slug ? themeLink(`/product/${slug}`) : '#';

  return (
    <div className={`md-compare-item ${highlight ? 'highlight' : ''}`}>
      <div
        style={{
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <img
          src={image}
          className="md-compare-img"
          alt={title}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
      <h4
        className={`md-fw-bold ${highlight ? 'md-text-primary' : ''}`}
        style={{ marginBottom: '0.5rem' }}
      >
        {title}
      </h4>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
        {stats} | Price: {price}
      </p>
      <Link
        href={detailUrl}
        className={`md-btn ${highlight ? 'md-btn-cta' : 'md-btn-outline'}`}
        style={{
          color: highlight ? 'white' : 'var(--md-primary)',
          border: highlight ? 'none' : '2px solid var(--md-primary)',
          display: 'block',
        }}
      >
        Full Specs
      </Link>
    </div>
  );
};

export const ModernFooter = () => {
  const themeLink = useAutosThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'MODERN AUTOS');
  const footerDescription = useThemeContent(
    'footer.description',
    'The future of mobility is here. Driven by technology, fueled by vision.',
  );
  const footerCopyright = useThemeContent(
    'footer.copyright',
    '2026 Modern Autos, Inc. All rights reserved.',
  );

  return (
    <footer className="md-footer">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}
      >
        <div>
          <Link href={themeLink('/')} className="md-logo" style={{ marginBottom: '1rem' }}>
            <BrandLogo label={brandLabel} />
          </Link>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{footerDescription}</p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h5"
          titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}
          linkClassName="md-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h5"
          titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}
          linkClassName="md-footer-link"
        />
        <div>
          <FooterMenuColumn
            location="footer_column_3"
            titleTag="h5"
            titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}
            linkClassName="md-footer-link"
          />
          <MenuNav
            location="social_footer"
            flat
            renderItem={(item, { href, onNavigate }) => (
              <a href={href} className="md-social" onClick={onNavigate}>
                {item.title.charAt(0)}
              </a>
            )}
          />
          <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>&copy; {footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
};
