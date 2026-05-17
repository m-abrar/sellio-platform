'use client';
import React from 'react';
import { CinematicPropertyCard, CuratorStats } from './components';

export default function Page() {
  const properties = [
    { 
        title: "The Obsidian Villa", 
        price: "$12,400,000", 
        location: "Santorini, Greece", 
        description: "A masterwork of volcanic architecture, integrated into the cliffside with seamless indoor-outdoor flow and panoramic caldera views.", 
        image: "/themes/properties/showcase/9.webp" 
    },
    { 
        title: "MCM Desert Pavilion", 
        price: "$8,900,000", 
        location: "Palm Springs, USA", 
        description: "A meticulously restored 1958 steel-and-glass sanctuary, celebrating the golden era of California modernism.", 
        image: "/themes/properties/showcase/10.webp" 
    },
    { 
        title: "Brutalist Sky Garden", 
        price: "$15,200,000", 
        location: "Singapore", 
        description: "An experimental vertical forest encased in raw concrete and architectural glass, defining the future of tropical living.", 
        image: "/themes/properties/showcase/11.webp" 
    },
    { 
        title: "The Florentine Atelier", 
        price: "$22,000,000", 
        location: "Florence, Italy", 
        description: "A 16th-century Palazzo refitted for the modern era, featuring original frescoes alongside museum-grade automation systems.", 
        image: "/themes/properties/showcase/12.webp" 
    },
  ];

  return (
    <div className="ps-section">
      {/* Cinematic Hero */}
      <section className="ps-hero" aria-labelledby="ps-hero-title">
        <div className="ps-hero-line"></div>
        <div className="ps-mono" style={{ marginBottom: '4rem' }}>CURATED_ATELIER_COLLECTION_V8</div>
        <h1 className="ps-heading-xl" id="ps-hero-title">
            Living <br/>
            As Art.
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.75rem', fontWeight: 300, color: 'var(--ps-text-dim)', lineHeight: 1.6, marginTop: '6rem' }}>
            A curated distribution of the world's most significant architectural achievements. Synchronizing institutional curation with museum-grade provenance.
        </p>
        <div style={{ marginTop: '8rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="ps-hero-buttons">
            <button className="ps-btn-primary" id="ps-btn-explore" onClick={() => document.getElementById('ps-story-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Curation
            </button>
            <button style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--ps-canvas)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '1rem', letterSpacing: '4px', cursor: 'pointer' }} id="ps-btn-manifesto" onClick={() => alert('Atelier Curation Manifesto loaded into memory bank node.')}>
              READ_MANIFESTO
            </button>
        </div>
      </section>

      {/* Curation Intelligence HUD Section */}
      <section style={{ padding: '10rem 0' }} className="ps-curator-section" aria-labelledby="ps-hud-title">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }} className="ps-story-card">
            <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }} id="ps-hud-title">
                    The Architecture <br/>of <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>Provenance.</span>
                </h2>
                <p style={{ fontSize: '1.35rem', color: 'var(--ps-text-dim)', lineHeight: 1.9 }}>
                    Every property in the Atelier registry is hand-selected by our board of curators. We validate not just the integrity, but the historical and cultural significance of each node.
                </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }} className="ps-curator-stats-list">
                <CuratorStats value="INSTITUTIONAL" label="CURATION_TIER" />
                <CuratorStats value="MUSEUM" label="GRADE_PROVENANCE" />
                <CuratorStats value="GLOBAL" label="DISTRIBUTION_SYNC" />
            </div>
        </div>
      </section>

      {/* Property Showcase Grid */}
      <section id="ps-story-grid" aria-label="Curated Properties Showcase">
          {properties.map((p, i) => (
            <CinematicPropertyCard key={i} {...p} />
          ))}
      </section>

      {/* Philosophy Bar */}
      <div style={{ padding: '4rem 2rem', border: '1px solid var(--ps-shadow)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10rem 0', flexWrap: 'wrap', gap: '2rem' }} className="ps-philosophy-bar">
          {['INSTITUTIONAL_CURATION', 'ARCHITECTURAL_INTEGRITY', 'HISTORIC_PRESERVATION', 'EDITORIAL_SYNC'].map(trust => (
              <div key={trust} className="ps-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{trust}</div>
          ))}
      </div>

      {/* Final CTA */}
      <section style={{ marginTop: '10rem', padding: '12rem 4rem', background: 'radial-gradient(circle at center, #111 0%, #090909 100%)', border: '1px solid var(--ps-shadow)', textAlign: 'center' }} className="ps-cta-box" aria-labelledby="ps-cta-title">
          <div className="ps-mono" style={{ marginBottom: '4rem' }}>BEGIN_YOUR_CURATION</div>
          <h2 style={{ fontFamily: 'var(--ps-font-serif)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, letterSpacing: '-4px', marginBottom: '6rem', lineHeight: 1 }} id="ps-cta-title">
              Authorize Your <br/>
              <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>Collection.</span>
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 6rem', color: 'var(--ps-text-dim)', fontSize: '1.35rem', lineHeight: 1.8 }}>
              Our institutional nodes are currently accepting select inquiries for the 2026/27 global collection. Submit your provenance for review.
          </p>
          <button className="ps-btn-primary" id="ps-btn-cta-auth" onClick={() => alert('Authentication and signature pipeline initializing.')}>
              Request Private Access
          </button>
      </section>
    </div>
  );
}
