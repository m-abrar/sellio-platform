import React from 'react';
import './styles.css';
import { HUDHeader, NeonFooter } from './components';

export default function ElectricLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-electric">
      <HUDHeader />
      <main className="electric-container">
        {children}
      </main>
      <NeonFooter />
    </div>
  );
}
