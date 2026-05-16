'use client';
import React from 'react';

export const FestivalHeader = () => (
  <header className="ef-header">
    <div className="ef-logo">
      NEON<span style={{ color: 'var(--ef-white)', fontWeight: 400 }}>Pulse</span>
    </div>
    
    <nav className="ef-nav">
        {['Lineup', 'Stages', 'Collective', 'Vibe_Auth'].map(link => (
            <a key={link} href="#" className="ef-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ef-mono" style={{ fontSize: '0.65rem', padding: '0.5rem 2rem', background: 'rgba(217, 70, 239, 0.1)', border: '1px solid var(--ef-magenta)' }}>
      VIBE_SYNC_ACTIVE
    </div>
  </header>
);

export const StageLineupCard = ({ title, location, date, image }: any) => (
  <div className="ef-stage-card">
    <img src={image} alt={title} className="ef-img" />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}>
        <div className="ef-mono" style={{ marginBottom: '1.5rem', color: 'var(--ef-magenta)' }}>{date} // {location.toUpperCase()}</div>
        <h3 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-2px' }}>{title}</h3>
        
        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px' }}>SECURE_PASS →</div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
        </div>
    </div>
  </div>
);

export const AtmosphereHUD = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: color, marginBottom: '0.5rem', letterSpacing: '-5px' }}>{value}</div>
        <div className="ef-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>{label}</div>
    </div>
);

export const NexusFooter = () => (
    <footer className="ef-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ef-logo" style={{ fontSize: '3.5rem', marginBottom: '3.5rem' }}>NEON</div>
                <p style={{ color: 'var(--ef-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most immersive distribution node for high-vibe environments. Synchronizing collective pulses with global neon nodes.
                </p>
            </div>
            {['COLLECTIVE', 'STAGES', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ef-mono" style={{ color: 'var(--ef-magenta)', marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Lineup', 'Vibe Sync', 'Patrons', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', color: 'var(--ef-grey)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ef-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_NEON_NODE // VIBE_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_NEON'].map(social => (
                    <span key={social} className="ef-mono" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
