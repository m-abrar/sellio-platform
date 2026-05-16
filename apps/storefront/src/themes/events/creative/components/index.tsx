'use client';
import React from 'react';

export const CreativeHeader = () => (
  <header className="ev-header">
    <div className="ev-logo">
      CREATIVE<span style={{ color: 'var(--ev-white)', fontWeight: 400 }}>Node</span>
    </div>
    
    <nav className="ev-nav">
        {['Protocols', 'Laboratory', 'Manifesto', 'Node_Auth'].map(link => (
            <a key={link} href="#" className="ev-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ev-label" style={{ fontSize: '0.65rem', padding: '0.5rem 1.5rem', background: 'rgba(190, 242, 100, 0.05)', border: '1px solid var(--ev-lime)' }}>
      EXPERIMENT_MODE: ACTIVE
    </div>
  </header>
);

export const ArtisanEventCard = ({ title, location, date, status }: any) => (
  <div className="ev-artisan-card">
    <div className="ev-tag">{status.toUpperCase()} // 2026</div>
    <div className="ev-label" style={{ marginBottom: '1.5rem', fontSize: '0.55rem', color: 'var(--ev-grey)' }}>{date} // {location.toUpperCase()}</div>
    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3.5rem', lineHeight: 1, letterSpacing: '-2px' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ev-zinc)', paddingTop: '2.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--ev-lime)', letterSpacing: '2px' }}>SYNC_NODE →</div>
        <div style={{ fontSize: '1.5rem', opacity: 0.3 }}>✺</div>
    </div>
  </div>
);

export const PulseHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ padding: '3rem', border: '1px solid var(--ev-zinc)', background: 'rgba(190, 242, 100, 0.02)' }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--ev-lime)', marginBottom: '1rem', letterSpacing: '-4px' }}>{value}</div>
        <div className="ev-label" style={{ fontSize: '0.6rem', color: 'var(--ev-grey)' }}>{label}</div>
    </div>
);

export const VibrantFooter = () => (
    <footer className="ev-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ev-logo" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>CREATIVE</div>
                <p style={{ color: 'var(--ev-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most vibrant distribution node for experimental event modules. Synchronizing creative pulses with global community nodes.
                </p>
            </div>
            {['PROTOCOLS', 'LABORATORY', 'COMMUNITY'].map(col => (
                <div key={col}>
                    <div className="ev-label" style={{ marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Hackathons', 'Synthetic Art', 'Bio-Digital', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', color: 'var(--ev-grey)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ev-zinc)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ev-label" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_CREATIVE_NODE // PULSE_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_CREATIVE'].map(social => (
                    <span key={social} className="ev-label" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
