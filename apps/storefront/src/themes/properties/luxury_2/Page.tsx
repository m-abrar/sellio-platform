
import React from 'react';
import { EstateBentoCard } from './components';

export default function Page() {
  const estates = [
    { title: "The Obsidian Monolith", price: "$42,500,000", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070", span: "span-8" },
    { title: "Glass Pavilion | Alpine", price: "$18,200,000", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070", span: "span-4" },
    { title: "Desert Sanctuary", price: "$12,400,000", image: "https://images.unsplash.com/photo-1600585154526-990dbee3f222?q=80&w=2070", span: "span-4" },
    { title: "Coastal Brutalist", price: "$24,800,000", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074", span: "span-8" },
    { title: "The Zen Atrium", price: "$31,500,000", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070", span: "span-12" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="lux-hero">
          <div className="lux-hero-tag">ARCHITECTURAL_ELITE</div>
          <h1>Structural <br/>Sublimity.</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.6, lineHeight: 2 }}>
              A curated collection of the world's most significant private estates. Where raw materials meet refined vision.
          </div>
          
          {/* Scroll Down */}
          <div style={{ position: 'absolute', bottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.3 }}>
              <div style={{ width: '1px', height: '60px', background: 'white' }}></div>
              <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '4px' }}>DISCOVER</span>
          </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '15rem 10%', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '4rem', marginBottom: '3rem' }}>The Protocol of Acquisition.</h2>
              <p style={{ fontSize: '1.2rem', lineHeight: 2, opacity: 0.5, marginBottom: '5rem' }}>
                  We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every node in our network.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', color: 'var(--prop-lux-gold)', marginBottom: '1rem' }}>92%</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4 }}>OFF_MARKET_ACCESS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', color: 'var(--prop-lux-gold)', marginBottom: '1rem' }}>$4.2B</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4 }}>MANAGED_ASSETS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', color: 'var(--prop-lux-gold)', marginBottom: '1rem' }}>24/7</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4 }}>GLOBAL_CONCIERGE</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Bento Grid Estates */}
      <section className="lux-bento-grid">
          {estates.map((estate, i) => (
              <EstateBentoCard key={i} {...estate} />
          ))}
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 10%', background: 'linear-gradient(to top, #000, var(--prop-lux-bg))' }}>
          <div style={{ border: '0.5px solid var(--prop-lux-border)', padding: '8rem 4rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '6px', color: 'var(--prop-lux-gold)', display: 'block', marginBottom: '2rem' }}>PRIVATE_CONSULTATION</span>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Acquire your legacy.</h2>
              <button style={{ 
                  background: 'var(--prop-lux-gold)', 
                  color: 'black', 
                  border: 'none', 
                  padding: '1.5rem 4rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 900, 
                  letterSpacing: '2px' 
              }}>
                  REQUEST_INVITATION
              </button>
          </div>
      </section>
    </div>
  );
}
