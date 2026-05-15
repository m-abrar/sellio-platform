
import React from 'react';

export const LuxuryHeader = () => (
    <header className="lux-header">
        <div className="lux-logo">THE_OBSIDIAN</div>
        <nav className="lux-nav">
            <a href="#" className="lux-nav-link">ESTATES</a>
            <a href="#" className="lux-nav-link">ARCHIVE</a>
            <a href="#" className="lux-nav-link">ACQUISITION</a>
            <a href="#" className="lux-nav-link">MAISON</a>
        </nav>
        <button style={{ 
            background: 'none', 
            border: '0.5px solid var(--prop-lux-gold)', 
            color: 'var(--prop-lux-gold)', 
            padding: '0.75rem 2rem',
            fontSize: '0.6rem',
            fontWeight: 900,
            letterSpacing: '2px'
        }}>
            PRIVATE_ACCESS
        </button>
    </header>
);
