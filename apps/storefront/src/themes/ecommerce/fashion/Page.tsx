
import React from 'react';
import { ProductLookbookCard } from './components';

export default function Page() {
  const collection = [
    { name: "Silk Drape Blazer", price: "$1,250", image: "https://images.unsplash.com/photo-1594932224010-756707729517?q=80&w=2000" },
    { name: "Monolith Chelsea Boots", price: "$850", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=2000" },
    { name: "Satin Evening Gown", price: "$2,400", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000" },
    { name: "Oversized Cashmere Coat", price: "$3,200", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000" },
    { name: "Textured Knit Sweater", price: "$450", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000" },
    { name: "Pleated Architecture Skirt", price: "$980", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000" },
  ];

  return (
    <div>
      {/* Fashion Hero */}
      <section className="fashion-hero">
        <div className="hero-main-frame">
            <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" 
                alt="Main Editorial" 
                className="fashion-img-fill"
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }}></div>
            <div className="hero-overlay-text">
                <span style={{ fontSize: '0.8rem', letterSpacing: '5px', fontWeight: 800 }}>FALL_WINTER_2026</span>
                <h1 className="hero-title">Silent <br/>Luxury.</h1>
                <button style={{ 
                    padding: '1.25rem 3.5rem', 
                    background: 'white', 
                    color: '#1a1a1a', 
                    border: 'none', 
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    letterSpacing: '2px'
                }}>EXPLORE_EDITORIAL</button>
            </div>
        </div>
        <div className="hero-side-frame">
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img 
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" 
                    alt="Side Look 1" 
                    className="fashion-img-fill"
                />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px' }}>ACCESSORIES_01</div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img 
                    src="https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071" 
                    alt="Side Look 2" 
                    className="fashion-img-fill"
                />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px' }}>READY_TO_WEAR_04</div>
            </div>
        </div>
      </section>

      {/* Lookbook Grid */}
      <section className="fashion-section">
        <div style={{ marginBottom: '10rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--fashion-serif)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--fashion-accent)', marginBottom: '1.5rem' }}>The Autumn Capsule</p>
            <h2 style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--fashion-serif)', letterSpacing: '-2px' }}>Lookbook_26</h2>
        </div>
        
        <div className="fashion-lookbook-grid">
            {collection.map((item, i) => (
                <ProductLookbookCard key={i} {...item} />
            ))}
        </div>
      </section>

      {/* Brand Statement */}
      <section style={{ padding: '15rem 4rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--fashion-serif)', fontSize: '3rem', fontWeight: 900, marginBottom: '3rem', lineHeight: 1.2 }}>
                "We do not build garments. We architect confidence through the precision of silhouette and the purity of material."
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--fashion-accent)', margin: '0 auto 3rem auto' }}></div>
            <p style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '4px', opacity: 0.5 }}>ATELIER_PHILOSOPHY</p>
        </div>
      </section>
    </div>
  );
}
