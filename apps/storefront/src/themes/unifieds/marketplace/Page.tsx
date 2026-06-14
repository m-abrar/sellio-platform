'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product, Testimonial } from '@sellio/types';
import { MarketGrid, LiquidSyncBar } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

type DisplayListing = {
  id: string | number;
  title: string;
  description: string;
  price: string;
  image: string;
  slug?: string;
  badge: string;
};

type CategoryHighlight = {
  title: string;
  query: string;
  sample: string;
  detail: string;
  image: string;
  count: string;
};

const categoryFallbacks: CategoryHighlight[] = [
  { title: 'Properties',  query: 'properties',  sample: 'Modern apartment',   detail: '$1.2M · Downtown',        image: '/themes/unifieds/marketplace/5.webp',  count: '—' },
  { title: 'Events',      query: 'events',      sample: 'Summer music pass',  detail: 'July 20 · Central Park',   image: '/themes/unifieds/marketplace/18.webp', count: '—' },
  { title: 'Autos',       query: 'autos',       sample: 'Tesla Model 3',      detail: '2024 · verified',           image: '/themes/unifieds/marketplace/10.webp', count: '—' },
  { title: 'Services',    query: 'services',    sample: 'Photography studio', detail: '5-star local provider',     image: '/themes/unifieds/marketplace/14.webp', count: '—' },
  { title: 'Jobs',        query: 'jobs',        sample: 'Software engineer',  detail: 'Remote · full time',        image: '/themes/unifieds/marketplace/21.webp', count: '—' },
  { title: 'Classifieds', query: 'classifieds', sample: 'Vintage watch',      detail: '$250 · verified seller',    image: '/themes/unifieds/marketplace/24.webp', count: '—' },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return String(n);
}

const fallbackListings: DisplayListing[] = [
  {
    id: 'fallback-property',
    title: 'Modern Penthouse',
    description: 'Skyline views, concierge service, flexible closing.',
    price: '$3.5M',
    image: '/themes/unifieds/marketplace/1.webp',
    badge: 'Property',
  },
  {
    id: 'fallback-auto',
    title: 'Electric SUV',
    description: 'Low mileage, premium package, fast charging.',
    price: '$55,000',
    image: '/themes/unifieds/marketplace/10.webp',
    badge: 'Auto',
  },
  {
    id: 'fallback-service',
    title: 'Photo Studio',
    description: 'Top-rated creative team for product shoots.',
    price: 'From $299',
    image: '/themes/unifieds/marketplace/14.webp',
    badge: 'Service',
  },
];

const heroStats = [
  { value: '6+', label: 'market categories' },
  { value: 'Fresh', label: 'listing feed' },
  { value: 'Secure', label: 'checkout' },
];

function productToListing(product: Product): DisplayListing {
  return {
    id: product.id,
    title: product.title,
    description: product.description || 'Verified marketplace listing.',
    price: product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact seller'),
    image: product.media?.featured_image || product.image_url || '/themes/unifieds/marketplace/2.webp',
    slug: product.slug,
    badge: 'Featured',
  };
}

