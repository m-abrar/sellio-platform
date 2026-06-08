'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { InteractionCanvas, FluidLogicBar } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'KINETIC_TRANSMISSION_V4');
  const heroTitle = useThemeContent('hero.title', 'Fluid\nDynamics.');
  const heroHighlight = useThemeContent('hero.highlight', 'Dynamics.');
  const heroDescription = useThemeContent('hero.description', 'The high-fidelity interaction node for multi-vertical commerce. Synchronize your digital distribution through fluid logic and kinetic transitions.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'INITIALIZE SYNC');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'READ THE DYNAMICS');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'LIVE_MOTION_FEED');
  const collectionTitle = useThemeContent('collection.title', 'Kinetic Listings.');
  const collectionDescription = useThemeContent('collection.description', 'Live product records synchronized into the Motion Node catalog for fast, fluid marketplace discovery.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'MOTION_OFFLINE');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_MOTION_FEED');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this motion feed will hydrate automatically.');

  const midSectionTitle = useThemeContent('mid_section.title', 'The Speed\nof Logic.');
  const midSectionDescription = useThemeContent('mid_section.description', 'Every interaction is a node. Every motion is a transition. Our high-fidelity protocol ensures that your digital distribution is as fluid as it is performant.');
  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/interactive/1.webp');

  const ctaTitle = useThemeContent('cta.title', 'Ready to\nTransition?');
  const ctaDescription = useThemeContent('cta.description', "Connect your interaction node to the world's most advanced high-fidelity distribution network. Precision motion, guaranteed.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'CONNECT MOTION NODE');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23000000'/><g transform='translate(328,214)' stroke='%23fbbf24' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='10'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%236366f1'>MOTION RECORD</text></svg>";

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

        console.error('Failed to load unified interactive listings:', error);
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
      <section className="motion-hero" aria-labelledby="ui-hero-title">
          <div className="motion-hero-glow"></div>
          <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '2.5rem' }}>{heroEyebrow}</div>
          <h1 className="ui-heading-xl" id="ui-hero-title">
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
          <p style={{ maxWidth: '800px', margin: '3rem auto 5rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }} className="ui-hero-buttons">
              <button className="motion-btn-primary" id="ui-btn-explore" onClick={() => document.getElementById('ui-interactive-canvas-section')?.scrollIntoView({ behavior: 'smooth' })}>
                {heroPrimaryCtaLabel}
              </button>
              <button style={{ 
                  padding: '1.5rem 4rem', 
                  background: 'transparent', 
                  color: 'white', 
                  border: '2px solid #333', 
                  fontFamily: 'var(--ui-font-heading)', 
                  fontWeight: 800, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
              }} id="ui-btn-dynamics" onClick={() => alert('Dynamics console initialized.')}>
                  {heroSecondaryCtaLabel}
              </button>
          </div>
      </section>

      {/* Fluid Bar */}
      <FluidLogicBar />

      {/* Interaction Canvas */}
      <InteractionCanvas />

      {/* Live Listings */}
      <section className="ui-listings-section" id="ui-interactive-canvas-section" aria-labelledby="ui-exchange-title">
          <div className="ui-listings-header">
              <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="ui-exchange-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

          {loadingListings ? (
              <div className="ui-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="ui-listing-card ui-listing-skeleton" key={item}>
                          <div className="ui-listing-image-wrap" />
                          <div className="ui-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="ui-listing-state" role="status">
                  <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="ui-listing-state" role="status">
                  <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="ui-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="ui-listing-card" key={product.id}>
                          <div className="ui-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="ui-listing-body">
                              <div className="ui-mono">MOTION_ID_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace record synchronized into the Motion Node catalog.'}</p>
                              <div className="ui-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>Open Motion</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: High Velocity */}
      <section className="ui-velocity-grid" aria-labelledby="ui-velocity-title">
          <div className="ui-velocity-grid-container">
              <div>
                  <h2 style={{ fontFamily: 'var(--ui-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: 'white', marginBottom: '3rem', letterSpacing: '-3px', lineHeight: 1.1 }} id="ui-velocity-title">
                    {midSectionTitle.split('\n').map((line, index, lines) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: '#888', lineHeight: 2, marginBottom: '4rem' }}>
                    {midSectionDescription}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Real-time Interaction Sync', 'Low-Latency Transitions', 'Dynamic Schema Fluids', 'Kinetic Asset Mapping'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 800, color: 'var(--ui-indigo)', letterSpacing: '2px' }}>
                              <div style={{ width: '10px', height: '10px', background: 'var(--ui-indigo)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'var(--ui-card)', borderRadius: '24px', border: '1px solid var(--ui-border)', overflow: 'hidden' }}>
                      <img src={midSectionImage} alt="Cyber Tech Cybernetics" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', width: '150px', height: '150px', borderBottom: '2px solid var(--ui-yellow)', borderRight: '2px solid var(--ui-yellow)' }} className="ui-yellow-accent-bracket"></div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="ui-cta-title">
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--ui-yellow) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontFamily: 'var(--ui-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, color: 'white', marginBottom: '4rem', letterSpacing: '-4px', lineHeight: 1.1 }} id="ui-cta-title">
            {ctaTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
            {ctaDescription}
          </p>
          <button className="motion-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.2rem' }} id="ui-btn-cta-handshake" onClick={() => alert('Interaction node handshake synchronized.')}>{ctaButtonLabel}</button>
      </section>
    </div>
  );
}
