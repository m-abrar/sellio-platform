
import React from 'react';
import './styles.css';
import { CapitalHeader, YieldFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-investment-wrapper">
      <CapitalHeader />
      <main>
        {children}
      </main>
      <YieldFooter />
    </div>
  );
}
