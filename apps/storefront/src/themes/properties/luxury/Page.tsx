import React from 'react';
import { PropertyCard } from './components';

export default function LuxuryPage() {
  const properties = [
    { title: "The Obsidian Villa", price: "$12,500,000", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071" },
    { title: "Ethereal Heights", price: "$8,200,000", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Azure Waterfront", price: "$15,000,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" },
    { title: "The Gilded Penthouse", price: "$22,000,000", image: "https://images.unsplash.com/photo-1600607687940-c52af096999a?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="luxury-hero">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075" 
          alt="Luxury Estate" 
          className="luxury-hero-image"
        />
        <div className="luxury-hero-content">
          <p className="luxury-hero-subtitle">Defining the Art of Living</p>
          <h1 className="luxury-hero-title">Beyond Excellence</h1>
        </div>
      </section>

      <div className="asymmetric-grid">
        {properties.map((p, i) => (
          <PropertyCard key={i} {...p} />
        ))}
      </div>

      <section style={{ padding: '10rem 4rem', textAlign: 'center', backgroundColor: '#fff' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '2rem' }}>
          Unrivaled Expertise
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.8', color: '#666' }}>
          Our global network of real estate professionals provides unparalleled access to the world's most exclusive properties. From London to Dubai, we represent the pinnacle of architectural achievement.
        </p>
      </section>
    </div>
  );
}
