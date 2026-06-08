'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { NexusBentoGrid, NexusPricing } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'CORE_V4_PROTOCOL');
  const heroTitle = useThemeContent('hero.title', 'Beyond\nStandard.');
  const heroHighlight = useThemeContent('hero.highlight', 'Standard.');
  const heroDescription = useThemeContent('hero.description', 'The high-fidelity distribution node for multi-vertical commerce. Standardize your presence across 50 industries with a single, unified engine.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'INITIALIZE NODE');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'VIEW ARCHITECTURE');

  const trustMetric1 = useThemeContent('trust.metric_1', '1.4M_NODES_ACTIVE');
  const trustMetric2 = useThemeContent('trust.metric_2', 'LATENCY: 8ms');
  const trustMetric3 = useThemeContent('trust.metric_3', 'DISTRIBUTION_READY: TRUE');
  const trustMetric4 = useThemeContent('trust.metric_4', 'ENCRYPTION: AES_256');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'LIVE_NEXUS_FEED');
  const collectionTitle = useThemeContent('collection.title', 'Synchronized Listings.');
  const collectionDescription = useThemeContent('collection.description', 'Live product records streamed into the Nexus Prime catalog layer for high-fidelity marketplace discovery.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'NEXUS_OFFLINE');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_NEXUS_FEED');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this nexus feed will hydrate automatically.');

  const midSectionTitle = useThemeContent('mid_section.title', 'The Power\nof Fifty.');
  const midSectionDescription = useThemeContent('mid_section.description', 'Why build fifty themes when you can deploy one engine? Our vertical-specific DNA ensures that every storefront feels bespoke, while sharing the robust high-fidelity logic of the Nexus Prime core.');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/modern/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Ready to\nsynchronize?');
  const ctaDescription = useThemeContent('cta.description', "Initialize your high-fidelity storefront node and join the world's most advanced distribution network.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'CONNECT CORE NODE');

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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Sync quote')
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
              <button className="nexus-btn-primary" id="unp-btn-explore" onClick={() => router.push(themeLink('/explore'))}>
                {heroPrimaryCtaLabel}
              </button>
              <button className="nexus-btn-outline" id="unp-btn-spec" onClick={() => router.push(themeLink('/explore'))}>
                {heroSecondaryCtaLabel}
              </button>
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
                              <div className="unp-mono">NEXUS_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace listing synchronized into the Nexus Prime catalog.'}</p>
                              <div className="unp-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>Open Sync</span>
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
                      {['Dynamic Schema Mapping', 'Real-time Global Sync', 'High-Fidelity UI DNA', 'Institutional Security Nodes'].map(item => (
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
          <button className="nexus-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }} id="unp-btn-cta-handshake" onClick={() => router.push(themeLink('/explore'))}>{ctaButtonLabel}</button>
      </section>
    </div>
  );
}
