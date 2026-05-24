'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { ProtocolGrid, EfficiencyBar } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(328,214)' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2364758b'>SCALE LISTING</text></svg>";

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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact for pricing')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="scale-hero" aria-labelledby="usp-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '2.5rem' }}>MODULAR_DISTRIBUTION_V1</div>
              <h1 className="usp-heading-xl" id="usp-hero-title">
                The <span>Scale</span> <br/>Protocol.
              </h1>
              <p style={{ maxWidth: '600px', margin: '2rem auto 5rem', fontSize: '1.25rem', color: 'var(--usp-gray)', lineHeight: 1.8, fontWeight: 300 }}>
                  The world&apos;s most efficient high-fidelity distribution node. Modular, precise, and engineered for global multi-vertical commerce.
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }} className="usp-hero-buttons">
                  <button className="scale-btn-primary" id="usp-btn-explore" onClick={() => document.getElementById('usp-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    INITIALIZE NODE
                  </button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.5rem 4rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', color: 'var(--usp-navy)' }} id="usp-btn-doc" onClick={() => alert('Scale Protocol documentation initialized.')}>
                    VIEW DOCUMENTATION
                  </button>
              </div>
          </div>
      </section>

      {/* Efficiency Bar */}
      <EfficiencyBar />

      {/* Protocol Grid Section */}
      <section style={{ padding: '8rem 6% 0', textAlign: 'center' }} aria-labelledby="usp-layers-title">
          <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-layers-title">Universal Logic Layers.</h2>
      </section>
      <ProtocolGrid />

      {/* Live Listings */}
      <section className="usp-listings-section" id="usp-exchange-section" aria-labelledby="usp-exchange-title">
          <div className="usp-listings-header">
              <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1.5rem' }}>LIVE_EXCHANGE</div>
              <h2 id="usp-exchange-title">Standard Listings Exchange.</h2>
              <p>Live product records synchronized into the Scale Protocol for clean, modular marketplace discovery.</p>
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
                  <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1rem' }}>EXCHANGE_OFFLINE</div>
                  <h3>Listings could not be synchronized.</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="usp-listing-state" role="status">
                  <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1rem' }}>EMPTY_EXCHANGE</div>
                  <h3>No live listings are available yet.</h3>
                  <p>Add product records in the backend and this exchange will hydrate automatically.</p>
              </div>
          ) : (
              <div className="usp-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="usp-listing-card" key={product.id}>
                          <div className="usp-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="usp-listing-body">
                              <div className="usp-mono">NODE_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace listing synchronized into the Scale Protocol.'}</p>
                              <div className="usp-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>Open Node</span>
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
                      <img src="/themes/unifieds/standard/1.webp" alt="Hardware Tech Precision Calibration" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="usp-geometric-badge" id="usp-badge-calibration"></div>
              </div>
              <div>
                  <span className="usp-mono" style={{ color: 'var(--usp-navy)' }}>GEOMETRIC_PRECISION</span>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', fontWeight: 800, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-mid-title">Modular <br/>Efficiency.</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--usp-gray)', lineHeight: 2, marginBottom: '4rem', fontWeight: 300 }}>
                      Every node in the Scale Protocol is designed for maximum efficiency. By isolating architectural layers and standardizing data mapping, we achieve a distribution latency that is unmatched in the multi-vertical market.
                  </p>
                  <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="usp-stats-row">
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>6ms</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>AVERAGE_SYNC</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>100%</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>ISO_COMPLIANCE</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }} aria-labelledby="usp-cta-title">
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-3px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-cta-title">Initialize the <br/>Standard.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: 'var(--usp-gray)', fontWeight: 300 }}>
              Connect your professional node to the Scale Protocol and gain access to the world&apos;s most efficient high-fidelity distribution network.
          </p>
          <button className="scale-btn-primary" id="usp-btn-cta-handshake" onClick={() => alert('Scale Protocol handshakes active.')}>CONNECT SCALE NODE</button>
      </section>
    </div>
  );
}
