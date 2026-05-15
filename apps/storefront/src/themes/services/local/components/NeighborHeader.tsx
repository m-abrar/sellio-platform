
import React from 'react';

export const NeighborHeader = () => (
    <header className="neighbor-header">
        <div className="local-logo">Sellio_Local</div>
        <nav className="local-nav">
            <a href="#" className="local-nav-link">SERVICES</a>
            <a href="#" className="local-nav-link">REVIEWS</a>
            <a href="#" className="local-nav-link">BECOME_PRO</a>
            <a href="#" className="local-nav-link">COMMUNITY</a>
        </nav>
        <button style={{ 
            background: 'var(--local-green)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 700
        }}>
            GET_HELP_NOW
        </button>
    </header>
);
