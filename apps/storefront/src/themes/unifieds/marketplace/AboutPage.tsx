'use client';

import React from 'react';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const verticals = [
  {
    title: 'Products',
    detail: 'Retail goods, electronics, furniture, gear',
    query: 'products',
    color: '#0d6efd',
    bg: 'rgba(13,110,253,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75c.75 0 1.41-.41 1.75-1.03h7.45c.75 0 1.41-.41 1.75-1.03L22 5H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.1-2h8.1c.75 0 1.41-.41 1.75-1.03L22 7H7.42l-.25-.5H6l1.17 8.25z" />
      </svg>
    ),
  },
  {
    title: 'Properties',
    detail: 'Homes, rentals, commercial real estate',
    query: 'properties',
    color: '#059669',
    bg: 'rgba(5,150,105,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
      </svg>
    ),
  },
];

const steps = [
  { title: 'Browse', body: 'Search across all 7 verticals in one place — products, properties, vehicles, services, jobs, events, and classifieds.' },
  { title: 'Discover', body: 'Filter by category, vertical, price, and condition. Every listing is verified before it goes live.' },
  { title: 'Checkout', body: 'One cart, one payment, every category. Your order history covers everything you buy across the marketplace.' },
];

const trustCards = [
  {
    title: 'Verified sellers',
    body: 'Every seller goes through ID verification before listing. Buyers can see verification badges on every listing.',
  },
  {
    title: 'Unified checkout',
    body: 'One cart, one checkout, one order history — regardless of whether you buy a product, book a service, or buy tickets.',
  },
  {
    title: 'Fresh daily inventory',
    body: 'New listings added across all 7 verticals every day. Search returns live catalog data, not cached snapshots.',
  },
  {
    title: 'Buyer protection',
    body: 'All transactions are secured through encrypted checkout. Contact support if your purchase is not as described.',
  },
];

export default function AboutPage() {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'MarketHub');
  const kicker = useThemeContent('about.kicker', 'About Us');
  const heading = useThemeContent('about.heading', 'One marketplace. Every category.');
  const intro = useThemeContent('about.intro', `${siteName} connects buyers and sellers across products, properties, vehicles, services, jobs, events, and classifieds from a single unified storefront.`);
  const stat1Value = useThemeContent('about.stat_1_value', '7');
  const stat1Label = useThemeContent('about.stat_1_label', 'verticals available');
  const stat2Value = useThemeContent('about.stat_2_value', '100%');
  const stat2Label = useThemeContent('about.stat_2_label', 'verified seller IDs');
  const stat3Value = useThemeContent('about.stat_3_value', '1');
  const stat3Label = useThemeContent('about.stat_3_label', 'cart for every vertical');
  const stat4Value = useThemeContent('about.stat_4_value', 'Daily');
  const stat4Label = useThemeContent('about.stat_4_label', 'fresh inventory');

  return (
    <div className="um-static-page">

        <section className="um-about-hero" aria-labelledby="um-about-title">
          <div className="um-section-kicker">{kicker}</div>
          <h1 id="um-about-title">{heading}</h1>
          <p>{intro}</p>
          <div className="um-about-hero-actions">
            <a className="um-btn-primary" href={themeLink('/explore')}>Browse marketplace</a>
            <a className="um-btn-secondary" href={themeLink('/explore')}>Become a seller</a>
          </div>
        </section>

        <div className="um-about-stats" aria-label="Marketplace highlights">
          <div className="um-about-stat">
            <strong>{stat1Value}</strong>
            <span>{stat1Label}</span>
          </div>
          <div className="um-about-stat">
            <strong>{stat2Value}</strong>
            <span>{stat2Label}</span>
          </div>
          <div className="um-about-stat">
            <strong>{stat3Value}</strong>
            <span>{stat3Label}</span>
          </div>
          <div className="um-about-stat">
            <strong>{stat4Value}</strong>
            <span>{stat4Label}</span>
          </div>
        </div>

        <section aria-labelledby="um-about-how-title">
          <div className="um-section-kicker">How it works</div>
          <h2 id="um-about-how-title">Three steps to your next purchase.</h2>
          <div className="um-about-timeline">
            {steps.map((step, index) => (
              <div key={step.title} className="um-about-step">
                <h3>{index + 1}. {step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="um-about-verticals-title">
          <div className="um-section-kicker">What you can list & buy</div>
          <h2 id="um-about-verticals-title">Seven verticals, one marketplace.</h2>
          <div className="um-about-verticals">
            {verticals.map((v) => (
              <a
                key={v.title}
                href={themeLink(`/explore?category=${v.query}`)}
                className="um-about-vertical-card"
              >
                <span
                  className="um-about-vertical-icon"
                  style={{ color: v.color, background: v.bg }}
                >
                  {v.icon}
                </span>
                <h3>{v.title}</h3>
                <p>{v.detail}</p>
                <span className="um-about-vertical-link" style={{ color: v.color }}>
                  Browse {v.title} →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="um-about-trust-title">
          <div className="um-section-kicker">Why MarketHub</div>
          <h2 id="um-about-trust-title">Built for confident buying and selling.</h2>
          <div className="um-about-trust-grid">
            {trustCards.map((card) => (
              <div key={card.title} className="um-about-trust-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="um-final-cta" aria-labelledby="um-about-cta-title">
          <div className="um-cta-glow um-cta-glow-a" aria-hidden="true" />
          <div className="um-cta-glow um-cta-glow-b" aria-hidden="true" />
          <div className="um-section-kicker um-cta-kicker">Get started</div>
          <h2 id="um-about-cta-title">Start browsing the {siteName} marketplace today.</h2>
          <div className="um-cta-actions">
            <a className="um-btn-primary" href={themeLink('/explore')}>Browse the marketplace</a>
          </div>
        </section>

    </div>
  );
}
