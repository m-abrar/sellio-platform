
import React from 'react';
import { CreativeServiceCard } from './components';

export default function Page() {
  const services = [
    { title: "Brand Identity Systems", description: "Architecting the visual DNA of modern commercial entities through high-fidelity design systems.", index: "01" },
    { title: "Digital Product Design", description: "Crafting immersive user interfaces and experimental commercial platforms for the next decade.", index: "02" },
    { title: "Motion Architecture", description: "Defining the kinetic language of brand expression through advanced motion design and cinematic rendering.", index: "03" },
    { title: "3D & Spatial Design", description: "Developing three-dimensional assets and spatial environments for institutional distribution.", index: "04" },
    { title: "Content Strategy Node", description: "Providing high-fidelity strategic guidance for commercial storytelling and platform positioning.", index: "05" },
    { title: "Experimental Labs", description: "Exploring the intersection of creative expression and emerging commercial technology protocols.", index: "06" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="studio-hero">
          <div className="studio-hero-orb"></div>
          <h1>Design <br/>As a <br/>Protocol.</h1>
          <div style={{ maxWidth: '600px', marginTop: '4rem' }}>
              <p style={{ fontSize: '1.5rem', lineHeight: 1.6, fontWeight: 400, opacity: 0.6 }}>
                  Sellio Studio is an avant-garde collective of designers and architects standardizing creative excellence through the global node network.
              </p>
              <button style={{ 
                  marginTop: '4rem', 
                  background: 'var(--create-onyx)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1.5rem 4rem', 
                  fontFamily: 'var(--font-syne)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  letterSpacing: '2px'
              }}>
                  START_COLLABORATION
              </button>
          </div>
      </section>

      {/* Philosophy bar */}
      <section style={{ padding: '4rem 5%', borderBottom: '1px solid var(--create-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--create-peach)', color: 'var(--create-onyx)', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px' }}>
          <span>ELITE_CRAFT</span>
          <span>SYSTEMIC_DESIGN</span>
          <span>GLOBAL_DISTRIBUTION</span>
          <span>HIGH_FIDELITY_OUTCOMES</span>
      </section>

      {/* Services Grid */}
      <section className="creative-grid">
          {services.map((service, i) => (
              <CreativeServiceCard key={i} {...service} />
          ))}
      </section>

      {/* Final CTA Section */}
      <section style={{ padding: '15rem 5%', background: '#fafafa', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '5rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-4px' }}>Let's build <br/>the future of <br/>industry.</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.5, marginBottom: '6rem' }}>
                  Our creative nodes are currently accepting select institutional inquiries for the 2026/27 cycle.
              </p>
              <button style={{ padding: '2rem 6rem', border: '2px solid var(--create-onyx)', background: 'none', color: 'var(--create-onyx)', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', letterSpacing: '4px' }}>
                  REQUEST_PORTFOLIO_ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
