
import React from 'react';

export const GlobalHeader = () => (
    <header className="global-header">
        <div className="global-logo">SELLIO_INSTITUTIONAL</div>
        <nav className="global-nav">
            <a href="#" className="global-nav-link">SOLUTIONS</a>
            <a href="#" className="global-nav-link">ENTERPRISE</a>
            <a href="#" className="global-nav-link">GLOBAL_NODES</a>
            <a href="#" className="global-nav-link">ADVISORY</a>
        </nav>
        <button style={{ 
            background: 'var(--corp-primary)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2.5rem',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            PARTNER_PORTAL
        </button>
    </header>
);
