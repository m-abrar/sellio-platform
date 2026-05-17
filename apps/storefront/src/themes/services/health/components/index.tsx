'use client';
import React from 'react';

export const WellnessHeader = () => (
  <header className="sh-header">
    <div className="sh-logo">
      VITALITY<span style={{ color: 'var(--sh-blue)', fontWeight: 300 }}>Labs</span>
    </div>
    
    <nav className="sh-nav">
        {['Clinicians', 'Protocols', 'Telemetry', 'Patient Portal'].map(link => (
            <a key={link} href="#" className="sh-nav-link">{link}</a>
        ))}
    </nav>

    <div className="sh-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--sh-teal)', padding: '0.5rem 2rem', borderRadius: '4px', background: 'var(--sh-teal-light)' }}>
      SECURE NODE ACTIVE
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
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--sh-blue)', letterSpacing: '2px' }}>BOOK CONSULTATION →</div>
    </div>
  </div>
);

export const VitalityHUD = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div style={{ padding: '3.5rem', background: 'white', border: '1px solid var(--sh-border)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <div className="sh-mono" style={{ marginBottom: '2rem' }}>{label}</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--sh-teal)', marginBottom: '1.5rem', letterSpacing: '-2px' }}>{value}</div>
        <div style={{ fontSize: '0.95rem', color: 'var(--sh-grey)', lineHeight: 1.6, fontWeight: 300 }}>{sub}</div>
    </div>
);

export const ClinicFooter = () => (
    <footer className="sh-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="sh-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>VITALITY<span style={{ fontWeight: 300 }}>Labs</span></div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '1.05rem', maxWidth: '400px', fontWeight: 300 }}>
                    The world's most trusted distribution node for high-fidelity clinical care. Synchronizing personal telemetry with global medical protocols.
                </p>
            </div>
            {['CLINICIANS', 'GOVERNANCE', 'SUPPORT'].map(col => (
                <div key={col}>
                    <div className="sh-mono" style={{ color: 'var(--sh-teal)', marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Protocols', 'Research', 'Secure Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.5, cursor: 'pointer', fontWeight: 500 }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sh-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 VITALITY LABS // CLINICAL GRADE NODE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'TELEMETRY STATUS'].map(social => (
                    <span key={social} className="sh-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
