import React from 'react';

export const NeighborHeader = () => (
    <header className="neighbor-header">
        <div className="local-logo">PRO LOCAL<span style={{ color: 'var(--local-green)' }}>.</span></div>
        <nav className="local-nav">
            <a href="#" className="local-nav-link">Services</a>
            <a href="#" className="local-nav-link">Top Pros</a>
            <a href="#" className="local-nav-link">How it Works</a>
            <a href="#" className="local-nav-link">Join Network</a>
        </nav>
        <button style={{ 
            background: 'var(--local-navy)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'var(--local-transition)'
        }}>
            Get Started
        </button>
    </header>
);
