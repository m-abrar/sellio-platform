
import React from 'react';

export const MasterHeader = () => (
    <header className="master-header">
        <div className="uni-logo">Sellio_Properties</div>
        <nav className="uni-nav">
            <a href="#" className="uni-nav-link">RESIDENTIAL</a>
            <a href="#" className="uni-nav-link">COMMERCIAL</a>
            <a href="#" className="uni-nav-link">INDUSTRIAL</a>
            <a href="#" className="uni-nav-link">LAND</a>
        </nav>
        <button style={{ 
            background: 'var(--uni-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 800
        }}>
            LIST_ASSET
        </button>
    </header>
);
