'use client';
import React from 'react';
import { LuxuryHeader, LuxuryProduct, LuxuryFooter } from './components';

export default function Page() {
  const products = [
    { title: "Lumina Diamond Watch", price: "$12,500", image: "/themes/ecommerce/luxury/31.webp" },
    { title: "Onyx Statement Ring", price: "$4,200", image: "/themes/ecommerce/luxury/32.webp" },
    { title: "The Imperial Chronograph", price: "$34,000", image: "/themes/ecommerce/luxury/33.webp" },
  ];

  return (
    <div className="ecommerce-luxury-wrapper">
      <LuxuryHeader />

      {/* Hero */}
      <section className="ecl-hero">
        <div className="ecl-hero-content">
            <h2 className="ecl-hero-subtitle">The High Jewelry Collection</h2>
            <h1 className="ecl-heading ecl-hero-title">CELESTIAL<br/>ELEGANCE</h1>
            <a href="#explore" className="ecl-btn-gold">Discover the Collection</a>
        </div>
      </section>

      {/* Signature Pieces */}
      <section className="ecl-section" id="explore">
        <div className="ecl-section-header">
            <h2 className="ecl-heading ecl-section-title">Signature Creations</h2>
            <p style={{ color: 'var(--ecl-text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Exquisite craftsmanship meets timeless design</p>
        </div>
        <div className="ecl-grid">
            {products.map((p, i) => <LuxuryProduct key={i} {...p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <a href="#" className="ecl-btn-gold" style={{ color: 'var(--ecl-text-dark)', borderColor: 'var(--ecl-border)' }}>View All Masterpieces</a>
        </div>
      </section>

      {/* Lookbook Split */}
      <section className="ecl-split">
        <div className="ecl-split-img"></div>
        <div className="ecl-split-content">
            <h2 className="ecl-heading" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Artistry in Every Detail</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 2, color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' }}>
                For over a century, our master artisans have poured their passion into every facet. We source only the rarest gems, setting them in designs that transcend time and trend. Experience the weight of true luxury.
            </p>
            <a href="#" className="ecl-btn-gold" style={{ color: '#fff', borderColor: '#fff' }}>Explore Our Heritage</a>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
}
