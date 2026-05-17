
'use client';
import React from 'react';

export const CorporateHeader = () => (
  <header className="sc-header">
    <div className="sc-logo">
      SELLIO<span style={{ color: 'var(--sc-accent)', fontWeight: 400 }}>ADVISORY</span>
    </div>
    
    <nav className="sc-nav">
        {['Solutions', 'Governance', 'Intelligence', 'Network'].map(link => (
            <a key={link} href="#" className="sc-nav-link" style={{ color: 'var(--sc-text)', opacity: 0.6 }}>{link}</a>
        ))}
    </nav>

    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--sc-text)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>LOGIN</button>
        <button className="sc-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.75rem' }}>GET ADVICE</button>
    </div>
  </header>
);

export const ServiceNodeCard = ({ title, description, icon }: any) => (
  <div className="sc-service-card">
    <div className="sc-icon" style={{ filter: 'grayscale(1) brightness(2)' }}>{icon}</div>
    <div className="sc-subheading" style={{ marginBottom: '1.5rem', fontSize: '0.6rem' }}>EXECUTIVE SERVICE</div>
    <h3 style={{ fontSize: '2rem', fontFamily: 'var(--sc-font-heading)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>{title}</h3>
    <p style={{ color: 'var(--sc-text-dim)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '4rem', fontWeight: 300 }}>{description}</p>
    
    <div style={{ borderTop: '1px solid var(--sc-border)', paddingTop: '2.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--sc-accent)', letterSpacing: '2px' }}>LEARN MORE →</div>
    </div>
  </div>
);

export const OperationalHUD = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div style={{ padding: '4rem', background: 'var(--sc-surface)', border: '1px solid var(--sc-border)', borderRadius: '8px' }}>
        <div className="sc-subheading" style={{ marginBottom: '2.5rem' }}>{label}</div>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem', letterSpacing: '-2px', fontFamily: 'var(--sc-font-heading)' }}>{value}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--sc-text-dim)', fontWeight: 400, lineHeight: 1.6 }}>{sub}</div>
    </div>
);

export const EnterpriseFooter = () => (
    <footer className="sc-footer" style={{ background: '#080E1E' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10rem' }}>
            <div>
                <div className="sc-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3.5rem' }}>SELLIO</div>
                <p style={{ color: 'var(--sc-text-dim)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '450px', fontWeight: 300 }}>
                    The world's most advanced distribution node for institutional services. Synchronizing enterprise strategy with global excellence.
                </p>
            </div>
            {['SOLUTIONS', 'GOVERNANCE', 'NETWORK'].map(col => (
                <div key={col}>
                    <div className="sc-subheading" style={{ color: 'var(--sc-accent)', marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {['Institutional Strategy', 'Supply Chain Logic', 'Risk & Compliance', 'Digital Transformation'].map(link => (
                            <span key={link} style={{ fontSize: '0.95rem', color: 'var(--sc-text-dim)', cursor: 'pointer', transition: 'all 0.3s ease' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--sc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
            <div style={{ color: 'var(--sc-text-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' }}>© 2026 SELLIO ADVISORY HUB // GLOBAL COMPLIANCE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['LINKEDIN', 'X', 'CRUNCHBASE'].map(social => (
                    <span key={social} style={{ color: 'var(--sc-accent)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
