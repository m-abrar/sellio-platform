
import React from 'react';

export const CareerHeader = () => (
    <header className="career-header">
        <div className="career-logo">SELLIO_CAREERS.</div>
        <nav className="career-nav">
            <a href="#" className="career-nav-link">OPPORTUNITIES</a>
            <a href="#" className="career-nav-link">LEADERSHIP</a>
            <a href="#" className="career-nav-link">CULTURE</a>
            <a href="#" className="career-nav-link">BENEFITS</a>
        </nav>
        <button style={{ 
            background: 'var(--corp-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem',
            fontSize: '0.8rem',
            fontWeight: 700
        }}>
            TALENT_PORTAL
        </button>
    </header>
);