export default function Page() {
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryHighlights, setCategoryHighlights] = useState<CategoryHighlight[]>(categoryFallbacks);
  const [totalListings, setTotalListings] = useState<number | null>(null);
  const [activeVerticals, setActiveVerticals] = useState<number>(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [avgRating, setAvgRating] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Marketplace hub');
  const heroTitle = useThemeContent('hero.title', 'Browse every marketplace in one place.');
  const heroHighlight = useThemeContent('hero.highlight', 'marketplace');
  const heroDescription = useThemeContent('hero.description', 'Find products, properties, cars, services, jobs, events, and classifieds from one polished Sellio storefront.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore listings');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'View categories');

  const featuredTitle = useThemeContent('collection.title', 'Featured listings');
  const featuredDescription = useThemeContent('collection.description', 'Fresh listings from your Sellio catalog.');
  const trendingTitle = useThemeContent('trending.title', 'Trending items');
  const trendingDescription = useThemeContent('trending.description', 'Popular listings buyers can scan quickly.');
  const trustImage = useThemeMedia('mid_section.image', '/themes/unifieds/marketplace/16.webp');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      try {
        const fetchedProducts = await api.getProducts();
        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setListingError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified marketplace listings:', error);
        setListingError(error instanceof Error ? error.message : 'Listings are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingListings(false);
        }
      }
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    Promise.allSettled([
      api.getProperties({ per_page: 1 }),
      api.getEvents({ per_page: 1 }),
      api.getVehicles({ per_page: 1 }),
      api.getServices({ per_page: 1 }),
      api.getJobs({ per_page: 1 }),
      api.getClassifieds({ per_page: 1 }),
    ]).then(([props, events, autos, services, jobs, classifieds]) => {
      if (!alive) return;

      function resolve(
        result: PromiseSettledResult<{ data: any[]; meta?: { total?: number } }>,
        imgFn: (item: any) => string | null | undefined,
        fallback: CategoryHighlight,
      ): Partial<CategoryHighlight> {
        const ok = result.status === 'fulfilled';
        const item = ok ? result.value.data?.[0] : undefined;
        const total = ok ? result.value.meta?.total : undefined;
        return {
          count: total != null ? formatCount(total) : fallback.count,
          image: (item && imgFn(item)) || fallback.image,
        };
      }

      setCategoryHighlights([
        { ...categoryFallbacks[0], ...resolve(props,       (p) => p.featured_image || p.thumbnail_image || p.primary_image_url,  categoryFallbacks[0]) },
        { ...categoryFallbacks[1], ...resolve(events,      (e) => e.media?.poster || e.media?.preview,                           categoryFallbacks[1]) },
        { ...categoryFallbacks[2], ...resolve(autos,       (v) => v.featured_image,                                              categoryFallbacks[2]) },
        { ...categoryFallbacks[3], ...resolve(services,    (s) => s.media?.main_photo,                                           categoryFallbacks[3]) },
        { ...categoryFallbacks[4], ...resolve(jobs,        (j) => j.company?.logo || j.company?.photos?.[0]?.url,                categoryFallbacks[4]) },
        { ...categoryFallbacks[5], ...resolve(classifieds, (c) => c.media?.main_photo || c.media?.thumbnail,                     categoryFallbacks[5]) },
      ]);

      const rawTotals = [props, events, autos, services, jobs, classifieds].reduce<number[]>((totals, result) => {
        if (result.status === 'fulfilled' && result.value.meta?.total != null) {
          totals.push(result.value.meta.total);
        }

        return totals;
      }, []);

      if (rawTotals.length > 0) {
        setTotalListings(rawTotals.reduce((a, b) => a + b, 0));
        setActiveVerticals(rawTotals.length);
      }
    });

    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    api.getTestimonials('unifieds_marketplace', 3)
      .then((data) => {
        if (!alive) return;
        const published = data.filter((t) => t.status === 'published').slice(0, 3);
        setTestimonials(published);
        const ratings = published.filter((t) => t.rating != null).map((t) => t.rating!);
        if (ratings.length > 0) {
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          setAvgRating(avg.toFixed(1));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const displayListings = useMemo(() => {
    if (loadingListings) {
      return fallbackListings;
    }

    return products.length > 0 ? products.slice(0, 6).map(productToListing) : fallbackListings;
  }, [loadingListings, products]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchQuery.trim();
    window.location.href = themeLink(term ? `/explore?search=${encodeURIComponent(term)}` : '/explore');
  };

  const titleParts = heroHighlight ? heroTitle.split(heroHighlight) : null;
  const titleNode = titleParts && titleParts.length > 1 ? (
    <>{titleParts[0]}<span className="um-hero-highlight">{heroHighlight}</span>{titleParts.slice(1).join(heroHighlight)}</>
  ) : heroTitle;

  return (
    <div>
      <section className="um-hero" aria-labelledby="um-hero-title">
        <div className="um-hero-content">
          <div className="um-section-kicker">{heroEyebrow}</div>
          <h1 id="um-hero-title">{titleNode}</h1>
          <p>{heroDescription}</p>

          <form className="um-hero-search" onSubmit={submitSearch} role="search">
            <div className="um-hero-search-filter">
              <select
                aria-label="Search category"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) window.location.href = themeLink(`/explore?category=${val}`);
                }}
                defaultValue=""
              >
                <option value="">All</option>
                <option value="properties">Properties</option>
                <option value="autos">Autos</option>
                <option value="services">Services</option>
                <option value="jobs">Jobs</option>
                <option value="events">Events</option>
                <option value="classifieds">Classifieds</option>
              </select>
              <span className="um-hero-search-divider" aria-hidden="true" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search homes, cars, services, jobs..."
              aria-label="Search marketplace listings"
            />
            <button type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              Search
            </button>
          </form>

          <div className="um-hero-actions" aria-label="Marketplace actions">
            <a className="um-btn-primary" href={themeLink('/explore')}>
              {heroPrimaryCtaLabel}
            </a>
            <a className="um-btn-secondary" href="#categories">
              {heroSecondaryCtaLabel}
            </a>
          </div>

          <nav className="um-hero-quick-cats" aria-label="Browse by category">
            {(['Properties', 'Autos', 'Services', 'Jobs', 'Events', 'Classifieds'] as const).map((cat) => (
              <a key={cat} href={themeLink(`/explore?category=${cat.toLowerCase()}`)} className="um-hero-cat-link">
                {cat}
              </a>
            ))}
          </nav>

          <div className="um-hero-meta" aria-label="Marketplace summary">
            <span>
              <strong>{totalListings != null ? formatCount(totalListings) : '6+'}</strong> listings
            </span>
            <span className="um-hero-meta-dot" aria-hidden="true" />
            <span>
              <strong>{activeVerticals > 0 ? activeVerticals : 6}</strong> categories
            </span>
            <span className="um-hero-meta-dot" aria-hidden="true" />
            <span>
              <strong>{avgRating ?? '4.9'}★</strong> avg rating
            </span>
          </div>
        </div>

        <div className="um-featured-carousel" aria-label="Featured listings" aria-busy={loadingListings}>
          <div className="um-hero-showcase-label">
            <span>Featured now</span>
            <strong>{displayListings.length > 0 ? displayListings[0].price : 'Live feed'}</strong>
          </div>
          {displayListings.slice(0, 3).map((listing, index) => (
            <a
              href={listing.slug ? themeLink(`/product/${listing.slug}`) : themeLink('/explore')}
              className={`um-feature-card ${index === 0 ? 'um-feature-card-primary' : ''}`}
              key={listing.id}
            >
              <img src={listing.image} alt={listing.title} />
              <div className="um-feature-card-content">
                <span>{listing.badge}</span>
                <h2>{listing.title}</h2>
                <p>{listing.description}</p>
                <strong>{listing.price}</strong>
              </div>
              <div className="um-feature-card-hover-cta" aria-hidden="true">
                View listing
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </div>
            </a>
          ))}
          <div className="um-hero-promo-card">
            <span>Seller boost</span>
            <strong>Post once. Sell across every vertical.</strong>
            <a href={themeLink('/explore')}>Start exploring</a>
          </div>
        </div>
      </section>

      <LiquidSyncBar />

      <section className="um-category-blocks" id="categories" aria-labelledby="um-category-blocks-title">
        <div className="um-section-kicker">Category blocks</div>
        <div className="um-section-heading-row">
          <h2 id="um-category-blocks-title">Start with a category.</h2>
          <a href={themeLink('/explore')} className="um-text-link">View marketplace</a>
        </div>
        <div className="um-category-highlight-grid">
          {categoryHighlights.map((category) => (
            <a href={themeLink(`/explore?category=${encodeURIComponent(category.title.toLowerCase())}`)} className="um-category-highlight" key={category.title}>
              <img src={category.image} alt={category.sample} />
              <div>
                <span>{category.title}</span>
                <strong>{category.count}</strong>
                <h3>{category.sample}</h3>
                <p>{category.detail}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <MarketGrid />

      <section className="um-listings-section" aria-labelledby="um-trending-title">
        <div className="um-listings-header">
          <div className="um-section-kicker">Buyer activity</div>
          <h2 id="um-trending-title">{trendingTitle}</h2>
          <p>{trendingDescription}</p>
        </div>

        {loadingListings ? (
          <div className="um-listings-grid" aria-label="Loading live listings">
            {[1, 2, 3].map((item) => (
              <div className="um-listing-card um-listing-skeleton" key={item}>
                <div className="um-listing-image-wrap" />
                <div className="um-listing-body">
                  <span />
                  <strong />
                  <em />
                </div>
              </div>
            ))}
          </div>
        ) : listingError && products.length === 0 ? (
          <div className="um-listing-state" role="status">
            <h3>Live listings could not be loaded.</h3>
            <p>Check the API connection or refresh the page.</p>
          </div>
        ) : (
          <div className="um-listings-grid">
            {displayListings.map((listing) => (
              <a href={listing.slug ? themeLink(`/product/${listing.slug}`) : themeLink('/explore')} className="um-listing-card" key={listing.id}>
                <div className="um-listing-image-wrap">
                  <img src={listing.image} alt={listing.title} />
                  <span className="um-listing-badge">{listing.badge}</span>
                </div>
                <div className="um-listing-body">
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <div className="um-listing-meta">
                    <span className="um-listing-price">{listing.price}</span>
                    <span className="um-listing-cta">
                      View details
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="um-trust-section" aria-labelledby="um-trust-title">
        <div>
          <div className="um-section-kicker">Top-rated sellers</div>
          <h2 id="um-trust-title">Trusted by buyers across every category.</h2>
          <p>
            Real sellers, verified listings, and a single checkout that spans products,
            properties, vehicles, services, jobs, events, and classifieds.
          </p>
          <div className="um-trust-metrics">
            <div>
              <strong>{totalListings != null ? `${totalListings.toLocaleString()}+` : '—'}</strong>
              <span>Active listings</span>
            </div>
            <div>
              <strong>{activeVerticals > 0 ? `${activeVerticals}+` : '6+'}</strong>
              <span>Listing verticals</span>
            </div>
            <div>
              <strong>{avgRating ? `${avgRating}/5` : '4.9/5'}</strong>
              <span>Avg. seller rating</span>
            </div>
            <div>
              <strong>1 cart</strong>
              <span>Unified checkout</span>
            </div>
          </div>
        </div>

        {testimonials.length > 0 ? (
          <div className="um-testimonial-stack">
            {testimonials.map((t) => (
              <div className="um-testimonial-card" key={t.id}>
                <div className="um-testimonial-stars" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < (t.rating ?? 5) ? 'um-star-on' : 'um-star-off'}>★</span>
                  ))}
                </div>
                <p className="um-testimonial-quote">"{t.quote}"</p>
                <div className="um-testimonial-author">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.author_name} />
                  ) : (
                    <span className="um-testimonial-initials">
                      {t.author_name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <strong>{t.author_name}</strong>
                    {(t.author_title || t.company) && (
                      <span>{[t.author_title, t.company].filter(Boolean).join(' · ')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <figure>
            <img src={trustImage} alt="Verified marketplace seller workspace" />
            <figcaption>Verified sellers</figcaption>
          </figure>
        )}
      </section>

      <section className="um-final-cta" aria-labelledby="um-final-cta-title">
        <div className="um-cta-glow um-cta-glow-a" aria-hidden="true" />
        <div className="um-cta-glow um-cta-glow-b" aria-hidden="true" />

        <div className="um-section-kicker um-cta-kicker">Your next move</div>
        <h2 id="um-final-cta-title">{featuredTitle}</h2>
        <p>{featuredDescription}</p>

        <div className="um-cta-actions">
          <a className="um-btn-primary" href={themeLink('/explore')}>
            Browse the marketplace
          </a>
          <a className="um-cta-btn-outline" href={themeLink('/explore')}>
            Post a listing
          </a>
        </div>

        <div className="um-cta-chips">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Free to browse
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            Verified sellers
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Secure checkout
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
            Fresh listings daily
          </span>
        </div>
      </section>
    </div>
  );
}
