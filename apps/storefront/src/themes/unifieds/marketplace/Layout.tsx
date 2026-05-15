
import React from 'react';
import './styles.css';
import { GlobalHeader, MarketFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-marketplace-wrapper">
      <GlobalHeader />
      <main>
        {children}
      </main>
      <MarketFooter />
    </div>
  );
}
