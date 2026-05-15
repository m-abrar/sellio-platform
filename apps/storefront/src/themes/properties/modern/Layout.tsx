
import React from 'react';
import './styles.css';
import { LifestyleHeader, SageFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-modern-wrapper">
      <LifestyleHeader />
      <main>
        {children}
      </main>
      <SageFooter />
    </div>
  );
}
