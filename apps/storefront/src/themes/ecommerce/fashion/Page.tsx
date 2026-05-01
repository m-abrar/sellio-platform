import React from 'react';

export default function Page() {
  return (
    <div>
      <section className="fashion-hero" style={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/themes/fashion/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="fashion-hero-content">
          <h1>Timeless Elegance</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Discover our latest collection of handcrafted luxury pieces designed for the modern connoisseur.
          </p>
          <button className="fashion-btn">Explore Collection</button>
        </div>
      </section>
      
      <section style={{ padding: '8rem 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Selected Pieces</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div style={{ aspectRatio: '3/4', backgroundColor: '#f9f9f9', marginBottom: '1rem' }}></div>
              <h3 style={{ fontSize: '1rem' }}>Essential Item {i}</h3>
              <p style={{ opacity: 0.6 }}>$240.00</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
