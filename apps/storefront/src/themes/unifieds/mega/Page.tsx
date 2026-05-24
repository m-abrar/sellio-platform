'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { HeavyweightGrid, MassiveSyncBar } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Quote required')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="mega-hero" aria-labelledby="ugm-hero-title">
          <div style={{ maxWidth: '1200px' }}>
              <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>HEAVYWEIGHT_LOGIC_ACTIVE</div>
              <h1 className="ugm-heading-xl" id="ugm-hero-title">
                The <span>Heavyweight</span> <br/>Grid.
              </h1>
              <p style={{ maxWidth: '800px', fontSize: '1.5rem', color: '#888', lineHeight: 1.8, marginBottom: '6rem', marginTop: '3rem' }}>
                  The world&apos;s most powerful high-fidelity distribution node. Precision structural engineering for multi-vertical commerce at massive scale.
              </p>
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }} className="ugm-hero-buttons">
                  <button className="mega-btn-primary" id="ugm-btn-explore" onClick={() => document.getElementById('ugm-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    INITIALIZE MEGA SYNC
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid #333', 
                      color: 'white', 
                      padding: '1.5rem 5rem', 
                      fontFamily: 'var(--ugm-font-heading)', 
                      fontWeight: 900, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }} id="ugm-btn-spec" onClick={() => alert('Infrastructure spec console activated.')}>
                      INFRASTRUCTURE SPEC
                  </button>
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
              <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1.5rem' }}>LIVE_MEGA_EXCHANGE</div>
              <h2 id="ugm-exchange-title">Heavyweight Listings.</h2>
              <p>Live product records reinforced inside the Mega Grid catalog layer for high-volume marketplace distribution.</p>
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
                  <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>GRID_OFFLINE</div>
                  <h3>Listings could not be synchronized.</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="ugm-listing-state" role="status">
                  <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>EMPTY_GRID</div>
                  <h3>No live listings are available yet.</h3>
                  <p>Add product records in the backend and this grid will hydrate automatically.</p>
              </div>
          ) : (
              <div className="ugm-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="ugm-listing-card" key={product.id}>
                          <div className="ugm-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="ugm-listing-body">
                              <div className="ugm-mono">GRID_ID_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace record reinforced inside the Mega Grid catalog.'}</p>
                              <div className="ugm-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>Inspect Node</span>
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
                  <span className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>INDUSTRIAL_STRENGTH</span>
                  <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-industrial-title">Structural <br/>Authority.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                      The Mega Grid protocol is built for high-density data distribution. Every node is reinforced with multi-layer redundancy, ensuring that your storefront remains stable under any operational volume.
                  </p>
                  <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }} className="ugm-metrics-row">
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>8ms</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>CORE_LATENCY</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>99.9%</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>NODAL_UPTIME</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '600px', background: 'white', border: '2px solid var(--ugm-charcoal)', overflow: 'hidden' }}>
                      <img src="/themes/unifieds/mega/1.webp" alt="Heavyweight Corporate Logistics Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="ugm-floating-reinforced-badge" id="ugm-badge-reinforced">
                      REINFORCED
                  </div>
              </div>
          </div>
      </section>

      {/* Authority Section */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: 'white' }} aria-labelledby="ugm-cta-title">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-4px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-cta-title">Authorize <br/>Distribution.</h2>
              <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Mega Grid and join the world&apos;s most robust high-fidelity distribution network. Institutional performance, guaranteed.
              </p>
              <button className="mega-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.4rem' }} id="ugm-btn-cta-handshake" onClick={() => alert('Infrastructure node handshake synchronized.')}>INITIALIZE HEAVYWEIGHT NODE</button>
          </div>
      </section>
    </div>
  );
}
