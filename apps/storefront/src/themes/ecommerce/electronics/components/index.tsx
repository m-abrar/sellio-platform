'use client';
import React from 'react';

export const SiliconHeader = () => (
  <header className="el-header">
    <div className="el-logo">
      SILICON<span style={{ color: 'var(--el-cyan)' }}>Node</span>
    </div>
    
    <nav className="el-nav">
        {['Ecosystem', 'Processors', 'Graphics', 'Interface_Auth'].map(link => (
            <a key={link} href="#" className="el-nav-link">{link}</a>
        ))}
    </nav>

    <div className="el-label" style={{ fontSize: '0.65rem', padding: '0.5rem 1.5rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid var(--el-border)' }}>
      NODE_SYNC_ACTIVE
    </div>
  </header>
);

export const TechDeviceCard = ({ title, price, category, image }: any) => (
  <div className="el-device-card">
    <div className="el-img-frame">
      <img src={image} alt={title} className="el-img" />
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--el-cyan)', color: 'black', padding: '0.4rem 1rem', fontFamily: 'var(--el-mono)', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '2px' }}>
        v.4.0_STABLE
      </div>
    </div>
    <div style={{ padding: '3rem' }}>
        <div className="el-label" style={{ marginBottom: '1rem', fontSize: '0.55rem' }}>{category}_ARCHITECTURE</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', fontFamily: 'var(--el-mono)', color: 'white' }}>{title}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
                <div className="el-label" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '0.5rem' }}>STATUS</div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--el-cyan)' }}>OPERATIONAL</div>
            </div>
            <div>
                <div className="el-label" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '0.5rem' }}>LATENCY</div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>0.01 MS</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--el-border)', paddingTop: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--el-mono)', color: 'white' }}>{price}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--el-cyan)', letterSpacing: '2px', fontFamily: 'var(--el-mono)' }}>INITIALIZE →</div>
        </div>
    </div>
  </div>
);

export const ComponentHUD = ({ icon, label, status }: { icon: string, label: string, status: string }) => (
    <div style={{ padding: '3rem', border: '1px solid var(--el-border)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{icon}</div>
        <div className="el-label" style={{ marginBottom: '0.75rem', fontSize: '0.6rem' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{status}</div>
    </div>
);

export const SystemFooter = () => (
    <footer className="el-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10rem' }}>
            <div>
                <div className="el-logo" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>SILICON</div>
                <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 2, fontSize: '1rem', maxWidth: '450px' }}>
                    The definitive hardware distribution protocol for high-fidelity computation. Synchronizing bespoke infrastructure with global engineering nodes.
                </p>
            </div>
            {['HARDWARE', 'GOVERNANCE', 'NETWORK'].map(col => (
                <div key={col}>
                    <div className="el-label" style={{ marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Processors', 'Graphics', 'Security', 'Telemetry'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontFamily: 'var(--el-mono)' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--el-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="el-label" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 SELLIO_SILICON_NODE // INFRA_STABLE</div>
            <div style={{ display: 'flex', gap: '6rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_SILICON'].map(social => (
                    <span key={social} className="el-label" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
