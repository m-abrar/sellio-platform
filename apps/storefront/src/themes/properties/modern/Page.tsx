
import React from 'react';
import { PropertyBentoCard } from './components';

export default function Page() {
  const properties = [
    { title: "The Obsidian Atrium", price: "$12,450,000", tag: "ARCHITECTURAL", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070", span: "col-span-8" },
    { title: "Sage Canyon Retreat", price: "$4,850,000", tag: "WELLNESS", image: "https://images.unsplash.com/photo-1600607687940-c52af096999a?q=80&w=2070", span: "col-span-4" },
    { title: "Monolithic Desert Pavilion", price: "$8,200,000", tag: "MINIMALIST", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071", span: "col-span-4" },
    { title: "Ethereal Glass Loft", price: "$3,900,000", tag: "URBAN", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070", span: "col-span-8" },
    { title: "Heritage Oak Estate", price: "$16,500,000", tag: "HISTORIC", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070", span: "col-span-12" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="prop-hero">
        <div className="prop-hero-frame">
            <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075" 
                alt="Main Showcase" 
                className="prop-hero-image"
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}></div>
            <div className="prop-hero-content">
                <span className="prop-hero-badge">CURATED_PROPERTIES_2026</span>
                <h1 className="prop-hero-title">Architectural <br/>Intention.</h1>
                <p style={{ fontSize: '1.25rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '3rem' }}>
                    A selection of the world's most significant residential architectures, chosen for their structural integrity and lifestyle intentionality.
                </p>
                <button style={{ 
                    padding: '1.25rem 3.5rem', 
                    borderRadius: '100px', 
                    border: 'none', 
                    background: 'white', 
                    color: '#1a1a1a', 
                    fontWeight: 800,
                    fontSize: '1rem'
                }}>EXPLORE_COLLECTION</button>
            </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="prop-section">
        <div style={{ marginBottom: '5rem' }}>
            <p style={{ color: '#4b6344', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '1rem' }}>SAGE_SELECTION</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Notable Listings</h2>
        </div>
        
        <div className="prop-bento-grid">
            {properties.map((p, i) => (
                <PropertyBentoCard key={i} {...p} />
            ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section style={{ padding: '10rem 4rem', backgroundColor: '#fdfdfd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
            <div style={{ borderRadius: '32px', overflow: 'hidden', height: '600px' }}>
                <img 
                    src="https://images.unsplash.com/photo-1449156001935-d28bc3df72a5?q=80&w=2070" 
                    alt="Process" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-2px' }}>Beyond the <br/>Structure.</h2>
                <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.8, marginBottom: '3rem' }}>
                    We believe that a home is more than a physical space; it's the foundation of a life well-lived. Our process begins with understanding the behavioral requirements of our clients, mapping their daily rituals to the structural affordances of the properties we represent.
                </p>
                <div style={{ display: 'flex', gap: '4rem' }}>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4b6344' }}>98%</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4 }}>RETENTION_RATE</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4b6344' }}>$4.2B</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4 }}>TOTAL_VOLUME</div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
