'use client';

import React from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

export default function AboutPage() {
  const themeLink = useRentalThemeLink();

  const kicker = useThemeContent('about.kicker', 'About RentEase');
  const title = useThemeContent('about.title', 'We make monthly renting frictionless.');
  const lead = useThemeContent('about.lead', 'Transparent pricing, digital leases, and verified listings — built for tenants and landlords who want less friction and more clarity in every transaction.');

  const statsRaw = useThemeContent('about.stats', '2,400+|Verified listings|18,000+|Tenants placed|98%|Lease completion rate');
  const statParts = statsRaw.split('|');
  const stats: { value: string; label: string }[] = [];
  for (let i = 0; i + 1 < statParts.length; i += 2) {
    stats.push({ value: statParts[i] ?? '', label: statParts[i + 1] ?? '' });
  }

  const step1Title = useThemeContent('about.step1_title', 'Search & filter');
  const step1Body = useThemeContent('about.step1_body', 'Filter by location, price, bedrooms, and move-in date. Every listing is verified before it goes live.');
  const step2Title = useThemeContent('about.step2_title', 'Apply online');
  const step2Body = useThemeContent('about.step2_body', 'Submit a lease inquiry in minutes from any listing page. No phone calls required.');
  const step3Title = useThemeContent('about.step3_title', 'Move in');
  const step3Body = useThemeContent('about.step3_body', 'Digital signing, automated receipts, and a direct line to your landlord from day one.');

  const valuesRaw = useThemeContent('about.values', '🏡|Verified listings|Every property passes our listing review.|📄|Digital lease tools|Apply, sign, and manage your lease online.|🔒|Secure payments|All transactions are processed through our encrypted checkout.|🛠|24h maintenance|Report issues directly through your tenant dashboard.');
  const valueParts = valuesRaw.split('|');
  const values: { icon: string; title: string; body: string }[] = [];
  for (let i = 0; i + 2 < valueParts.length; i += 3) {
    values.push({ icon: valueParts[i] ?? '', title: valueParts[i + 1] ?? '', body: valueParts[i + 2] ?? '' });
  }

  const landlordHeading = useThemeContent('about.landlord_heading', 'We work with great landlords');
  const landlordBody = useThemeContent('about.landlord_body', 'We partner with independent landlords and property managers to keep inventory fresh and verified. No upfront fees — commission applies only on successful leases.');
  const landlordCtaLabel = useThemeContent('about.landlord_cta_label', 'List your property');
  const browseLabel = useThemeContent('about.browse_label', 'Browse rentals');

  return (
    <div className="pr-about-page">
      <section className="pr-about-hero">
        <span className="pr-kicker">{kicker}</span>
        <h1 className="pr-about-title">{title}</h1>
        <p className="pr-about-lead">{lead}</p>
      </section>

      <div className="pr-trust-metrics pr-about-stats" aria-label="Key figures">
        {stats.map(({ value, label }) => (
          <div key={label} className="pr-trust-metric">
            <div className="pr-trust-metric__value">{value}</div>
            <div className="pr-trust-metric__label">{label}</div>
          </div>
        ))}
      </div>

      <section className="pr-about-steps-section">
        <span className="pr-kicker">How it works</span>
        <div className="pr-about-steps">
          {[
            { num: '01', title: step1Title, body: step1Body },
            { num: '02', title: step2Title, body: step2Body },
            { num: '03', title: step3Title, body: step3Body },
          ].map(({ num, title: stepTitle, body }) => (
            <div key={num} className="pr-about-step">
              <span className="pr-about-step__num">{num}</span>
              <strong className="pr-about-step__title">{stepTitle}</strong>
              <p className="pr-about-step__body">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pr-about-values-section">
        <span className="pr-kicker">Why tenants choose us</span>
        <div className="pr-about-values">
          {values.map(({ icon, title: valTitle, body }) => (
            <div key={valTitle} className="pr-detail-block pr-about-value-card">
              <span className="pr-about-value-icon" aria-hidden="true">{icon}</span>
              <strong className="pr-about-value-title">{valTitle}</strong>
              <p className="pr-about-value-body">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pr-about-landlord">
        <div className="pr-about-landlord__copy">
          <h2 className="pr-about-landlord__title">{landlordHeading}</h2>
          <p className="pr-about-landlord__body">{landlordBody}</p>
          <div className="pr-about-landlord__actions">
            <a href="/admin/properties/create" className="pr-btn-primary" target="_blank" rel="noopener noreferrer">
              {landlordCtaLabel}
            </a>
            <a href={themeLink('/explore')} className="pr-btn-secondary">
              {browseLabel}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
