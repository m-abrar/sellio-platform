
import React from 'react';

export const UtilityNav = () => (
    <header className="utility-nav">
        <div className="trade-logo">SELLIO_TRADES</div>
        <nav className="trade-nav-links">
            <a href="#" className="trade-nav-link">CONSTRUCTION</a>
            <a href="#" className="trade-nav-link">LOGISTICS</a>
            <a href="#" className="trade-nav-link">MANUFACTURING</a>
            <a href="#" className="trade-nav-link">SAFETY</a>
        </nav>
        <button style={{ 
            background: 'var(--trade-orange)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase'
        }}>
            POST_ROLE
        </button>
    </header>
);
