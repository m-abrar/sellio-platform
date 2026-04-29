import React from 'react';

export default function Page() {
  return (
    <div>
      <section className="grocery-hero">
        <div>
          <span className="grocery-badge">100% Organic & Local</span>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Freshness Delivered To Your Door</h1>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.2rem', opacity: 0.8 }}>
            Support local farmers and enjoy the highest quality organic produce harvested at the peak of ripeness.
          </p>
          <button className="grocery-btn">Start Shopping</button>
        </div>
        <div style={{ 
          backgroundImage: 'url("/themes/grocery/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          borderRadius: '30px',
          boxShadow: '0 20px 40px rgba(45, 106, 79, 0.1)'
        }}></div>
      </section>
      
      <section style={{ padding: '8rem 10%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>This Week's Harvest</h2>
          <a href="#" style={{ color: '#2d6a4f', fontWeight: 600 }}>View All</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ aspectRatio: '1', backgroundColor: '#f0f9f4', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid #e1f2e8' }}></div>
              <h3 style={{ fontSize: '1.2rem' }}>Organic Product {i}</h3>
              <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>From $4.99 / lb</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
