'use client';
import React, { useState } from 'react';

export const LuxuryHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="lx-header">
            <a href="#" className="lx-logo">Velvet Wheels</a>
            
            <button 
                className={`lx-hamburger ${isOpen ? 'lx-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="lx-hamburger-toggle"
            >
                <span className="lx-hamburger-bar"></span>
                <span className="lx-hamburger-bar"></span>
                <span className="lx-hamburger-bar"></span>
            </button>

            <nav className={`lx-nav ${isOpen ? 'lx-nav-open' : ''}`}>
                {['Home', 'Collections', 'Brands', 'Dealers', 'Contact'].map(link => (
                    <a 
                        key={link} 
                        href={`#${link.toLowerCase()}`} 
                        className="lx-nav-link"
                        onClick={() => setIsOpen(false)}
                    >
                        {link}
                    </a>
                ))}
                <a href="#" className="lx-btn lx-btn-gold" onClick={() => setIsOpen(false)}>Book a Test Drive</a>
            </nav>
        </header>
    );
};

export const LuxuryCarCard = ({ title, specs, price, image }: any) => (
    <div className="lx-car-card">
        <div style={{ overflow: 'hidden', height: '200px' }}>
            <img src={image} className="lx-car-img" alt={title} />
        </div>
        <div className="lx-car-body">
            <h5 className="lx-car-title">{title}</h5>
            <p style={{ color: 'var(--lx-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{specs}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="lx-car-price">{price}</span>
                <a href="#" className="lx-btn lx-btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>View Details</a>
            </div>
        </div>
    </div>
);

export const LuxuryFooter = () => (
    <footer className="lx-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <h4 className="lx-logo" style={{ marginBottom: '1rem', display: 'block' }}>Velvet Wheels</h4>
                <p style={{ color: 'var(--lx-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Curating the world's finest automobiles for the most discerning clientele.</p>
            </div>
            <div>
                <h5 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Quick Links</h5>
                <a href="#" className="lx-footer-link">Inventory</a>
                <a href="#" className="lx-footer-link">Finance</a>
                <a href="#" className="lx-footer-link">About Us</a>
                <a href="#" className="lx-footer-link">FAQ</a>
            </div>
            <div>
                <h5 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Support</h5>
                <a href="#" className="lx-footer-link">Contact</a>
                <a href="#" className="lx-footer-link">Dealers</a>
                <a href="#" className="lx-footer-link">Privacy Policy</a>
                <a href="#" className="lx-footer-link">Terms</a>
            </div>
            <div>
                <h5 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Connect</h5>
                <p style={{ color: 'var(--lx-text-muted)', marginTop: '1.5rem' }}>info@velvetwheels.com</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--lx-text-muted)', fontSize: '0.85rem' }}>
            &copy; 2026 Velvet Wheels. All Rights Reserved.
        </div>
    </footer>
);
