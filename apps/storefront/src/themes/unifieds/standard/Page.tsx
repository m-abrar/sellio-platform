'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { EfficiencyBar, ProtocolGrid } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Standard Marketplace');
  const heroTitle = useThemeContent('hero.title', 'The Scale\nProtocol.');
  const heroHighlight = useThemeContent('hero.highlight', 'Scale');
  const heroDescription = useThemeContent('hero.description', "A modular, reliable marketplace platform engineered for multi-vertical commerce. Clean data, fast delivery, and global reach.");
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Browse Listings');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'View Catalog');

  const layersTitle = useThemeContent('layers.title', 'Platform Features.');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Live Listings');
  const collectionTitle = useThemeContent('collection.title', 'Standard Listings Exchange.');
  const collectionDescription = useThemeContent('collection.description', 'Browse live product listings from verified sellers across all marketplace categories.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'Connection Error');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'No Listings Yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here.');

  const midSectionEyebrow = useThemeContent('mid_section.eyebrow', 'Built for Efficiency');
  const midSectionTitle = useThemeContent('mid_section.title', 'Modular\nEfficiency.');
  const midSectionDescription = useThemeContent('mid_section.description', 'Every part of this marketplace is designed for maximum efficiency. Fast data delivery, standardized listing formats, and a platform that stays reliable under any volume of traffic.');
  const midSectionMetric1Value = useThemeContent('mid_section.metric_1_value', '6ms');
  const midSectionMetric1Label = useThemeContent('mid_section.metric_1_label', 'Avg Response');
  const midSectionMetric2Value = useThemeContent('mid_section.metric_2_value', '100%');
  const midSectionMetric2Label = useThemeContent('mid_section.metric_2_label', 'Compliance');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/standard/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Start Selling\nToday.');
  const ctaDescription = useThemeContent('cta.description', "List your products on a fast, reliable marketplace platform and reach buyers across all categories. Start with Sellio.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Get Started');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23f4f4f5'/><g transform='translate(328,214)' stroke='%2318181b' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='4'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='700' fill='%23a1a1aa'>SCALE RECORD</text></svg>";

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

        console.error('Failed to load unified standard listings:', error);
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
      <section className="scale-hero" aria-labelledby="usp-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '2.5rem' }}>{heroEyebrow}</div>
              <h1 className="usp-heading-xl" id="usp-hero-title">
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
              <p style={{ maxWidth: '600px', margin: '2rem auto 5rem', fontSize: '1.25rem', color: 'var(--usp-gray)', lineHeight: 1.8, fontWeight: 300 }}>
                {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }} className="usp-hero-buttons">
                  <a href={themeLink('/explore')} className="scale-btn-primary" id="usp-btn-explore" style={{ textDecoration: 'none' }}>
                    {heroPrimaryCtaLabel}
                  </a>
                  <a href={themeLink('/explore')} style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.5rem 4rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--usp-navy)', textDecoration: 'none' }} id="usp-btn-doc">
                    {heroSecondaryCtaLabel}
                  </a>
              </div>
          </div>
      </section>

      {/* Efficiency Bar */}
      <EfficiencyBar />

      {/* Protocol Grid Section */}
      <section style={{ padding: '8rem 6% 0', textAlign: 'center' }} aria-labelledby="usp-layers-title">
          <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-layers-title">{layersTitle}</h2>
      </section>
      <ProtocolGrid />

      {/* Live Listings */}
      <section className="usp-listings-section" id="usp-exchange-section" aria-labelledby="usp-exchange-title">
          <div className="usp-listings-header">
              <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="usp-exchange-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

          {loadingListings ? (
              <div className="usp-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="usp-listing-card usp-listing-skeleton" key={item}>
                          <div className="usp-listing-image-wrap" />
                          <div className="usp-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="usp-listing-state" role="status">
                  <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>Check your API connection and confirm listings are published in the admin panel.</p>
              </div>
          ) : products.length === 0 ? (
              <div className="usp-listing-state" role="status">
                  <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="usp-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={themeLink(`/product/${product.slug}`)} className="usp-listing-card" key={product.id}>
                          <div className="usp-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="usp-listing-body">
                              <div className="usp-mono">{'Listing'}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Browse this listing for full details and pricing.'}</p>
                              <div className="usp-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View Details</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: Geometric Precision */}
      <section className="usp-geometric-section" aria-labelledby="usp-mid-title">
          <div className="usp-geometric-grid">
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'white', borderRadius: '12px', border: '1px solid var(--usp-border)', overflow: 'hidden' }}>
                      <img src={midSectionImage} alt="Hardware Tech Precision Calibration" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="usp-geometric-badge" id="usp-badge-calibration"></div>
              </div>
              <div>
                  <span className="usp-mono" style={{ color: 'var(--usp-navy)' }}>{midSectionEyebrow}</span>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', fontWeight: 800, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-mid-title">
                    {midSectionTitle.split('\n').map((line, index, lines) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--usp-gray)', lineHeight: 2, marginBottom: '4rem', fontWeight: 300 }}>
                    {midSectionDescription}
                  </p>
                  <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="usp-stats-row">
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>{midSectionMetric1Value}</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>{midSectionMetric1Label}</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>{midSectionMetric2Value}</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>{midSectionMetric2Label}</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }} aria-labelledby="usp-cta-title">
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-3px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-cta-title">
            {ctaTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: 'var(--usp-gray)', fontWeight: 300 }}>
            {ctaDescription}
          </p>
          <a href={themeLink('/explore')} className="scale-btn-primary" id="usp-btn-cta-handshake" style={{ textDecoration: 'none' }}>{ctaButtonLabel}</a>
      </section>
    </div>
  );
}
