'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { HeritageGrid, ChronicleBar } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23fffcf2'/><g transform='translate(328,214)' stroke='%23d4af37' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='4'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='13' font-weight='700' letter-spacing='2' fill='%237f1d1d'>ARCHIVE RECORD</text></svg>";

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

        console.error('Failed to load unified classic listings:', error);
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
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Price upon request')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="legacy-hero" aria-labelledby="uc-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>TRADITION_OF_EXCELLENCE</div>
              <h1 className="uc-heading-xl" id="uc-hero-title">
                The <span className="uc-italic" style={{ color: 'var(--uc-gold)' }}>Heritage</span> of <br/>Distribution.
              </h1>
              <p style={{ maxWidth: '700px', margin: '3rem auto 6rem', fontSize: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                  A high-fidelity foundational node for multi-vertical commerce. Established on the principles of structural integrity and global reliability.
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="uc-hero-buttons">
                  <button className="legacy-btn-primary" id="uc-btn-explore" onClick={() => document.getElementById('uc-heritage-registry')?.scrollIntoView({ behavior: 'smooth' })}>
                    ENTER THE ARCHIVE
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid var(--uc-burgundy)', 
                      padding: '1.5rem 5rem', 
                      fontFamily: 'var(--uc-font-heading)', 
                      fontWeight: 700, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      color: 'var(--uc-burgundy)',
                      transition: 'all 0.3s ease'
                  }} id="uc-btn-chronicles" onClick={() => alert('Chronicles handbook initialized.')}>
                      READ THE CHRONICLES
                  </button>
              </div>
          </div>
      </section>

      {/* Chronicle Bar */}
      <ChronicleBar />

      {/* Heritage Grid Section */}
      <HeritageGrid />

      {/* Live Listings */}
      <section className="uc-listings-section" id="uc-heritage-registry" aria-labelledby="uc-registry-title">
          <div className="uc-listings-header">
              <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1.5rem' }}>LIVE_HERITAGE_REGISTRY</div>
              <h2 id="uc-registry-title">The Catalog Archive.</h2>
              <p>Live product records preserved inside the Legacy Registry for dignified marketplace discovery.</p>
          </div>

          {loadingListings ? (
              <div className="uc-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="uc-listing-card uc-listing-skeleton" key={item}>
                          <div className="uc-listing-image-wrap" />
                          <div className="uc-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="uc-listing-state" role="status">
                  <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1rem' }}>ARCHIVE_OFFLINE</div>
                  <h3>Listings could not be synchronized.</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="uc-listing-state" role="status">
                  <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1rem' }}>EMPTY_ARCHIVE</div>
                  <h3>No live listings are available yet.</h3>
                  <p>Add product records in the backend and this archive will hydrate automatically.</p>
              </div>
          ) : (
              <div className="uc-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={`/product/${product.slug}`} className="uc-listing-card" key={product.id}>
                          <div className="uc-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="uc-listing-body">
                              <div className="uc-mono">ARCHIVE_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace record preserved inside the Legacy Registry.'}</p>
                              <div className="uc-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View Provenance</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: Time-Honored Precision */}
      <section className="uc-precision-grid" aria-labelledby="uc-precision-title">
          <div style={{ position: 'relative' }}>
              <div style={{ height: '700px', background: 'white', border: '1px solid var(--uc-border)', overflow: 'hidden' }}>
                  <img src="/themes/unifieds/classic/1.webp" alt="Historical Architecture Provenance" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '200px', height: '200px', borderBottom: '3px solid var(--uc-gold)', borderLeft: '3px solid var(--uc-gold)' }} className="uc-gold-accent-bracket"></div>
          </div>
          <div>
              <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>TIME_HONORED_PRECISION</span>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginTop: '2.5rem', marginBottom: '3rem', letterSpacing: '-2px', lineHeight: 1.1 }} id="uc-precision-title">Structural <br/>Elegance.</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  The Legacy Node protocol is built on a foundation of reliability. By blending traditional structural integrity with modern distribution logic, we ensure that your high-fidelity assets remain secure and accessible across the global network.
              </p>
              <div style={{ display: 'flex', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>30yr+</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>CORE_LOGIC_AGE</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>100%</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>ASSET_PROVENANCE</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', background: 'var(--uc-cream)' }} aria-labelledby="uc-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginBottom: '4rem', letterSpacing: '-3px', lineHeight: 1.1 }} id="uc-cta-title">Establish Your <br/>Legacy.</h2>
              <p style={{ fontSize: '1.4rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Legacy Registry and join the world&apos;s most trusted high-fidelity distribution network. Institutional authority, guaranteed.
              </p>
              <button className="legacy-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.35rem' }} id="uc-btn-cta-handshake" onClick={() => alert('Legacy node handshake handshake synchronized.')}>CONNECT LEGACY NODE</button>
          </div>
      </section>
    </div>
  );
}
