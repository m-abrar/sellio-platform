import React from 'react';
import { ProductTile } from './components';

export default function LuxuryRetailPage() {
  const products = [
    { name: "The Obsidian Timepiece", price: "$4,200", category: "HOROLOGY", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070" },
    { name: "Silk Noir Evening Wrap", price: "$1,850", category: "ACCESSORIES", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070" },
    { name: "Aurelian Fragrance", price: "$320", category: "BEAUTY", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2070" },
    { name: "Crafted Calfskin Tote", price: "$2,900", category: "LEATHER_GOODS", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="luxury-retail-hero">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" 
          alt="Boutique Hero" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} 
        />
        <div className="hero-overlay-text">
          <p>COLLECTION_04</p>
          <h1>The Quiet Minimalist</h1>
          <button style={{ 
            marginTop: '2rem', 
            backgroundColor: 'white', 
            color: 'black', 
            padding: '1rem 3rem', 
            border: 'none', 
            fontFamily: 'var(--font-serif)', 
            cursor: 'pointer',
            letterSpacing: '2px'
          }}>
            EXPLORE_ATELIER
          </button>
        </div>
      </section>

      <section style={{ padding: '6rem 4rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>Seasonal Curations</h2>
        <p style={{ opacity: 0.5, letterSpacing: '2px' }}>EXCLUSIVELY CRAFTED // LIMITED_NUMBERS</p>
      </section>

      <div className="monolithic-product-grid">
        {products.map((p, i) => (
          <ProductTile key={i} {...p} />
        ))}
      </div>

      <section style={{ height: '60vh', display: 'flex', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ flex: 1, padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Artisanal Heritage</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.7 }}>
            Every piece in our collection is a testament to the enduring power of craftsmanship. We collaborate with world-renowned artisans to preserve traditional techniques while embracing modern aesthetic precision.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" 
            alt="Craftsmanship" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      </section>
    </div>
  );
}
