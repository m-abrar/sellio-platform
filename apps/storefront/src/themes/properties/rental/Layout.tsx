
import React from 'react';
import './styles.css';
import { LeaseHeader, TenantFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rental-wrapper">
      <LeaseHeader />
      <main>
        {children}
      </main>
      <TenantFooter />
    </div>
  );
}
