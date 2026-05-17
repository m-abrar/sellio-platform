import React from 'react';
import { MarketplaceHeader, MarketplaceFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-marketplace-theme">
      <MarketplaceHeader />
      <main>
        {children}
      </main>
      <MarketplaceFooter />
    </div>
  );
}
