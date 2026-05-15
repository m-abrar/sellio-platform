
import React from 'react';

export const AtelierFooter = () => (
    <footer className="atelier-footer">
        <div className="atelier-logo">ATELIER_SELLIO</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
                <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem', opacity: 0.5 }}>SHOP</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                    <span>New Arrivals</span>
                    <span>Ready-to-Wear</span>
                    <span>Accessories</span>
                    <span>Footwear</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem', opacity: 0.5 }}>ATELIER</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                    <span>Sustainability</span>
                    <span>Craftsmanship</span>
                    <span>Materials</span>
                    <span>Philosophy</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem', opacity: 0.5 }}>SUPPORT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                    <span>Shipping</span>
                    <span>Returns</span>
                    <span>Contact</span>
                    <span>FAQ</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem', opacity: 0.5 }}>FOLLOW</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                    <span>Instagram</span>
                    <span>Pinterest</span>
                    <span>X.com</span>
                    <span>Newsletter</span>
                </div>
            </div>
        </div>
        <div style={{ marginTop: '8rem', fontSize: '0.7rem', opacity: 0.3, letterSpacing: '3px' }}>
            © 2026 ATELIER SELLIO GLOBAL INC. ALL RIGHTS RESERVED.
        </div>
    </footer>
);
