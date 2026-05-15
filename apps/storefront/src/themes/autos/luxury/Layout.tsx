import React from 'react';
import './styles.css';
import { AtelierHeader, ConciergeFooter } from './components';

export default function LuxuryGarageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-luxury">
      <AtelierHeader />
      <main className="luxury-garage-container">
        {children}
      </main>
      <ConciergeFooter />
    </div>
  );
}
