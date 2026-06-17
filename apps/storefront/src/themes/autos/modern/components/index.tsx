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
      <span style={{ color: 'var(--md-accent)' }} aria-hidden="true">⚡</span>
      {firstWord}{' '}
      <span style={{ color: 'var(--md-accent)' }}>{restWords.join(' ')}</span>
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
        type="button"
        className={`md-hamburger ${isOpen ? 'md-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
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
  year?: string | number;
  condition?: string | null;
  fuelType?: string | null;
}

export const ModernCarCard = ({
  title,
  desc,
  price,
  image,
  slug,
  year,
  condition,
  fuelType,
}: ModernCarCardProps) => {
  const themeLink = useAutosThemeLink();
  const detailUrl = slug ? themeLink(`/product/${slug}`) : '#';
  const chips = [fuelType, year ? String(year) : null].filter(Boolean) as string[];

  return (
    <article className="md-car-card">
      <Link href={detailUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="md-car-media">
          <img src={image} className="md-car-img" alt={title} loading="lazy" />
          <div className="md-car-badges">
            {condition ? <span className="md-car-badge">{condition}</span> : <span />}
            {year ? <span className="md-car-badge md-car-badge--accent">{year}</span> : null}
          </div>
        </div>
      </Link>
      <div className="md-car-body">
        <Link href={detailUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="md-car-title">{title}</h3>
          <p className="md-car-specs">{desc}</p>
        </Link>
        {chips.length > 0 && (
          <div className="md-car-chips">
            {chips.map((chip) => (
              <span key={chip} className="md-car-chip">
                {chip}
              </span>
            ))}
          </div>
        )}
        <div className="md-car-price-row">
          <p className="md-car-price">{price}</p>
          <span className="md-car-price-note">MSRP</span>
        </div>
        <Link href={detailUrl} className="md-btn md-btn-cta">
          View Details
        </Link>
      </div>
    </article>
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
      <div className="md-compare-media">
        <img src={image} className="md-compare-img" alt={title} loading="lazy" />
      </div>
      <h4 className={`md-compare-title ${highlight ? 'md-text-primary' : ''}`}>{title}</h4>
      <p className="md-compare-stats">{stats}</p>
      <p className="md-compare-price">{price}</p>
      <Link
        href={detailUrl}
        className={`md-btn ${highlight ? 'md-btn-cta' : 'md-btn-outline-primary'}`}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        Full Specs
      </Link>
    </div>
  );
};

type BrandOption = { id: number; title: string; logo_url?: string | null };

export const ModernBrandGrid = ({ brands = [] }: { brands?: BrandOption[] }) => {
  const themeLink = useAutosThemeLink();

  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="md-brand-grid">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={themeLink(`/explore?brand=${encodeURIComponent(brand.title)}`)}
          className="md-brand-tile"
        >
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.title}
              style={{ maxHeight: '42px', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <>
              <span className="md-brand-monogram">{brand.title.slice(0, 2).toUpperCase()}</span>
              <span className="md-brand-name">{brand.title}</span>
            </>
          )}
        </Link>
      ))}
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
  const year = new Date().getFullYear();
  const footerCopyright = useThemeContent(
    'footer.copyright',
    `${year} ${brandLabel}. All rights reserved.`,
  );

  return (
    <footer className="md-footer">
      <div className="md-footer-grid">
        <div>
          <Link href={themeLink('/')} className="md-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <BrandLogo label={brandLabel} />
          </Link>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{footerDescription}</p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h5"
          titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}
          linkClassName="md-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h5"
          titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}
          linkClassName="md-footer-link"
        />
        <div>
          <FooterMenuColumn
            location="footer_column_3"
            titleTag="h5"
            titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}
            linkClassName="md-footer-link"
          />
          <div style={{ marginTop: '0.5rem' }}>
            <MenuNav
              location="social_footer"
              flat
              renderItem={(item, { href, onNavigate }) => (
                <a href={href} className="md-social" onClick={onNavigate} aria-label={item.title}>
                  {item.title.charAt(0)}
                </a>
              )}
            />
          </div>
        </div>
      </div>
      <div className="md-footer-bottom">&copy; {footerCopyright}</div>
    </footer>
  );
};

export function CarCardSkeleton() {
  return (
    <div className="md-car-card" style={{ pointerEvents: 'none' }}>
      <div className="md-skeleton md-skeleton-block" style={{ height: '210px' }} />
      <div className="md-car-body">
        <div className="md-skeleton md-skeleton-block" style={{ height: '20px', width: '72%', marginBottom: '0.65rem' }} />
        <div className="md-skeleton md-skeleton-block" style={{ height: '14px', width: '55%', marginBottom: '1rem' }} />
        <div className="md-skeleton md-skeleton-block" style={{ height: '26px', width: '42%' }} />
      </div>
    </div>
  );
}
