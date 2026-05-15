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
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" 
    },
    { 
        title: "MCM Desert Pavilion", 
        price: "$8,900,000", 
        location: "Palm Springs, USA", 
        description: "A meticulously restored 1958 steel-and-glass sanctuary, celebrating the golden era of California modernism.", 
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070" 
    },
    { 
        title: "Brutalist Sky Garden", 
        price: "$15,200,000", 
        location: "Singapore", 
        description: "An experimental vertical forest encased in raw concrete and architectural glass, defining the future of tropical living.", 
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070" 
    },
    { 
        title: "The Florentine Atelier", 
        price: "$22,000,000", 
        location: "Florence, Italy", 
        description: "A 16th-century Palazzo refitted for the modern era, featuring original frescoes alongside museum-grade automation systems.", 
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" 
    },
  ];

  return (
    <div className="ps-section">
      {/* Cinematic Hero */}
      <section className="ps-hero">
        <div className="ps-hero-line"></div>
        <div className="ps-mono" style={{ marginBottom: '4rem' }}>CURATED_ATELIER_COLLECTION_V8</div>
        <h1 className="ps-heading-xl">
            Living <br/>
            As Art.
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.75rem', fontWeight: 300, color: 'var(--ps-text-dim)', lineHeight: 1.6, marginTop: '6rem' }}>
            A curated distribution of the world's most significant architectural achievements. Synchronizing institutional curation with museum-grade provenance.
        </p>
        <div style={{ marginTop: '8rem', display: 'flex', gap: '4rem' }}>
            <button className="ps-btn-primary">Explore Curation</button>
            <button style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--ps-canvas)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '1rem', letterSpacing: '4px', cursor: 'pointer' }}>READ_MANIFESTO</button>
        </div>
      </section>

      {/* Intelligence HUD Section */}
      <section style={{ padding: '15rem 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }}>
                  The Architecture <br/>of <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>Provenance.</span>
              </h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--ps-text-dim)', lineHeight: 2 }}>
                  Every property in the Atelier registry is hand-selected by our board of curators. We validate not just the integrity, but the historical and cultural significance of each node.
              </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
              <CuratorStats value="INSTITUTIONAL" label="CURATION_TIER" />
              <CuratorStats value="MUSEUM" label="GRADE_PROVENANCE" />
              <CuratorStats value="GLOBAL" label="DISTRIBUTION_SYNC" />
          </div>
      </section>

      {/* Property Showcase Grid */}
      <section style={{ marginTop: '10rem' }}>
          {properties.map((p, i) => (
            <CinematicPropertyCard key={i} {...p} />
          ))}
      </section>

      {/* Philosophy Bar */}
      <div style={{ padding: '6rem', border: '1px solid var(--ps-shadow)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15rem 0' }}>
          {['INSTITUTIONAL_CURATION', 'ARCHITECTURAL_INTEGRITY', 'HISTORIC_PRESERVATION', 'EDITORIAL_SYNC'].map(trust => (
              <div key={trust} className="ps-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{trust}</div>
          ))}
      </div>

      {/* Final CTA */}
      <section style={{ marginTop: '15rem', padding: '20rem 0', textAlign: 'center', background: 'radial-gradient(circle at center, #111 0%, #0d0d0d 100%)', border: '1px solid var(--ps-shadow)' }}>
          <div className="ps-mono" style={{ marginBottom: '4rem' }}>BEGIN_YOUR_CURATION</div>
          <h2 style={{ fontFamily: 'var(--ps-font-serif)', fontSize: '8rem', fontWeight: 900, letterSpacing: '-6px', marginBottom: '6rem', lineHeight: 0.9 }}>
              Authorize Your <br/>
              <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>Collection.</span>
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 8rem', color: 'var(--ps-text-dim)', fontSize: '1.5rem', lineHeight: 1.8 }}>
              Our institutional nodes are currently accepting select inquiries for the 2026/27 global collection. Submit your provenance for review.
          </p>
          <button className="ps-btn-primary">
              Request Private Access
          </button>
      </section>
    </div>
  );
}
