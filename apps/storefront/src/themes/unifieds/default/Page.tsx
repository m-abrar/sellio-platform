'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { CoreFeatures, GlobalTrust } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

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

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact for pricing')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="origin-hero" aria-labelledby="ud-hero-title">
          <div>
              <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '2.5rem' }}>FOUNDATIONAL_DISTRIBUTION_V1</div>
              <h1 className="ud-heading-xl" id="ud-hero-title">
                The Core of <br/><span>Distribution.</span>
              </h1>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'var(--ud-slate)', lineHeight: 1.8, marginBottom: '5rem', marginTop: '2.5rem' }}>
                  A high-fidelity foundational node for multi-vertical commerce. Standardize your global presence with Sellio&apos;s most trusted high-performance engine.
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="ud-hero-buttons">
                  <button className="core-btn-primary" id="ud-btn-explore" onClick={() => document.getElementById('ud-features-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    GET STARTED CORE
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid var(--ud-azure)', 
                      color: 'var(--ud-azure)',
                      padding: '1.25rem 3.5rem', 
                      borderRadius: '12px', 
                      fontFamily: 'var(--ud-font-heading)', 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }} id="ud-btn-spec" onClick={() => alert('Core protocol spec initialized.')}>
                      READ THE SPEC
                  </button>
              </div>
          </div>
          <div style={{ position: 'relative' }} className="ud-hero-img-wrapper">
              <div style={{ height: '600px', background: '#f0f9ff', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--ud-border)' }} className="ud-hero-img-container">
                  <img src="/themes/unifieds/default/1.webp" alt="Analytics Core Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--ud-border)' }} className="ud-floating-badge">
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ud-azure)', fontFamily: 'var(--ud-font-heading)', lineHeight: 1 }}>50/50</div>
                  <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem', marginTop: '0.5rem' }}>VERTICALLY_READY</div>
              </div>
          </div>
      </section>

      {/* Trust Bar */}
      <GlobalTrust />

      {/* Stats Grid */}
      <section className="ud-stats-grid" aria-label="Uptime and Latency Metrics">
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>99.9%</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>UPTIME_GUARANTEE</div>
          </div>
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>1.4M+</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>GLOBAL_NODES</div>
          </div>
          <div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--ud-font-heading)' }}>8ms</div>
              <div className="ud-mono" style={{ color: 'var(--ud-slate)', fontSize: '0.65rem' }}>AVERAGE_LATENCY</div>
          </div>
      </section>

      {/* Live Listings */}
      <section className="ud-listings-section" id="ud-listings-section" aria-labelledby="ud-listings-title">
          <div className="ud-listings-header">
              <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1.5rem' }}>LIVE_REGISTRY</div>
              <h2 id="ud-listings-title">Core Listings Feed.</h2>
              <p>
                  Live marketplace records synchronized from the Sellio product catalog and curated for enterprise-grade discovery.
              </p>
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
                  <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>REGISTRY_OFFLINE</div>
                  <h3>Listings could not be synchronized.</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="ud-listing-state" role="status">
                  <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>EMPTY_REGISTRY</div>
                  <h3>No live listings are available yet.</h3>
                  <p>Add product records in the backend and this feed will hydrate automatically.</p>
              </div>
          ) : (
              <div className="ud-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="ud-listing-card" key={product.id}>
                          <div className="ud-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
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
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, fontFamily: 'var(--ud-font-heading)', marginBottom: '3rem', letterSpacing: '-2px', color: '#1e293b', lineHeight: 1.1 }} id="ud-cta-title">Scale with the <br/>Foundation.</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--ud-slate)', lineHeight: 2, marginBottom: '5rem' }}>
                  Initialize your core node and join the world&apos;s most stable high-fidelity distribution network. Institutional grade performance, guaranteed.
              </p>
              <button className="core-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.2rem' }} id="ud-btn-cta-handshake" onClick={() => alert('Core node handshake handshake synchronized.')}>INITIALIZE CORE NODE</button>
          </div>
      </section>
    </div>
  );
}
