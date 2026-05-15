
import React from 'react';

export const CommunityNav = () => (
    <header className="community-nav">
        <div className="hood-logo">
            <div style={{ width: '30px', height: '30px', background: 'var(--hood-green)', borderRadius: '50%' }}></div>
            Sellio_Hood
        </div>
        <nav className="hood-nav-links">
            <a href="#" className="hood-nav-link">COMMUNITY</a>
            <a href="#" className="hood-nav-link">LOCAL_SCHOOLS</a>
            <a href="#" className="hood-nav-link">AMENITIES</a>
            <a href="#" className="hood-nav-link">SAFETY</a>
        </nav>
        <button style={{ 
            background: 'var(--hood-green)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            borderRadius: '50px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            fontWeight: 700
        }}>
            JOIN_COMMUNITY
        </button>
    </header>
);
