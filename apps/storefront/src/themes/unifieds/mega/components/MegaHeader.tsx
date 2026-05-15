
import React from 'react';

export const MegaHeader = () => (
    <header className="mega-header">
        <div className="mega-logo">MEGA<span>_</span>GRID</div>
        <nav className="mega-nav">
            <a href="#" className="mega-nav-link">CAPACITY</a>
            <a href="#" className="mega-nav-link">STRUCTURE</a>
            <a href="#" className="mega-nav-link">DISTRIBUTION</a>
            <a href="#" className="mega-nav-link">REDUNDANCY</a>
        </nav>
        <button className="mega-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.8rem' }}>CONNECT_CORE</button>
    </header>
);
