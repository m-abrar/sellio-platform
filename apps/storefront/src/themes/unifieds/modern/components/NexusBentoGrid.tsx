
import React from 'react';

export const NexusBentoGrid = () => (
    <section className="nexus-bento-grid">
        <div className="bento-item bento-main glass-panel" style={{ padding: '4rem' }}>
            <span style={{ color: 'var(--nexus-cyan)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px' }}>CORE_ENGINE</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, marginTop: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-nexus)' }}>Unified Data <br/>Architecture.</h2>
            <p style={{ color: 'var(--nexus-dim)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '500px' }}>
                One core engine powering 50+ vertical-specific storefronts. Standardize your distribution logic across any industry with high-fidelity performance.
            </p>
        </div>
        <div className="bento-item bento-side-top glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--nexus-cyan)' }}>1.2M</div>
            <p style={{ color: 'var(--nexus-dim)', fontSize: '0.9rem' }}>Real-time transactions per node.</p>
        </div>
        <div className="bento-item bento-side-bottom glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1,2,3,4].map(i => <div key={i} style={{ width: '12px', height: '12px', background: 'var(--nexus-cyan)', borderRadius: '50%' }}></div>)}
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>High-Fidelity <br/>Sync Active.</p>
        </div>
    </section>
);
