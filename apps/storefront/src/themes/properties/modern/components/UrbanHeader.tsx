
import React from 'react';

export const UrbanHeader = () => (
    <header className="urban-header">
        <div className="urban-logo">URBAN<span>_</span>NODE</div>
        <nav className="urban-nav">
            <a href="#" className="urban-nav-link">RESIDENTIAL</a>
            <a href="#" className="urban-nav-link">COMMERCIAL</a>
            <a href="#" className="urban-nav-link">DISTRICTS</a>
            <a href="#" className="urban-nav-link">SKYLINE</a>
        </nav>
        <button className="urban-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>EXPLORE_UNITS</button>
    </header>
);
