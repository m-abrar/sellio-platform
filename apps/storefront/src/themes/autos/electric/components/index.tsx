'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useAutosThemeLink } from '../../shared/useAutosThemeLink';

export const ElectricHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const themeLink = useAutosThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'EVOLVE');
    const brandHighlight = useThemeContent('header.brand_highlight', 'OLVE');
    return (
        <header className="ev-header">
            <a href={themeLink('/')} className="ev-logo text-neon-green">
                {brandLabel.split(brandHighlight)[0]}<span className="ev-text-blue">{brandHighlight}</span>
            </a>
            
            <button 
                className={`ev-hamburger ${isOpen ? 'ev-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="ev-hamburger-toggle"
            >
                <span className="ev-hamburger-bar"></span>
                <span className="ev-hamburger-bar"></span>
                <span className="ev-hamburger-bar"></span>
            </button>

            <div className={`ev-nav-panel ${isOpen ? 'ev-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="ev-nav"
                    linkClassName="ev-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />
                <MenuActionButtons
                    linkClassName="ev-btn ev-btn-green"
                    onNavigate={() => setIsOpen(false)}
                />
            </div>
        </header>
    );
};

interface EVCardProps {
    title: string;
    price: string;
    range: string;
    battery: string;
    charge: string;
    image: string;
    onClick?: () => void;
}

export const EVCard = ({ title, price, range, battery, charge, image, onClick }: EVCardProps) => (
    <div className="ev-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <img src={image} className="ev-card-img" alt={title} />
        <div className="ev-card-body">
            <h5 className="ev-card-title">{title}</h5>
            <p className="ev-card-price">{price}</p>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>⚡</span>Range:</span>
                <span style={{ fontWeight: 600 }}>{range}</span>
            </div>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>🔋</span>Battery:</span>
                <span style={{ fontWeight: 600 }}>{battery}</span>
            </div>
            <div className="ev-spec">
                <span><span className="ev-text-green" style={{marginRight: '8px'}}>🔌</span>Charge (DC):</span>
                <span style={{ fontWeight: 600 }}>{charge}</span>
            </div>
        </div>
    </div>
);

export const IconBox = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
    <div className="ev-icon-box">
        <div className="icon">{icon}</div>
        <h5 className="ev-text-green" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h5>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>{desc}</p>
    </div>
);

export const ElectricFooter = () => {
    const themeLink = useAutosThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'EVOLVE');
    const brandHighlight = useThemeContent('header.brand_highlight', 'OLVE');
    const footerDescription = useThemeContent('footer.description', 'Driving the future of sustainable mobility, one electric vehicle at a time.');
    const footerCopyright = useThemeContent('footer.copyright', '2026 Sellio. All rights reserved.');

    return (
    <footer className="ev-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a className="ev-logo text-neon-green" href={themeLink('/')} style={{ display: 'block', marginBottom: '1rem' }}>
                    {brandLabel.split(brandHighlight)[0]}<span className="ev-text-blue">{brandHighlight}</span>
                </a>
                <p style={{ fontSize: '0.9rem', opacity: 0.75, marginBottom: '1.5rem' }}>{footerDescription}</p>
                <MenuNav
                    location="social_footer"
                    flat
                    renderItem={(item, { href, onNavigate }) => (
                        <a href={href} className="ev-social-icon" onClick={onNavigate}>
                            {item.title.charAt(0)}
                        </a>
                    )}
                />
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h6"
                titleClassName="ev-text-green"
                titleStyle={{ marginBottom: '1rem', fontWeight: 600 }}
                linkClassName="ev-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h6"
                titleClassName="ev-text-green"
                titleStyle={{ marginBottom: '1rem', fontWeight: 600 }}
                linkClassName="ev-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                titleTag="h6"
                titleClassName="ev-text-green"
                titleStyle={{ marginBottom: '1rem', fontWeight: 600 }}
                linkClassName="ev-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
            &copy; {footerCopyright}
        </div>
    </footer>
    );
};
