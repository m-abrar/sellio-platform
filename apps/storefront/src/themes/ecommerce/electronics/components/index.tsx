
'use client';
import React from 'react';

export const CoreHeader = () => (
  <header className="el-header">
    <div className="el-logo">
      CORE<span style={{ color: 'var(--el-cyan)' }}>//HARDWARE</span>
    </div>
    
    <nav className="el-nav">
        {['Infrastructure', 'Compute', 'Graphics', 'Registry'].map(link => (
            <a key={link} href="#" className="el-nav-link">{link}</a>
        ))}
    </nav>

    <div className="el-label" style={{ fontSize: '0.65rem', padding: '0.6rem 1.5rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid var(--el-cyan)', boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)' }}>
      System Status: Online
    </div>
  </header>
);

export const TechDeviceCard = ({ title, price, category, image }: any) => (
  <div className="el-device-card">
    <div className="el-img-frame">
      <img src={image} alt={title} className="el-img" />
    </div>
    <div style={{ padding: '3rem' }}>
        <div className="el-label" style={{ marginBottom: '1.25rem', fontSize: '0.55rem', color: 'var(--el-cyan)', opacity: 0.8 }}>{category} Architecture</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', fontFamily: 'var(--el-mono)', color: 'white', letterSpacing: '-0.5px' }}>{title}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
                <div className="el-label" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '0.75rem' }}>Signal Status</div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--el-cyan)', fontFamily: 'var(--el-mono)' }}>Verified</div>
            </div>
            <div>
                <div className="el-label" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '0.75rem' }}>Base Latency</div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'var(--el-mono)', color: 'white' }}>0.01 MS</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--el-mono)', color: 'white' }}>{price}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--el-cyan)', letterSpacing: '2px', fontFamily: 'var(--el-mono)', cursor: 'pointer' }}>ACQUIRE →</div>
        </div>
    </div>
  </div>
);

export const ComponentHUD = ({ icon, label, status }: { icon: string, label: string, status: string }) => (
    <div style={{ padding: '4rem', border: '1px solid var(--el-border)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>{icon}</div>
        <div className="el-label" style={{ marginBottom: '1rem', fontSize: '0.65rem', color: 'var(--el-cyan)' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>{status}</div>
    </div>
);

export const CoreFooter = () => (
    <footer className="el-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8rem' }}>
            <div>
                <div className="el-logo" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>CORE</div>
                <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 2, fontSize: '1rem', maxWidth: '450px' }}>
                    The definitive hardware distribution protocol for high-fidelity computation. Synchronizing bespoke infrastructure with global engineering nodes.
                </p>
            </div>
            {['RESOURCES', 'GOVERNANCE', 'NETWORK'].map(col => (
                <div key={col}>
                    <div className="el-label" style={{ marginBottom: '4rem', color: 'var(--el-cyan)' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Processors', 'Graphics', 'Security', 'Telemetry'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontFamily: 'var(--el-mono)' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
            <div className="el-label" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 CORE HARDWARE // GLOBAL_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_CORE'].map(social => (
                    <span key={social} className="el-label" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
