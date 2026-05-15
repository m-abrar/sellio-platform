'use client';
import React from 'react';
import { ShowcaseCard, StatisticsNode } from './components';

export default function Page() {
  const estates = [
    { title: "The Obsidian Monolith", price: "$42,500,000", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070", span: "span-8" },
    { title: "Glass Pavilion | Alpine", price: "$18,200,000", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070", span: "span-4" },
    { title: "Desert Sanctuary", price: "$12,400,000", image: "https://images.unsplash.com/photo-1600585154526-990dbee3f222?q=80&w=2070", span: "span-4" },
    { title: "Coastal Brutalist", price: "$24,800,000", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074", span: "span-8" },
    { title: "The Zen Atrium", price: "$31,500,000", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070", span: "span-12" },
  ];

  return (
    <div className="pl-section">
      {/* Platinum Hero */}
      <section className="pl-hero">
        <div className="pl-mono" style={{ color: 'var(--pl-gold)', marginBottom: '3rem' }}>ARCHITECTURAL_SUBLIMITY_V8</div>
        <h1 className="pl-heading-xl">
            Structural <br/>
            Refinement.
        </h1>
        <p style={{ marginTop: '5rem', maxWidth: '700px', fontSize: '1.5rem', color: 'var(--pl-text-dim)', lineHeight: 1.6 }}>
            A curated collection of the world's most significant private estates. Where raw materials meet refined billionaire-minimalist vision.
        </p>
        
        <div className="pl-scroll-indicator">
            <span className="pl-mono">DISCOVER</span>
            <div className="pl-scroll-line"></div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section style={{ padding: '15rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '4rem', textTransform: 'uppercase' }}>
                      The Protocol <br/>of Acquisition.
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: 'var(--pl-text-dim)', lineHeight: 2 }}>
                      We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every node in our network. Each acquisition is handled via our private concierge protocol.
                  </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                  <StatisticsNode label="OFF_MARKET_NODES" value="92%" />
                  <StatisticsNode label="ASSETS_UNDER_SYNC" value="$4.2B" />
                  <StatisticsNode label="GLOBAL_CONCIERGE" value="24/7" />
              </div>
          </div>
      </section>

      {/* Bento Showcase Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
              <div className="pl-mono">CINEMATIC_SHOWCASE</div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--pl-text-dim)', letterSpacing: '2px' }}>
                  FILTER: LUXURY_TIER == "PLATINUM"
              </div>
          </div>
          
          <div className="pl-bento-grid">
            {estates.map((e, i) => (
              <ShowcaseCard key={i} {...e} />
            ))}
          </div>
      </section>

      {/* Private Inquiry CTA */}
      <section style={{ marginTop: '15rem', padding: '15rem 0', border: '1px solid var(--pl-border)', textAlign: 'center', position: 'relative', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="pl-mono" style={{ color: 'var(--pl-gold)', marginBottom: '3rem' }}>PRIVATE_CONSULTATION</div>
              <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', marginBottom: '5rem', textTransform: 'uppercase' }}>
                  Acquire Your <br/>Legacy.
              </h2>
              <button style={{ 
                  background: 'var(--pl-gold)', 
                  color: 'black', 
                  border: 'none', 
                  padding: '2.5rem 8rem', 
                  fontSize: '1rem', 
                  fontWeight: 900, 
                  letterSpacing: '4px',
                  cursor: 'pointer',
                  transition: 'var(--pl-transition)'
              }}>
                  REQUEST_INVITATION
              </button>
          </div>
      </section>
    </div>
  );
}
