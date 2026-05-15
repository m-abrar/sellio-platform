import React from 'react';
import { CommercialHeader, InstitutionalFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-commercial-theme">
      <CommercialHeader />
      <main>
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}
