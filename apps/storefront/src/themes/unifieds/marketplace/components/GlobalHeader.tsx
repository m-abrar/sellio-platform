
import React from 'react';

export const GlobalHeader = () => (
    <header className="market-header">
        <div className="market-logo">Sellio_Market</div>
        <nav className="market-nav">
            <a href="#" className="market-nav-link">BROWSE</a>
            <a href="#" className="market-nav-link">SHOPS</a>
            <a href="#" className="market-nav-link">COMMUNITY</a>
            <a href="#" className="market-nav-link">PROTOCOL</a>
        </nav>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6b7280' }}>LOGIN</span>
            <button style={{ 
                background: 'var(--market-purple)', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 700
            }}>
                START_SELLING
            </button>
        </div>
    </header>
);
