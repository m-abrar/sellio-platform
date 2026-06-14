
import React from 'react';
import './styles.css';
import '@/themes/properties/shared/subpages.css';
import { PlatinumHeader, ConciergeFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="luxury-premium-wrapper">
      <PlatinumHeader />
      <main>
        {children}
      </main>
      <ConciergeFooter />
    </div>
  );
}
