
import React from 'react';
import './styles.css';
import { CorporateHeader, CommercialFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="commercial-wrapper">
      <CorporateHeader />
      <main>
        {children}
      </main>
      <CommercialFooter />
    </div>
  );
}
