
import React from 'react';

export const ReliableHeader = () => (
    <header className="used-header">
        <div className="used-logo">
            <span style={{ color: 'var(--auto-accent)' }}>✔</span> SELLIO_CERTIFIED
        </div>
        <nav className="used-nav">
            <a href="#" className="used-nav-link">INVENTORY</a>
            <a href="#" className="used-nav-link">FINANCING</a>
            <a href="#" className="used-nav-link">TRADE-IN</a>
            <a href="#" className="used-nav-link">PROTECTION</a>
        </nav>
        <button style={{ 
            background: 'var(--auto-primary)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            GET_PRE_APPROVED
        </button>
    </header>
);
