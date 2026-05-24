'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

const luxuryActionIcon = (title: string) => {
    if (title === 'Search') return '🔍';
    if (title === 'Account') return '👤';
    if (title === 'Bag') return '👜';
    return title;
};

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

            <div className={`ecl-nav ${isOpen ? 'ecl-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    style={{ display: 'contents' }}
                    linkClassName="ecl-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <div style={{ marginTop: '2rem' }}>
                    <MenuActionButtons
                        className="ecl-icon-group ecl-mobile-icons"
                        onNavigate={() => setIsOpen(false)}
                        renderItem={(item, { href, onNavigate }) => (
                            <a href={href} style={{ cursor: 'pointer' }} onClick={onNavigate}>
                                {luxuryActionIcon(item.title)}
                            </a>
                        )}
                    />
                </div>
            </div>

            <MenuActionButtons
                className="ecl-icon-group ecl-desktop-icons"
                renderItem={(item, { href, onNavigate }) => (
                    <a href={href} style={{ cursor: 'pointer' }} onClick={onNavigate}>
                        {luxuryActionIcon(item.title)}
                    </a>
                )}
            />
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
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => (
                    <h4 style={{ fontFamily: 'var(--ecl-font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title}</h4>
                )}
                linkClassName=""
            />
            <div>
                <h2 className="ecl-logo" style={{ color: 'var(--ecl-bg-dark)', marginBottom: '1.5rem', display: 'block' }}>AURELIA</h2>
                <p style={{ color: 'var(--ecl-text-muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2rem' }}>Subscribe to receive updates on exclusive collections, private events, and our latest creations.</p>
                <div style={{ borderBottom: '1px solid var(--ecl-border)', display: 'flex', paddingBottom: '0.5rem' }}>
                    <input type="email" placeholder="Email Address" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ecl-text-dark)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Subscribe</button>
                </div>
            </div>
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => (
                    <h4 style={{ fontFamily: 'var(--ecl-font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title}</h4>
                )}
            />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--ecl-text-muted)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            &copy; 2026 Aurelia Maison. All Rights Reserved.
        </div>
    </footer>
);
