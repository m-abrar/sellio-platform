
import React from 'react';

export const EliteHeader = () => (
    <header className="elite-header">
        <div className="elite-logo">SELLIO_ELITE</div>
        <nav className="elite-nav">
            <a href="#" className="elite-nav-link">COLLECTIONS</a>
            <a href="#" className="elite-nav-link">APPRAISAL</a>
            <a href="#" className="elite-nav-link">CONCIERGE</a>
            <a href="#" className="elite-nav-link">AUCTIONS</a>
        </nav>
        <button style={{ 
            background: 'transparent', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.2)', 
            padding: '0.75rem 2rem', 
            borderRadius: '4px', 
            fontWeight: 800,
            fontSize: '0.75rem',
            letterSpacing: '1px'
        }}>MEMBER_LOGIN</button>
    </header>
);
