import React from 'react';
import { LifestylePropertyBlock } from './components';

export default function ModernPropertiesPage() {
  const properties = [
    { title: "The Atrium House", price: "$3,450,000", location: "Silver Lake, CA", tag: "Architectural", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" },
    { title: "Sage Canyon Retreat", price: "$1,850,000", location: "Sedona, AZ", tag: "Wellness", image: "https://images.unsplash.com/photo-1600607687940-c52af096999a?q=80&w=2070" },
    { title: "Monolithic Desert Pavilion", price: "$5,200,000", location: "Joshua Tree, CA", tag: "Minimalist", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071" },
    { title: "Ethereal Glass Loft", price: "$2,900,000", location: "Downtown LA, CA", tag: "Urban", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Heritage Oak Estate", price: "$6,500,000", location: "Ojai, CA", tag: "Historic", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="modern-property-hero">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075" 
          alt="Lifestyle Hero" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }} 
        />
        <div className="hero-lifestyle-text">
          <p style={{ color: 'var(--color-sage)', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem', display: 'block' }}>LIFESTYLE_COLLECTION</p>
          <h1>Living<br/>In Harmony.</h1>
          <button style={{ 
            marginTop: '2rem', 
            backgroundColor: 'var(--color-sage)', 
            color: 'white', 
            padding: '1.2rem 4rem', 
            border: 'none', 
            borderRadius: '100px', 
            fontFamily: 'var(--font-outfit)', 
            fontWeight: 800,
            cursor: 'pointer'
          }}>
            Explore Neighborhoods
          </button>
        </div>
      </section>

      <div className="lifestyle-grid">
        {properties.map((p, i) => (
          <LifestylePropertyBlock key={i} {...p} />
        ))}
      </div>

      <section style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
        <div style={{ height: '600px', borderRadius: '32px', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1449156001935-d28bc3df72a5?q=80&w=2070" 
            alt="Interior" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Beyond the Structure.</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.7, fontSize: '1.1rem' }}>
            We don't just list properties; we curate communities. Every home in our Modern Collection is chosen for its architectural integrity and its ability to facilitate a specific, intentional lifestyle.
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-sage)' }}>98%</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.5 }}>CLIENT_SATISFACTION</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-sage)' }}>14+</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.5 }}>GLOBAL_MARKETS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
