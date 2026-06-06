'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const ClassicHeader = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const brandLabel = useThemeContent('header.brand_label', 'CLASSIC MOTORS');
    const [brandPrimary, ...brandRest] = brandLabel.split(' ');
    const brandSecondary = brandRest.join(' ');

    return (
        <header className="ac-header">
            <a href="#" className="ac-logo">
                <span style={{ color: 'var(--ac-primary)' }}>{brandPrimary}</span> <span style={{ color: 'var(--ac-dark)' }}>{brandSecondary}</span>
            </a>
            
            <button 
                className="ac-menu-toggle" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
                aria-expanded={isOpen}
            >
                <span className={`ac-bar ${isOpen ? 'open' : ''}`}></span>
                <span className={`ac-bar ${isOpen ? 'open' : ''}`}></span>
                <span className={`ac-bar ${isOpen ? 'open' : ''}`}></span>
            </button>

            <div className={`ac-nav-panel ${isOpen ? 'open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="ac-nav"
                    linkClassName="ac-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <MenuActionButtons
                    linkClassName="ac-btn ac-btn-cta ac-nav-cta"
                    onNavigate={() => setIsOpen(false)}
                />
            </div>

            <MenuActionButtons linkClassName="ac-btn ac-btn-cta ac-desktop-cta" />
        </header>
    );
};

interface ClassicCarCardProps {
    title: string;
    desc: string;
    price: string;
    image: string;
    onClick?: () => void;
}

export const ClassicCarCard = ({ title, desc, price, image, onClick }: ClassicCarCardProps) => (
    <div className="ac-car-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
        <img src={image} className="ac-car-img" alt={title} style={{ height: '220px', width: '100%', objectFit: 'cover' }} />
        <div className="ac-car-details">
            <h5 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h5>
            <p style={{ color: '#6c757d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{desc}</p>
            <p className="ac-car-price">{price}</p>
            <span className="ac-btn ac-btn-cta" style={{ width: '100%', boxSizing: 'border-box', display: 'inline-block', textAlign: 'center' }}>View Details</span>
        </div>
    </div>
);


interface AuctionCardProps {
    title: string;
    desc: string;
    currentBid: string;
    timeRemaining: string;
    image: string;
}

export const AuctionCard = ({ title, desc, currentBid, timeRemaining, image }: AuctionCardProps) => (
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

export const ClassicFooter = () => {
    const brandLabel = useThemeContent('header.brand_label', 'CLASSIC MOTORS');
    const footerDescription = useThemeContent(
        'footer.description',
        "The world's premier destination for buying and selling vintage and collector automobiles."
    );
    const footerEmail = useThemeContent('footer.email', 'info@classicmotors.com');
    const footerPhone = useThemeContent('footer.phone', '+1 (555) CLASSIC');
    const footerCopyright = useThemeContent('footer.copyright', '2026 Classic Motors. All rights reserved.');
    const [brandPrimary, ...brandRest] = brandLabel.split(' ');
    const brandSecondary = brandRest.join(' ');

    return (
    <footer className="ac-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a className="ac-logo" href="#" style={{ display: 'block', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--ac-secondary)' }}>{brandPrimary}</span> <span style={{ color: 'var(--ac-light)' }}>{brandSecondary}</span>
                </a>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>{footerDescription}</p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h5"
                linkClassName="ac-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h5"
                linkClassName="ac-footer-link"
            />
            <div>
                <h5>Contact Us</h5>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Email: {footerEmail}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>Phone: {footerPhone}</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
            &copy; {footerCopyright}
        </div>
    </footer>
    );
};
