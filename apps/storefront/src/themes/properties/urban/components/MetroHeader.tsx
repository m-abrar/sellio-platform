
import React from 'react';

export const MetroHeader = () => (
    <header className="metro-header">
        <div className="metro-logo">SELLIO_METRO</div>
        <nav className="metro-nav">
            <a href="#" className="metro-nav-link">RENTALS</a>
            <a href="#" className="metro-nav-link">LOFTS</a>
            <a href="#" className="metro-nav-link">PENTHOUSES</a>
            <a href="#" className="metro-nav-link">DISTRICTS</a>
        </nav>
        <button style={{ 
            background: 'var(--urban-accent)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2rem',
            borderRadius: '50px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.7rem',
            fontWeight: 900
        }}>
            BOOK_VIEWING
        </button>
    </header>
);
