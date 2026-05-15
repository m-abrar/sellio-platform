import React from 'react';
import './styles.css';
import { BoutiqueHeader, AtelierFooter } from './components';

export default function LuxuryRetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-luxury">
      <BoutiqueHeader />
      <main className="luxury-ecommerce-container">
        {children}
      </main>
      <AtelierFooter />
    </div>
  );
}
