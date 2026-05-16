'use client';
import React from 'react';

export const CorporateHeader = () => (
  <header className="sc-header">
    <div className="sc-logo">
      INSTITUTIONAL<span style={{ color: 'var(--sc-blue)', fontWeight: 400 }}>Hub</span>
    </div>
    
    <nav className="sc-nav">
        {['Solutions', 'Governance', 'Intelligence', 'Partner_Auth'].map(link => (
            <a key={link} href="#" className="sc-nav-link">{link}</a>
        ))}
    </nav>

    <div className="sc-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--sc-border)', padding: '0.5rem 2.5rem' }}>
      SYSTEM_INTEGRITY_LEVEL_01
    </div>
  </header>
);

export const ServiceNodeCard = ({ title, description, icon }: any) => (
  <div className="sc-service-card">
    <div className="sc-icon">{icon}</div>
    <div className="sc-mono" style={{ marginBottom: '1.5rem', fontSize: '0.55rem' }}>PROTOCOL_NODE</div>
    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>{title}</h3>
    <p style={{ color: 'var(--sc-grey)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem' }}>{description}</p>
    
    <div style={{ borderTop: '1px solid var(--sc-border)', paddingTop: '2.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--sc-blue)', letterSpacing: '2px' }}>INITIALIZE_ADVISORY →</div>
    </div>
  </div>
);

export const OperationalHUD = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div style={{ padding: '3.5rem', background: 'var(--sc-frost)', border: '1px solid var(--sc-border)' }}>
        <div className="sc-mono" style={{ marginBottom: '2rem' }}>{label}</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--sc-navy)', marginBottom: '1.5rem', letterSpacing: '-3px' }}>{value}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--sc-grey)', fontWeight: 600 }}>{sub}</div>
    </div>
);

export const EnterpriseFooter = () => (
    <footer className="sc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10rem' }}>
            <div>
                <div className="sc-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3.5rem' }}>SELLIO</div>
                <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '1.1rem', maxWidth: '450px' }}>
                    The world's most advanced distribution node for institutional services. Synchronizing enterprise strategy with global industrial nodes.
                </p>
            </div>
            {['SOLUTIONS', 'GOVERNANCE', 'NETWORK'].map(col => (
                <div key={col}>
                    <div className="sc-mono" style={{ color: 'var(--sc-blue)', marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Strategy', 'Logistics', 'Security', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sc-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_INSTITUTIONAL_HUB // ISO_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_SELLIO'].map(social => (
                    <span key={social} className="sc-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
