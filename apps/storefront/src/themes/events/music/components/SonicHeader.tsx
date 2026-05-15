
import React from 'react';

export const SonicHeader = () => (
    <header className="sonic-header">
        <div className="sonic-logo">SONIC_PULSE</div>
        <nav className="sonic-nav">
            <a href="#" className="sonic-nav-link">FESTIVALS</a>
            <a href="#" className="sonic-nav-link">ARTISTS</a>
            <a href="#" className="sonic-nav-link">TICKETS</a>
            <a href="#" className="sonic-nav-link">EXPERIENCE</a>
        </nav>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--sonic-pink)', letterSpacing: '2px' }}>LIVE_NODE: 04</span>
            <button className="sonic-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.8rem' }}>LOGIN</button>
        </div>
    </header>
);
