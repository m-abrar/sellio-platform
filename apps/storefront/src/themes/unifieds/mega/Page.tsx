'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { HeavyweightGrid, MassiveSyncBar } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Heavyweight Marketplace');
  const heroTitle = useThemeContent('hero.title', 'The Heavyweight\nGrid.');
  const heroHighlight = useThemeContent('hero.highlight', 'Heavyweight');
  const heroDescription = useThemeContent('hero.description', "A high-capacity marketplace platform built for multi-vertical commerce. Designed to handle large-scale listing catalogs with speed and reliability.");
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Browse Marketplace');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'View Catalog');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Live Marketplace');
  const collectionTitle = useThemeContent('collection.title', 'Heavyweight Listings.');
  const collectionDescription = useThemeContent('collection.description', 'Browse live product listings from verified sellers across all marketplace categories.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'Connection Error');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'No Listings Yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here.');

  const midSectionEyebrow = useThemeContent('mid_section.eyebrow', 'Built for Scale');
  const midSectionTitle = useThemeContent('mid_section.title', 'Structural\nAuthority.');
  const midSectionDescription = useThemeContent('mid_section.description', 'This marketplace is built to handle high-volume listing catalogs without compromise. Fast load times, reliable uptime, and a smooth experience for buyers and sellers alike.');
  const midSectionMetric1Value = useThemeContent('mid_section.metric_1_value', '8ms');
  const midSectionMetric1Label = useThemeContent('mid_section.metric_1_label', 'Core Latency');
  const midSectionMetric2Value = useThemeContent('mid_section.metric_2_value', '99.9%');
  const midSectionMetric2Label = useThemeContent('mid_section.metric_2_label', 'Uptime');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/mega/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Grow Your\nMarketplace.');
  const ctaDescription = useThemeContent('cta.description', "List your products on a platform built for scale. Reach buyers across every category with a storefront that handles high-volume traffic with ease.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Get Started');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23171717'/><g transform='translate(328,214)' stroke='%23f97316' stroke-width='3' fill='none' stroke-linecap='square' stroke-linejoin='miter'><rect x='2' y='2' width='60' height='60'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='13' font-weight='900' letter-spacing='2' fill='%23ffffff'>MEGA RECORD</text></svg>";

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

        console.error('Failed to load unified mega listings:', error);
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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Heavyweight quote')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="mega-hero" aria-labelledby="ugm-hero-title">
          <div style={{ maxWidth: '1200px' }}>
              <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>{heroEyebrow}</div>
              <h1 className="ugm-heading-xl" id="ugm-hero-title">
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
              <p style={{ maxWidth: '800px', fontSize: '1.5rem', color: '#888', lineHeight: 1.8, marginBottom: '6rem', marginTop: '3rem' }}>
                {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }} className="ugm-hero-buttons">
                  <a href={themeLink('/explore')} className="mega-btn-primary" id="ugm-btn-explore" style={{ textDecoration: 'none' }}>
                    {heroPrimaryCtaLabel}
                  </a>
                  <a href={themeLink('/explore')} style={{
                      background: 'transparent',
                      border: '2px solid #333',
                      color: 'white',
                      padding: '1.5rem 5rem',
                      fontFamily: 'var(--ugm-font-heading)',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                  }} id="ugm-btn-spec">
                      {heroSecondaryCtaLabel}
                  </a>
              </div>
          </div>
      </section>

      {/* Massive Sync Bar */}
      <MassiveSyncBar />

      {/* Heavyweight Grid Section */}
      <HeavyweightGrid />

      {/* Live Listings */}
      <section className="ugm-listings-section" id="ugm-exchange-section" aria-labelledby="ugm-exchange-title">
          <div className="ugm-listings-header">
              <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="ugm-exchange-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

          {loadingListings ? (
              <div className="ugm-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="ugm-listing-card ugm-listing-skeleton" key={item}>
                          <div className="ugm-listing-image-wrap" />
                          <div className="ugm-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="ugm-listing-state" role="status">
                  <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>Check your API connection and confirm listings are published in the admin panel.</p>
              </div>
          ) : products.length === 0 ? (
              <div className="ugm-listing-state" role="status">
                  <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="ugm-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={themeLink(`/product/${product.slug}`)} className="ugm-listing-card" key={product.id}>
                          <div className="ugm-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="ugm-listing-body">
                              <div className="ugm-mono">{'Listing'}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Browse this listing for full details and pricing.'}</p>
                              <div className="ugm-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View Details</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: Industrial Strength */}
      <section className="ugm-industrial-grid" aria-labelledby="ugm-industrial-title">
          <div className="ugm-industrial-grid-container">
              <div>
                  <span className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>{midSectionEyebrow}</span>
                  <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-industrial-title">
                    {midSectionTitle.split('\n').map((line, index, lines) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                    {midSectionDescription}
                  </p>
                  <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }} className="ugm-metrics-row">
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>{midSectionMetric1Value}</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>{midSectionMetric1Label}</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>{midSectionMetric2Value}</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>{midSectionMetric2Label}</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '600px', background: 'white', border: '2px solid var(--ugm-charcoal)', overflow: 'hidden' }}>
                      <img src={midSectionImage} alt="Heavyweight Corporate Logistics Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="ugm-floating-reinforced-badge" id="ugm-badge-reinforced">
                      Certified
                  </div>
              </div>
          </div>
      </section>

      {/* Authority Section */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: 'white' }} aria-labelledby="ugm-cta-title">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-4px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-cta-title">
                {ctaTitle.split('\n').map((line, index, lines) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                {ctaDescription}
              </p>
              <a href={themeLink('/explore')} className="mega-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.4rem', textDecoration: 'none' }} id="ugm-btn-cta-handshake">{ctaButtonLabel}</a>
          </div>
      </section>
    </div>
  );
}
