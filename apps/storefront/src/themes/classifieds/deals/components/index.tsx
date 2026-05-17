'use client';
import React from 'react';

export const DealsHeader = () => (
    <>
        <div className="cd-header-top">
            <div>🔥 FLASH SALE: UP TO 80% OFF CLEARANCE ITEMS</div>
            <div>Ends in: <span style={{ fontWeight: 800, color: 'var(--cd-secondary-yellow)' }}>04:12:39</span></div>
        </div>
        <header className="cd-header-main">
            <a href="#" className="cd-logo">
                Deal<span>Dash</span>
            </a>
            
            <div className="cd-search-bar d-none d-lg-flex">
                <span style={{ fontSize: '1.2rem', color: 'var(--cd-text-muted)', marginLeft: '0.5rem' }}>🔍</span>
                <input type="text" className="cd-search-input" placeholder="Search for bargains, tech, fashion..." />
                <button className="cd-search-btn">Search</button>
            </div>
            
            <div className="cd-nav-actions">
                <a href="#" style={{ color: 'var(--cd-text-main)', textDecoration: 'none', fontWeight: 600 }}>Login</a>
                <a href="#" className="cd-btn-post">Post a Deal</a>
            </div>
        </header>
        <div className="cd-category-ribbon">
            <a href="#" className="cd-cat-link">🔥 Trending Now</a>
            <a href="#" className="cd-cat-link">💻 Electronics</a>
            <a href="#" className="cd-cat-link">👕 Fashion</a>
            <a href="#" className="cd-cat-link">🛋️ Home & Garden</a>
            <a href="#" className="cd-cat-link">🚗 Vehicles</a>
            <a href="#" className="cd-cat-link">🛠️ Tools</a>
            <a href="#" className="cd-cat-link">🎮 Gaming</a>
        </div>
    </>
);

export const DealCard = ({ title, currentPrice, originalPrice, discount, image, seller, isTopSeller }: any) => (
    <div className="cd-deal-card">
        <div className="cd-discount-tag">-{discount}%</div>
        <div className="cd-card-img-wrap">
            <img src={image} className="cd-card-img" alt={title} />
        </div>
        <div className="cd-card-body">
            <h3 className="cd-card-title">{title}</h3>
            <div className="cd-price-row">
                <span className="cd-current-price">{currentPrice}</span>
                <span className="cd-original-price">{originalPrice}</span>
            </div>
            <div className="cd-seller-info">
                <span>👤 {seller}</span>
                {isTopSeller && <span className="cd-seller-badge">Trusted Seller</span>}
            </div>
        </div>
    </div>
);

export const DealsFooter = () => (
    <footer className="cd-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="cd-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    Deal<span>Dash</span>
                </a>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>Your ultimate destination for community bargains, flash sales, and hidden gems.</p>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Buyer Protection</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#">Money Back Guarantee</a>
                    <a href="#">Safe Trading Guide</a>
                    <a href="#">Report an Item</a>
                    <a href="#">Customer Support</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Sell on DealDash</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#">Post an Item</a>
                    <a href="#">Seller Dashboard</a>
                    <a href="#">Promote your listings</a>
                    <a href="#">Fee Schedule</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Never miss a deal</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="email" placeholder="Email address" style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', outline: 'none', width: '100%' }} />
                    <button style={{ backgroundColor: 'var(--cd-primary-red)', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>Go</button>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            &copy; 2026 DealDash Marketplace. All rights reserved.
        </div>
    </footer>
);
