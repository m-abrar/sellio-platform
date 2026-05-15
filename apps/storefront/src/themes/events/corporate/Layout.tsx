import React from 'react';
import './styles.css';
import { ConfHeader, CorporateFooter } from './components';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-corporate">
      <ConfHeader />
      <main className="corporate-container">
        {children}
      </main>
      <CorporateFooter />
    </div>
  );
}
