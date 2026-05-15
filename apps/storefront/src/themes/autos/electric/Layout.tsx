
import React from 'react';
import './styles.css';
import { HUDHeader, FutureFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-electric-wrapper">
      <HUDHeader />
      <main>
        {children}
      </main>
      <FutureFooter />
    </div>
  );
}
