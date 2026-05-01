import React from 'react';

export default function Page() {
  return (
    <div>
      <section className="unified-hero">
        <div>
          <h1>Everything you need, all in one place.</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.7 }}>
            Experience the most powerful marketplace engine designed for the next generation of commerce and services.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="unified-btn">Start Browsing</button>
            <button style={{ 
              padding: '0.8rem 2rem', 
              borderRadius: '6px', 
              border: '1px solid #ddd', 
              background: 'white',
              fontWeight: 600
            }}>Learn More</button>
          </div>
        </div>
        <div style={{ 
          backgroundImage: 'url("/themes/unified/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '450px',
          borderRadius: '20px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.05)'
        }}></div>
      </section>
      
      <section style={{ padding: '6rem 5%' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>Featured Collections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="unified-card">
              <div style={{ aspectRatio: '16/9', background: '#f0f0f0', borderRadius: '8px', marginBottom: '1.5rem' }}></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Collection Name {i}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Explore our curated selection of top-quality items in this category.
              </p>
              <a href="#" style={{ color: '#1e4d4e', fontWeight: 600, textDecoration: 'none' }}>Browse Collection →</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
