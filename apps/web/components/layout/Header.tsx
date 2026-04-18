"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@sellio/ui';

interface HeaderProps {
  appConfig: any; // Using any for now to handle dynamic settings payload
}

/**
 * Premium Header component with glassmorphic design.
 * Handles branding (Logo vs Title) and navigation.
 */
export const Header = ({ appConfig }: HeaderProps) => {
  const settings = appConfig?.app_settings || {};
  const logoUrl = settings.site_logo ? `http://localhost:8000/storage/${settings.site_logo}` : null;
  const siteName = settings.site_name || appConfig?.title || 'Sellio';
  const hideSiteName = settings.hide_site_name === '1';

  // Navigation items based on active modules/verticals
  const navItems = [
    { label: 'Marketplace', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Properties', href: '/properties' },
    { label: 'Vehicles', href: '/vehicles' },
    { label: 'Jobs', href: '/jobs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        
        {/* BRANDING */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-9 w-auto object-contain drop-shadow-sm" 
              />
            )}
            
            {/* Show site name if no logo exists OR if hideSiteName is false */}
            {(!logoUrl || !hideSiteName) && (
              <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">
                {siteName.toUpperCase()}
              </span>
            )}
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex rounded-full border-2 font-bold px-6">
            Sign In
          </Button>
          <Button variant="primary" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold">
            Get Started
          </Button>
          
          {/* MOBILE MENU TOGGLE (Placeholder) */}
          <button className="md:hidden p-2 text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
};
