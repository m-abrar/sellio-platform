'use client';
import React from 'react';

export const HeritageHeader = () => (
  <header className="ac-header">
    <div className="ac-logo">
      HERITAGE<span style={{ color: 'var(--ac-tan)' }}>Motors</span>
    </div>
    
    <nav className="ac-nav">
        {['The_Archive', 'Restorations', 'Provenance', 'Collector_Auth'].map(link => (
            <a key={link} href="#" className="ac-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ac-mono" style={{ fontSize: '0.6rem', border: '1px solid var(--ac-green)', padding: '0.5rem 1.5rem', color: 'var(--ac-green)' }}>
      ARCHIVE_SYNC_V8
    </div>
  </header>
);

export const VintageCarCard = ({ name, price, km, transmission, year, image, isCertified }: any) => (
  <div className="ac-car-card">
    <div className="ac-card-img-wrapper">
      <img src={image} alt={name} className="ac-card-img" />
      {isCertified && (
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--ac-green)', color: 'white', padding: '0.5rem 1rem', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '2px' }}>
          VERIFIED_HERITAGE
        </div>
      )}
    </div>
    <div style={{ padding: '3rem' }}>
        <div className="ac-mono" style={{ marginBottom: '1rem', color: 'var(--ac-tan)' }}>{year} // PROVENANCE_RECORD</div>
        <h3 style={{ fontFamily: 'var(--ac-font-serif)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--ac-green)' }}>{name}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
                <div className="ac-mono" style={{ fontSize: '0.55rem', color: 'var(--ac-text-dim)', marginBottom: '0.5rem' }}>ODOMETER</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{km} KM</div>
            </div>
            <div>
                <div className="ac-mono" style={{ fontSize: '0.55rem', color: 'var(--ac-text-dim)', marginBottom: '0.5rem' }}>TRANSMISSION</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{transmission}</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ac-chrome)', paddingTop: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--ac-font-serif)', fontWeight: 900, color: 'var(--ac-charcoal)' }}>{price}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ac-tan)', letterSpacing: '2px' }}>ENQUIRE →</div>
        </div>
    </div>
  </div>
);

export const CollectorMetricsHUD = ({ value, label }: { value: string, label: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontFamily: 'var(--ac-font-serif)', fontWeight: 900, color: 'var(--ac-green)', marginBottom: '0.5rem' }}>{value}</div>
        <div className="ac-mono" style={{ color: 'var(--ac-text-dim)', fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const ArtisanFooter = () => (
    <footer className="ac-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ac-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>HERITAGE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    The world's most significant archive of heritage automotive assets. Synchronizing historical provenance with artisan restoration nodes.
                </p>
            </div>
            {['ARCHIVE', 'RESTORATION', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ac-mono" style={{ color: 'var(--ac-tan)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Provenance', 'Atelier', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ac-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 HERITAGE_MOTORS_OS // PROVENANCE_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_ARCHIVE'].map(social => (
                    <span key={social} className="ac-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
