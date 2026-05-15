
import React from 'react';
import { ArtisanPropertyCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="showcase-hero">
          <div style={{ position: 'absolute', top: '10rem', right: '5%', width: '1px', height: '300px', background: 'var(--show-gold)' }}></div>
          <h1>Living <br/>As Art.</h1>
          <p style={{ maxWidth: '600px', fontSize: '1.5rem', fontWeight: 300, color: '#444', lineHeight: 1.6, marginTop: '4rem' }}>
              The Sellio Collection is a curated distribution of the world's most significant architectural achievements. Verified by the Atelier node.
          </p>
      </section>

      {/* Philosophy Bar */}
      <section style={{ padding: '4rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', color: 'var(--show-gold)', fontFamily: 'var(--font-serif)', fontSize: '0.8rem', letterSpacing: '4px' }}>
          <span>INSTITUTIONAL_CURATION</span>
          <span>ARCHITECTURAL_INTEGRITY</span>
          <span>HISTORIC_PRESERVATION</span>
          <span>EDITORIAL_DISTRIBUTION</span>
      </section>

      {/* Property Grid (Vertical Editorial) */}
      <section className="showcase-grid">
          {properties.map((prop, i) => (
              <ArtisanPropertyCard key={i} {...prop} />
          ))}
      </section>

      {/* Curator CTA */}
      <section style={{ padding: '20rem 5%', textAlign: 'center', background: '#050505' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '6rem', fontWeight: 900, marginBottom: '4rem', color: 'var(--show-gold)', letterSpacing: '-4px' }}>Begin your <br/>curation.</h2>
              <p style={{ fontSize: '1.25rem', color: '#333', lineHeight: 2, marginBottom: '6rem' }}>
                  Our institutional nodes are currently accepting select inquiries for the 2026/27 global collection.
              </p>
              <button style={{ padding: '2rem 8rem', background: 'var(--show-gold)', color: 'black', border: 'none', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '4px' }}>
                  REQUEST_PRIVATE_ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
