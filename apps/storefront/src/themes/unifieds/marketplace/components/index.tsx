'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

type MarketCategory = {
  title: string;
  detail: string;
  query: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
};

const marketCategories: MarketCategory[] = [
  {
    title: 'Products',
    detail: 'Retail goods, gear & everyday essentials',
    query: 'products',
    color: '#0d6efd',
    bg: 'rgba(13,110,253,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75c.75 0 1.41-.41 1.75-1.03h7.45c.75 0 1.41-.41 1.75-1.03L22 5H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.1-2h8.1c.75 0 1.41-.41 1.75-1.03L22 7H7.42l-.25-.5H6l1.17 8.25z" />
      </svg>
    ),
  },
  {
    title: 'Properties',
    detail: 'Homes, rentals & commercial spaces',
    query: 'properties',
    color: '#0d6efd',
    bg: 'rgba(13,110,253,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    title: 'Autos',
    detail: 'New, used, luxury & electric vehicles',
    query: 'autos',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    title: 'Services',
    detail: 'Local experts & on-demand bookings',
    query: 'services',
    color: '#198754',
    bg: 'rgba(25,135,84,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    title: 'Jobs',
    detail: 'Remote, corporate & freelance roles',
    query: 'jobs',
    color: '#fd7e14',
    bg: 'rgba(253,126,20,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 6h-2.18c.07-.44.18-.88.18-1 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .12.11.56.18 1H8c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-3c1.1 0 2 .9 2 2 0 .12-.11.56-.18 1h-3.64C12.11 5.56 12 5.12 12 5c0-1.1.9-2 2-2zm6 16H8V8h12v11z" />
      </svg>
    ),
  },
  {
    title: 'Events',
    detail: 'Tickets, conferences & live venues',
    query: 'events',
    color: '#6f42c1',
    bg: 'rgba(111,66,193,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    title: 'Classifieds',
    detail: 'Deals, collectibles & verified sellers',
    query: 'classifieds',
    color: '#dc3545',
    bg: 'rgba(220,53,69,0.1)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
      </svg>
    ),
  },
];

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return String(n);
}

export const MarketplaceHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'MarketHub');
  const siteLogo = useThemeContent('site_logo', '');
  const hideSiteName = useThemeContent('hide_site_name', '0');

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    router.push(themeLink(term ? `/explore?search=${encodeURIComponent(term)}` : '/explore'));
    setIsOpen(false);
  };

  return (
    <header className="um-header">
      <a className="um-logo" href={themeLink('/')} aria-label={`${siteName} home`}>
        {siteLogo ? (
          <img src={siteLogo} alt={siteName} className="um-logo-img" />
        ) : (
          <span className="um-logo-mark">{siteName.charAt(0).toUpperCase()}</span>
        )}
        {hideSiteName !== '1' && <span className="um-logo-name">{siteName}</span>}
      </a>

      <form className="um-header-search" onSubmit={submitSearch} role="search">
        <svg className="um-header-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search anything..."
          aria-label="Search marketplace"
        />
        <button type="submit" aria-label="Submit search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </button>
      </form>

      <button
        className={`um-hamburger ${isOpen ? 'um-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="um-hamburger-bar" />
        <span className="um-hamburger-bar" />
        <span className="um-hamburger-bar" />
      </button>

      <div className={`um-nav-panel ${isOpen ? 'um-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="um-nav"
          linkClassName="um-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          as="button"
          buttonClassName="um-btn-primary um-mobile-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { href, className, onNavigate }) => (
            <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
          )}
        />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="um-btn-primary um-desktop-btn"
        renderItem={(item, { href, className, onNavigate }) => (
          <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
        )}
      />
    </header>
  );
};

