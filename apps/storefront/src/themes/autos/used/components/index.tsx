'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const UsedHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="us-header">
            <a href="#" className="us-logo">
                <span className="us-text-orange">Drive</span>Hub
            </a>
            
            <button 
                className={`us-hamburger ${isOpen ? 'us-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="us-hamburger-toggle"
            >
                <span className="us-hamburger-bar"></span>
                <span className="us-hamburger-bar"></span>
                <span className="us-hamburger-bar"></span>
            </button>

            <nav className={`us-nav ${isOpen ? 'us-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    style={{ display: 'contents' }}
                    linkClassName="us-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <MenuActionButtons
                    linkClassName="us-btn us-btn-orange"
                    onNavigate={() => setIsOpen(false)}
                />
            </nav>
        </header>
    );
};

export const UsedCarCard = ({ title, price, mileage, location, dealer, image, onClick }: any) => (
    <div className="us-car-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="us-car-img-container">
            <img src={image} className="us-car-img" alt={title} style={{ height: '220px', width: '100%', objectFit: 'cover' }} />
            <div className="us-car-overlay">
                <span className="us-btn us-btn-orange">View Details</span>
            </div>
        </div>
        <div className="us-car-body">
            <h5 className="us-car-title">{title}</h5>
            <p className="us-car-price">{price}</p>
            <p className="us-car-meta">
                <span>⏱️ {mileage}</span> | <span>📍 {location}</span>
            </p>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem' }}>🏪</span>
                <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>{dealer}</span>
            </div>
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
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h6"
                titleClassName="us-text-orange us-fw-bold"
                titleStyle={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}
                linkClassName="us-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h6"
                titleClassName="us-text-orange us-fw-bold"
                titleStyle={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}
                linkClassName="us-footer-link"
            />
            <div>
                <FooterMenuColumn
                    location="footer_column_3"
                    renderTitle={() => (
                        <h6 className="us-text-orange us-fw-bold" style={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}>Connect With Us</h6>
                    )}
                    linkClassName="us-footer-link"
                />
                <div style={{ marginBottom: '1.5rem' }}>
                    <MenuNav
                        location="social_footer"
                        flat
                        renderItem={(item, { href, onNavigate }) => (
                            <a href={href} className="us-social" onClick={onNavigate}>
                                {item.title.charAt(0)}
                            </a>
                        )}
                    />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>✉️ info@drivehub.com</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            &copy; 2026 DriveHub Marketplace. All rights reserved.
        </div>
    </footer>
);
