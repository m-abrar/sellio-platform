
import React from 'react';

export const UtilityHeader = () => (
    <header className="utility-header">
        <div className="gen-logo">
            <div style={{ width: '30px', height: '30px', background: 'var(--gen-yellow)', borderRadius: '4px' }}></div>
            SELLIO_GEN
        </div>
        <nav className="gen-nav">
            <a href="#" className="gen-nav-link">ELECTRONICS</a>
            <a href="#" className="gen-nav-link">VEHICLES</a>
            <a href="#" className="gen-nav-link">PROPERTY</a>
            <a href="#" className="gen-nav-link">JOBS</a>
            <a href="#" className="gen-nav-link">SERVICES</a>
        </nav>
        <button style={{ 
            background: 'var(--gen-charcoal)', 
            color: 'white', 
            border: 'none', 
            padding: '0.6rem 1.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            POST_AD
        </button>
    </header>
);
