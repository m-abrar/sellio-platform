'use client';
import React from 'react';

export const ClassicHeader = () => (
    <header className="ac-header">
        <a href="#" className="ac-logo">
            <span style={{ color: 'var(--ac-primary)' }}>CLASSIC</span> <span style={{ color: 'var(--ac-dark)' }}>MOTORS</span>
        </a>
        <nav className="ac-nav">
            {['Home', 'Listings', 'Auctions', 'Dealers', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="ac-nav-link">{link}</a>
            ))}
        </nav>
        <a href="#sell" className="ac-btn ac-btn-cta">Sell Your Car</a>
    </header>
);

export const ClassicCarCard = ({ title, desc, price, image }: any) => (
    <div className="ac-car-card">
        <img src={image} className="ac-car-img" alt={title} />
        <div className="ac-car-details">
            <h5 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h5>
            <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>{desc}</p>
            <p className="ac-car-price">{price}</p>
            <a href="#" className="ac-btn ac-btn-cta" style={{ width: '100%', boxSizing: 'border-box' }}>View Details</a>
        </div>
    </div>
);

export const AuctionCard = ({ title, desc, currentBid, timeRemaining, image }: any) => (
    <div className="ac-auction-card">
        <img src={image} className="ac-car-img" alt={title} style={{ height: '300px' }} />
        <div style={{ padding: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--ac-font-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>{desc}</p>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Current Bid: <span style={{ color: '#ffc107', fontWeight: 600 }}>{currentBid}</span></p>
            <div className="ac-countdown">{timeRemaining}</div>
            <a href="#" className="ac-btn ac-btn-gold" style={{ width: '75%', marginTop: '1rem' }}>Place Bid Now</a>
        </div>
    </div>
);

export const ClassicFooter = () => (
    <footer className="ac-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a className="ac-logo" href="#" style={{ display: 'block', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--ac-secondary)' }}>CLASSIC</span> <span style={{ color: 'var(--ac-light)' }}>MOTORS</span>
                </a>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>The world's premier destination for buying and selling vintage and collector automobiles.</p>
            </div>
            <div>
                <h5>Quick Links</h5>
                <a href="#home" className="ac-footer-link">Home</a>
                <a href="#listings" className="ac-footer-link">Current Listings</a>
                <a href="#auctions" className="ac-footer-link">Live Auctions</a>
                <a href="#dealers" className="ac-footer-link">Dealer Network</a>
            </div>
            <div>
                <h5>Support</h5>
                <a href="#" className="ac-footer-link">FAQs</a>
                <a href="#" className="ac-footer-link">Terms & Conditions</a>
                <a href="#" className="ac-footer-link">Privacy Policy</a>
                <a href="#" className="ac-footer-link">Careers</a>
            </div>
            <div>
                <h5>Contact Us</h5>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Email: info@classicmotors.com</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>Phone: +1 (555) CLASSIC</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
            &copy; 2026 Classic Motors. All rights reserved.
        </div>
    </footer>
);
