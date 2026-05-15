
import React from 'react';

export const CorporateHeader = () => (
    <header className="corp-header">
        <div className="corp-logo">SELLIO_COMMERCIAL.</div>
        <nav className="corp-nav">
            <a href="#" className="corp-nav-link">PORTFOLIO</a>
            <a href="#" className="corp-nav-link">ACQUISITIONS</a>
            <a href="#" className="corp-nav-link">VALUATION</a>
            <a href="#" className="corp-nav-link">ADVISORY</a>
        </nav>
        <button style={{ 
            background: 'var(--comm-primary)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            CLIENT_LOGIN
        </button>
    </header>
);
