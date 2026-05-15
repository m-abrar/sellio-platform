
import React from 'react';

export const NexusHeader = () => (
    <header className="nexus-header">
        <div className="nexus-logo">NEXUS_PRIME</div>
        <nav className="nexus-nav">
            <a href="#" className="nexus-nav-link">ECOSYSTEM</a>
            <a href="#" className="nexus-nav-link">MODULES</a>
            <a href="#" className="nexus-nav-link">NETWORK</a>
            <a href="#" className="nexus-nav-link">UPGRADE</a>
        </nav>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--nexus-dim)', fontWeight: 600 }}>STATUS: ONLINE</span>
            <button className="nexus-btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>INITIALIZE</button>
        </div>
    </header>
);
