'use client';
import React from 'react';
import { RetreatBentoCard, ExperienceStats } from './components';

export default function Page() {
  const retreats = [
    { title: "Azure Bay Villa", location: "Amalfi Coast, Italy", price: "$1,200", rating: "4.95", image: "/themes/properties/vacation/9.webp" },
    { title: "Nordic Glass Cabin", location: "Lofoten, Norway", price: "$850", rating: "4.88", image: "/themes/properties/vacation/10.webp" },
    { title: "Santorini Heights", location: "Oia, Greece", price: "$1,500", rating: "4.99", image: "/themes/properties/vacation/11.webp" },
    { title: "Bamboo Zen Estate", location: "Bali, Indonesia", price: "$450", rating: "4.92", image: "/themes/properties/vacation/12.webp" },
    { title: "Alpine Chalet v2", location: "Zermatt, Switzerland", price: "$980", rating: "4.85", image: "/themes/properties/vacation/13.webp" },
    { title: "Desert Mirror House", location: "Joshua Tree, USA", price: "$1,100", rating: "4.97", image: "/themes/properties/vacation/14.webp" },
  ];

  return (
    <div className="pv-section">
      {/* Escape Hero */}
      <section className="pv-hero" aria-labelledby="pv-hero-title">
        <div className="pv-hero-tag">
          <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>GLOBAL_ESCAPE_REGISTRY_V8</div>
          <h1 className="pv-heading-xl" id="pv-hero-title">
            Find Your <br/>
            Infinite <span className="pv-italic" style={{ color: 'var(--pv-azure)' }}>Horizon.</span>
          </h1>
        </div>
        <p style={{ marginTop: '3rem', fontSize: '1.4rem', color: 'var(--pv-text-muted)', lineHeight: 1.8, maxWidth: '700px', margin: '3rem auto' }}>
            A curated collection of the world's most significant vacation retreats. Authenticated by our local nodes, enjoyed by global travelers.
        </p>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }} className="pv-hero-buttons">
          <button className="pv-btn-primary" id="pv-btn-explore" onClick={() => document.getElementById('pv-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Destinations
          </button>
          <button style={{ 
              background: 'transparent', 
              border: '2px solid var(--pv-azure)', 
              color: 'var(--pv-azure)', 
              padding: '1.5rem 4.5rem', 
              borderRadius: '100px', 
              fontWeight: 800, 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
          }} id="pv-btn-list" onClick={() => alert('Registering vacation retreat node.')}>
              List Your Retreat
          </button>
        </div>
      </section>

      {/* Trust bar */}
      <section className="pv-trust-bar" aria-label="Trust and Protocol Indicators">
          {['100%_AUTHENTICATED', 'NO_PROTOCOL_FEES', 'LOCAL_NODE_SUPPORT', 'CRYPTO_SYNC_ENABLED'].map(trust => (
              <div key={trust} className="pv-mono" style={{ fontSize: '0.65rem', color: 'var(--pv-ink)', opacity: 0.6 }}>{trust}</div>
          ))}
      </section>

      {/* Retreat Grid */}
      <section id="pv-registry-grid" aria-labelledby="pv-grid-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem', flexWrap: 'wrap', gap: '3rem' }}>
              <div>
                  <div className="pv-mono" style={{ marginBottom: '1.5rem' }}>CURATED_COLLECTION</div>
                  <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pv-ink)' }} id="pv-grid-title">The <span className="pv-italic">Retreats.</span></h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '1rem', color: 'var(--pv-text-muted)', lineHeight: 1.8 }}>
                  Every property in our vacation vertical is manually verified by a local node expert to validate the vibe and view.
              </div>
          </div>
          
          <div className="pv-retreat-grid">
            {retreats.map((r, i) => (
              <RetreatBentoCard key={i} {...r} />
            ))}
          </div>
      </section>

      {/* Philosophy / Value Prop */}
      <section style={{ marginTop: '12rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8rem', alignItems: 'center' }} className="pv-philosophy-grid" aria-labelledby="pv-phil-title">
          <div>
              <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>THE_GETAWAY_PROTOCOL</div>
              <h2 className="pv-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '4rem', color: 'var(--pv-ink)' }} id="pv-phil-title">The Art of <br/>the <span className="pv-italic" style={{ color: 'var(--pv-coral)' }}>Escape.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pv-text-muted)', lineHeight: 2, marginBottom: '6rem' }}>
                  We do not just check the amenities; we validate the architectural integrity and local significance of every vacation node.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="pv-stats-grid">
                  <ExperienceStats value="1,200+" label="VERIFIED_NODES" />
                  <ExperienceStats value="48h" label="AVG_RESPONSE" />
              </div>
          </div>
          <div style={{ position: 'relative' }} className="pv-phil-img-wrapper">
              <div style={{ height: '700px', background: 'var(--pv-cloud)', borderRadius: 'var(--pv-radius)', overflow: 'hidden', padding: '1.5rem', border: '1px solid var(--pv-border)' }} className="pv-phil-img-container">
                <img src="/themes/properties/vacation/15.webp" alt="Coastal Getaway Horizon Framework" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
              </div>
              <div style={{ 
                  position: 'absolute', 
                  top: '-3rem', 
                  right: '-3rem', 
                  background: 'var(--pv-azure)', 
                  color: 'white', 
                  width: '220px', 
                  height: '220px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center', 
                  padding: '2rem', 
                  fontWeight: 800, 
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  boxShadow: '0 15px 30px rgba(0, 119, 255, 0.2)'
              }} className="pv-floating-badge">
                  AUTHENTICATED LOCAL RETREAT
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '12rem', padding: '10rem 4rem', textAlign: 'center', background: 'linear-gradient(to top, #f0f7ff, #fff)', borderRadius: 'var(--pv-radius) var(--pv-radius) 0 0', border: '1px solid var(--pv-border)' }} className="pv-cta-box" aria-labelledby="pv-cta-title">
          <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, marginBottom: '5rem', letterSpacing: '-3px', lineHeight: 1.1, color: 'var(--pv-ink)' }} id="pv-cta-title">
              Your Next Escape <br/>
              is <span className="pv-italic" style={{ color: 'var(--pv-coral)' }}>One Click Away.</span>
          </h2>
          <button className="pv-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.35rem' }} id="pv-btn-cta-auth" onClick={() => alert('Secure escape handshake initialized.')}>
              SECURE YOUR RETREAT
          </button>
      </section>
    </div>
  );
}
