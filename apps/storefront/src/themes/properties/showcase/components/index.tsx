'use client';
import React from 'react';

export const ArtisanHeader = () => (
  <header className="ps-header">
    <div className="ps-logo">
      ATELIER<span style={{ color: 'var(--ps-gold)', fontSize: '1rem', verticalAlign: 'top', marginLeft: '4px' }}>®</span>
    </div>
    
    <nav className="ps-nav">
        {['Collection', 'Atelier', 'Provenance', 'Private_Auth'].map(link => (
            <a key={link} href="#" className="ps-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ps-mono" style={{ fontSize: '0.6rem', border: '1px solid var(--ps-gold)', padding: '0.5rem 1.5rem' }}>
      CURATION_SYNC_ACTIVE
    </div>
  </header>
);

export const CinematicPropertyCard = ({ title, price, location, description, image }: any) => (
  <div className="ps-story-card">
    <div className="ps-img-frame">
      <img src={image} alt={title} className="ps-img" />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'var(--ps-gold)', color: 'black', padding: '0.5rem 1.5rem', fontWeight: 900, fontSize: '0.7rem' }}>
        FEATURED_NODE
      </div>
    </div>
    <div style={{ padding: '2rem' }}>
        <div className="ps-mono" style={{ marginBottom: '2rem' }}>{location}</div>
        <h3 style={{ fontFamily: 'var(--ps-font-serif)', fontSize: '4.5rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1 }}>{title}</h3>
        <p style={{ fontSize: '1.25rem', color: 'var(--ps-text-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>{description}</p>
        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 700, color: 'var(--ps-gold)' }}>{price}</div>
        
        <button style={{ marginTop: '5rem', background: 'transparent', border: 'none', borderBottom: '2px solid var(--ps-gold)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '4px', cursor: 'pointer' }}>
            VIEW_PROVENANCE_DATA →
        </button>
    </div>
  </div>
);

export const CuratorStats = ({ value, label }: { value: string, label: string }) => (
    <div style={{ borderLeft: '1px solid var(--ps-gold)', paddingLeft: '3rem' }}>
        <div style={{ fontSize: '4rem', fontFamily: 'var(--ps-font-serif)', fontWeight: 900, color: 'var(--ps-gold)', marginBottom: '1rem' }}>{value}</div>
        <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const EditorialFooter = () => (
    <footer className="ps-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '8rem' }}>
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
                        {['Registry', 'Provenance', 'Curators', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'var(--ps-text-dim)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ps-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.6rem' }}>© 2026 SELLIO_ATELIER_NODE // DATA_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_ATELIER'].map(social => (
                    <span key={social} className="ps-mono" style={{ color: 'var(--ps-text-dim)', fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
