
'use client';
import React from 'react';
import { CreativeServiceCard, StudioHeader, StudioFooter } from './components';

export default function Page() {
  const services = [
    { 
        title: "Brand Identity Systems", 
        description: "Architecting the visual DNA of modern luxury through high-fidelity design systems and typography.", 
        index: "01",
        image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2000"
    },
    { 
        title: "Digital Product Design", 
        description: "Crafting immersive interfaces and experimental digital showrooms for the world's most visionary brands.", 
        index: "02",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000"
    },
    { 
        title: "Motion Architecture", 
        description: "Defining the kinetic language of brand expression through cinematic rendering and fluid motion.", 
        index: "03",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000"
    },
    { 
        title: "Spatial Experience", 
        description: "Developing immersive physical and digital environments that redefine the boundaries of interaction.", 
        index: "04",
        image: "https://images.unsplash.com/photo-1600607687940-4e7a43f59663?q=80&w=2000"
    },
    { 
        title: "Creative Strategy", 
        description: "Strategic guidance for institutional storytelling and global platform positioning.", 
        index: "05",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000"
    },
    { 
        title: "The Laboratory", 
        description: "Exploring the intersection of artistry and emerging technology at the frontier of industry.", 
        index: "06",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000"
    },
  ];

  return (
    <div className="creative-services-wrapper">
      {/* Editorial Hero */}
      <section className="studio-hero">
          <div style={{ color: 'var(--atelier-gold)', fontWeight: 800, letterSpacing: '4px', fontSize: '0.8rem', marginBottom: '3rem' }}>EST. 2026 // GLOBAL DESIGN NODE</div>
          <h1>The Standard <br/>for Global <br/><span style={{ fontStyle: 'italic' }}>Craft.</span></h1>
          <div style={{ maxWidth: '700px', marginTop: '6rem' }}>
              <p>
                  The Atelier is a collective of visionary designers and spatial architects dedicated to defining the aesthetic standard of the next decade.
              </p>
              <button style={{ 
                  marginTop: '5rem', 
                  background: 'var(--atelier-black)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1.8rem 5rem', 
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '3px',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
              }}>
                  VIEW PORTFOLIO
              </button>
          </div>
      </section>

      {/* Marquee Ticker */}
      <section style={{ 
          padding: '2.5rem 0', 
          background: 'var(--atelier-black)', 
          color: 'white', 
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          borderY: '1px solid var(--atelier-gold)'
      }}>
          <div style={{ display: 'flex', gap: '6rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', opacity: 0.8 }}>
              <span>ELITE CRAFT</span> • <span>SYSTEMIC DESIGN</span> • <span>GLOBAL DISTRIBUTION</span> • <span>HIGH FIDELITY OUTCOMES</span> • <span>LUXURY EXPERIENCE</span> • <span>ELITE CRAFT</span> • <span>SYSTEMIC DESIGN</span>
          </div>
      </section>

      {/* Editorial Grid */}
      <section style={{ padding: '15rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '10rem', padding: '0 6%' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900 }}>Curated Works</h2>
          </div>
          <div className="creative-grid">
              {services.map((service, i) => (
                  <CreativeServiceCard key={i} {...service} />
              ))}
          </div>
      </section>

      {/* Legacy Spotlight */}
      <section style={{ padding: '15rem 6%', background: 'white', textAlign: 'center', borderTop: '1px solid var(--atelier-border)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 900, marginBottom: '5rem', lineHeight: 1.1 }}>
                  Let's redefine the <br/>boundaries of <span style={{ color: 'var(--atelier-gold)', fontStyle: 'italic' }}>industry.</span>
              </h2>
              <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'rgba(0,0,0,0.5)', marginBottom: '8rem', maxWidth: '700px', margin: '0 auto 8rem' }}>
                  Our studios are currently accepting institutional inquiries for the 2026/27 cycle. Connect with our principal architects.
              </p>
              <button style={{ 
                  padding: '2.5rem 8rem', 
                  border: '1px solid var(--atelier-black)', 
                  background: 'none', 
                  color: 'var(--atelier-black)', 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 800, 
                  fontSize: '0.85rem', 
                  letterSpacing: '5px',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
              }}>
                  REQUEST ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