export const MarketGrid = () => {
  const themeLink = useUnifiedThemeLink();
  const [counts, setCounts] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;

    Promise.allSettled([
      api.getProductsCatalog({ per_page: 1 }),
      api.getProperties({ per_page: 1 }),
      api.getEvents({ per_page: 1 }),
      api.getVehicles({ per_page: 1 }),
      api.getServices({ per_page: 1 }),
      api.getJobs({ per_page: 1 }),
      api.getClassifieds({ per_page: 1 }),
    ]).then(([products, props, events, autos, services, jobs, classifieds]) => {
      if (!alive) return;

      const pick = (r: PromiseSettledResult<{ meta?: { total?: number } }>) =>
        r.status === 'fulfilled' && r.value.meta?.total != null
          ? fmtCount(r.value.meta.total)
          : '';

      setCounts({
        products:    pick(products),
        properties:  pick(props),
        events:      pick(events),
        autos:       pick(autos),
        services:    pick(services),
        jobs:        pick(jobs),
        classifieds: pick(classifieds),
      });
    });

    return () => { alive = false; };
  }, []);

  return (
    <section className="um-market-grid-section" aria-labelledby="um-categories-title">
      <div className="um-section-kicker">Explore top categories</div>
      <div className="um-section-heading-row">
        <h2 id="um-categories-title">Everything buyers need, neatly grouped.</h2>
        <a href={themeLink('/explore')} className="um-text-link">Browse all</a>
      </div>
      <div className="um-market-grid">
        {marketCategories.map((cat) => (
          <a
            className="um-market-card-premium"
            href={themeLink(`/explore?category=${encodeURIComponent(cat.query)}`)}
            key={cat.title}
          >
            <div className="um-market-card-top">
              <span
                className="um-market-icon"
                style={{ color: cat.color, background: cat.bg }}
              >
                {cat.icon}
              </span>
              {counts[cat.query] && (
                <span
                  className="um-market-count"
                  style={{ color: cat.color, background: cat.bg }}
                >
                  {counts[cat.query]}
                </span>
              )}
            </div>
            <h3>{cat.title}</h3>
            <p>{cat.detail}</p>
            <span className="um-market-cta" style={{ color: cat.color }}>
              Browse {cat.title}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

const trustFeatures = [
  {
    label: 'Verified Sellers',
    detail: 'Every seller ID-checked',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    label: 'Secure Checkout',
    detail: 'Encrypted & fraud-protected',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    ),
  },
  {
    label: 'Fresh Listings Daily',
    detail: 'New inventory every day',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
    ),
  },
  {
    label: 'Multi-vertical Search',
    detail: 'One search, every category',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    ),
  },
];

export const LiquidSyncBar = () => (
  <div className="um-liquid-sync-bar" aria-label="Marketplace trust metrics">
    {trustFeatures.map(({ icon, label, detail }) => (
      <div className="um-sync-feature" key={label}>
        <span className="um-sync-icon">{icon}</span>
        <strong className="um-sync-label">{label}</strong>
        <span className="um-sync-detail">{detail}</span>
      </div>
    ))}
  </div>
);

const footerVerticals = ['Products', 'Properties', 'Autos', 'Services', 'Jobs', 'Events', 'Classifieds'];

export const MarketplaceFooter = () => {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'MarketHub');
  const siteLogo = useThemeContent('site_logo', '');
  const hideSiteName = useThemeContent('hide_site_name', '0');
  const brandDescription = useThemeContent(
    'footer.brand_description',
    'The all-in-one marketplace for properties, vehicles, services, jobs, events, and classifieds.',
  );
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="um-marketplace-footer">
      <div className="um-footer-accent" aria-hidden="true" />

      <div className="um-footer-grid">
        <div className="um-footer-brand">
          <a className="um-logo um-footer-logo" href={themeLink('/')}>
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className="um-logo-img" />
            ) : (
              <span className="um-logo-mark">{siteName.charAt(0).toUpperCase()}</span>
            )}
            {hideSiteName !== '1' && <span className="um-logo-name">{siteName}</span>}
          </a>
          <p>{brandDescription}</p>
          <div className="um-footer-cats" aria-label="Browse marketplace categories">
            {footerVerticals.map((cat) => (
              <a
                key={cat}
                href={themeLink(`/explore?category=${cat.toLowerCase()}`)}
                className="um-footer-cat"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        <FooterMenuColumn
          location="footer_column_1"
          renderTitle={(title) => <h3>{title}</h3>}
          listClassName="um-footer-link-group"
          linkClassName="um-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          renderTitle={(title) => <h3>{title}</h3>}
          listClassName="um-footer-link-group"
          linkClassName="um-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_3"
          renderTitle={(title) => <h3>{title}</h3>}
          listClassName="um-footer-link-group"
          linkClassName="um-footer-link"
        />
      </div>

      <div className="um-footer-bottom">
        <span>(c) {currentYear} {siteName}. All rights reserved.</span>
        <div className="um-footer-bottom-right">
          <MenuNav
            location="social_footer"
            flat
            className="um-footer-socials"
            linkClassName="um-footer-social-link"
            renderItem={defaultNavItemRenderer}
          />
          <button className="um-footer-top-btn" onClick={scrollToTop} aria-label="Back to top">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
            </svg>
            Top
          </button>
        </div>
      </div>
    </footer>
  );
};
