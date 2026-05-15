import React from 'react';
import './styles.css';
import { LifestyleHeader, SageFooter } from './components';

export default function ModernPropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-modern">
      <LifestyleHeader />
      <main className="modern-properties-container">
        {children}
      </main>
      <SageFooter />
    </div>
  );
}
