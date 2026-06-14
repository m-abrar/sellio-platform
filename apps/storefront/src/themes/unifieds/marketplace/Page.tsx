'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
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

const categoryHighlights = [
  { title: 'Properties', sample: 'Modern apartment', detail: '$1.2M - Downtown', image: '/themes/unifieds/marketplace/5.webp', count: '2.8k' },
  { title: 'Events', sample: 'Summer music pass', detail: 'July 20 - Central Park', image: '/themes/unifieds/marketplace/18.webp', count: '310' },
  { title: 'Autos', sample: 'Tesla Model 3', detail: '2024 - verified', image: '/themes/unifieds/marketplace/10.webp', count: '920' },
  { title: 'Services', sample: 'Photography studio', detail: '5-star local provider', image: '/themes/unifieds/marketplace/14.webp', count: '640' },
  { title: 'Jobs', sample: 'Software engineer', detail: 'Remote - full time', image: '/themes/unifieds/marketplace/21.webp', count: '1.2k' },
  { title: 'Classifieds', sample: 'Vintage watch', detail: '$250 - verified seller', image: '/themes/unifieds/marketplace/24.webp', count: '4.6k' },
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

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Marketplace hub');
  const heroTitle = useThemeContent('hero.title', 'Browse every marketplace in one place.');
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

  const displayListings = useMemo(() => {
    if (loadingListings) {
      return [];
    }

    return products.length > 0 ? products.slice(0, 6).map(productToListing) : fallbackListings;
  }, [loadingListings, products]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchQuery.trim();
    router.push(themeLink(term ? `/explore?search=${encodeURIComponent(term)}` : '/explore'));
  };

  return (
    <div>
      <section className="um-hero" aria-labelledby="um-hero-title">
        <div className="um-hero-content">
          <div className="um-section-kicker">{heroEyebrow}</div>
          <h1 id="um-hero-title">{heroTitle}</h1>
          <p>{heroDescription}</p>

          <div className="um-hero-proof" aria-label="Marketplace proof points">
            <span>Multi-category search</span>
            <span>Verified sellers</span>
            <span>Fresh listing feed</span>
          </div>

          <form className="um-hero-search" onSubmit={submitSearch}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search homes, cars, services, jobs..."
              aria-label="Search marketplace listings"
            />
            <button type="submit">Search</button>
          </form>

          <div className="um-hero-actions">
            <a className="um-btn-primary" href={themeLink('/explore')}>
              {heroPrimaryCtaLabel}
            </a>
            <a className="um-btn-secondary" href={themeLink('/explore#categories')}>
              {heroSecondaryCtaLabel}
            </a>
          </div>

          <div className="um-hero-stats" aria-label="Marketplace snapshot">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="um-featured-carousel" aria-label="Featured listings carousel" aria-busy={loadingListings}>
          {loadingListings ? (
            [0, 1, 2].map((item) => (
              <div
                className={`um-feature-card um-feature-card-loading ${item === 0 ? 'um-feature-card-primary' : ''}`}
                key={item}
              >
                <div className="um-feature-card-skeleton-image" />
                <span />
                <h2 />
                <p />
                <strong />
              </div>
            ))
          ) : (
            displayListings.slice(0, 3).map((listing, index) => (
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
              </a>
            ))
          )}
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
                </div>
                <div className="um-listing-body">
                  <div className="um-listing-badge">{listing.badge}</div>
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <div className="um-listing-meta">
                    <span>{listing.price}</span>
                    <span>View details</span>
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
          <h2 id="um-trust-title">A marketplace buyers understand fast.</h2>
          <p>
            Search first, scan featured listings, browse categories, and move into details without friction.
          </p>
          <div className="um-trust-metrics">
            <div>
              <strong>4.9/5</strong>
              <span>Average seller rating</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Marketplace discovery</span>
            </div>
            <div>
              <strong>7+</strong>
              <span>Listing verticals</span>
            </div>
            <div>
              <strong>1 cart</strong>
              <span>Unified checkout path</span>
            </div>
          </div>
        </div>
        <figure>
          <img src={trustImage} alt="Verified marketplace seller workspace" />
          <figcaption>Verified sellers</figcaption>
        </figure>
      </section>

      <section className="um-final-cta" aria-labelledby="um-final-cta-title">
        <h2 id="um-final-cta-title">{featuredTitle}</h2>
        <p>{featuredDescription}</p>
        <a className="um-btn-primary" href={themeLink('/explore')}>
          Browse the marketplace
        </a>
      </section>
    </div>
  );
}
