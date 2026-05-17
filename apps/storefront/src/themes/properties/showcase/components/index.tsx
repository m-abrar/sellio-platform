'use client';
import React, { useState } from 'react';

export const ArtisanHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ps-header">
      <div className="ps-logo">
        ATELIER<span style={{ color: 'var(--ps-gold)', fontSize: '1rem', verticalAlign: 'top', marginLeft: '4px' }}>®</span>
      </div>
      
      <button 
          className={`ps-hamburger ${isOpen ? 'ps-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ps-hamburger-toggle"
      >
          <span className="ps-hamburger-bar"></span>
          <span className="ps-hamburger-bar"></span>
          <span className="ps-hamburger-bar"></span>
      </button>

      <nav className={`ps-nav ${isOpen ? 'ps-nav-open' : ''}`}>
          {['Collection', 'Atelier_Specs', 'Provenance_Data', 'Private_Auth'].map(link => (
              <a key={link} href="#" className="ps-nav-link" onClick={() => setIsOpen(false)}>{link.replace('_', ' ')}</a>
          ))}
          <div className="ps-mono ps-mobile-status" style={{ fontSize: '0.6rem', border: '1px solid var(--ps-gold)', padding: '0.5rem 1.5rem', marginTop: '2rem', textAlign: 'center' }}>
            CURATION_SYNC_ACTIVE
          </div>
      </nav>

      <div className="ps-mono ps-desktop-status" style={{ fontSize: '0.6rem', border: '1px solid var(--ps-gold)', padding: '0.5rem 1.5rem' }}>
        CURATION_SYNC_ACTIVE
      </div>
    </header>
  );
};

export const CinematicPropertyCard = ({ title, price, location, description, image }: any) => (
  <div className="ps-story-card">
    <div className="ps-img-frame">
      <img src={image} alt={title} className="ps-img" />
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        right: '2rem', 
        background: 'var(--ps-gold)', 
        color: 'var(--ps-charcoal)', 
        padding: '0.5rem 1.5rem', 
        fontWeight: 900, 
        fontSize: '0.7rem',
        letterSpacing: '2px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        FEATURED_NODE
      </div>
    </div>
    <div className="ps-story-content" style={{ padding: '2rem' }}>
        <div className="ps-mono" style={{ marginBottom: '2rem' }}>{location}</div>
        <h3 className="ps-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1, color: 'var(--ps-canvas)' }}>{title}</h3>
        <p style={{ fontSize: '1.25rem', color: 'var(--ps-text-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>{description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 700, color: 'var(--ps-gold)' }}>{price}</div>
            <button style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--ps-gold)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }} className="ps-provenance-btn" onClick={() => alert(`Accessing provenance records for: ${title}`)}>
                VIEW_PROVENANCE_DATA →
            </button>
        </div>
    </div>
  </div>
);

export const CuratorStats = ({ value, label }: { value: string, label: string }) => (
    <div className="ps-stat-node" style={{ borderLeft: '1px solid var(--ps-gold)', paddingLeft: '3rem' }}>
        <div style={{ fontSize: '4rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 900, color: 'var(--ps-gold)', marginBottom: '1rem', lineHeight: 1 }}>{value}</div>
        <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem' }}>{label}</div>
    </div>
);

export const EditorialFooter = () => (
    <footer className="ps-footer">
        <div className="ps-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ps-logo" style={{ fontSize: '3rem', marginBottom: '3rem' }}>ATELIER</div>
                <p style={{ color: 'var(--ps-text-dim)', lineHeight: 2, fontSize: '1rem', maxWidth: '500px' }}>
                    A curated high-fidelity distribution of the world's most significant architectural achievements. Synchronizing institutional curation with global provenance.
                </p>
            </div>
            {['COLLECTION', 'ATELIER', 'INSTITUTIONAL'].map(col => (
                <div key={col}>
                    <div className="ps-mono" style={{ marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Provenance', 'Curators', 'Auth Registry'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'var(--ps-text-dim)', cursor: 'pointer', transition: 'color 0.3s ease' }} className="ps-footer-link" onClick={() => alert(`Navigating registry pipeline node: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ps-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="ps-footer-bottom">
            <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem' }}>© 2026 SELLIO_ATELIER_NODE // DATA_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }} className="ps-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_ATELIER'].map(social => (
                    <span key={social} className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
