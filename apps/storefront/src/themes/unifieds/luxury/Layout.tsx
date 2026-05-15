import React from 'react';
import './styles.css';
import { MaisonHeader, HeritageFooter } from './components';

export default function MaisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unifieds-luxury">
      <MaisonHeader />
      <main className="luxury-portal-container">
        {children}
      </main>
      <HeritageFooter />
    </div>
  );
}
