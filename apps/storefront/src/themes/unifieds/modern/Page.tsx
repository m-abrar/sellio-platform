'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { NexusBentoGrid, NexusPricing } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23020617'/><g transform='translate(328,214)' stroke='%2322d3ee' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2394a3b8'>NEXUS LISTING</text></svg>";

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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact for pricing')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="nexus-hero" aria-labelledby="unp-hero-title">
          <div className="nexus-hero-glow"></div>
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '2rem' }}>CORE_V4_PROTOCOL</div>
          <h1 className="unp-heading-xl" id="unp-hero-title">
            Beyond <br/><span>Standard.</span>
          </h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--unp-dim)', lineHeight: 1.8, marginBottom: '4rem', marginTop: '2rem' }}>
              The high-fidelity distribution node for multi-vertical commerce. Standardize your presence across 50 industries with a single, unified engine.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="unp-hero-buttons">
              <button className="nexus-btn-primary" id="unp-btn-explore" onClick={() => document.getElementById('unp-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                INITIALIZE NODE
              </button>
              <button className="nexus-btn-outline" id="unp-btn-spec" onClick={() => alert('Nexus Architecture Blueprint initialized.')}>
                VIEW ARCHITECTURE
              </button>
          </div>
      </section>

      {/* Trust Bar */}
      <section className="unp-trust-bar" aria-label="Operational Status Metrics">
          <span>1.4M_NODES_ACTIVE</span>
          <span>LATENCY: 8ms</span>
          <span>DISTRIBUTION_READY: TRUE</span>
          <span>ENCRYPTION: AES_256</span>
      </section>

      {/* Bento Section */}
      <NexusBentoGrid />

      {/* Live Listings */}
      <section className="unp-listings-section" id="unp-exchange-section" aria-labelledby="unp-exchange-title">
          <div className="unp-listings-header">
              <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1.5rem' }}>LIVE_NEXUS_FEED</div>
              <h2 id="unp-exchange-title">Synchronized Listings.</h2>
              <p>Live product records streamed into the Nexus Prime catalog layer for high-fidelity marketplace discovery.</p>
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
                  <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>NEXUS_OFFLINE</div>
                  <h3>Listings could not be synchronized.</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="unp-listing-state" role="status">
                  <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>EMPTY_NEXUS</div>
                  <h3>No live listings are available yet.</h3>
                  <p>Add product records in the backend and this feed will hydrate automatically.</p>
              </div>
          ) : (
              <div className="unp-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="unp-listing-card" key={product.id}>
                          <div className="unp-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="unp-listing-body">
                              <div className="unp-mono">NEXUS_ID_{product.id}</div>
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
                  <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3rem', letterSpacing: '-2px', color: 'white', lineHeight: 1.1 }} id="unp-showcase-title">The Power <br/>of Fifty.</h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--unp-dim)', lineHeight: 2, marginBottom: '4rem' }}>
                      Why build fifty themes when you can deploy one engine? Our vertical-specific DNA ensures that every storefront feels bespoke, while sharing the robust high-fidelity logic of the Nexus Prime core.
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
                      <img src="/themes/unifieds/modern/1.webp" alt="Digital Nexus Prime Network Visualizer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <NexusPricing />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="unp-cta-title">
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--unp-cyan) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3.5rem', letterSpacing: '-3px', color: 'white', lineHeight: 1.1 }} id="unp-cta-title">Ready to <br/>synchronize?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--unp-dim)', fontWeight: 300 }}>
              Initialize your high-fidelity storefront node and join the world&apos;s most advanced distribution network.
          </p>
          <button className="nexus-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }} id="unp-btn-cta-handshake" onClick={() => alert('Nexus core node handshake synchronized.')}>CONNECT CORE NODE</button>
      </section>
    </div>
  );
}
