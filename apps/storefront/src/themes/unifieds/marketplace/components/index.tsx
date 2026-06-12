'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

const categories = [
  { title: 'Properties', detail: 'Homes, rentals, commercial spaces', stat: '2.8k listings', query: 'properties' },
  { title: 'Autos', detail: 'New, used, luxury, electric', stat: '920 vehicles', query: 'autos' },
  { title: 'Services', detail: 'Local experts and bookings', stat: '640 providers', query: 'services' },
  { title: 'Jobs', detail: 'Remote, corporate, freelance', stat: '1.2k openings', query: 'jobs' },
  { title: 'Events', detail: 'Tickets, conferences, venues', stat: '310 events', query: 'events' },
  { title: 'Classifieds', detail: 'Deals and verified sellers', stat: '4.6k ads', query: 'classifieds' },
];

export const MarketplaceHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const themeLink = useUnifiedThemeLink();

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    router.push(themeLink(term ? `/explore?search=${encodeURIComponent(term)}` : '/explore'));
    setIsOpen(false);
  };

  return (
    <header className="um-header">
      <a className="um-logo" href={themeLink('/')} aria-label="MarketHub home">
        <span className="um-logo-mark">M</span>
        <span>MarketHub</span>
      </a>

      <form className="um-header-search" onSubmit={submitSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search listings, services, jobs..."
          aria-label="Search marketplace"
        />
        <button type="submit">Search</button>
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

  return (
    <section className="um-market-grid-section" aria-labelledby="um-categories-title">
      <div className="um-section-kicker">Explore top categories</div>
      <div className="um-section-heading-row">
        <h2 id="um-categories-title">Everything buyers need, neatly grouped.</h2>
        <a href={themeLink('/explore')} className="um-text-link">Browse all</a>
      </div>
      <div className="um-market-grid">
        {categories.map((category) => (
          <a
            className="um-market-card-premium"
            href={themeLink(`/explore?category=${encodeURIComponent(category.query)}`)}
            key={category.title}
          >
            <span className="um-category-token">{category.title.slice(0, 2).toUpperCase()}</span>
            <h3>{category.title}</h3>
            <p>{category.detail}</p>
            <strong>{category.stat}</strong>
          </a>
        ))}
      </div>
    </section>
  );
};

export const LiquidSyncBar = () => (
  <div className="um-liquid-sync-bar" aria-label="Marketplace trust metrics">
    <span>Verified sellers</span>
    <span>Secure checkout</span>
    <span>Fresh listings daily</span>
    <span>Multi-vertical search</span>
  </div>
);

export const MarketplaceFooter = () => {
  const themeLink = useUnifiedThemeLink();

  return (
  <footer className="um-marketplace-footer">
    <div className="um-footer-grid">
      <div>
        <a className="um-logo um-footer-logo" href={themeLink('/')}>
          <span className="um-logo-mark">M</span>
          <span>MarketHub</span>
        </a>
        <p>
          A clean multi-category marketplace for products, properties, vehicles, services,
          jobs, events, and classifieds.
        </p>
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
      <span>Copyright 2026 Sellio MarketHub. All rights reserved.</span>
      <MenuNav
        location="social_footer"
        flat
        className="um-footer-socials"
        linkClassName="um-footer-social-link"
        renderItem={defaultNavItemRenderer}
      />
    </div>
  </footer>
  );
};
