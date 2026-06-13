'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { NexusBentoGrid, NexusPricing } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Modern Marketplace');
  const heroTitle = useThemeContent('hero.title', 'Beyond\nStandard.');
  const heroHighlight = useThemeContent('hero.highlight', 'Standard.');
  const heroDescription = useThemeContent('hero.description', 'A powerful multi-vertical marketplace platform. Browse products, properties, services, and more — all in one modern storefront.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Browse the catalog');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Explore listings');

  const trustMetric1 = useThemeContent('trust.metric_1', '1.4M+ Active listings');
  const trustMetric2 = useThemeContent('trust.metric_2', 'Free shipping available');
  const trustMetric3 = useThemeContent('trust.metric_3', 'Verified sellers');
  const trustMetric4 = useThemeContent('trust.metric_4', 'Secure checkout');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Live Catalog');
  const collectionTitle = useThemeContent('collection.title', 'Featured Listings.');
  const collectionDescription = useThemeContent('collection.description', 'Browse live listings from the Sellio catalog, updated in real time.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'Connection error');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'No listings yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here automatically.');

  const midSectionTitle = useThemeContent('mid_section.title', 'The Power\nof One.');
  const midSectionDescription = useThemeContent('mid_section.description', 'One platform powering storefronts across every vertical — products, properties, jobs, services, autos, events, and classifieds. Each one tailored, all sharing the same reliable core.');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/modern/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Ready to\nget started?');
  const ctaDescription = useThemeContent('cta.description', 'Discover products, properties, services, and more across all categories in one unified marketplace.');
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Browse the catalog');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%230a0a0a'/><g transform='translate(328,214)' stroke='%2306b6d4' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='6'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='11' letter-spacing='2' fill='%23525252'>NEXUS RECORD</text></svg>";

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

        console.error('Failed to load unified modern listings:', error);
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

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Price on request')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="nexus-hero" aria-labelledby="unp-hero-title">
          <div className="nexus-hero-glow"></div>
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '2rem' }}>{heroEyebrow}</div>
          <h1 className="unp-heading-xl" id="unp-hero-title">
            {heroTitle.split('\n').map((line, index, lines) => {
              const parts = heroHighlight ? line.split(new RegExp(`(${heroHighlight})`, 'g')) : [line];
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {parts.map((part, pIdx) => 
                    part === heroHighlight ? (
                      <span key={pIdx}>{part}</span>
                    ) : (
                      part
                    )
                  )}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              );
            })}
          </h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--unp-dim)', lineHeight: 1.8, marginBottom: '4rem', marginTop: '2rem' }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="unp-hero-buttons">
              <a href={themeLink('/explore')} className="nexus-btn-primary" id="unp-btn-explore">
                {heroPrimaryCtaLabel}
              </a>
              <a href={themeLink('/explore')} className="nexus-btn-outline" id="unp-btn-spec">
                {heroSecondaryCtaLabel}
              </a>
          </div>
      </section>

      {/* Trust Bar */}
      <section className="unp-trust-bar" aria-label="Operational Status Metrics">
          <span>{trustMetric1}</span>
          <span>{trustMetric2}</span>
          <span>{trustMetric3}</span>
          <span>{trustMetric4}</span>
      </section>

      {/* Bento Section */}
      <NexusBentoGrid />

      {/* Live Listings */}
      <section className="unp-listings-section" id="unp-exchange-section" aria-labelledby="unp-exchange-title">
          <div className="unp-listings-header">
              <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="unp-exchange-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

          {loadingListings ? (
              <div className="unp-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="unp-listing-card unp-listing-skeleton" key={item}>
                          <div className="unp-listing-image-wrap" />
                          <div className="unp-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="unp-listing-state" role="status">
                  <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="unp-listing-state" role="status">
                  <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="unp-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={themeLink(`/product/${product.slug}`)} className="unp-listing-card" key={product.id}>
                          <div className="unp-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="unp-listing-body">
                              <div className="unp-mono">#{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Browse this listing for full details and pricing.'}</p>
                              <div className="unp-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View listing</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Industry Showcase Section */}
      <section className="unp-showcase-section" aria-labelledby="unp-showcase-title">
          <div className="unp-showcase-grid">
              <div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3rem', letterSpacing: '-2px', color: 'white', lineHeight: 1.1 }} id="unp-showcase-title">
                    {midSectionTitle.split('\n').map((line, index, lines) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--unp-dim)', lineHeight: 2, marginBottom: '4rem' }}>
                    {midSectionDescription}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Multi-Vertical Platform', 'Real-Time Catalog Updates', 'Mobile-First Design', 'Secure Transactions'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 700, color: 'var(--unp-cyan)' }}>
                              <div style={{ width: '8px', height: '8px', background: 'var(--unp-cyan)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div className="unp-showcase-badge" id="unp-badge-nexus"></div>
                  <div style={{ height: '500px', background: 'var(--unp-card)', borderRadius: '24px', border: '1px solid var(--unp-border)', overflow: 'hidden' }}>
                      <img src={midSectionImage} alt="Digital Nexus Prime Network Visualizer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <NexusPricing />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="unp-cta-title">
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--unp-cyan) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3.5rem', letterSpacing: '-3px', color: 'white', lineHeight: 1.1 }} id="unp-cta-title">
            {ctaTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--unp-dim)', fontWeight: 300 }}>
            {ctaDescription}
          </p>
          <a href={themeLink('/explore')} className="nexus-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem', display: 'inline-block' }} id="unp-btn-cta-handshake">{ctaButtonLabel}</a>
      </section>
    </div>
  );
}
