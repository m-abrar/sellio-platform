
import React from 'react';

export const StandardNav = () => (
    <header className="standard-nav">
        <div className="std-logo">Sellio_Standard</div>
        <nav className="std-nav-links">
            <a href="#" className="std-nav-link">MARKETPLACE</a>
            <a href="#" className="std-nav-link">PROPERTIES</a>
            <a href="#" className="std-nav-link">AUTOS</a>
            <a href="#" className="std-nav-link">JOBS</a>
        </nav>
        <button style={{ 
            background: 'var(--std-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '0.6rem 2rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            CREATE_LISTING
        </button>
    </header>
);
