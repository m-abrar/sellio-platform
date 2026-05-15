import React from 'react';
import { PlatinumHeader, PilotFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-luxury-theme">
      <PlatinumHeader />
      <main>
        {children}
      </main>
      <PilotFooter />
    </div>
  );
}
