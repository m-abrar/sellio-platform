
import React from 'react';
import './styles.css';
import { StandardNav, CorporateFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-standard-wrapper">
      <StandardNav />
      <main>
        {children}
      </main>
      <CorporateFooter />
    </div>
  );
}
