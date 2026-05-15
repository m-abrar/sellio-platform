
import React from 'react';

export const FlexHeader = () => (
    <header className="flex-header">
        <div className="flex-logo">SELLIO_FLEX.sh</div>
        <nav className="flex-nav">
            <a href="#" className="flex-nav-link">PROJECTS</a>
            <a href="#" className="flex-nav-link">TALENT</a>
            <a href="#" className="flex-nav-link">TASKS</a>
            <a href="#" className="flex-nav-link">PROTOCOL</a>
        </nav>
        <button style={{ 
            background: 'var(--flex-mint)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700
        }}>
            CONNECT_WALLET
        </button>
    </header>
);
