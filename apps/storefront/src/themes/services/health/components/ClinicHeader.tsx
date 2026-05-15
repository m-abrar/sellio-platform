
import React from 'react';

export const ClinicHeader = () => (
    <header className="clinic-header">
        <div className="clinic-logo">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            <span>SELLIO_WELLNESS</span>
        </div>
        <nav className="clinic-nav">
            <a href="#" className="clinic-nav-link">SPECIALISTS</a>
            <a href="#" className="clinic-nav-link">CLINICS</a>
            <a href="#" className="clinic-nav-link">WELLNESS_PLANS</a>
            <a href="#" className="clinic-nav-link">TELEHEALTH</a>
        </nav>
        <button style={{ 
            background: 'white', 
            color: '#0d9488', 
            border: '2px solid #0d9488', 
            padding: '0.6rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 700,
            fontSize: '0.85rem'
        }}>CLIENT_PORTAL</button>
    </header>
);
