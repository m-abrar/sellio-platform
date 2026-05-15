
import React from 'react';

export const EscapeHeader = () => (
    <header className="escape-header">
        <div className="escape-logo">Sellio_Escape</div>
        <nav className="escape-nav">
            <a href="#" className="escape-nav-link">DESTINATIONS</a>
            <a href="#" className="escape-nav-link">VILLAS</a>
            <a href="#" className="escape-nav-link">CABINS</a>
            <a href="#" className="escape-nav-link">EXPERIENCES</a>
        </nav>
        <button style={{ 
            background: 'var(--vacay-accent)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(251, 113, 133, 0.3)'
        }}>
            BOOK_NOW
        </button>
    </header>
);
