
import React from 'react';
import './styles.css';
import { TechHeader, CircuitFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="electronics-wrapper">
      <TechHeader />
      <main>
        {children}
      </main>
      <CircuitFooter />
    </div>
  );
}
