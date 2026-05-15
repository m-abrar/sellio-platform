
import React from 'react';

export const GrowthHeader = () => (
    <header className="growth-header">
        <div className="growth-logo">
            <div style={{ width: '24px', height: '24px', background: 'var(--growth-neon)', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
            GROWTH_NODE<span>.</span>
        </div>
        <nav className="growth-nav">
            <a href="#" className="growth-nav-link">VENTURES</a>
            <a href="#" className="growth-nav-link">CAPITAL</a>
            <a href="#" className="growth-nav-link">NETWORK</a>
            <a href="#" className="growth-nav-link">MISSION</a>
        </nav>
        <button className="growth-btn-primary" style={{ padding: '0.7rem 2rem', fontSize: '0.8rem' }}>
            CONNECT_HUB
        </button>
    </header>
);
