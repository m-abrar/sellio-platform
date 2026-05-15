
import React from 'react';

export const PlatinumHeader = () => (
    <header className="platinum-header">
        <div className="platinum-logo">PLATINUM_ESTATE</div>
        <nav className="platinum-nav">
            <a href="#" className="platinum-nav-link">COLLECTION</a>
            <a href="#" className="platinum-nav-link">RESIDENCES</a>
            <a href="#" className="platinum-nav-link">OFF-MARKET</a>
            <a href="#" className="platinum-nav-link">CONCIERGE</a>
        </nav>
        <button style={{ 
            background: 'none', 
            border: '1px solid #000', 
            padding: '0.8rem 2.5rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
        }}>
            INQUIRE
        </button>
    </header>
);
