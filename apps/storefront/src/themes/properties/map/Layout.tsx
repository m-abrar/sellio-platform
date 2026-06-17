'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import './styles.css';
import { MapHeader } from './components';
import { GeographicFooter } from './components/GeographicFooter';

export default function MapLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  // Explore and product detail are standard scroll pages; only the homepage
  // needs the fixed-height map-app shell.
  const isContentPage = pathname.includes('/explore') || pathname.includes('/product');

  return (
    <div className={`properties-map${isContentPage ? ' pm-content-mode' : ''}`}>
      <div className="map-page-wrapper">
        <MapHeader />
        <div className="split-view-container">
          {children}
        </div>
        {isContentPage && <GeographicFooter />}
      </div>
    </div>
  );
}
