'use client';

import React from 'react';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const services = [
  {
    title: 'Fine Art & Collectibles',
    detail: 'Museum-grade paintings, sculptures, and signed editions authenticated by certified appraisers.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v3h3v2h-3v3h-2v-3H8v-2h3z"/>
      </svg>
    ),
  },
  {
    title: 'Luxury Horology',
    detail: 'Rare timepieces from Patek Philippe, Rolex, and independent watchmakers, each with full provenance.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
  },
  {
    title: 'Rare Vintages',
    detail: 'Investment-grade wines, whiskies, and spirits sourced from private cellars and bonded warehouses.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
      </svg>
    ),
  },
  {
    title: 'Exotic Motors',
    detail: 'Limited-production supercars, classic marques, and collector motorcycles with verified service history.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
  },
];

const trustPoints = [
  { title: 'Verified custodians', body: 'Every seller completes background verification and submits certified appraisal documentation before listing.' },
  { title: 'Authenticated provenance', body: 'Each asset carries a full ownership record, appraisal certificate, and chain-of-custody documentation.' },
  { title: 'Private acquisition protocol', body: 'Transactions are handled through a secure, discreet process. No public bidding. No third-party exposure.' },
  { title: 'Expert advisory access', body: 'Our concierge team connects serious buyers with independent appraisers and legal counsel on request.' },
];

export default function AboutPage() {
  const themeLink = useClassifiedsThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio Elite');

  return (
    <div className="ce-static-page">

      <div className="ce-static-hero">
        <div className="ce-static-kicker">About Us</div>
        <h1>The private marketplace for high-value acquisitions.</h1>
        <p>
          {siteName} connects qualified buyers with verified custodians of fine art, luxury timepieces,
          rare vintages, and exotic motors — through a discreet, authenticated process.
        </p>
      </div>

      <div className="ce-about-stats">
        <div className="ce-about-stat">
          <strong>4</strong>
          <span>specialist verticals</span>
        </div>
        <div className="ce-about-stat">
          <strong>100%</strong>
          <span>verified custodians</span>
        </div>
        <div className="ce-about-stat">
          <strong>Private</strong>
          <span>acquisition protocol</span>
        </div>
        <div className="ce-about-stat">
          <strong>Expert</strong>
          <span>advisory concierge</span>
        </div>
      </div>

      <div className="ce-static-section">
        <div className="ce-static-kicker">Asset Categories</div>
        <h2 className="ce-static-section-title">What we curate.</h2>
        <p className="ce-static-section-lead">Every listing is reviewed, authenticated, and approved before entering the catalog.</p>
        <div className="ce-about-services">
          {services.map((s) => (
            <div key={s.title} className="ce-about-service-card">
              <div className="ce-about-service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ce-static-section">
        <div className="ce-static-kicker">Why Elite</div>
        <h2 className="ce-static-section-title">Acquisition standards that protect buyers.</h2>
        <p className="ce-static-section-lead">Serious collectors require more than a listing. They require certainty.</p>
        <div className="ce-about-services">
          {trustPoints.map((tp) => (
            <div key={tp.title} className="ce-about-service-card">
              <h3>{tp.title}</h3>
              <p>{tp.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ce-static-cta">
        <h2>Browse the private catalog.</h2>
        <p>Authenticated acquisitions from verified custodians worldwide.</p>
        <a href={themeLink('/')} className="elite-modal-cta" style={{ textDecoration: 'none' }}>View catalog</a>
      </div>

    </div>
  );
}
