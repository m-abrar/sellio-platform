
import React from 'react';
import './styles.css';
import { MarketplaceHeader, MarketplaceFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="market-hub-wrapper">
      <MarketplaceHeader />
      <main>
        {children}
      </main>
      <MarketplaceFooter />
    </div>
  );
}
