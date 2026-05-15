import React from 'react';

export const SocialHeader = () => (
  <header className="social-header">
    <div className="social-logo">SELLIO_VIBE</div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <span style={{ fontSize: '1.2rem' }}>🔍</span>
      <div style={{ position: 'relative' }}>
        <span style={{ fontSize: '1.2rem' }}>🛒</span>
        <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-coral)', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 900 }}>2</div>
      </div>
    </div>
  </header>
);

export const StoryBubble = ({ label, image }: { label: string, image: string }) => (
  <div className="story-bubble">
    <div className="bubble-image">
      <img src={image} alt={label} />
    </div>
    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
  </div>
);

export const MobileProductCard = ({ name, price, brand, image }: { name: string, price: string, brand: string, image: string }) => (
  <div className="mobile-style-card">
    <div className="card-wishlist">❤️</div>
    <img src={image} alt={name} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
    <div style={{ padding: '1.5rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{brand}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{name}</h3>
      <div className="modern-price-tag">{price}</div>
      <button className="add-to-cart-pill">QUICK_ADD</button>
    </div>
  </div>
);
