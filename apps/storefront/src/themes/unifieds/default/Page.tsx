'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { CoreFeatures, GlobalTrust } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { formatProductPrice, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'FOUNDATIONAL_DISTRIBUTION_V1');
  const heroTitle = useThemeContent('hero.title', 'The Core of\nDistribution.');
  const heroHighlight = useThemeContent('hero.highlight', 'Distribution.');
  const heroDescription = useThemeContent('hero.description', "A high-fidelity foundational node for multi-vertical commerce. Standardize your global presence with Sellio's most trusted high-performance engine.");
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'GET STARTED CORE');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'READ THE SPEC');
  const heroImage = useThemeMedia('hero.image', '/themes/unifieds/default/1.webp');
  const heroBadgeValue = useThemeContent('hero.badge_value', '50/50');
  const heroBadgeLabel = useThemeContent('hero.badge_label', 'VERTICALLY_READY');

  const statsMetric1Value = useThemeContent('stats.metric_1_value', '99.9%');
  const statsMetric1Label = useThemeContent('stats.metric_1_label', 'UPTIME_GUARANTEE');
  const statsMetric2Value = useThemeContent('stats.metric_2_value', '1.4M+');
  const statsMetric2Label = useThemeContent('stats.metric_2_label', 'GLOBAL_NODES');
  const statsMetric3Value = useThemeContent('stats.metric_3_value', '8ms');
  const statsMetric3Label = useThemeContent('stats.metric_3_label', 'AVERAGE_LATENCY');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'LIVE_REGISTRY');
  const collectionTitle = useThemeContent('collection.title', 'Core Listings Feed.');
  const collectionDescription = useThemeContent('collection.description', 'Live marketplace records synchronized from the Sellio product catalog and curated for enterprise-grade discovery.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'REGISTRY_OFFLINE');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_REGISTRY');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this feed will hydrate automatically.');

  const ctaTitle = useThemeContent('cta.title', 'Scale with the\nFoundation.');
  const ctaDescription = useThemeContent('cta.description', "Initialize your core node and join the world's most stable high-fidelity distribution network. Institutional grade performance, guaranteed.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'INITIALIZE CORE NODE');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(328,214)' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2364758b'>LISTING IMAGE</text></svg>";

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

        console.error('Failed to load unified default listings:', error);
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

  const getProductImageForCard = (product: Product) => getProductImage(product, placeholderImage);

  const formatPrice = (product: Product) => formatProductPrice(product);

  return (
    <div>
      {/* Hero Section */}
      <section className="origin-hero" aria-labelledby="ud-hero-title">
          <div>
              <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '2.5rem' }}>{heroEyebrow}</div>
              <h1 className="ud-heading-xl" id="ud-hero-title">
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
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'var(--ud-slate)', lineHeight: 1.8, marginBottom: '5rem', marginTop: '2.5rem' }}>
                {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="ud-hero-buttons">
                  <button className="core-btn-primary" id="ud-btn-explore" onClick={() => document.getElementById('ud-listings-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    {heroPrimaryCtaLabel}
                  </button>
                  <a
                    href={themeLink('/explore')}
                    style={{
                      background: 'transparent',
                      border: '2px solid var(--ud-azure)',
                      color: 'var(--ud-azure)',
                      padding: '1.25rem 3.5rem',
                      borderRadius: '12px',
                      fontFamily: 'var(--ud-font-heading)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    id="ud-btn-spec"
                  >
                    {heroSecondaryCtaLabel}
                  </a>
              </div>
          </div>
          <div style={{ position: 'relative' }} className="ud-hero-img-wrapper">
              <div style={{ height: '600px', background: '#f0f9ff', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--ud-border)' }} className="ud-hero-img-container">
                  <img src={heroImage} alt="Analytics Core Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--ud-border)' }} className="ud-floating-badge">
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ud-azure)', fontFamily: 'var(--ud-font-heading)', lineHeight: 1 }}>{heroBadgeValue}</div>
                  <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem', marginTop: '0.5rem' }}>{heroBadgeLabel}</div>
              </div>
          </div>
      </section>

      {/* Trust Bar */}
      <GlobalTrust />

      {/* Stats Grid */}
      <section className="ud-stats-grid" aria-label="Uptime and Latency Metrics">
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>{statsMetric1Value}</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>{statsMetric1Label}</div>
          </div>
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>{statsMetric2Value}</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>{statsMetric2Label}</div>
          </div>
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>{statsMetric3Value}</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>{statsMetric3Label}</div>
          </div>
      </section>

      {/* Live Listings */}
      <section className="ud-listings-section" id="ud-listings-section" aria-labelledby="ud-listings-title">
          <div className="ud-listings-header">
              <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="ud-listings-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

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
          ) : listingError ? (
              <div className="ud-listing-state" role="status">
                  <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="ud-listing-state" role="status">
                  <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="ud-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={themeLink(`/product/${product.slug}`)} className="ud-listing-card" key={product.id}>
                          <div className="ud-listing-image-wrap">
                              <img src={getProductImageForCard(product)} alt={product.title} />
                          </div>
                          <div className="ud-listing-body">
                              <div className="ud-mono">CATALOG_ID_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace listing synchronized from the Sellio catalog.'}</p>
                              <div className="ud-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View Record</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      <CoreFeatures />

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid var(--ud-border)' }} aria-labelledby="ud-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, fontFamily: 'var(--ud-font-heading)', marginBottom: '3rem', letterSpacing: '-2px', color: '#1e293b', lineHeight: 1.1 }} id="ud-cta-title">
                {ctaTitle.split('\n').map((line, index, lines) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--ud-slate)', lineHeight: 2, marginBottom: '5rem' }}>
                {ctaDescription}
              </p>
              <a href={themeLink('/explore')} className="core-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.2rem', textDecoration: 'none' }} id="ud-btn-cta-handshake">{ctaButtonLabel}</a>
          </div>
      </section>
    </div>
  );
}
