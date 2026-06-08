'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { MarketGrid, LiquidSyncBar } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'LIQUID_EXCHANGE_V5');
  const heroTitle = useThemeContent('hero.title', 'Trade the\nFuture.');
  const heroHighlight = useThemeContent('hero.highlight', 'Future.');
  const heroDescription = useThemeContent('hero.description', "The world's most advanced high-fidelity marketplace node. Precision transactional engineering for the modern global economy.");
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'START TRADING');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'MARKET DATA');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'LIVE_TRADE_EXCHANGE');
  const collectionTitle = useThemeContent('collection.title', 'Marketplace Listings.');
  const collectionDescription = useThemeContent('collection.description', 'Live product records synchronized into the Trade Node exchange for liquid marketplace discovery.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'EXCHANGE_OFFLINE');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_EXCHANGE');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this exchange feed will hydrate automatically.');

  const midSectionEyebrow = useThemeContent('mid_section.eyebrow', 'TRANSACTIONAL_AUTHORITY');
  const midSectionTitle = useThemeContent('mid_section.title', 'Liquid\nLogistics.');
  const midSectionDescription = useThemeContent('mid_section.description', 'The Trade Node protocol is designed for high-velocity peer-to-peer commerce. Every transaction is a node in the global Sellio registry, ensuring that your digital and physical assets are distributed with absolute precision.');
  const midSectionMetric1Value = useThemeContent('mid_section.metric_1_value', '1.4B+');
  const midSectionMetric1Label = useThemeContent('mid_section.metric_1_label', 'ANNUAL_VOLUME');
  const midSectionMetric2Value = useThemeContent('mid_section.metric_2_value', '24/7');
  const midSectionMetric2Label = useThemeContent('mid_section.metric_2_label', 'MARKET_UPTIME');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/marketplace/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Liquidate the\nFuture.');
  const ctaDescription = useThemeContent('cta.description', "Connect your trade node to the global exchange and join the world's most liquid high-fidelity distribution network.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'INITIALIZE TRADE NODE');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%230f172a'/><g transform='translate(328,214)' stroke='%2310b981' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%2364748b'>EXCHANGE ASSET</text></svg>";

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

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Negotiate exchange')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="trade-hero" aria-labelledby="um-hero-title">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '3rem' }}>{heroEyebrow}</div>
              <h1 className="um-heading-xl" id="um-hero-title">
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
              <p style={{ maxWidth: '800px', margin: '3rem auto 6rem', fontSize: '1.5rem', color: '#94a3b8', lineHeight: 1.8 }}>
                {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="um-hero-buttons">
                  <button className="trade-btn-primary" id="um-btn-explore" onClick={() => document.getElementById('um-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    {heroPrimaryCtaLabel}
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid #334155', 
                      color: 'white', 
                      padding: '1.5rem 5rem', 
                      borderRadius: '12px', 
                      fontFamily: 'var(--um-font-heading)', 
                      fontWeight: 800, 
                      fontSize: '1rem', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }} id="um-btn-market-data" onClick={() => alert('Exchange market data sync active.')}>
                      {heroSecondaryCtaLabel}
                  </button>
              </div>
          </div>
      </section>

      {/* Liquid Sync Bar */}
      <LiquidSyncBar />

      {/* Market Grid Section */}
      <MarketGrid />

      {/* Live Listings */}
      <section className="um-listings-section" id="um-exchange-section" aria-labelledby="um-exchange-title">
          <div className="um-listings-header">
              <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="um-exchange-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
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
          ) : listingError ? (
              <div className="um-listing-state" role="status">
                  <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="um-listing-state" role="status">
                  <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="um-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="um-listing-card" key={product.id}>
                          <div className="um-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="um-listing-body">
                              <div className="um-mono">EXCHANGE_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace record synchronized into the Trade Node exchange.'}</p>
                              <div className="um-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>Open Trade</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: Transactional Authority */}
      <section className="um-logistics-grid" aria-labelledby="um-logistics-title">
          <div className="um-logistics-grid-container">
              <div>
                  <span className="um-mono" style={{ color: 'var(--um-green)' }}>{midSectionEyebrow}</span>
                  <h2 style={{ fontFamily: 'var(--um-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--um-slate)', lineHeight: 1.1 }} id="um-logistics-title">
                    {midSectionTitle.split('\n').map((line, index, lines) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                    {midSectionDescription}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }} className="um-metrics-row">
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--um-font-heading)', color: 'var(--um-slate)' }}>{midSectionMetric1Value}</div>
                          <div className="um-mono" style={{ color: '#94a3b8', fontSize: '0.65rem' }}>{midSectionMetric1Label}</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--um-font-heading)', color: 'var(--um-slate)' }}>{midSectionMetric2Value}</div>
                          <div className="um-mono" style={{ color: '#94a3b8', fontSize: '0.65rem' }}>{midSectionMetric2Label}</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '600px', background: 'var(--um-bg)', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--um-border)' }}>
                      <img src={midSectionImage} alt="Global Trade Operations Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="um-floating-verified-badge" id="um-badge-verified">
                      VERIFIED
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: 'var(--um-bg)' }} aria-labelledby="um-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--um-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--um-slate)', marginBottom: '4rem', letterSpacing: '-4px', lineHeight: 1.1 }} id="um-cta-title">
                {ctaTitle.split('\n').map((line, index, lines) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.5rem', color: '#64748b', lineHeight: 1.8, marginBottom: '6rem' }}>
                {ctaDescription}
              </p>
              <button className="trade-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.4rem' }} id="um-btn-cta-handshake" onClick={() => alert('Exchange node handshake synchronized.')}>{ctaButtonLabel}</button>
          </div>
      </section>
    </div>
  );
}
