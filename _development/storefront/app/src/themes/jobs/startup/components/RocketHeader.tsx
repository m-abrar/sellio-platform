
import React from 'react';

export const RocketHeader = () => (
    <header className="rocket-header">
        <div className="rocket-logo">SELLIO_LAUNCH</div>
        <nav className="rocket-nav">
            <a href="#" className="rocket-nav-link">SERIES_A</a>
            <a href="#" className="rocket-nav-link">VENTURES</a>
            <a href="#" className="rocket-nav-link">EQUITY</a>
            <a href="#" className="rocket-nav-link">COMMUNITY</a>
        </nav>
        <button style={{ 
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '100px', 
            fontWeight: 900,
            fontSize: '0.8rem',
            boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
        }}>POST_JOB</button>
    </header>
);
