
import React from 'react';
import './styles.css';
import { GlobalHeader, InstitutionalFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="corporate-services-wrapper">
      <GlobalHeader />
      <main>
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}
