'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const LuxuryHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const brandLabel = useThemeContent('header.brand_label', 'Velvet Wheels');
    return (
        <header className="lx-header">
            <a href="#" className="lx-logo">{brandLabel}</a>
            
            <button 
                className={`lx-hamburger ${isOpen ? 'lx-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="lx-hamburger-toggle"
            >
                <span className="lx-hamburger-bar"></span>
                <span className="lx-hamburger-bar"></span>
                <span className="lx-hamburger-bar"></span>
            </button>

            <div className={`lx-nav-panel ${isOpen ? 'lx-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="lx-nav"
                    linkClassName="lx-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <MenuActionButtons
                    linkClassName="lx-btn lx-btn-gold"
                    onNavigate={() => setIsOpen(false)}
                />
            </div>
        </header>
    );
};

const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
        const isPreview = window.location.pathname.startsWith('/preview/');
        if (isPreview) {
            return `/preview/autos_luxury${path}`;
        }
    }
    return path;
};

interface LuxuryCarCardProps {
    title: string;
    specs: string;
    price: string;
    image: string;
    slug?: string;
    onClick?: (event: React.MouseEvent) => void;
}

export const LuxuryCarCard = ({ title, specs, price, image, slug, onClick }: LuxuryCarCardProps) => {
    const cursorStyle = onClick || slug ? { cursor: 'pointer' } : {};
    
    // Resolve link if slug is provided
    const linkPath = slug ? getThemeLink(`/product/${slug}`) : "#";
    
    const handleCardClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick(e);
        } else if (slug && typeof window !== 'undefined') {
            window.location.href = linkPath;
        }
    };

    return (
        <div className="lx-car-card" style={cursorStyle} onClick={handleCardClick}>
            <div style={{ overflow: 'hidden', height: '200px' }}>
                <img src={image} className="lx-car-img" alt={title} />
            </div>
            <div className="lx-car-body">
                <h5 className="lx-car-title">{title}</h5>
                <p style={{ color: 'var(--lx-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{specs}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="lx-car-price">{price}</span>
                    <a 
                        href={linkPath} 
                        className="lx-btn lx-btn-outline" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClick) {
                                e.preventDefault();
                                onClick(e);
                            }
                        }}
                    >
                        View Details
                    </a>
                </div>
            </div>
        </div>
    );
};

export const LuxuryFooter = () => {
    const brandLabel = useThemeContent('header.brand_label', 'Velvet Wheels');
    const footerDescription = useThemeContent(
        'footer.description',
        "Curating the world's finest automobiles for the most discerning clientele.",
    );

    return (
    <footer className="lx-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <h4 className="lx-logo" style={{ marginBottom: '1rem', display: 'block' }}>{brandLabel}</h4>
                <p style={{ color: 'var(--lx-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{footerDescription}</p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
                linkClassName="lx-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
                linkClassName="lx-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}
                linkClassName="lx-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--lx-text-muted)', fontSize: '0.85rem' }}>
            &copy; 2026 Velvet Wheels. All Rights Reserved.
        </div>
    </footer>
    );
};
