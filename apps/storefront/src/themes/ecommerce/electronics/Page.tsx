import React from 'react';

export default function Page() {
  return (
    <div>
      <section className="electronics-hero" style={{ 
        backgroundImage: 'url("/themes/electronics/hero.png")'
      }}>
        <div className="electronics-glass-card">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Powering the Future</h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Next-generation processing power and ultra-responsive displays for the elite performer.
          </p>
          <button className="electronics-btn">Pre-Order Now</button>
        </div>
      </section>
      
      <section style={{ padding: '5rem 5%' }}>
        <h2 style={{ color: '#00f2ff', marginBottom: '3rem' }}>Trending Gear</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '1.5rem', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
              <h3 style={{ fontSize: '1.1rem' }}>Quantum Core X{i}</h3>
              <p style={{ color: '#00f2ff', marginTop: '0.5rem' }}>$1,299.00</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
