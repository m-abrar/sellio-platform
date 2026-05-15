import React from 'react';

export const BoutiqueHeader = () => (
  <header className="boutique-header">
    <div className="boutique-nav">
      <span>Collections</span>
      <span>Atelier</span>
    </div>
    <div className="boutique-logo">SELLIO_MAISON</div>
    <div className="boutique-nav">
      <span>Search</span>
      <span>Cart (0)</span>
    </div>
  </header>
);

export const ProductTile = ({ name, price, category, image }: { name: string, price: string, category: string, image: string }) => (
  <div className="product-tile-luxury">
    <div className="product-image-frame">
      <img src={image} alt={name} className="luxury-product-image" />
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.4 }}>
        LIMITED_EDITION
      </div>
    </div>
    <div className="product-info-luxury">
      <div style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.5 }}>
        {category}
      </div>
      <h3>{name}</h3>
      <div className="product-price-luxury">{price}</div>
    </div>
  </div>
);

export const AtelierFooter = () => (
  <footer className="atelier-footer">
    <div className="footer-heritage">
      "Crafted with obsession, delivered with care. The Maison represents the intersection of digital innovation and traditional artisan excellence."
    </div>
    <div className="boutique-logo" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>SELLIO_MAISON</div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.5 }}>
      <span>PRIVACY</span>
      <span>TERMS</span>
      <span>SHIPPING</span>
      <span>BOUTIQUES</span>
    </div>
  </footer>
);
