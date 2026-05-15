
import React from 'react';

export const CyberHeader = () => (
    <header className="cyber-header">
        <div className="cyber-logo">SELLIO_CREATIVE.exe</div>
        <nav className="cyber-nav">
            <a href="#" className="cyber-nav-link">MODULES</a>
            <a href="#" className="cyber-nav-link">ARCHIVE</a>
            <a href="#" className="cyber-nav-link">PROTOCOL</a>
            <a href="#" className="cyber-nav-link">NODES</a>
        </nav>
        <button style={{ 
            background: 'var(--event-lime)', 
            color: 'black', 
            border: 'none', 
            padding: '0.6rem 2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700
        }}>
            INIT_SESSION
        </button>
    </header>
);
