'use client';
import React, { useState } from 'react';

export const ElectricHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="ev-header">
            <a href="#" className="ev-logo text-neon-green">
                EV<span className="ev-text-blue">OLVE</span>
            </a>
            
            <button 
                className={`ev-hamburger ${isOpen ? 'ev-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="ev-hamburger-toggle"
            >
                <span className="ev-hamburger-bar"></span>
                <span className="ev-hamburger-bar"></span>
                <span className="ev-hamburger-bar"></span>
            </button>

            <nav className={`ev-nav ${isOpen ? 'ev-nav-open' : ''}`}>
                {['Home', 'EV Models', 'Charging', 'Compare', 'Contact'].map(link => (
                    <a 
                        key={link} 
                        href={`#${link.toLowerCase().replace(' ', '-')}`} 
                        className="ev-nav-link"
                        onClick={() => setIsOpen(false)}
                    >
                        {link}
                    </a>
                ))}
                <a href="#" className="ev-btn ev-btn-green" onClick={() => setIsOpen(false)}>Find Your EV</a>
            </nav>
        </header>
    );
};

export const EVCard = ({ title, price, range, battery, charge, image }: any) => (
    <div className="ev-card">
        <img src={image} className="ev-card-img" alt={title} />
        <div className="ev-card-body">
            <h5 className="ev-card-title">{title}</h5>
            <p className="ev-card-price">{price}</p>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>⚡</span>Range:</span>
                <span style={{ fontWeight: 600 }}>{range}</span>
            </div>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>🔋</span>Battery:</span>
                <span style={{ fontWeight: 600 }}>{battery}</span>
            </div>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>🔌</span>Charge (DC):</span>
                <span style={{ fontWeight: 600 }}>{charge}</span>
            </div>
        </div>
    </div>
);

export const IconBox = ({ icon, title, desc }: any) => (
    <div className="ev-icon-box">
        <div className="icon">{icon}</div>
        <h5 className="ev-text-green" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h5>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>{desc}</p>
    </div>
);

export const ElectricFooter = () => (
    <footer className="ev-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a className="ev-logo text-neon-green" href="#" style={{ display: 'block', marginBottom: '1rem' }}>
                    EV<span className="ev-text-blue">OLVE</span>
                </a>
                <p style={{ fontSize: '0.9rem', opacity: 0.75, marginBottom: '1.5rem' }}>Driving the future of sustainable mobility, one electric vehicle at a time.</p>
                <div>
                    <a href="#" className="ev-social-icon">F</a>
                    <a href="#" className="ev-social-icon">T</a>
                    <a href="#" className="ev-social-icon">I</a>
                </div>
            </div>
            <div>
                <h6 className="ev-text-green" style={{ marginBottom: '1rem', fontWeight: 600 }}>Explore</h6>
                <a href="#featured-evs" className="ev-footer-link">EV Models</a>
                <a href="#compare-evs" className="ev-footer-link">Compare</a>
                <a href="#charging" className="ev-footer-link">Charging Map</a>
                <a href="#" className="ev-footer-link">Financing</a>
            </div>
            <div>
                <h6 className="ev-text-green" style={{ marginBottom: '1rem', fontWeight: 600 }}>Company</h6>
                <a href="#" className="ev-footer-link">About Us</a>
                <a href="#" className="ev-footer-link">Careers</a>
                <a href="#" className="ev-footer-link">Press</a>
                <a href="#" className="ev-footer-link">Partnerships</a>
            </div>
            <div>
                <h6 className="ev-text-green" style={{ marginBottom: '1rem', fontWeight: 600 }}>Legal & Support</h6>
                <a href="#" className="ev-footer-link">Privacy Policy</a>
                <a href="#" className="ev-footer-link">Terms of Service</a>
                <a href="#" className="ev-footer-link">FAQ</a>
                <a href="#" className="ev-footer-link">Contact Support</a>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
            &copy; 2026 EVOLVE Marketplace. All rights reserved. Powering the electric revolution.
        </div>
    </footer>
);
