
import React from 'react';
import './styles.css';
import { ElegantHeader, LegacyFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-classic-wrapper">
      <ElegantHeader />
      <main>
        {children}
      </main>
      <LegacyFooter />
    </div>
  );
}
