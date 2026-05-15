
import React from 'react';

export const StorefrontHeader = () => (
    <header className="ecom-header">
        <div className="ecom-nav-container">
            <div className="ecom-logo">STYLE_TIME.</div>
            <nav className="ecom-nav-links">
                <a href="#" className="ecom-nav-link">NEW_ARRIVALS</a>
                <a href="#" className="ecom-nav-link">COLLECTIONS</a>
                <a href="#" className="ecom-nav-link">LIMITED_EDITION</a>
                <a href="#" className="ecom-nav-link">ABOUT</a>
            </nav>
            <div className="ecom-nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <div style={{ position: 'relative' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#1e4d4e', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>0</span>
                </div>
            </div>
        </div>
    </header>
);

export const ProductCard = ({ name, price, category, image }: any) => (
    <div className="ecom-product-card">
        <div className="ecom-product-image-wrapper">
            <img src={image} alt={name} className="ecom-product-image" />
            <div style={{ 
                position: 'absolute', 
                bottom: '1rem', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '80%',
                opacity: 0,
                transition: 'all 0.3s ease'
            }} className="quick-add-btn">
                <button style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    border: 'none', 
                    background: 'white', 
                    color: 'black', 
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>QUICK_ADD</button>
            </div>
        </div>
        <div className="ecom-product-info">
            <p className="ecom-product-category">{category}</p>
            <h3 className="ecom-product-name">{name}</h3>
            <p className="ecom-product-price">{price}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
            .ecom-product-card:hover .quick-add-btn { opacity: 1 !important; transform: translate(-50%, -5px) !important; }
        `}} />
    </div>
);

export const MainFooter = () => (
    <footer className="ecom-footer">
        <div className="ecom-footer-container">
            <div className="ecom-footer-column">
                <div className="ecom-logo" style={{ marginBottom: '1.5rem' }}>STYLE_TIME.</div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '240px' }}>
                    Elevating your everyday wardrobe with curated, premium essentials designed for the modern individual.
                </p>
            </div>
            <div className="ecom-footer-column">
                <h4>SHOP</h4>
                <ul className="ecom-footer-links">
                    <li><a href="#" className="ecom-footer-link">New Arrivals</a></li>
                    <li><a href="#" className="ecom-footer-link">Best Sellers</a></li>
                    <li><a href="#" className="ecom-footer-link">Men</a></li>
                    <li><a href="#" className="ecom-footer-link">Women</a></li>
                </ul>
            </div>
            <div className="ecom-footer-column">
                <h4>COMPANY</h4>
                <ul className="ecom-footer-links">
                    <li><a href="#" className="ecom-footer-link">About Us</a></li>
                    <li><a href="#" className="ecom-footer-link">Sustainability</a></li>
                    <li><a href="#" className="ecom-footer-link">Terms of Service</a></li>
                    <li><a href="#" className="ecom-footer-link">Privacy Policy</a></li>
                </ul>
            </div>
            <div className="ecom-footer-column">
                <h4>SUPPORT</h4>
                <ul className="ecom-footer-links">
                    <li><a href="#" className="ecom-footer-link">Contact Us</a></li>
                    <li><a href="#" className="ecom-footer-link">Shipping & Returns</a></li>
                    <li><a href="#" className="ecom-footer-link">Size Guide</a></li>
                    <li><a href="#" className="ecom-footer-link">FAQs</a></li>
                </ul>
            </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>© 2026 StyleTime. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['Twitter', 'Instagram', 'Facebook'].map(s => <span key={s} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}>{s}</span>)}
            </div>
        </div>
    </footer>
);
