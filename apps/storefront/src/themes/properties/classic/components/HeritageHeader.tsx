
'use client';
import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { getThemeLink } from '@/lib/links';
import { useMenuContext } from '@/components/menu/MenuProvider';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { themeKey } = useMenuContext();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`pc-header ${scrolled ? 'scrolled' : ''}`}>
            <a 
                href={getThemeLink('/', themeKey)}
                style={{ textDecoration: 'none', fontFamily: 'var(--pc-font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--pc-teal)', letterSpacing: '-1px', cursor: 'pointer', zIndex: 1045, position: 'relative' }}
            >
                ESTATE <span style={{ fontWeight: 400, opacity: scrolled ? 0.3 : 0.6 }}>&</span> HERITAGE
            </a>
            
            <button 
                className={`pc-hamburger ${isOpen ? 'pc-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
            </button>

            <MenuNav
                location="main_header"
                flat
                className={`pc-nav ${isOpen ? 'pc-nav-open' : ''}`}
                linkClassName="pc-nav-link"
                onNavigate={() => setIsOpen(false)}
                renderItem={(item, { href, className, onNavigate }) => (
                    <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
                )}
            />

            {isOpen && (
                <div className="pc-mobile-header-right" style={{ marginTop: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--pc-teal)', cursor: 'pointer', opacity: 0.8, marginBottom: '1.5rem' }} className="pc-nav-link">
                        LOGIN
                    </div>
                    <a href={getThemeLink('/cart', themeKey)} className="pc-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                        INQUIRE
                    </a>
                </div>
            )}

            <div className="pc-header-right">
                <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--pc-teal)', cursor: 'pointer', opacity: 0.6 }} className="pc-nav-link">
                    LOGIN
                </div>
                <a href={getThemeLink('/cart', themeKey)} className="pc-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                    INQUIRE
                </a>
            </div>
        </header>
    );
};
