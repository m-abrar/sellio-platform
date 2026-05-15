
import React from 'react';

export const TechHeader = () => (
    <header className="tech-header">
        <div className="tech-logo">SELLIO_CORE v.4.0</div>
        <nav className="tech-nav">
            <a href="#" className="tech-nav-link">PROCESSORS</a>
            <a href="#" className="tech-nav-link">GRAPHICS</a>
            <a href="#" className="tech-nav-link">DISPLAYS</a>
            <a href="#" className="tech-nav-link">INTERFACE</a>
        </nav>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--tech-accent)' }}>SYSTEM_ACTIVE</span>
            <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '50%', border: '1px solid #333' }}></div>
        </div>
    </header>
);
