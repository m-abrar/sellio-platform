'use client';
import React, { useState } from 'react';

export const LuxuryHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="ecl-header">
            <a href="#" className="ecl-logo">AURELIA</a>
            
            <button 
                className={`ecl-hamburger ${isOpen ? 'ecl-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="ecl-hamburger-toggle"
            >
                <span className="ecl-hamburger-bar"></span>
                <span className="ecl-hamburger-bar"></span>
                <span className="ecl-hamburger-bar"></span>
            </button>

            <nav className={`ecl-nav ${isOpen ? 'ecl-nav-open' : ''}`}>
                <a href="#collections" className="ecl-nav-link" onClick={() => setIsOpen(false)}>Collections</a>
                <a href="#watches" className="ecl-nav-link" onClick={() => setIsOpen(false)}>Timepieces</a>
                <a href="#jewelry" className="ecl-nav-link" onClick={() => setIsOpen(false)}>Jewelry</a>
                <a href="#heritage" className="ecl-nav-link" onClick={() => setIsOpen(false)}>Heritage</a>
                <div className="ecl-icon-group ecl-mobile-icons" style={{ marginTop: '2rem' }}>
                    <span style={{ cursor: 'pointer' }}>🔍</span>
                    <span style={{ cursor: 'pointer' }}>👤</span>
                    <span style={{ cursor: 'pointer' }}>👜</span>
                </div>
            </nav>

            <div className="ecl-icon-group ecl-desktop-icons">
                <span style={{ cursor: 'pointer' }}>🔍</span>
                <span style={{ cursor: 'pointer' }}>👤</span>
                <span style={{ cursor: 'pointer' }}>👜</span>
            </div>
        </header>
    );
};

export const LuxuryProduct = ({ title, price, image }: any) => (
    <div className="ecl-product-card">
        <div className="ecl-product-img-wrap">
            <img src={image} className="ecl-product-img" alt={title} />
            <button className="ecl-add-to-cart">Add to Bag</button>
        </div>
        <h3 className="ecl-product-title">{title}</h3>
        <p className="ecl-product-price">{price}</p>
    </div>
);

export const LuxuryFooter = () => (
    <footer className="ecl-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem', textAlign: 'center' }}>
            <div>
                <h4 style={{ fontFamily: 'var(--ecl-font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Client Services</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Contact Us</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Track Order</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Returns & Exchanges</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Care Guidelines</a>
                </div>
            </div>
            <div>
                <h2 className="ecl-logo" style={{ color: 'var(--ecl-bg-dark)', marginBottom: '1.5rem', display: 'block' }}>AURELIA</h2>
                <p style={{ color: 'var(--ecl-text-muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2rem' }}>Subscribe to receive updates on exclusive collections, private events, and our latest creations.</p>
                <div style={{ borderBottom: '1px solid var(--ecl-border)', display: 'flex', paddingBottom: '0.5rem' }}>
                    <input type="email" placeholder="Email Address" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ecl-text-dark)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Subscribe</button>
                </div>
            </div>
            <div>
                <h4 style={{ fontFamily: 'var(--ecl-font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>The Maison</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>La Maison</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Careers</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Sustainability</a>
                    <a href="#" style={{ color: 'var(--ecl-text-muted)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px' }}>Boutiques</a>
                </div>
            </div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--ecl-text-muted)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            &copy; 2026 Aurelia Maison. All Rights Reserved.
        </div>
    </footer>
);
