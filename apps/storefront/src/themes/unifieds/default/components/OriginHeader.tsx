
import React from 'react';

export const OriginHeader = () => (
    <header className="origin-header">
        <div className="origin-logo">SELLIO_CORE</div>
        <nav className="origin-nav">
            <a href="#" className="origin-nav-link">PLATFORM</a>
            <a href="#" className="origin-nav-link">SOLUTIONS</a>
            <a href="#" className="origin-nav-link">ENTERPRISE</a>
            <a href="#" className="origin-nav-link">PRICING</a>
        </nav>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--core-slate)' }}>CONTACT_SALES</span>
            <button className="core-btn-primary">GET_STARTED</button>
        </div>
    </header>
);
