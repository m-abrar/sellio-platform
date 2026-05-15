import React from 'react';

export const SleekHeader = () => (
  <header className="sleek-header">
    <div className="sleek-logo">AUTO_MODERN</div>
    <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
      <span>Inventory</span>
      <span>Leasing</span>
      <span>Service</span>
    </div>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>LOGIN</span>
      <button style={{ 
        background: 'var(--color-blue)', 
        color: 'white', 
        padding: '0.6rem 1.5rem', 
        borderRadius: '100px', 
        border: 'none', 
        fontWeight: 700,
        fontSize: '0.85rem'
      }}>
        Book Test Drive
      </button>
    </div>
  </header>
);

export const BentoCarCard = ({ name, price, year, fuel, hp, transmission, image }: { name: string, price: string, year: number, fuel: string, hp: string, transmission: string, image: string }) => (
  <div className="bento-car-card">
    <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.3, marginBottom: '0.5rem' }}>{year} COLLECTION</div>
    <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 800 }}>{name}</h3>
    <img src={image} alt={name} className="car-image-bento" />
    <div className="car-spec-pills">
      <span className="spec-pill">{fuel}</span>
      <span className="spec-pill">{hp} HP</span>
      <span className="spec-pill">{transmission}</span>
    </div>
    <div className="bento-price-tag">{price}</div>
  </div>
);

export const ModernAutoFooter = () => (
  <footer className="modern-auto-footer">
    <div>
      <div className="sleek-logo" style={{ marginBottom: '1rem' }}>AUTO_MODERN</div>
      <p style={{ opacity: 0.4, fontSize: '0.85rem' }}>© 2026 SELLIO_AUTOMOTIVE_GROUP</p>
    </div>
    <div style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem', fontWeight: 700 }}>
      <span>INSTAGRAM</span>
      <span>YOUTUBE</span>
      <span>X.COM</span>
    </div>
  </footer>
);
