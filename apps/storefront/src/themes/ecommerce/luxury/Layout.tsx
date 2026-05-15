
import React from 'react';
import './styles.css';
import { AtelierHeader, LuxuryCartFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="atelier-premium-wrapper">
      <AtelierHeader />
      <main>
        {children}
      </main>
      <LuxuryCartFooter />
    </div>
  );
}
