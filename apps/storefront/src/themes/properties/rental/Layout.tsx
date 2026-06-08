import React from 'react';
import { RentalHeader, TenantFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-rental-theme">
      <RentalHeader />
      <main>
        {children}
      </main>
      <TenantFooter />
    </div>
  );
}
