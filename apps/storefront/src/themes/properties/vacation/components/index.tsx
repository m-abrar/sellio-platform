'use client';
import React from 'react';

export const VacationHeader = () => (
  <header className="pv-header">
    <div className="pv-logo">
      ESCAPE<span style={{ color: 'var(--pv-coral)' }}>Node</span>
    </div>
    
    <nav className="pv-nav">
        {['Destinations', 'Experiences', 'Retreats', 'Local_Nodes'].map(link => (
            <a key={link} href="#" className="pv-nav-link">{link}</a>
        ))}
    </nav>

    <button className="pv-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', boxShadow: 'none' }}>
      BOOK_NOW
    </button>
  </header>
);

export const RetreatBentoCard = ({ title, location, price, rating, image }: any) => (
  <div className="pv-retreat-card">
    <div className="pv-card-img-wrapper">
      <img src={image} alt={title} className="pv-card-img" />
      <div className="pv-card-rating">
        ★ {rating}
      </div>
    </div>
    <div style={{ padding: '3rem' }}>
        <div className="pv-mono" style={{ marginBottom: '1rem', color: 'var(--pv-sand)' }}>AUTHENTICATED_RETREAT</div>
        <h3 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)', marginBottom: '3rem' }}>{location}</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pv-border)', paddingTop: '2.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--pv-azure)' }}>{price}<span style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)', fontWeight: 600 }}>/night</span></div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--pv-coral)' }}>SECURE_BOOKING →</div>
        </div>
    </div>
  </div>
);

export const ExperienceStats = ({ value, label }: { value: string, label: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', fontFamily: 'var(--pv-font-serif)', fontWeight: 900, color: 'var(--pv-azure)', marginBottom: '1rem' }}>{value}</div>
        <div className="pv-mono" style={{ color: 'var(--pv-text-muted)', fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const EscapeFooter = () => (
    <footer className="pv-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pv-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>ESCAPENODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    A high-fidelity vacation registry designed for the global traveler. Synchronizing authentic retreats with local expertise.
                </p>
            </div>
            {['DESTINATIONS', 'PROTOCOL', 'COMPANY'].map(col => (
                <div key={col}>
                    <div className="pv-mono" style={{ color: 'var(--pv-sand)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Verification', 'Support', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.5, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pv-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>© 2026 SELLIO_VACATION_OS // HORIZON_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="pv-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
