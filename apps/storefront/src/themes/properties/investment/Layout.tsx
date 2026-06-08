import React from 'react';
import { InvestmentHeader, InstitutionalFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-investment-theme">
      <InvestmentHeader />
      <main>
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}
