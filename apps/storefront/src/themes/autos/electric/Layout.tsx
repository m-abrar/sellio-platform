import React from 'react';
import { VoltHeader, EnergyFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-electric-theme">
      <VoltHeader />
      <main>
        {children}
      </main>
      <EnergyFooter />
    </div>
  );
}
