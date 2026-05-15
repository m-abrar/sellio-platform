
import React from 'react';

export const HeritageNav = () => (
    <header className="heritage-nav">
        <div className="uni-heritage-logo">Sellio_Gazette</div>
        <nav className="uni-heritage-nav">
            <a href="#" className="uni-heritage-link">GENERAL</a>
            <a href="#" className="uni-heritage-link">ESTATES</a>
            <a href="#" className="uni-heritage-link">MOTORS</a>
            <a href="#" className="uni-heritage-link">CAREERS</a>
        </nav>
        <button style={{ 
            background: 'var(--uni-navy)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 3rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            fontWeight: 900
        }}>
            POST_NOTICE
        </button>
    </header>
);
