'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Category } from '@sellio/types';
import { CoreFeatures, GlobalTrust } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchAllVerticals, VERTICALS, type ExploreListing } from './multiVertical';

export default function Page() {
  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Multi-Vertical Marketplace');
  const heroTitle = useThemeContent('hero.title', 'Everything you need,\nall in one place.');
  const heroHighlight = useThemeContent('hero.highlight', 'all in one place.');
  const heroDescription = useThemeContent(
    'hero.description',
    'A comprehensive marketplace platform for discovering products, properties, services, and more — all in one place.',
  );
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore listings');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Browse catalog');
  const heroImage = useThemeMedia('hero.image', '/themes/unifieds/default/1.webp');
  const heroBadgeLabel = useThemeContent('hero.badge_label', 'Live listings');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Live Catalog');
  const collectionTitle = useThemeContent('collection.title', 'Featured Listings.');
  const collectionDescription = useThemeContent(
    'collection.description',
    'Browse real listings from the live Sellio catalog.',
  );

  const emptyKicker = useThemeContent('empty.kicker', 'No listings yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add listings in the admin panel and they will appear here automatically.',
  );

  const ctaTitle = useThemeContent('cta.title', 'Start browsing\ntoday.');
  const ctaDescription = useThemeContent(
    'cta.description',
    'Discover products, properties, services, and more across all categories in one unified marketplace.',
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Browse the catalog');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setLoadingListings(true);
      const result = await fetchAllVerticals({ per_page: 1 });

      if (!isMounted) {
        return;
      }

      if (result.listings.length > 0 || result.failedVerticals.length < VERTICALS.length) {
        setListings(result.listings.slice(0, 6));
        setInventoryTotal(result.total || result.listings.length);
        setCategories(result.categories);
        setListingError(null);
      } else {
        setListings([]);
        setCategories([]);
        setInventoryTotal(null);
        setListingError('Listings are temporarily unavailable.');
      }

      setLoadingListings(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const liveStats = useMemo(
    () => ({
      inventory: inventoryTotal ?? listings.length,
      categories: categories.length,
      verticals: VERTICALS.length,
    }),
    [categories.length, inventoryTotal, listings.length],
  );

  const heroBadgeValue =
    inventoryTotal != null ? `${inventoryTotal}` : listings.length > 0 ? `${listings.length}` : '0';

  return (
    <div>
      <section className="origin-hero" aria-labelledby="ud-hero-title">
        <div>
          <div className="ud-mono ud-hero-eyebrow">{heroEyebrow}</div>
          <h1 className="ud-heading-xl" id="ud-hero-title">
            {heroTitle.split('\n').map((line, index, lines) => {
              const parts = heroHighlight ? line.split(new RegExp(`(${heroHighlight})`, 'g')) : [line];
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {parts.map((part, partIndex) => (
                    <React.Fragment key={`${part}-${partIndex}`}>{part}</React.Fragment>
                  ))}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              );
            })}
          </h1>
          <p className="ud-hero-copy">{heroDescription}</p>
          <div className="ud-hero-buttons">
            <button
              type="button"
              className="core-btn-primary"
              id="ud-btn-explore"
              onClick={() =>
                document.getElementById('ud-listings-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {heroPrimaryCtaLabel}
            </button>
            <a href={themeLink('/explore')} className="ud-hero-secondary-btn" id="ud-btn-spec">
              {heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
        <div className="ud-hero-img-wrapper">
          <div className="ud-hero-img-container">
            <img src={heroImage} alt="Marketplace listings preview" className="ud-hero-img" />
          </div>
          <div className="ud-floating-badge">
            <div className="ud-floating-badge-value">{heroBadgeValue}</div>
            <div className="ud-mono ud-floating-badge-label">{heroBadgeLabel}</div>
          </div>
        </div>
      </section>

      <GlobalTrust />

      <section className="ud-stats-grid" aria-label="Catalog metrics">
        <div>
          <div className="ud-stat-value">{liveStats.inventory.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">Live listings</div>
        </div>
        <div>
          <div className="ud-stat-value">{liveStats.categories.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">Active categories</div>
        </div>
        <div>
          <div className="ud-stat-value">{liveStats.verticals.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">Marketplace verticals</div>
        </div>
      </section>

      <section className="ud-listings-section" id="ud-listings-section" aria-labelledby="ud-listings-title">
        <div className="ud-listings-header">
          <div className="ud-mono ud-section-eyebrow">{collectionEyebrow}</div>
          <h2 id="ud-listings-title">{collectionTitle}</h2>
          <p>{collectionDescription}</p>
          {!loadingListings && inventoryTotal != null && (
            <p className="ud-listings-meta">{inventoryTotal.toLocaleString()} listings available</p>
          )}
        </div>

        {listingError && (
          <div className="ud-alert-slot">
            <CatalogSyncAlert error={listingError} />
          </div>
        )}

        {loadingListings ? (
          <div className="ud-listings-grid" aria-label="Loading live listings">
            {[1, 2, 3].map((item) => (
              <div className="ud-listing-card ud-listing-skeleton" key={item}>
                <div className="ud-listing-image-wrap" />
                <div className="ud-listing-body">
                  <span />
                  <strong />
                  <em />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="ud-listing-state" role="status">
            <div className="ud-mono ud-section-eyebrow">{emptyKicker}</div>
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
            <a href={themeLink('/explore')} className="core-btn-primary ud-empty-cta">
              Open catalog directory
            </a>
          </div>
        ) : (
          <>
            <div className="ud-listings-grid">
              {listings.map((listing) => (
                <a href={themeLink(listing.href)} className="ud-listing-card" key={listing.id}>
                  <div className="ud-listing-image-wrap">
                    <img src={listing.image} alt={listing.title} />
                  </div>
                  <div className="ud-listing-body">
                    <div className="ud-mono">{listing.category}</div>
                    <h3>{listing.title}</h3>
                    <p>{listing.description}</p>
                    <div className="ud-listing-meta">
                      <span>{listing.price}</span>
                      <span>{listing.actionLabel}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {(inventoryTotal ?? 0) > listings.length && (
              <div className="ud-listings-footer">
                <a href={themeLink('/explore')} className="ud-hero-secondary-btn">
                  Browse full catalog
                </a>
              </div>
            )}
          </>
        )}
      </section>

      <CoreFeatures />

      <section className="ud-final-cta" aria-labelledby="ud-cta-title">
        <div className="ud-final-cta-inner">
          <h2 id="ud-cta-title">
            {ctaTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>
          <p>{ctaDescription}</p>
          <a href={themeLink('/explore')} className="core-btn-primary ud-final-cta-btn" id="ud-btn-cta-handshake">
            {ctaButtonLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
