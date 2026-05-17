'use client';
import React, { useState } from 'react';

export const ShopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="ed-header">
      <div className="ed-logo">
        SELLIO<span style={{ color: 'var(--ed-blue)' }}>Shop</span>
      </div>
      
      <button 
        className={`ed-hamburger ${isOpen ? 'ed-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="ed-hamburger-toggle"
      >
        <span className="ed-hamburger-bar"></span>
        <span className="ed-hamburger-bar"></span>
        <span className="ed-hamburger-bar"></span>
      </button>

      <nav className={`ed-nav ${isOpen ? 'ed-nav-open' : ''}`}>
          {['Collection', 'Essentials', 'Lookbook', 'Support'].map(link => (
              <a 
                key={link} 
                href="#" 
                className="ed-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
          ))}
          <div className="ed-mono ed-mobile-header-meta" style={{ fontSize: '0.65rem', gap: '2rem', marginTop: '2rem' }}>
            <span>CART (0)</span>
            <span>SEARCH</span>
          </div>
      </nav>

      <div className="ed-mono ed-desktop-header-meta" style={{ fontSize: '0.65rem', display: 'flex', gap: '2rem' }}>
        <span>CART (0)</span>
        <span>SEARCH</span>
      </div>
    </header>
  );
};

export const PremiumProductCard = ({ name, price, category, image }: any) => (
  <div className="ed-product-card">
    <div className="ed-img-frame">
      <img src={image} alt={name} className="ed-img" />
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7v14"/></svg>
      </div>
    </div>
    <div style={{ padding: '0.5rem' }}>
        <div className="ed-mono" style={{ marginBottom: '0.75rem', fontSize: '0.55rem', opacity: 0.5 }}>{category}</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--ed-slate)' }}>{name}</h3>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ed-blue)' }}>{price}</div>
    </div>
  </div>
);

export const CategoryRibbon = ({ label, count }: { label: string, count: string }) => (
    <div style={{ padding: '2.5rem', background: 'var(--ed-frost)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'var(--ed-transition)' }} className="category-item-hover">
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{label}</div>
        <div className="ed-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{count} ITEMS</div>
    </div>
);

export const TransactionFooter = () => (
    <footer className="ed-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ed-logo" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>SELLIO</div>
                <p style={{ color: 'var(--ed-text-muted)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most advanced transaction protocol for high-fidelity retail. Synchronizing refined essentials with global distribution nodes.
                </p>
            </div>
            {['SHOP', 'COLLECTIVE', 'SUPPORT'].map(col => (
                <div key={col}>
                    <div className="ed-mono" style={{ marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['New Arrivals', 'Essentials', 'Lookbook', 'Shipping'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', color: 'var(--ed-text-muted)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ed-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ed-mono" style={{ color: 'var(--ed-text-muted)', fontSize: '0.65rem' }}>© 2026 SELLIO_SHOP // TRANSACTION_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_SHOP'].map(social => (
                    <span key={social} className="ed-mono" style={{ color: 'var(--ed-text-muted)', fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
