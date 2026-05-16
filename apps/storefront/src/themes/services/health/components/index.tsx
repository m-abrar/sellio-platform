'use client';
import React from 'react';

export const WellnessHeader = () => (
  <header className="sh-header">
    <div className="sh-logo">
      WELLNESS<span style={{ color: 'var(--sh-blue)', fontWeight: 400 }}>Node</span>
    </div>
    
    <nav className="sh-nav">
        {['Practitioners', 'Protocols', 'Telemetry', 'Portal_Auth'].map(link => (
            <a key={link} href="#" className="sh-nav-link">{link}</a>
        ))}
    </nav>

    <div className="sh-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--sh-teal)', padding: '0.5rem 2rem', borderRadius: '50px' }}>
      CARE_PROTOCOL_ACTIVE
    </div>
  </header>
);

export const PractitionerCard = ({ name, title, image, rating, availability }: any) => (
  <div className="sh-specialist-card">
    <div className="sh-img-circle">
      <img src={image} alt={name} className="sh-img" />
    </div>
    <div className="sh-mono" style={{ marginBottom: '1rem', fontSize: '0.6rem' }}>{title}</div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{name}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
        <span style={{ color: '#F59E0B' }}>★</span>
        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{rating}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-teal)' }}>{availability}</span>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--sh-border)', paddingTop: '2rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--sh-blue)', letterSpacing: '2px' }}>BOOK_CONSULTATION →</div>
    </div>
  </div>
);

export const VitalityHUD = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div style={{ padding: '3.5rem', background: 'white', border: '1px solid var(--sh-border)', borderRadius: '24px' }}>
        <div className="sh-mono" style={{ marginBottom: '2rem' }}>{label}</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--sh-teal)', marginBottom: '1.5rem', letterSpacing: '-3px' }}>{value}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--sh-grey)', lineHeight: 1.6 }}>{sub}</div>
    </div>
);

export const ClinicFooter = () => (
    <footer className="sh-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="sh-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>WELLNESS</div>
                <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most trusted distribution node for high-fidelity clinical care. Synchronizing personal telemetry with global wellness nodes.
                </p>
            </div>
            {['PRACTITIONERS', 'GOVERNANCE', 'SUPPORT'].map(col => (
                <div key={col}>
                    <div className="sh-mono" style={{ color: 'var(--sh-teal)', marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Protocols', 'Archives', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sh-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_WELLNESS_NODE // HIPPA_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_WELLNESS'].map(social => (
                    <span key={social} className="sh-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
