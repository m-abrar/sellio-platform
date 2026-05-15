
import React from 'react';
import { ProductShowcase, BrandNarrative } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="atelier-hero">
          <div style={{ maxWidth: '1000px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--atelier-gold)', letterSpacing: '8px', display: 'block', marginBottom: '2.5rem' }}>BOUTIQUE_DISTRIBUTION_V1</span>
              <h1>The <span>Art</span> of <br/>Atmosphere.</h1>
              <p style={{ fontSize: '1.25rem', color: '#888', lineHeight: 2, marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem' }}>
                  A curated high-fidelity edit of the world's most significant fashion assets. Precision in construction, verified by the Atelier protocol.
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                  <button className="atelier-btn-primary">EXPLORE_COLLECTION</button>
                  <button style={{ background: 'none', border: '1px solid #ddd', padding: '1.25rem 4rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>READ_THE_JOURNAL</button>
              </div>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '3.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--atelier-border)', color: '#ccc', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '4px' }}>
          <span>AUTHENTICITY_NODES: 100%</span>
          <span>GLOBAL_DISTRIBUTION: ACTIVE</span>
          <span>BOUTIQUE_SYNC: VERIFIED</span>
          <span>BESPOKE_ACCESS: OPEN</span>
      </section>

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Narrative Section */}
      <BrandNarrative />

      {/* Mid-Section Image Grid */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <div style={{ height: '700px', background: 'var(--atelier-silk)', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68624d5517?q=80&w=2070" alt="Luxury Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ flex: 1, background: 'var(--atelier-silk)', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071" alt="Texture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '4rem', background: 'white', border: '1px solid var(--atelier-border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>Timeless Logic.</h3>
                  <p style={{ color: '#888', lineHeight: 2 }}>Every piece is tracked via the Sellio registry, ensuring a lifetime of high-fidelity authenticity and provenance.</p>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-3px' }}>The Atelier <br/>Registry.</h2>
              <p style={{ fontSize: '1.25rem', color: '#888', lineHeight: 2, marginBottom: '5rem' }}>
                  Join the exclusive distribution node for high-fidelity fashion. Verify your collection and gain access to off-market edits.
              </p>
              <button className="atelier-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1rem' }}>CONNECT_TO_ATELIER</button>
          </div>
      </section>
    </div>
  );
}
