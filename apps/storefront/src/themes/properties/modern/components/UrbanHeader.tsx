
'use client';
import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../utils';

const navItems = [
    { label: 'RESIDENTIAL', target: 'urban-structure-grid' },
    { label: 'COMMERCIAL', target: 'urban-precision-section' },
    { label: 'DISTRICTS', target: 'urban-structure-grid' },
    { label: 'SKYLINE', target: 'urban-hero-section' },
];

export const UrbanHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleNavClick = (event: React.MouseEvent, target: string) => {
        event.preventDefault();
        setIsOpen(false);
        scrollToSection(target);
    };

    const handleExplore = () => {
        setIsOpen(false);
        scrollToSection('urban-structure-grid');
    };

    return (
        <header className="urban-header">
            <div className="urban-logo">URBAN<span>_</span>NODE</div>

            {isOpen && (
                <button
                    type="button"
                    className="urban-nav-backdrop"
                    aria-label="Close navigation menu"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <button
                type="button"
                className={`urban-hamburger ${isOpen ? 'urban-hamburger-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                aria-expanded={isOpen}
            >
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
            </button>

            <nav className={`urban-nav ${isOpen ? 'urban-nav-open' : ''}`} aria-label="Primary">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={`#${item.target}`}
                        className="urban-nav-link"
                        onClick={(event) => handleNavClick(event, item.target)}
                    >
                        {item.label}
                    </a>
                ))}

                <button
                    type="button"
                    className="urban-btn-primary urban-mobile-auth-btn"
                    onClick={handleExplore}
                >
                    EXPLORE_UNITS
                </button>
            </nav>

            <button
                type="button"
                className="urban-btn-primary urban-desktop-auth-btn"
                onClick={handleExplore}
            >
                EXPLORE_UNITS
            </button>
        </header>
    );
};
