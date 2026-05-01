import React from 'react';

export default function Page() {
  return (
    <div>
      <section style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Smarter Commerce.</h1>
        <p style={{ opacity: 0.6 }}>A contemporary experience for the modern marketplace era.</p>
      </section>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="modern-card">
            <h3 style={{ marginBottom: '1rem' }}>Modern Module {i}</h3>
            <div style={{ height: '4px', width: '40px', background: 'var(--mod-primary)', marginBottom: '1rem' }}></div>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Streamlined data management and intuitive interface design.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
