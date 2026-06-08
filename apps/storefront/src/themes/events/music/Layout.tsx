
import React from 'react';
import './styles.css';
import { SonicHeader, VoltageFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sonic-pulse-wrapper">
      <SonicHeader />
      <main>
        {children}
      </main>
      <VoltageFooter />
    </div>
  );
}
