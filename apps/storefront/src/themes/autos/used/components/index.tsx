'use client';
import React from 'react';

export const UsedHeader = () => (
    <header className="us-header">
        <a href="#" className="us-logo">
            <span className="us-text-orange">Drive</span>Hub
        </a>
        <nav className="us-nav">
            {['Home', 'Browse Cars', 'Dealers', 'Sell Your Car', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="us-nav-link">{link}</a>
            ))}
            <a href="#" className="us-btn us-btn-orange">Post Your Ad</a>
        </nav>
    </header>
);

export const UsedCarCard = ({ title, price, mileage, location, dealer, image }: any) => (
    <div className="us-car-card">
        <div className="us-car-img-container">
            <img src={image} className="us-car-img" alt={title} />
            <div className="us-car-overlay">
                <a href="#" className="us-btn us-btn-orange">Contact Seller</a>
            </div>
        </div>
        <div className="us-car-body">
            <h5 className="us-car-title">{title}</h5>
            <p className="us-car-price">{price}</p>
            <p className="us-car-meta">
                <span>⏱️ {mileage}</span> | <span>📍 {location}</span>
            </p>
            <small style={{ color: '#888' }}>
                <span>🏪 {dealer}</span>
            </small>
        </div>
    </div>
);

export const DealerLogo = ({ name, rating }: any) => (
    <div className="us-dealer-logo">
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 700, color: '#555', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {name}
        </div>
        <div style={{ color: '#ffd700', fontSize: '0.9rem' }}>
            {'★'.repeat(Math.floor(rating))}{rating % 1 !== 0 ? '☆' : ''} <span style={{ color: '#666' }}>({rating})</span>
        </div>
    </div>
);

export const StepCard = ({ icon, title, desc }: any) => (
    <div className="us-step-card">
        <div className="us-step-icon">{icon}</div>
        <h4 className="us-text-blue us-fw-bold" style={{ marginBottom: '1rem' }}>{title}</h4>
        <p style={{ color: '#666', lineHeight: 1.6 }}>{desc}</p>
    </div>
);

export const UsedFooter = () => (
    <footer className="us-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <h4 className="us-fw-bold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    <span className="us-text-orange">Drive</span>Hub
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Your trusted marketplace for quality used vehicles.</p>
            </div>
            <div>
                <h6 className="us-text-orange us-fw-bold" style={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}>Quick Links</h6>
                <a href="#featured-listings" className="us-footer-link">Browse Cars</a>
                <a href="#how-it-works" className="us-footer-link">Sell Your Car</a>
                <a href="#trusted-dealers" className="us-footer-link">Our Dealers</a>
                <a href="#" className="us-footer-link">FAQs</a>
            </div>
            <div>
                <h6 className="us-text-orange us-fw-bold" style={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}>About</h6>
                <a href="#" className="us-footer-link">About Us</a>
                <a href="#" className="us-footer-link">Terms of Service</a>
                <a href="#" className="us-footer-link">Privacy Policy</a>
                <a href="#" className="us-footer-link">Contact</a>
            </div>
            <div>
                <h6 className="us-text-orange us-fw-bold" style={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}>Connect With Us</h6>
                <div style={{ marginBottom: '1.5rem' }}>
                    <a href="#" className="us-social">F</a>
                    <a href="#" className="us-social">T</a>
                    <a href="#" className="us-social">I</a>
                    <a href="#" className="us-social">L</a>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>✉️ info@drivehub.com</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            &copy; 2026 DriveHub Marketplace. All rights reserved.
        </div>
    </footer>
);
