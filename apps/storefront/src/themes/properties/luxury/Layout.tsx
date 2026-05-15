import React from 'react';
import './styles.css';
import { LuxuryHeader, LuxuryFooter } from './components';

export default function LuxuryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-luxury">
      <LuxuryHeader />
      <main className="luxury-container">
        {children}
      </main>
      <LuxuryFooter />
    </div>
  );
}
