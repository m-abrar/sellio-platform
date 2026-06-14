'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LeaseUnitCard, TrustMetrics } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import {
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  filterRentalProperties,
} from './catalog';
import { mapPropertyToLeaseCard, type RentalUnitCard } from './property-utils';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogRegistryAlert } from './components/explore';

const adminListPropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;

function renderMultilineTitle(
  text: string,
  highlight: string,
  highlightClassName = 'pr-text-highlight',
) {
  return text.split('\n').map((line, index, lines) => {
    const hasHighlight = highlight && line.includes(highlight);
    return (
      <React.Fragment key={index}>
        {hasHighlight
          ? line.split(highlight).map((part, partIndex, parts) => (
              <React.Fragment key={partIndex}>
                {part}
                {partIndex < parts.length - 1 && (
                  <span className={highlightClassName}>{highlight}</span>
                )}
              </React.Fragment>
            ))
          : line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function Page() {
  const router = useRouter();
  const themeLink = useRentalThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [rentals, setRentals] = useState<RentalUnitCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [leaseType, setLeaseType] = useState('All');

  const heroKicker = useThemeContent('hero.kicker', 'RentEase · Monthly leases');
  const heroTitle = useThemeContent('hero.title', 'A home you can \nlease month to month.');
  const heroHighlight = useThemeContent('hero.highlight', 'month to month.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Compare verified apartments and houses with clear monthly rent, move-in dates, and what is included in each lease.',
  );
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Search rentals');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'List a property');
  const heroImage = useThemeMedia('hero.image', '/themes/properties/rental/7.webp');
  const heroActiveUnitsSuffix = useThemeContent('hero.active_units_suffix', 'homes available now');

  const searchLocationLabel = useThemeContent('search.location_label', 'Location');
  const searchLocationPlaceholder = useThemeContent(
    'search.location_placeholder',
    'City, neighborhood, or address',
  );
  const searchCheckinLabel = useThemeContent('search.checkin_label', 'Move-in date');
  const searchCheckoutLabel = useThemeContent('search.checkout_label', 'Move-out date');
  const searchTermsLabel = useThemeContent('search.terms_label', 'Household size');
  const searchTermsAllLabel = useThemeContent('search.terms_all_label', 'Any size');
  const searchButtonLabel = useThemeContent('search.button_label', 'Search rentals');

  const trustTitle = useThemeContent('trust.title', 'Leasing without \nthe runaround.');
  const trustHighlight = useThemeContent('trust.highlight', 'runaround.');
  const trustDescription = useThemeContent(
    'trust.description',
    'Apply online, see real monthly totals, and keep lease paperwork in one place — for tenants and landlords.',
  );
  const trustMetric1Value = useThemeContent('trust.metric_1_value', '100%');
  const trustMetric1Label = useThemeContent('trust.metric_1_label', 'Digital leases');
  const trustMetric2Value = useThemeContent('trust.metric_2_value', '24h');
  const trustMetric2Label = useThemeContent('trust.metric_2_label', 'Maintenance response');
  const trustMetric3Value = useThemeContent('trust.metric_3_value', 'Fast');
  const trustMetric3Label = useThemeContent('trust.metric_3_label', 'Application review');
  const trustMetric4Value = useThemeContent('trust.metric_4_value', 'Verified');
  const trustMetric4Label = useThemeContent('trust.metric_4_label', 'Listing quality');

  const gridTitle = useThemeContent('grid.title', 'Featured rentals');
  const gridDescription = useThemeContent(
    'grid.description',
    'Hand-picked homes and apartments available for monthly lease right now.',
  );
  const emptyTitle = useThemeContent('empty.title', 'No rentals found');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Publish rental listings in your Sellio admin or try again once your API connection is configured.',
  );

  const ctaKicker = useThemeContent('cta.kicker', 'Start your search');
  const ctaTitle = useThemeContent('cta.title', 'Pick a neighborhood, \nset your budget.');
  const ctaHighlight = useThemeContent('cta.highlight', 'budget.');
  const ctaDescription = useThemeContent(
    'cta.description',
    'Filter by rent, bedrooms, and move-in date, then send a lease inquiry when you are ready.',
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'View all rentals');

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      const result = await fetchPropertyCatalogPage(1, {}, 6);

      if (result.ok) {
        const cards = filterRentalProperties(result.data)
          .slice(0, 6)
          .map((property, index) => mapPropertyToLeaseCard(property, index));
        setRentals(cards);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveCatalogFailure({}, allowDemo);
        if (resolution.mode === 'demo') {
          setUseFallback(true);
          setRentals(
            resolution.estates
              .slice(0, 6)
              .map((property, index) => mapPropertyToLeaseCard(property, index)),
          );
        } else {
          setUseFallback(false);
          setRentals([]);
        }
      }

      setLoading(false);
    };

    loadFeatured();
  }, [allowDemo]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('q', searchLocation.trim());
    if (leaseType === 'Single') params.set('beds', '1');
    if (leaseType === 'Shared') params.set('beds', '2');
    if (leaseType === 'Family') params.set('beds', '3');
    const suffix = params.toString();
    router.push(themeLink(`/explore${suffix ? `?${suffix}` : ''}`));
  };

  return (
    <div className="pr-section pr-home pr-section--flush-top">
      <section className="pr-hero">
        <div className="pr-hero-copy">
          <span className="pr-kicker">{heroKicker}</span>
          <h1 className="pr-heading-xl">{renderMultilineTitle(heroTitle, heroHighlight)}</h1>
          <p className="pr-lead">{heroDescription}</p>

          <div className="pr-hero-actions">
            <a
              className="pr-btn-primary"
              id="pr-btn-discover"
              href={themeLink('/explore')}
            >
              {heroPrimaryCta}
            </a>
            <a
              href={adminListPropertyUrl}
              className="pr-btn-secondary"
              id="pr-btn-list"
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroSecondaryCta}
            </a>
          </div>
        </div>

        <div className="pr-hero-image-wrapper">
          <img
            src={heroImage}
            alt="Modern apartment living room"
            className="pr-hero-image"
          />
          <div className="pr-badge-floater">
            <div className="pr-badge-floater__inner">
              <span className="pr-badge-floater__dot" aria-hidden="true" />
              <span className="pr-badge-floater__text">
                {loading
                  ? 'Loading listings…'
                  : `${rentals.length} ${heroActiveUnitsSuffix}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pr-search-section" aria-label="Rental search">
        <form onSubmit={handleSearchSubmit} className="pr-search-ribbon">
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-search-loc">
              {searchLocationLabel}
            </label>
            <input
              id="pr-search-loc"
              type="text"
              placeholder={searchLocationPlaceholder}
              className="pr-booking-input"
              value={searchLocation}
              onChange={(event) => setSearchLocation(event.target.value)}
            />
          </div>

          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkin">
              {searchCheckinLabel}
            </label>
            <input
              id="pr-checkin"
              type="date"
              className="pr-booking-input"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
            />
          </div>

          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkout">
              {searchCheckoutLabel}
            </label>
            <input
              id="pr-checkout"
              type="date"
              className="pr-booking-input"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </div>

          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-guests-selector">
              {searchTermsLabel}
            </label>
            <select
              id="pr-guests-selector"
              className="pr-booking-input"
              value={leaseType}
              onChange={(event) => setLeaseType(event.target.value)}
            >
              <option value="All">
                {searchTermsAllLabel}
              </option>
              <option value="Single">Studio / 1 bedroom</option>
              <option value="Shared">2 bedrooms</option>
              <option value="Family">3+ bedrooms</option>
            </select>
          </div>

          <button type="submit" className="pr-btn-primary pr-booking-submit" id="pr-booking-submit">
            {searchButtonLabel}
          </button>
        </form>
      </section>

      {apiError && useFallback && (
        <div className="pr-alert-slot">
          <CatalogRegistryAlert variant="demo" error={apiError} />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="pr-alert-slot">
          <CatalogRegistryAlert variant="production" error={apiError} />
        </div>
      )}

      <section className="pr-hero pr-hero--trust">
        <div>
          <h2 className="pr-section-title">
            {renderMultilineTitle(trustTitle, trustHighlight)}
          </h2>
          <p className="pr-lead">{trustDescription}</p>
        </div>
        <div className="pr-stats-grid">
          <TrustMetrics value={trustMetric1Value} label={trustMetric1Label} />
          <TrustMetrics value={trustMetric2Value} label={trustMetric2Label} />
          <TrustMetrics value={trustMetric3Value} label={trustMetric3Label} />
          <TrustMetrics value={trustMetric4Value} label={trustMetric4Label} />
        </div>
      </section>

      <section id="pr-discovery-grid" className="pr-grid-section">
        <h2 className="pr-section-title">
          {gridTitle}
        </h2>
        <p className="pr-section-lead">{gridDescription}</p>

        {loading ? (
          <div className="pr-rent-grid">
            {[1, 2, 3].map((index) => (
              <div key={index} className="pr-card-skeleton" aria-hidden="true" />
            ))}
          </div>
        ) : rentals.length > 0 ? (
          <div className="pr-rent-grid">
            {rentals.map((rental) => (
              <a key={rental.slug} href={themeLink(`/product/${rental.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <LeaseUnitCard
                  {...rental}
                  rating={4.5 + (rental.id % 5) * 0.1}
                  reviews={20 + (rental.id % 12) * 11}
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="pr-empty-panel">
            <h3 className="pr-empty-panel__title">
              {emptyTitle}
            </h3>
            <p className="pr-empty-panel__copy">{emptyDescription}</p>
          </div>
        )}

        <div className="pr-grid-section__actions">
          <a className="pr-btn-primary" href={themeLink('/explore')}>
            View all rentals
          </a>
        </div>
      </section>

      <section className="pr-section-cta">
        <div className="pr-cta-panel">
          <span className="pr-kicker">
            {ctaKicker}
          </span>
          <h2 className="pr-cta-panel__title">
            {renderMultilineTitle(ctaTitle, ctaHighlight)}
          </h2>
          <p className="pr-cta-panel__lead">{ctaDescription}</p>
          <a
            className="pr-btn-primary pr-btn-primary--lg"
            id="pr-btn-cta-auth"
            href={themeLink('/explore')}
          >
            {ctaButtonLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
