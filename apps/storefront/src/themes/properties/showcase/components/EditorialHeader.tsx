
import React from 'react';

export const EditorialHeader = () => (
    <header className="editorial-header">
        <div className="showcase-logo">SELLIO_COLLECTION</div>
        <nav className="showcase-nav">
            <a href="#" className="showcase-nav-link">CURATION</a>
            <a href="#" className="showcase-nav-link">ARCHITECTS</a>
            <a href="#" className="showcase-nav-link">HISTORY</a>
            <a href="#" className="showcase-nav-link">ATELIER</a>
        </nav>
        <button style={{ 
            background: 'none', 
            color: 'var(--show-gold)', 
            border: '1px solid var(--show-gold)', 
            padding: '1rem 3rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '2px'
        }}>
            INQUIRE
        </button>
    </header>
);
