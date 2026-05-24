'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const ElectronicsHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="el-header">
            <a href="#" className="el-logo">
                NEURAL<span className="el-text-cyan">GEAR</span>
            </a>
            <div className="el-search-bar el-desktop-search">
                <span>🔍</span>
                <input type="text" className="el-search-input" placeholder="Search components, devices..." />
            </div>
            
            <button 
                className={`el-hamburger ${isOpen ? 'el-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="el-hamburger-toggle"
            >
                <span className="el-hamburger-bar"></span>
                <span className="el-hamburger-bar"></span>
                <span className="el-hamburger-bar"></span>
            </button>

            <div className={`el-nav-panel ${isOpen ? 'el-nav-open' : ''}`}>
                <div className="el-search-bar el-mobile-search" style={{ marginBottom: '2rem' }}>
                    <span>🔍</span>
                    <input type="text" className="el-search-input" placeholder="Search components, devices..." />
                </div>
                <MenuNav
                    location="main_header"
                    flat
                    className="el-nav"
                    linkClassName="el-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <MenuActionButtons
                    className="el-header-actions"
                    linkClassName="el-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={(item, { href, className, onNavigate }) => {
                        if (item.title === 'CART') {
                            return (
                                <div className="el-cart-icon" onClick={onNavigate}>
                                    🛒
                                    <span className="el-cart-badge">3</span>
                                </div>
                            );
                        }
                        return (
                            <a href={href} className={`${className} el-header-search-link`} onClick={onNavigate}>
                                {item.title}
                            </a>
                        );
                    }}
                />
            </div>
        </header>
    );
};

export const ProductCard = ({ title, category, price, oldPrice, image, badge, onClick }: any) => (
    <div className="el-product-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        {badge && <span className="el-badge">{badge}</span>}
        <div className="el-product-img-wrap">
            <img src={image} className="el-product-img" alt={title} />
        </div>
        <div className="el-product-category">{category}</div>
        <h3 className="el-product-title">{title}</h3>
        <div className="el-product-footer">
            <div>
                <span className="el-price">{price}</span>
                {oldPrice && <span className="el-price-old">{oldPrice}</span>}
            </div>
            <button 
                className="el-add-cart" 
                title="Add to Cart"
                onClick={(e) => {
                    if (onClick) {
                        e.stopPropagation();
                    }
                }}
            >
                +
            </button>
        </div>
    </div>
);

export const SpecFeature = ({ icon, title, desc }: any) => (
    <div className="el-spec-item">
        <div className="el-spec-icon">{icon}</div>
        <h4 className="el-tech-font" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ color: 'var(--el-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

export const ElectronicsFooter = () => (
    <footer className="el-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="el-logo" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                    NEURAL<span className="el-text-cyan">GEAR</span>
                </a>
                <p style={{ color: 'var(--el-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Next-generation hardware for builders, gamers, and creators. Power your future.</p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h5"
                titleClassName="el-tech-font"
                titleStyle={{ marginBottom: '1.5rem', color: 'white' }}
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h5"
                titleClassName="el-tech-font"
                titleStyle={{ marginBottom: '1.5rem', color: 'white' }}
                listClassName=""
                linkClassName=""
            />
            <div>
                <h5 className="el-tech-font" style={{ marginBottom: '1.5rem', color: 'white' }}>Newsletter</h5>
                <p style={{ color: 'var(--el-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Get updates on latest drops and tech news.</p>
                <div style={{ display: 'flex' }}>
                    <input type="email" placeholder="Email Address" style={{ background: 'var(--el-bg-card)', border: '1px solid var(--el-border)', padding: '0.8rem', color: 'white', outline: 'none', borderRadius: '4px 0 0 4px', width: '100%' }} />
                    <button style={{ background: 'var(--el-primary)', border: 'none', padding: '0.8rem 1rem', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}>→</button>
                </div>
            </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--el-border)', color: 'var(--el-text-muted)', fontSize: '0.85rem' }}>
            &copy; 2026 NeuralGear Electronics. All rights reserved.
        </div>
    </footer>
);
