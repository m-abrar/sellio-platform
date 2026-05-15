
import React from 'react';

export const HeritageHeader = () => (
    <header className="heritage-header">
        <div className="heritage-logo">SELLIO_HERITAGE</div>
        <nav className="heritage-nav">
            <a href="#" className="heritage-nav-link">ESTATES</a>
            <a href="#" className="heritage-nav-link">MANORS</a>
            <a href="#" className="heritage-nav-link">HISTORY</a>
            <a href="#" className="heritage-nav-link">REGISTRY</a>
        </nav>
        <button style={{ 
            background: 'var(--classic-mahogany)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontStyle: 'italic'
        }}>
            INQUIRE_NOW
        </button>
    </header>
);
