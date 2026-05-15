import React from 'react';
import './styles.css';
import { SleekHeader, ModernAutoFooter } from './components';

export default function ModernAutoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-modern">
      <SleekHeader />
      <main className="modern-autos-container">
        {children}
      </main>
      <ModernAutoFooter />
    </div>
  );
}
