
import React from 'react';

export const ElegantHeader = () => (
    <header className="elegant-header">
        <div className="classic-logo">Sellio_Legacy</div>
        <nav className="classic-nav">
            <a href="#" className="classic-nav-link">REPERTOIRE</a>
            <a href="#" className="classic-nav-link">VENUES</a>
            <a href="#" className="classic-nav-link">ARTISTS</a>
            <a href="#" className="classic-nav-link">PATRONS</a>
        </nav>
        <button style={{ 
            background: 'var(--classic-burgundy)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontStyle: 'italic'
        }}>
            RESERVE_SEATS
        </button>
    </header>
);
