
import React from 'react';
import './styles.css';
import { OriginHeader, InstitutionalFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="core-origin-wrapper">
      <OriginHeader />
      <main>
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}
