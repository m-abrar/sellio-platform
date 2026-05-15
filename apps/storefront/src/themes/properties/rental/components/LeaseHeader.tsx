
import React from 'react';

export const LeaseHeader = () => (
    <header className="lease-header">
        <div className="lease-logo">Sellio_Rent</div>
        <nav className="lease-nav">
            <a href="#" className="lease-nav-link">SEARCH</a>
            <a href="#" className="lease-nav-link">TENANT_HUB</a>
            <a href="#" className="lease-nav-link">LIST_PROPERTY</a>
            <a href="#" className="lease-nav-link">SUPPORT</a>
        </nav>
        <button style={{ 
            background: 'var(--rent-teal)', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 700
        }}>
            DASHBOARD_LOGIN
        </button>
    </header>
);
