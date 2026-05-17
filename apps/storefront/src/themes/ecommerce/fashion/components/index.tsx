'use client';
import React, { useState } from 'react';

export const RunwayHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="ef-header">
      <div className="ef-logo">
        ATELIER<span style={{ fontWeight: 400, fontStyle: 'italic' }}>Runway</span>
      </div>
      
      <button 
        className={`ef-hamburger ${isOpen ? 'ef-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="ef-hamburger-toggle"
      >
        <span className="ef-hamburger-bar"></span>
        <span className="ef-hamburger-bar"></span>
        <span className="ef-hamburger-bar"></span>
      </button>

      <nav className={`ef-nav ${isOpen ? 'ef-nav-open' : ''}`}>
          {['Collection', 'Editorial', 'Lookbook', 'Atelier_Auth'].map(link => (
              <a 
                key={link} 
                href="#" 
                className="ef-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
          ))}
          <div className="ef-mono ef-mobile-header-meta" style={{ fontSize: '0.6rem', border: '1px solid var(--ef-ebony)', padding: '0.5rem 1.5rem', marginTop: '2rem' }}>
            AUTUMN_WINTER_26
          </div>
      </nav>

      <div className="ef-mono ef-desktop-header-meta" style={{ fontSize: '0.6rem', border: '1px solid var(--ef-ebony)', padding: '0.5rem 1.5rem' }}>
        AUTUMN_WINTER_26
      </div>
    </header>
  );
};

export const EditorialLookCard = ({ name, price, image }: any) => (
  <div className="ef-look-card">
    <div className="ef-img-frame">
      <img src={image} alt={name} className="ef-img" />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'white', padding: '0.5rem 1rem', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '2px' }}>
        LOOK_07
      </div>
    </div>
    <div style={{ textAlign: 'center' }}>
        <div className="ef-mono" style={{ marginBottom: '1rem', fontSize: '0.55rem', opacity: 0.4 }}>READY_TO_WEAR</div>
        <h3 style={{ fontFamily: 'var(--ef-serif)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>{name}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--ef-champagne)', fontWeight: 700 }}>{price}</div>
    </div>
  </div>
);

export const TrendHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontFamily: 'var(--ef-serif)', fontWeight: 900, marginBottom: '0.5rem' }}>{value}</div>
        <div className="ef-mono" style={{ fontSize: '0.6rem', opacity: 0.4 }}>{label}</div>
    </div>
);

export const AtelierFooter = () => (
    <footer className="ef-footer">
        <div className="ef-logo" style={{ fontSize: '4rem', marginBottom: '6rem' }}>ATELIER</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
            <div>
                <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>PHILOSOPHY</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '0.9rem' }}>
                    We do not build garments. We architect confidence through the precision of silhouette and the purity of material.
                </p>
            </div>
            {['COLLECTIONS', 'ATELIER', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Runway', 'Editorial', 'Bespoke', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.3, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ef-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 SELLIO_ATELIER_NODE // SILHOUETTE_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_ATELIER'].map(social => (
                    <span key={social} className="ef-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
