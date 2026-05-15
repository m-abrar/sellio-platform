
import React from 'react';

export const CapitalHeader = () => (
    <header className="capital-header">
        <div className="inv-logo">SELLIO_CAPITAL.</div>
        <nav className="inv-nav">
            <a href="#" className="inv-nav-link">PORTFOLIO</a>
            <a href="#" className="inv-nav-link">YIELD_MAP</a>
            <a href="#" className="inv-nav-link">RESEARCH</a>
            <a href="#" className="inv-nav-link">TERMINAL</a>
        </nav>
        <button style={{ 
            background: 'var(--inv-charcoal)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            fontFamily: 'var(--font-data)',
            fontSize: '0.75rem',
            fontWeight: 700
        }}>
            ACCESS_TERMINAL
        </button>
    </header>
);
