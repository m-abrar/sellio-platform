import React from 'react';
import { MaisonIndustrySection } from './components';

export default function MaisonPage() {
  const collections = [
    { 
      title: "The Architectural Estate", 
      description: "Discover a curated selection of properties where structural integrity meets avant-garde design. Our global estates represent the pinnacle of modern living.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
    },
    { 
      title: "Automotive Excellence", 
      description: "A tribute to mechanical precision and aerodynamic mastery. Explore the world's most exclusive vehicle inventory, curated for the discerning collector.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" 
    },
    { 
      title: "Artisanal E-Commerce", 
      description: "The intersection of tradition and digital innovation. Our boutique marketplace showcases limited-edition pieces from the world's finest ateliers.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" 
    }
  ];

  return (
    <div>
      <section className="luxury-hero-maison">
        <div className="signature-divider"></div>
        <p style={{ letterSpacing: '6px', fontSize: '0.8rem', opacity: 0.5, marginBottom: '2rem' }}>THE_GLOBAL_COLLECTIVE</p>
        <h1>An Intersection<br/>Of Industry<br/>And Art.</h1>
        <p style={{ maxWidth: '500px', lineHeight: '2', opacity: 0.6 }}>
          We curate the world's most impactful verticals into a single, high-fidelity ecosystem. Welcome to the Maison of Commerce.
        </p>
      </section>

      <div>
        {collections.map((item, i) => (
          <MaisonIndustrySection key={i} {...item} />
        ))}
      </div>

      <section style={{ padding: '10rem 6rem', textAlign: 'center', background: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="signature-divider" style={{ margin: '0 auto 3rem' }}></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 400, marginBottom: '2rem' }}>A Legacy of Scale.</h2>
          <p style={{ lineHeight: '2', opacity: 0.6, fontSize: '1.2rem', marginBottom: '4rem' }}>
            With over 50 specialized industries and 1.2M active listings, our engine provides the architectural foundation for the future of commercial distribution.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6rem' }}>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>50+</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 800, opacity: 0.5 }}>INDUSTRIES</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>1.2M</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 800, opacity: 0.5 }}>LISTINGS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
