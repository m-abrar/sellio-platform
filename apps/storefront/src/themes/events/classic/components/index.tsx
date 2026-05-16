'use client';
import React from 'react';

export const VenueHeader = () => (
  <header className="ec-header">
    <div className="ec-logo">
      LEGACY<span style={{ color: 'var(--ec-gold)', fontWeight: 400, fontStyle: 'italic' }}>Arts</span>
    </div>
    
    <nav className="ec-nav">
        {['The_Repertoire', 'Patrons', 'Archives', 'Institutional_Auth'].map(link => (
            <a key={link} href="#" className="ec-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ec-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--ec-burgundy)', padding: '0.5rem 2rem', color: 'var(--ec-burgundy)' }}>
      PATRON_PORTAL_ACTIVE
    </div>
  </header>
);

export const OccasionCard = ({ title, location, date, category }: any) => (
  <div className="ec-occasion-card">
    <div className="ec-mono" style={{ marginBottom: '2.5rem' }}>{date} // {category.toUpperCase()}</div>
    <h3 style={{ fontFamily: 'var(--ec-serif)', fontSize: '2.25rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>{title}</h3>
    <div style={{ fontStyle: 'italic', color: 'var(--ec-gold)', fontSize: '1.1rem', marginBottom: '3.5rem', fontFamily: 'var(--ec-serif)' }}>{location}</div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--ec-stone)', paddingTop: '2.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ec-burgundy)', letterSpacing: '3px' }}>REQUEST_PATRON_PASS →</div>
    </div>
  </div>
);

export const BookingHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontFamily: 'var(--ec-serif)', fontWeight: 900, color: 'var(--ec-burgundy)', marginBottom: '0.5rem' }}>{value}</div>
        <div className="ec-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const LegacyFooter = () => (
    <footer className="ec-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ec-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>LEGACY</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    The world's most significant archive of cultural repertoire. Synchronizing institutional archives with global patron nodes.
                </p>
            </div>
            {['REPERTOIRE', 'PATRONS', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ec-mono" style={{ color: 'var(--ec-gold)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Archives', 'Protocols', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.3, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ec-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_LEGACY_ARTS // ARCHIVE_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_LEGACY'].map(social => (
                    <span key={social} className="ec-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
