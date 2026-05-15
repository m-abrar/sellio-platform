
import React from 'react';
import './styles.css';
import { LuxuryHeader, ExclusiveFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="luxury-wrapper">
      <LuxuryHeader />
      <main>
        {children}
      </main>
      <ExclusiveFooter />
    </div>
  );
}
