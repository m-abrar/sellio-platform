
import React from 'react';

export const LifestyleHeader = () => (
    <header className="prop-header">
        <div className="prop-logo">SELLIO_SAGE</div>
        <nav className="prop-nav">
            <a href="#" className="prop-nav-link">RESIDENTIAL</a>
            <a href="#" className="prop-nav-link">ARCHITECTURAL</a>
            <a href="#" className="prop-nav-link">COMMERCIAL</a>
            <a href="#" className="prop-nav-link">CONTACT</a>
        </nav>
        <button style={{ 
            background: '#4b6344', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '12px', 
            fontWeight: 800,
            fontSize: '0.75rem',
            letterSpacing: '1px'
        }}>BOOK_VIEWING</button>
    </header>
);
