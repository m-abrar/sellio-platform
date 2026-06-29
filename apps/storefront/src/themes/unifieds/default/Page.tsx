'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Category } from '@sellio/types';
import {
  AutoCard,
  ClassifiedMiniCard,
  CoreFeatures,
  EventCard,
  GlobalTrust,
  HeroMosaic,
  HeroSearchModule,
  HowItWorks,
  JobListItem,
  JobsClassifiedsSplitPanel,
  PopularCategoriesSection,
  PropertyCard,
  ServiceCategoryCard,
  VerticalModuleCards,
} from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import {
  fetchHomeListings,
  VERTICALS,
  type ExploreListing,
  type Vertical,
} from '@/themes/unifieds/shared/multiVertical';

function byVertical(listings: ExploreListing[], vertical: Vertical): ExploreListing[] {
  return listings.filter((l) => l.vertical === vertical).slice(0, 4);
}

// Shared skeleton grid shown while a section loads
function SectionSkeletons({ count = 4, gridClass }: { count?: number; gridClass: string }) {
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ud-listing-card ud-listing-skeleton">
          <div className="ud-listing-image-wrap" />
          <div className="ud-listing-body">
            <span />
            <strong />
            <em />
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple product card (no specs; just image + category + title + price)
function ProductCard({
  listing,
  themeLink,
}: {
  listing: ExploreListing;
  themeLink: (path: string) => string;
}) {
  return (
    <a href={themeLink(listing.href)} className="ud-product-card">
      <div className="ud-product-card__img-wrap">
        <img src={listing.image} alt={listing.title} loading="lazy" className="ud-product-card__img" />
        <span className="ud-product-card__badge">{listing.category}</span>
      </div>
      <div className="ud-product-card__body">
        <h3 className="ud-product-card__title">{listing.title}</h3>
        <div className="ud-product-card__footer">
          <span className="ud-product-card__price">{listing.price}</span>
          <span className="ud-product-card__action">{listing.actionLabel}</span>
        </div>
      </div>
    </a>
  );
}

export default function Page() {
  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totals, setTotals] = useState<Partial<Record<Vertical, number>>>({});
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroTitle = useThemeContent('hero.title', 'Everything you need,\nall in one place.');
  const heroHighlight = useThemeContent('hero.highlight', 'all in one place.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover properties, vehicles, events, jobs, and more — all in one trusted marketplace.',
  );

  // ── Section: Properties ───────────────────────────────────────────────────
  const propertiesTitle = useThemeContent('properties_section.title', 'Properties');
  const propertiesCta = useThemeContent('properties_section.cta', 'View all properties');

  // ── Section: Products ─────────────────────────────────────────────────────
  const productsTitle = useThemeContent('products_section.title', 'Products');
  const productsCta = useThemeContent('products_section.cta', 'Browse all products');

  // ── Section: Autos ────────────────────────────────────────────────────────
  const autosTitle = useThemeContent('autos_section.title', 'Vehicles for Sale');
  const autosCta = useThemeContent('autos_section.cta', 'Browse all vehicles');

  // ── Section: Events ───────────────────────────────────────────────────────
  const eventsTitle = useThemeContent('events_section.title', 'Upcoming Events');
  const eventsCta = useThemeContent('events_section.cta', 'See all events');

  // ── Section: Services ─────────────────────────────────────────────────────
  const servicesTitle = useThemeContent('services_section.title', 'Service Providers');
  const servicesCta = useThemeContent('services_section.cta', 'Find services');

  // ── Seller CTA ────────────────────────────────────────────────────────────
  const sellerCtaEyebrow = useThemeContent('seller_cta.eyebrow', 'Sell on the marketplace');
  const sellerCtaTitle = useThemeContent('seller_cta.title', 'Reach more buyers');
  const sellerCtaDescription = useThemeContent(
    'seller_cta.description',
    'List your property, vehicle, service, or product in minutes and connect with thousands of active buyers.',
  );
  const sellerCtaButton = useThemeContent('seller_cta.button', 'Post a listing');
  const sellerCtaHiwLink = useThemeContent('seller_cta.hiw_link', 'How it works');

  // ── Empty state ───────────────────────────────────────────────────────────
  const emptyKicker = useThemeContent('empty.kicker', 'No listings yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add listings in the admin panel and they will appear here automatically.',
  );
  const emptyCta = useThemeContent('empty.cta', 'Open catalog directory');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setLoadingListings(true);
      const result = await fetchHomeListings();

      if (!isMounted) return;

      if (result.listings.length > 0 || result.failedVerticals.length < VERTICALS.length) {
        setListings(result.listings);
        setInventoryTotal(result.total || result.listings.length);
        setCategories(result.categories);
        setTotals(result.totals);
        setListingError(null);
      } else {
        setListings([]);
        setCategories([]);
        setTotals({});
        setInventoryTotal(null);
        setListingError('Listings are temporarily unavailable.');
      }

      setLoadingListings(false);
    }

    loadListings();
    return () => { isMounted = false; };
  }, []);

  const properties = useMemo(() => byVertical(listings, 'properties'), [listings]);
  const products   = useMemo(() => byVertical(listings, 'products'),   [listings]);
  const autos      = useMemo(() => byVertical(listings, 'autos'),      [listings]);
  const events     = useMemo(() => byVertical(listings, 'events'),     [listings]);
  const jobs       = useMemo(() => byVertical(listings, 'jobs'),       [listings]);
  const classifieds = useMemo(() => byVertical(listings, 'classifieds'), [listings]);

  // Service categories (from API sidebar.categories tagged as 'services'),
  // falling back to any category if none are vertically tagged.
  const serviceCategories = useMemo(() => {
    const tagged = categories.filter((c) => c.vertical === 'services');
    return tagged.length > 0 ? tagged.slice(0, 6) : [];
  }, [categories]);

  const mosaicImages = useMemo(() => {
    const priority: Vertical[] = ['properties', 'autos', 'events', 'services'];
    const seen: ExploreListing[] = [];
    for (const v of priority) {
      const match = listings.find((l) => l.vertical === v && l.image && !l.image.includes('placeholder'));
      if (match) seen.push(match);
    }
    return seen;
  }, [listings]);

  // Show '—' while loading so badge doesn't flash '0'
  const heroBadgeValue = loadingListings
    ? '—'
    : (inventoryTotal ?? listings.length).toLocaleString();

  const noListings = !loadingListings && listings.length === 0 && !listingError;

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="origin-hero" aria-labelledby="ud-hero-title">
        <div className="ud-hero-content">
          <div className="ud-hero-verticals-strip" aria-label="Marketplace verticals">
            {['Properties', 'Autos', 'Jobs', 'Events'].map(v => (
              <span key={v} className="ud-hero-vertical-chip">{v}</span>
            ))}
            <span className="ud-hero-vertical-more">+3 more</span>
          </div>
          <h1 className="ud-heading-xl" id="ud-hero-title">
            {heroTitle.split('\n').map((line, lineIndex, lines) => {
              const escapedHighlight = heroHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const parts = heroHighlight
                ? line.split(new RegExp(`(${escapedHighlight})`, 'g'))
                : [line];
              return (
                <React.Fragment key={`line-${lineIndex}`}>
                  {parts.map((part, pi) =>
                    part === heroHighlight ? (
                      // Picked up by: .origin-hero h1 span { color: var(--ud-azure) }
                      <span key={`hl-${pi}`}>{part}</span>
                    ) : (
                      <React.Fragment key={`txt-${pi}`}>{part}</React.Fragment>
                    ),
                  )}
                  {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h1>
          <p className="ud-hero-copy">{heroDescription}</p>
          <HeroSearchModule
            categories={categories}
            themeLink={themeLink}
            inventoryTotal={inventoryTotal}
            isLoading={loadingListings}
          />
        </div>

        <div className="ud-hero-visual">
          {mosaicImages.length > 0 ? (
            <HeroMosaic listings={mosaicImages} />
          ) : (
            <div className="ud-hero-mosaic" aria-hidden="true">
              <div className="ud-hero-mosaic__col">
                <div className="ud-hero-mosaic__item ud-hero-mosaic__item--lg">
                  <div className="ud-hero-mosaic__placeholder" />
                </div>
                <div className="ud-hero-mosaic__item ud-hero-mosaic__item--sm">
                  <div className="ud-hero-mosaic__placeholder" />
                </div>
              </div>
              <div className="ud-hero-mosaic__col ud-hero-mosaic__col--offset">
                <div className="ud-hero-mosaic__item ud-hero-mosaic__item--sm">
                  <div className="ud-hero-mosaic__placeholder" />
                </div>
                <div className="ud-hero-mosaic__item ud-hero-mosaic__item--lg">
                  <div className="ud-hero-mosaic__placeholder" />
                </div>
              </div>
            </div>
          )}
          <div className="ud-floating-badge">
            <div className="ud-fbl-live-row">
              <span className="ud-floating-badge-live-dot" aria-hidden="true" />
              <span className="ud-fbl-live-text">Live now</span>
            </div>
            <div className={`ud-fbl-count${loadingListings ? ' ud-fbl-count--loading' : ''}`}>
              {heroBadgeValue}
              {!loadingListings && <span className="ud-fbl-count-plus" aria-hidden="true">+</span>}
            </div>
            <p className="ud-fbl-desc">active listings</p>
            <div className="ud-fbl-sep" aria-hidden="true" />
            <div className="ud-fbl-verticals">
              <span className="ud-fbl-vchip">Properties</span>
              <span className="ud-fbl-vchip">Autos</span>
              <span className="ud-fbl-vchip ud-fbl-vchip--more">+5 more</span>
            </div>
          </div>
        </div>
      </section>

      <GlobalTrust />

      {listingError && (
        <div className="ud-alert-slot">
          <CatalogSyncAlert error={listingError} />
        </div>
      )}

      {/* ── Vertical Module Cards ─────────────────────────────────────────── */}
      <div id="ud-discovery-section">
        <VerticalModuleCards
          verticals={VERTICALS}
          totals={totals}
          themeLink={themeLink}
          isLoading={loadingListings}
        />
      </div>

      {/* ── Properties ───────────────────────────────────────────────────── */}
      {(loadingListings || properties.length > 0) && (
        <section className="ud-vertical-section" aria-labelledby="ud-properties-title">
          <div className="ud-section-head">
            <div>
              <h2 className="ud-section-title" id="ud-properties-title">{propertiesTitle}</h2>
              {!loadingListings && (
                <p className="ud-section-count">
                  {(totals.properties ?? 0).toLocaleString()} listings
                </p>
              )}
            </div>
            <a href={themeLink('/explore?vertical=properties')} className="ud-section-cta">
              {propertiesCta}
            </a>
          </div>
          {loadingListings ? (
            <SectionSkeletons count={4} gridClass="ud-property-grid" />
          ) : (
            <div className="ud-property-grid">
              {properties.map((l) => <PropertyCard key={l.id} listing={l} themeLink={themeLink} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Products ─────────────────────────────────────────────────────── */}
      {(loadingListings || products.length > 0) && (
        <section className="ud-vertical-section ud-vertical-section--alt" aria-labelledby="ud-products-title">
          <div className="ud-section-head">
            <div>
              <h2 className="ud-section-title" id="ud-products-title">{productsTitle}</h2>
              {!loadingListings && (
                <p className="ud-section-count">
                  {(totals.products ?? 0).toLocaleString()} listings
                </p>
              )}
            </div>
            <a href={themeLink('/explore?vertical=products')} className="ud-section-cta">
              {productsCta}
            </a>
          </div>
          {loadingListings ? (
            <SectionSkeletons count={4} gridClass="ud-product-grid" />
          ) : (
            <div className="ud-product-grid">
              {products.map((l) => <ProductCard key={l.id} listing={l} themeLink={themeLink} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Autos ────────────────────────────────────────────────────────── */}
      {(loadingListings || autos.length > 0) && (
        <section className="ud-vertical-section" aria-labelledby="ud-autos-title">
          <div className="ud-section-head">
            <div>
              <h2 className="ud-section-title" id="ud-autos-title">{autosTitle}</h2>
              {!loadingListings && (
                <p className="ud-section-count">
                  {(totals.autos ?? 0).toLocaleString()} listings
                </p>
              )}
            </div>
            <a href={themeLink('/explore?vertical=autos')} className="ud-section-cta">
              {autosCta}
            </a>
          </div>
          {loadingListings ? (
            <SectionSkeletons count={4} gridClass="ud-auto-grid" />
          ) : (
            <div className="ud-auto-grid">
              {autos.map((l) => <AutoCard key={l.id} listing={l} themeLink={themeLink} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Events ───────────────────────────────────────────────────────── */}
      {(loadingListings || events.length > 0) && (
        <section className="ud-vertical-section ud-vertical-section--alt" aria-labelledby="ud-events-title">
          <div className="ud-section-head">
            <div>
              <h2 className="ud-section-title" id="ud-events-title">{eventsTitle}</h2>
              {!loadingListings && (
                <p className="ud-section-count">
                  {(totals.events ?? 0).toLocaleString()} listings
                </p>
              )}
            </div>
            <a href={themeLink('/explore?vertical=events')} className="ud-section-cta">
              {eventsCta}
            </a>
          </div>
          {loadingListings ? (
            <SectionSkeletons count={4} gridClass="ud-event-grid" />
          ) : (
            <div className="ud-event-grid">
              {events.map((l) => <EventCard key={l.id} listing={l} themeLink={themeLink} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Jobs + Classifieds Split ──────────────────────────────────────── */}
      {(loadingListings || jobs.length > 0 || classifieds.length > 0) && (
        loadingListings ? (
          <section className="ud-split-section">
            <div className="ud-split-panel-grid">
              <div className="ud-split-panel">
                <SectionSkeletons count={4} gridClass="ud-jobs-list" />
              </div>
              <div className="ud-split-panel">
                <SectionSkeletons count={4} gridClass="ud-classifieds-mini-grid" />
              </div>
            </div>
          </section>
        ) : (
          <JobsClassifiedsSplitPanel
            jobs={jobs}
            classifieds={classifieds}
            themeLink={themeLink}
          />
        )
      )}

      {/* ── Services ─────────────────────────────────────────────────────── */}
      {(loadingListings || serviceCategories.length > 0) && (
        <section className="ud-vertical-section" aria-labelledby="ud-services-title">
          <div className="ud-section-head">
            <div>
              <h2 className="ud-section-title" id="ud-services-title">{servicesTitle}</h2>
              {!loadingListings && (
                <p className="ud-section-count">
                  {(totals.services ?? 0).toLocaleString()} providers
                </p>
              )}
            </div>
            <a href={themeLink('/explore?vertical=services')} className="ud-section-cta">
              {servicesCta}
            </a>
          </div>
          {loadingListings ? (
            <SectionSkeletons count={6} gridClass="ud-svc-grid" />
          ) : (
            <div className="ud-svc-grid">
              {serviceCategories.map((cat) => (
                <ServiceCategoryCard key={cat.id} category={cat} themeLink={themeLink} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {noListings && (
        <section className="ud-listings-section" aria-labelledby="ud-empty-title">
          <div className="ud-listing-state" role="status">
            <div className="ud-mono ud-section-eyebrow">{emptyKicker}</div>
            <h3 id="ud-empty-title">{emptyTitle}</h3>
            <p>{emptyDescription}</p>
            <a href={themeLink('/explore')} className="core-btn-primary ud-empty-cta">
              {emptyCta}
            </a>
          </div>
        </section>
      )}

      {/* ── Popular Categories ────────────────────────────────────────────── */}
      {!loadingListings && categories.length > 0 && (
        <PopularCategoriesSection categories={categories} themeLink={themeLink} />
      )}

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <HowItWorks />

      <CoreFeatures />

      {/* ── Seller CTA ────────────────────────────────────────────────────── */}
      <section className="ud-seller-cta" aria-labelledby="ud-seller-cta-title">
        <div className="ud-seller-cta-inner">
          <div className="ud-seller-cta-copy">
            <div className="ud-mono ud-section-eyebrow">{sellerCtaEyebrow}</div>
            <h2 id="ud-seller-cta-title">{sellerCtaTitle}</h2>
            <p>{sellerCtaDescription}</p>
            <div className="ud-seller-cta-actions">
              <a href={themeLink('/listing')} className="core-btn-primary ud-seller-cta-btn">
                {sellerCtaButton}
              </a>
              {/* Links to HIW section above — same page */}
              <a href="#ud-hiw-section" className="ud-seller-cta-link">{sellerCtaHiwLink}</a>
            </div>
          </div>
          <div className="ud-seller-cta-stats">
            {inventoryTotal != null && (
              <div className="ud-seller-stat">
                <span className="ud-seller-stat__value">{inventoryTotal.toLocaleString()}</span>
                <span className="ud-mono ud-seller-stat__label">Active listings</span>
              </div>
            )}
            <div className="ud-seller-stat">
              <span className="ud-seller-stat__value">{VERTICALS.length}</span>
              <span className="ud-mono ud-seller-stat__label">Marketplace verticals</span>
            </div>
            <div className="ud-seller-stat">
              <span className="ud-seller-stat__value">{!loadingListings ? categories.length || '—' : '—'}</span>
              <span className="ud-mono ud-seller-stat__label">Active categories</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
