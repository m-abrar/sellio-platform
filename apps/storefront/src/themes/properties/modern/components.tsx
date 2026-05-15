import React from 'react';

export const LifestyleHeader = () => (
  <header className="lifestyle-header">
    <div className="lifestyle-logo">VUE_MODERN</div>
    <nav className="lifestyle-nav">
      <span>Neighborhoods</span>
      <span>Lifestyles</span>
      <span>Collection</span>
    </nav>
    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>SEARCH_</div>
  </header>
);

export const LifestylePropertyBlock = ({ title, price, location, image, tag }: { title: string, price: string, location: string, image: string, tag: string }) => (
  <div className="lifestyle-block">
    <div className="lifestyle-image-wrapper">
      <img src={image} alt={title} />
    </div>
    <div className="lifestyle-tag">{tag}</div>
    <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '1rem' }}>{location}</p>
    <div className="lifestyle-price">{price}</div>
  </div>
);

export const SageFooter = () => (
  <footer className="sage-footer">
    <h2 className="footer-quote">"Home is not a place, it's a curated feeling of belonging."</h2>
    <div className="lifestyle-logo" style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.5 }}>VUE_MODERN_ESTATES</div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, opacity: 0.4 }}>
      <span>INSTAGRAM</span>
      <span>PINTEREST</span>
      <span>JOURNAL</span>
    </div>
  </footer>
);
