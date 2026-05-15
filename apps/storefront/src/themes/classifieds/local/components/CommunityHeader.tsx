
import React from 'react';

export const CommunityHeader = () => (
    <header className="community-header">
        <div className="local-logo">Sellio_Community</div>
        <nav className="local-nav">
            <a href="#" className="local-nav-link">FOR_SALE</a>
            <a href="#" className="local-nav-link">EVENTS</a>
            <a href="#" className="local-nav-link">WANTED</a>
            <a href="#" className="local-nav-link">LOST_FOUND</a>
        </nav>
        <button style={{ 
            background: 'var(--local-orange)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            borderRadius: '50px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8rem',
            fontWeight: 800
        }}>
            POST_FOR_FREE
        </button>
    </header>
);
