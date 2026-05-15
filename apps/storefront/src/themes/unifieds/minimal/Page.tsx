
import React from 'react';
import { CleanCard } from './components';

export default function Page() {
  const items = [
    { title: "Mono Chair 01", price: "$450", category: "Furniture", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2000" },
    { title: "Concrete Lamp", price: "$120", category: "Lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2000" },
    { title: "Steel Table", price: "$890", category: "Furniture", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070" },
    { title: "Black Vase v1", price: "$65", category: "Object", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=2000" },
    { title: "Minimal Watch", price: "$290", category: "Apparel", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070" },
    { title: "Canvas Tote", price: "$45", category: "Apparel", image: "https://images.unsplash.com/photo-1544816153-12ad5d714b21?q=80&w=2000" },
    { title: "Studio Speaker", price: "$320", category: "Tech", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070" },
    { title: "Glass Carafe", price: "$35", category: "Object", image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-hero">
          <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '2rem' }}>COLLECTION_2026</div>
          <h1>Less <br/>Is More.</h1>
          <p style={{ maxWidth: '500px', fontSize: '1rem', fontWeight: 400, opacity: 0.6, marginTop: '4rem' }}>
              Objective design for a cluttered world. Every object is selected for its functional purity and architectural integrity.
          </p>
      </section>

      {/* Grid Section */}
      <section className="min-grid">
          {items.map((item, i) => (
              <CleanCard key={i} {...item} />
          ))}
      </section>

      {/* Content Section */}
      <section style={{ padding: '15rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'flex-start' }}>
          <div>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '4rem', letterSpacing: '-4px' }}>Functional <br/>Purity.</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.8 }}>
                  Our minimalist vertical is a rejection of the ornamental. We provide objects that exist in their most essential state, distributed globally via the Sellio node network.
              </p>
          </div>
          <div style={{ paddingTop: '2rem' }}>
              <div style={{ marginBottom: '4rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1rem' }}>01_AUTHENTICITY</div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>Every object is sourced directly from original design nodes.</p>
              </div>
              <div style={{ marginBottom: '4rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1rem' }}>02_DURABILITY</div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>Built with materials designed for multi-generational utility.</p>
              </div>
              <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1rem' }}>03_DISTRIBUTION</div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>Optimized logistics for zero-waste delivery protocols.</p>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '10rem 5%', borderTop: '2px solid black', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px' }}>Subscribe to the Archive.</h2>
          <div style={{ marginTop: '4rem', maxWidth: '600px', margin: '4rem auto 0', display: 'flex', border: '2px solid black' }}>
              <input type="text" placeholder="EMAIL_ADDRESS" style={{ flex: 1, padding: '1.5rem', border: 'none', fontSize: '0.8rem', fontWeight: 900, outline: 'none' }} />
              <button style={{ background: 'black', color: 'white', border: 'none', padding: '0 4rem', fontSize: '0.8rem', fontWeight: 900 }}>JOIN</button>
          </div>
      </section>
    </div>
  );
}
