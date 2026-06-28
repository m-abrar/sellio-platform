'use client';

import React from 'react';
import { EstateShowcase, LuxuryAmenities } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

function renderMultilineTitle(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

export default function Page() {
  const themeLink = usePropertyThemeLink();

  const heroKicker = useThemeContent('hero.kicker', 'Exclusively Represented');
  const heroTitle = useThemeContent('hero.title', 'The \nCollection.');
  const heroHighlight = useThemeContent('hero.highlight', 'Platinum');
  const heroDescription = useThemeContent('hero.description', "A curated selection of the world's finest luxury estates. Premium listings for the discerning buyer.");
  const heroCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore Collection');
  const heroImage = useThemeMedia('hero.image', '/themes/properties/luxury/1.webp');

  const logicItems = useThemeContent('logic.items', 'Properties Listed|Global Markets|Verified Listings|Private Concierge Access');

  const editorialImage = useThemeMedia('editorial.image', '/themes/properties/luxury/2.webp');
  const editorialBadgeValue = useThemeContent('editorial.badge_value', '50+');
  const editorialBadgeLabel = useThemeContent('editorial.badge_label', 'Off-Market Listings');
  const editorialKicker = useThemeContent('editorial.kicker', 'Editorial');
  const editorialTitle = useThemeContent('editorial.title', 'Bespoke Architecture. \nGlobal Context.');
  const editorialDescription = useThemeContent('editorial.description', 'Every property in our Platinum Collection is more than a listing — it is an architectural statement. Our platform ensures the story of each estate is presented with care and precision.');
  const editorialCtaLabel = useThemeContent('editorial.cta_label', 'Read the Journal');

  const ctaTitle = useThemeContent('cta.title', 'Define your \nLegacy.');
  const ctaDescription = useThemeContent('cta.description', 'Our concierge team is ready to guide your next acquisition. Connect with us for exclusive access to our global portfolio.');
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Connect with Concierge');

  const heroTitleParts = heroTitle.split('\n');

  return (
    <div>
      {/* Hero */}
      <section className="platinum-hero">
        <div className="platinum-hero-content">
          <span className="platinum-hero-kicker">{heroKicker}</span>
          <h1>
            {heroTitleParts.map((line, i) => (
              <React.Fragment key={i}>
                {i === 0 ? <>{line} <span>{heroHighlight}</span></> : line}
                {i < heroTitleParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="platinum-hero-description">{heroDescription}</p>
          <a href={themeLink('/explore')} className="luxury-btn-primary">{heroCtaLabel}</a>
        </div>
        <div>
          <img src={heroImage} alt="Luxury Villa" className="platinum-hero-img" loading="eager" />
        </div>
      </section>

      {/* Logic bar */}
      <section className="platinum-logic-bar" aria-label="Key figures">
        {logicItems.split('|').map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <EstateShowcase />

      {/* Editorial */}
      <section className="platinum-editorial-section">
        <div className="platinum-editorial-img-wrap">
          <img src={editorialImage} alt="Modern Architecture" className="platinum-editorial-img" loading="lazy" />
          <div className="platinum-editorial-badge" aria-hidden="true">
            <div className="platinum-editorial-badge-value">{editorialBadgeValue}</div>
            <div className="platinum-editorial-badge-label">{editorialBadgeLabel}</div>
          </div>
        </div>
        <div>
          <span className="platinum-editorial-kicker">{editorialKicker}</span>
          <h2 className="platinum-editorial-title">{renderMultilineTitle(editorialTitle)}</h2>
          <p className="platinum-editorial-description">{editorialDescription}</p>
          <a href={themeLink('/explore')} className="platinum-editorial-cta">{editorialCtaLabel}</a>
        </div>
      </section>

      <LuxuryAmenities />

      {/* Final CTA */}
      <section className="platinum-cta-section">
        <div className="platinum-cta-inner">
          <h2 className="platinum-cta-title">{renderMultilineTitle(ctaTitle)}</h2>
          <p className="platinum-cta-description">{ctaDescription}</p>
          <a href={themeLink('/explore')} className="luxury-btn-primary platinum-cta-btn">{ctaButtonLabel}</a>
        </div>
      </section>
    </div>
  );
}
