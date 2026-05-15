
import React from 'react';

export const VibeHeader = () => (
    <header className="vibe-header">
        <div className="fest-logo">SELLIO_FESTIVAL</div>
        <nav className="fest-nav">
            <a href="#" className="fest-nav-link">LINEUP</a>
            <a href="#" className="fest-nav-link">CITIES</a>
            <a href="#" className="fest-nav-link">TICKETS</a>
            <a href="#" className="fest-nav-link">ARCHIVE</a>
        </nav>
        <button style={{ 
            background: 'var(--fest-pink)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem',
            fontSize: '0.8rem',
            fontWeight: 900,
            letterSpacing: '2px'
        }}>
            GET_ACCESS
        </button>
    </header>
);
